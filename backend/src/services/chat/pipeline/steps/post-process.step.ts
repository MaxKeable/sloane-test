import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";

export const postProcessStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat || !context.savedMessage || !context.contextConfig) {
    throw new Error(
      "Chat, saved message, or context config not found. Previous steps must run first."
    );
  }

  logger.info("Pipeline Step: Post-Process", {
    chatId: context.input.chatId,
  });

  // Post-processing step - currently a placeholder for future functionality
  // Previously handled memory batch processing which has been removed

  return context;
};
