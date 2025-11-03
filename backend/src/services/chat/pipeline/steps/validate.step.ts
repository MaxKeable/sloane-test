import prisma from "../../../../../config/client";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";

export const validateStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  logger.info("Pipeline Step: Validate", {
    chatId: context.input.chatId,
    userId: context.userId,
  });

  const chat = await prisma.chats.findFirst({
    where: {
      id: context.input.chatId,
      user: context.userId,
    },
  });

  if (!chat) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found",
    });
  }

  return {
    ...context,
    chat: {
      id: chat.id,
      user: chat.user,
      assistant: chat.assistant,
      messages: chat.messages as any[],
      sessionContext: chat.sessionContext,
      folderId: chat.folderId,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    },
  };
};
