/**
 * Token estimation utility
 * Provides a simple heuristic for estimating token counts from text
 */

/**
 * Estimate the number of tokens in a text string
 * Uses a simple heuristic: approximately 1 token per 4 characters for English text
 * This is a rough approximation - actual token counts may vary by ~20-30%
 *
 * @param text - The text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  // Simple heuristic: 1 token ≈ 4 characters
  // This works reasonably well for English text
  const estimate = Math.ceil(text.length / 4);

  return estimate;
}

/**
 * Estimate tokens for a chat message object
 * Includes both question and answer in the count
 *
 * @param message - Chat message with question and answer
 * @returns Estimated token count for the message pair
 */
export function estimateMessageTokens(message: { question: string; answer: string }): number {
  const questionTokens = estimateTokens(message.question);
  const answerTokens = estimateTokens(message.answer);

  // Add a small overhead for message formatting (role labels, etc.)
  const overhead = 10;

  return questionTokens + answerTokens + overhead;
}

/**
 * Get messages within a token budget, starting from the most recent
 * Always includes at least the specified minimum number of messages
 *
 * @param messages - Array of chat messages
 * @param tokenBudget - Maximum number of tokens to include
 * @param minMessages - Minimum number of messages to include (default: 3)
 * @returns Array of messages within the token budget
 */
export function getMessagesWithinTokenBudget<T extends { question: string; answer: string }>(
  messages: T[],
  tokenBudget: number,
  minMessages: number = 3
): T[] {
  if (messages.length === 0) {
    return [];
  }

  const result: T[] = [];
  let tokenCount = 0;

  // Start from the most recent message and work backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = estimateMessageTokens(message);

    // Always include minimum number of messages, even if over budget
    if (result.length < minMessages) {
      result.unshift(message);
      tokenCount += messageTokens;
      continue;
    }

    // Check if adding this message would exceed the budget
    if (tokenCount + messageTokens > tokenBudget) {
      break;
    }

    result.unshift(message);
    tokenCount += messageTokens;
  }

  return result;
}
