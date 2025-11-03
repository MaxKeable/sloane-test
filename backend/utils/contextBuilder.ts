/**
 * Smart context builder utility for AI chat services
 * Manages conversation history to prevent context window overflow and improve AI performance
 */

export interface ChatMessage {
  question: string;
  answer: string;
}

export interface ContextBuilderOptions {
  maxMessages?: number;
  maxAnswerLength?: number;
  includeMessageNumbers?: boolean;
}

/**
 * Builds optimized context from chat messages
 * @param messages - Array of chat messages
 * @param options - Configuration options for context building
 * @returns Formatted context string optimized for AI consumption
 */
export const buildSmartContext = (
  messages: ChatMessage[],
  options: ContextBuilderOptions = {}
): string => {
  const {
    maxMessages = 8,
    maxAnswerLength = 200,
    includeMessageNumbers = true,
  } = options;

  if (!messages || messages.length === 0) {
    return "No previous conversation.";
  }

  // Take only the last N messages to keep context relevant
  const recentMessages = messages.slice(-maxMessages);

  // Structure context better for AI understanding
  const contextParts = ["Recent conversation context:"];

  recentMessages.forEach((message, index) => {
    const messageNum = includeMessageNumbers
      ? messages.length - maxMessages + index + 1
      : index + 1;

    const prefix = includeMessageNumbers ? `[${messageNum}]` : "";

    // Add user question
    contextParts.push(`${prefix} User: ${message.question}`);

    // Add truncated assistant response
    const truncatedAnswer =
      message.answer.length > maxAnswerLength
        ? `${message.answer.slice(0, maxAnswerLength)}...`
        : message.answer;

    contextParts.push(`${prefix} Assistant: ${truncatedAnswer}`);
  });

  return contextParts.join("\n");
};

/**
 * Estimates token count for context (rough approximation)
 * @param context - Context string
 * @returns Estimated token count
 */
export const estimateTokenCount = (context: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(context.length / 4);
};

/**
 * Builds context with automatic token limit management
 * @param messages - Array of chat messages
 * @param maxTokens - Maximum tokens to allow in context
 * @returns Optimized context string within token limits
 */
export const buildTokenLimitedContext = (
  messages: ChatMessage[],
  maxTokens: number = 4000
): string => {
  let maxMessages = Math.min(messages.length, 20); // Start with reasonable upper limit
  let context = "";

  // Binary search to find optimal message count within token limit
  while (maxMessages > 0) {
    context = buildSmartContext(messages, { maxMessages });
    const tokenCount = estimateTokenCount(context);

    if (tokenCount <= maxTokens) {
      break;
    }

    maxMessages = Math.floor(maxMessages * 0.7); // Reduce by 30%
  }

  return context || "No previous conversation.";
};
