import { ModelMessage } from "ai";
import { logger } from "../../../../../utils/logger";
import { getMessagesWithinTokenBudget } from "../../../../utils/token-estimator";
import { PipelineContext, PipelineStep } from "../types";

// Token budget for short-term memory (~8K tokens ≈ 2000 words of context)
const TOKEN_BUDGET = 8000;
// Minimum number of message pairs to always include, even if over budget
const MIN_MESSAGE_PAIRS = 3;

export const prepareMessagesStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat) {
    throw new Error("Chat not found in context. Validation step must run first.");
  }

  // Get messages within token budget, starting from most recent
  const recentMessages = getMessagesWithinTokenBudget(
    context.chat.messages,
    TOKEN_BUDGET,
    MIN_MESSAGE_PAIRS
  );

  logger.info("Pipeline Step: Prepare Messages", {
    chatId: context.input.chatId,
    totalMessages: context.chat.messages.length,
    includedMessages: recentMessages.length,
    tokenBudget: TOKEN_BUDGET,
  });

  const messages: ModelMessage[] = [
    ...recentMessages.flatMap((msg) => [
      { role: "user" as const, content: msg.question },
      { role: "assistant" as const, content: msg.answer },
    ]),
    { role: "user" as const, content: context.input.message },
  ];

  return {
    ...context,
    messages,
  };
};
