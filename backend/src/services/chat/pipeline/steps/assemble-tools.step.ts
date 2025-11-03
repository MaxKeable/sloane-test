import { logger } from "../../../../../utils/logger";
import { PipelineContext, PipelineStep } from "../types";
import { createChatTools } from "../../tools";

export const assembleToolsStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat || !context.contextConfig) {
    throw new Error(
      "Chat or context config not found. Previous steps must run first."
    );
  }

  logger.info("Pipeline Step: Assemble Tools", {
    chatId: context.input.chatId,
    enableWebSearch: context.input.enableWebSearch,
  });

  const tools = createChatTools({
    userId: context.userId,
    assistantId: context.chat.assistant,
    enabledTools: {
      rag: true,
      webSearch: context.input.enableWebSearch ?? false,
    },
    isolateRagToAssistant:
      context.contextConfig.features.rag?.isolateToAssistant || false,
    callbacks: {
      onToolCall: (toolName, args) => {
        logger.info("Tool called", {
          chatId: context.input.chatId,
          toolName,
          args,
        });
      },
    },
  });

  return {
    ...context,
    tools,
  };
};
