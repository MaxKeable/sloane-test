import { ObjectId } from "mongodb";
import prisma from "../../../../../config/client";
import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";

export const saveResponseStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat || !context.aiResponse) {
    throw new Error(
      "Chat or AI response not found. Previous steps must run first."
    );
  }

  logger.info("Pipeline Step: Save Response", {
    chatId: context.input.chatId,
    responseLength: context.aiResponse.length,
  });

  const newMessage = {
    id: new ObjectId().toString(),
    question: context.input.message,
    answer: context.aiResponse,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(context.input.file && {
      file_type:
        context.input.file.mimeType === "application/pdf"
          ? "PDF"
          : context.input.file.mimeType.startsWith("image/")
          ? "Image"
          : undefined,
      imageName: context.input.file.filename,
    }),
  };

  await prisma.chats.update({
    where: { id: context.input.chatId },
    data: {
      messages: [...context.chat.messages, newMessage],
      updatedAt: new Date(),
    },
  });

  return {
    ...context,
    response: context.aiResponse,
    savedMessage: newMessage,
  };
};
