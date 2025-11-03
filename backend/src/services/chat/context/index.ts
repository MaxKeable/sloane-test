import { logger } from "../../../../utils/logger";
import { ContextConfig, ResolvedContext } from "../pipeline/types";
import {
  resolveAssistantPrompt,
  resolveAssistantConfig,
  resolveBusinessContext,
  resolveRagContext,
} from "./resolvers";

export class ContextBuilderService {
  async buildConfigFromAssistant(
    userId: string,
    assistantId: string | undefined | null,
    userQuery: string,
    chatId?: string
  ): Promise<ContextConfig> {
    if (!assistantId) {
      return {
        userId,
        assistantId: undefined,
        userQuery,
        chatId,
        features: {
          memory: { enabled: false },
          assistantPrompt: { enabled: false },
          businessContext: { enabled: false },
          rag: { enabled: true, limit: 5, isolateToAssistant: false, includeChatContext: false },
        },
      };
    }

    const assistantConfig = await resolveAssistantConfig(assistantId);

    return {
      userId,
      assistantId,
      userQuery,
      chatId,
      features: {
        memory: { enabled: false }, // Disabled to prevent cross-chat memory bleeding
        assistantPrompt: { enabled: true },
        businessContext: { enabled: !assistantConfig.excludeBusinessContext },
        rag: {
          enabled: true,
          assistantId,
          chatId,
          isolateToAssistant: assistantConfig.isolateRagContext,
          includeChatContext: true, // Enable chat-scoped context retrieval
          limit: 5,
        },
      },
    };
  }

  async resolveContextData(config: ContextConfig): Promise<ResolvedContext> {
    const resolved: ResolvedContext = {};

    try {
      const [assistantPrompt, businessContext, ragContext] =
        await Promise.all([
          config.features.assistantPrompt?.enabled && config.assistantId
            ? resolveAssistantPrompt({
                assistantId: config.assistantId,
                enabled: true,
                override: config.features.assistantPrompt.override,
              })
            : null,

          config.features.businessContext?.enabled
            ? resolveBusinessContext({
                userId: config.userId,
                enabled: true,
              })
            : null,

          config.features.rag?.enabled
            ? resolveRagContext({
                userId: config.userId,
                assistantId:
                  config.features.rag.assistantId || config.assistantId,
                chatId: config.features.rag.chatId || config.chatId,
                userQuery: config.userQuery,
                enabled: true,
                isolateToAssistant: config.features.rag.isolateToAssistant,
                includeChatContext: config.features.rag.includeChatContext || false,
                limit: config.features.rag.limit,
              })
            : null,
        ]);

      resolved.assistantPrompt = assistantPrompt;
      resolved.businessContext = businessContext;
      resolved.ragContext = ragContext;

      return resolved;
    } catch (error) {
      logger.error("Error resolving context data:", error);
      return resolved;
    }
  }

  buildPromptFromContext(resolved: ResolvedContext): string {
    const parts: string[] = [];

    if (resolved.assistantPrompt) {
      parts.push(resolved.assistantPrompt);
    }

    if (resolved.businessContext) {
      parts.push(resolved.businessContext);
    }

    if (resolved.ragContext) {
      parts.push(resolved.ragContext);
    }

    parts.push(
      "FORMATTING: Always format your responses using proper Markdown syntax."
    );

    return parts.join("\n\n");
  }

  async buildContextFromConfig(config: ContextConfig): Promise<string> {
    try {
      const resolved = await this.resolveContextData(config);
      return this.buildPromptFromContext(resolved);
    } catch (error) {
      logger.error("Error building context from config:", error);
      return "FORMATTING: Always format your responses using proper Markdown syntax.";
    }
  }
}

export const contextBuilderService = new ContextBuilderService();

export type { ContextConfig, ResolvedContext } from "../pipeline/types";
