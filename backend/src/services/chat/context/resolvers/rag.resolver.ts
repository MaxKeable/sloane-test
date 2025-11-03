
import { findRelevantContent, findRelevantChatContext } from "../../../../utils/embeddingService";
import { logger } from "../../../../../utils/logger";

export interface RagResolverOptions {
  userId: string;
  assistantId?: string;
  chatId?: string;
  userQuery: string;
  enabled: boolean;
  isolateToAssistant?: boolean;
  includeChatContext?: boolean;
  limit?: number;
}

export async function resolveRagContext(
  options: RagResolverOptions
): Promise<string | null> {
  if (!options.enabled) {
    return null;
  }

  try {
    const contextParts: string[] = [];

    // 1. Get regular RAG resources (knowledge base)
    const regularResults = await findRelevantContent(
      options.userQuery,
      options.userId,
      options.assistantId,
      options.isolateToAssistant || false,
      options.limit || 5
    );

    if (regularResults.length > 0) {
      contextParts.push("Relevant Knowledge Base Context:");
      regularResults.forEach((r, i) => {
        contextParts.push(
          `[${i + 1}] (relevance: ${(r.similarity * 100).toFixed(0)}%)\n${r.content}`
        );
      });
    }

    // 2. Get chat-scoped context if enabled and chatId provided
    if (options.includeChatContext && options.chatId) {
      const chatResults = await findRelevantChatContext(
        options.userQuery,
        options.userId,
        options.chatId,
        2 // Limit to 2 most relevant older messages
      );

      if (chatResults.length > 0) {
        contextParts.push("\nEarlier in this conversation:");
        chatResults.forEach((r, i) => {
          contextParts.push(
            `[${i + 1}] ${r.content}`
          );
        });
      }
    }

    return contextParts.length > 0 ? contextParts.join("\n\n") : null;
  } catch (error) {
    logger.error("Error resolving RAG context:", error);
    return null;
  }
}
