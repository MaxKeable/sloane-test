import { openai } from "@ai-sdk/openai";
import { streamText, tool, ModelMessage, jsonSchema, stepCountIs } from "ai";
import {
  createResourceWithEmbeddings,
  findRelevantContent,
} from "../../utils/embeddingService";

export interface RagChatOptions {
  userId: string;
  assistantId?: string;
  systemPrompt?: string;
  onChunk?: (chunk: string) => void;
  onToolCall?: (toolName: string, args: any) => void;
}

export const streamRagChat = async (
  messages: ModelMessage[],
  options: RagChatOptions
) => {
  const { userId, assistantId, systemPrompt, onChunk, onToolCall } = options;

  const defaultSystemPrompt = `You are a helpful AI assistant with access to a knowledge base.
  
IMPORTANT INSTRUCTIONS:
- Always check your knowledge base before answering questions using the getInformation tool
- Only respond using information retrieved from tool calls
- If no relevant information is found, respond: "Sorry, I don't have information about that in my knowledge base."
- When users provide information unprompted, use the addResource tool immediately without asking
- Be concise and conversational
- After using tools, provide a natural response based on the retrieved information

FORMAT: Use proper Markdown formatting in responses.`;

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt || defaultSystemPrompt,
    messages,
    stopWhen: stepCountIs(5),
    tools: {
      addResource: tool({
        description: `Add information to your knowledge base. Use this when the user provides facts, documents, or information they want you to remember. If the user shares information unprompted, use this tool immediately.`,
        inputSchema: jsonSchema({
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "The information to add to knowledge base",
            },
            title: {
              type: "string",
              description: "Optional title for this resource",
            },
          },
          required: ["content"],
          additionalProperties: false,
        }),
        execute: async ({
          content,
          title,
        }: {
          content: string;
          title?: string;
        }) => {
          if (onToolCall) {
            onToolCall("addResource", { content, title });
          }

          await createResourceWithEmbeddings(content, userId, assistantId, {
            title,
            type: "text",
          });

          return `Successfully added to knowledge base${title ? `: "${title}"` : ""}`;
        },
      }),

      getInformation: tool({
        description: `Search the knowledge base to answer questions. ALWAYS use this tool before responding to user questions.`,
        inputSchema: jsonSchema({
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The search query or question to find relevant information",
            },
          },
          required: ["query"],
          additionalProperties: false,
        }),
        execute: async ({ query }: { query: string }) => {
          if (onToolCall) {
            onToolCall("getInformation", { query });
          }
          console.log("query calling get embedding info", query);
          const results = await findRelevantContent(query, userId, assistantId);

          if (results.length === 0) {
            return "No relevant information found in knowledge base.";
          }

          return results
            .map(
              (r, i) =>
                `[Result ${i + 1}] (similarity: ${r.similarity.toFixed(2)})\n${r.content}`
            )
            .join("\n\n");
        },
      }),
    },
  });

  return result;
};
