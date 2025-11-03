import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "../../config/client";

const embeddingModel = openai.embedding("text-embedding-3-small");

interface ChunkResult {
  embedding: number[];
  content: string;
}

export const generateChunks = (input: string): string[] => {
  const sentences = input
    .trim()
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > 500) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ". " : "") + sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks.length > 0 ? chunks : [input];
};

export const generateEmbeddings = async (
  content: string
): Promise<ChunkResult[]> => {
  const chunks = generateChunks(content);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
};

export const generateSingleEmbedding = async (
  text: string
): Promise<number[]> => {
  const input = text.replaceAll("\\n", " ").trim();
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (
  userQuery: string,
  userId: string,
  assistantId?: string,
  isolateToAssistant: boolean = false,
  limit: number = 5
) => {
  const queryEmbedding = await generateSingleEmbedding(userQuery);

  // Build filter for embeddings - always include userId
  const filter: any = { userId };

  // Build resource filter for determining which resources to search
  let resourceIds: string[] | undefined;

  if (isolateToAssistant && assistantId) {
    // Isolate: Only search resources for this specific assistant
    const resources = await prisma.resources.findMany({
      where: {
        userId,
        assistantId,
      },
      select: { id: true }
    });
    resourceIds = resources.map(r => r.id);

    // If no matching resources, return empty array
    if (resourceIds.length === 0) {
      return [];
    }
  } else if (assistantId) {
    // Not isolated: Search resources for this assistant OR global resources (no assistantId)
    const resources = await prisma.resources.findMany({
      where: {
        userId,
        OR: [
          { assistantId },
          { assistantId: null }
        ]
      },
      select: { id: true }
    });
    resourceIds = resources.map(r => r.id);

    // If no matching resources, return empty array
    if (resourceIds.length === 0) {
      return [];
    }
  }

  const pipeline: any[] = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 50,
        limit: limit,
        filter: filter,
      },
    },
    {
      $project: {
        content: 1,
        resourceId: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $match: {
        score: { $gte: 0.7 },
      },
    },
  ];

  // Add resourceId filter if needed
  if (resourceIds) {
    pipeline.push({
      $match: {
        resourceId: { $in: resourceIds }
      }
    });
  }

  const results = await prisma.embeddings.aggregateRaw({
    pipeline,
  });

  return (results as unknown as any[]).map((r: any) => ({
    content: r.content,
    resourceId: r.resourceId,
    similarity: r.score,
  }));
};

export const findRelevantChatContext = async (
  userQuery: string,
  userId: string,
  chatId: string,
  limit: number = 2
) => {
  const queryEmbedding = await generateSingleEmbedding(userQuery);

  // Find resources tagged with this chatId and type 'chat_context'
  const resources = await prisma.resources.findMany({
    where: {
      userId,
      chatId,
      type: "chat_context",
    },
    select: { id: true },
  });

  if (resources.length === 0) {
    return [];
  }

  const resourceIds = resources.map((r) => r.id);

  const pipeline: any[] = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 20,
        limit: limit,
        filter: { userId },
      },
    },
    {
      $project: {
        content: 1,
        resourceId: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $match: {
        score: { $gte: 0.6 }, // Slightly lower threshold for chat context
        resourceId: { $in: resourceIds },
      },
    },
  ];

  const results = await prisma.embeddings.aggregateRaw({
    pipeline,
  });

  return (results as unknown as any[]).map((r: any) => ({
    content: r.content,
    resourceId: r.resourceId,
    similarity: r.score,
  }));
};

export const createResourceWithEmbeddings = async (
  content: string,
  userId: string,
  assistantId?: string,
  metadata?: { title?: string; source?: string; type?: string; chatId?: string }
) => {
  const resource = await prisma.resources.create({
    data: {
      content,
      userId,
      assistantId,
      chatId: metadata?.chatId,
      title: metadata?.title,
      source: metadata?.source,
      type: metadata?.type || "text",
    },
  });

  const embeddings = await generateEmbeddings(content);

  await prisma.embeddings.createMany({
    data: embeddings.map((e) => ({
      resourceId: resource.id,
      content: e.content,
      embedding: e.embedding,
      userId,
    })),
  });

  return resource;
};
