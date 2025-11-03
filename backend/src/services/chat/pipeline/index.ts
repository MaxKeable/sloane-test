import { logger } from "../../../../utils/logger";
import { TRPCError } from "@trpc/server";
import { PipelineContext, SendMessageInput } from "./types";
import {
  validateStep,
  resolveContextStep,
  buildPromptStep,
  prepareMessagesStep,
  assembleToolsStep,
  streamStep,
  saveResponseStep,
  extractContextStep,
  postProcessStep,
} from "./steps";

export async function executeChatPipeline(
  userId: string,
  input: SendMessageInput
): Promise<{ success: boolean }> {
  try {
    logger.info("Starting chat pipeline", {
      chatId: input.chatId,
      userId,
    });

    let context: PipelineContext = {
      userId,
      input,
    };

    context = await validateStep(context);
    context = await resolveContextStep(context);
    context = await buildPromptStep(context);
    context = await prepareMessagesStep(context);
    context = await assembleToolsStep(context);
    context = await streamStep(context);
    context = await saveResponseStep(context);
    context = await extractContextStep(context);
    context = await postProcessStep(context);

    logger.info("Chat pipeline completed successfully", {
      chatId: input.chatId,
      userId,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    logger.error("Error in chat pipeline:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      chatId: input.chatId,
      userId,
    });

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to process message",
    });
  }
}
