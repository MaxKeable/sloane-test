import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";
import { contextBuilderService } from "../../context";

export const resolveContextStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat) {
    throw new Error("Chat not found in context. Validation step must run first.");
  }

  logger.info("Pipeline Step: Resolve Context", {
    chatId: context.input.chatId,
    assistantId: context.chat.assistant,
  });

  const contextConfig = await contextBuilderService.buildConfigFromAssistant(
    context.userId,
    context.chat.assistant,
    context.input.message,
    context.input.chatId
  );

  return {
    ...context,
    contextConfig,
  };
};
