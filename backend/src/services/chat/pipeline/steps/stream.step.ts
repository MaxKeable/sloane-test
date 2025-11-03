import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";
import { aiSdkProvider } from "../../streaming";
import { SocketStreamTransport } from "../../streaming";

export const streamStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.messages || !context.systemPrompt) {
    throw new Error(
      "Messages or system prompt not found. Previous steps must run first."
    );
  }

  logger.info("Pipeline Step: Stream", {
    chatId: context.input.chatId,
    hasTools: !!context.tools,
  });

  const transport = new SocketStreamTransport(context.input.chatId);

  let aiResponse = "";

  await aiSdkProvider.stream(
    {
      chatId: context.input.chatId,
      messages: context.messages,
      systemPrompt: context.systemPrompt,
      file: context.input.file,
      userId: context.userId,
      assistantId: context.chat?.assistant || undefined,
      tools: context.tools,
      selectedModel: context.input.selectedModel,
    },
    transport,
    {
      onComplete: async (response: string) => {
        aiResponse = response;
      },
      onError: (error: Error) => {
        logger.error("Streaming error", {
          chatId: context.input.chatId,
          error: error.message,
        });
      },
    }
  );

  return {
    ...context,
    aiResponse,
  };
};
