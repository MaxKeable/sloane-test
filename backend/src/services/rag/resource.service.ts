import prisma from "../../../config/client";
import { createResourceWithEmbeddings } from "../../utils/embeddingService";

export const createResource = async (
  userId: string,
  content: string,
  assistantId?: string,
  metadata?: { title?: string; source?: string; type?: string }
) => {
  if (!content || content.trim().length < 10) {
    throw new Error("Content must be at least 10 characters");
  }

  const resource = await createResourceWithEmbeddings(
    content,
    userId,
    assistantId,
    metadata
  );

  return {
    success: true,
    message: "Resource created and embedded successfully",
    resourceId: resource.id,
  };
};

export const getResources = async (
  userId: string,
  assistantId?: string
) => {
  const filter: any = { userId };
  if (assistantId) filter.assistantId = assistantId;

  const resources = await prisma.resources.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      embeddings: {
        select: {
          id: true,
        },
      },
    },
  });

  return resources.map((r) => ({
    ...r,
    embeddingCount: r.embeddings.length,
  }));
};

export const deleteResource = async (userId: string, resourceId: string) => {
  const resource = await prisma.resources.findFirst({
    where: {
      id: resourceId,
      userId,
    },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  await prisma.resources.delete({
    where: { id: resourceId },
  });

  return {
    success: true,
    message: "Resource deleted successfully",
  };
};
