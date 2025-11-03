import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { findRelevantContent } from "../../utils/embeddingService";

// New assistant-based config interface
export interface ContextConfig {
  userId: string;
  assistantId?: string;
  userQuery: string;

  features: {
    assistantPrompt?: {
      enabled: boolean;
      override?: string;
    };
    businessContext?: {
      enabled: boolean;
    };
    rag?: {
      enabled: boolean;
      assistantId?: string;
      isolateToAssistant?: boolean;
      limit?: number;
    };
  };
}

interface BusinessProfile {
  businessName?: string;
  businessType?: string;
  businessSize?: number;
  businessDescription?: string;
}

export class ContextBuilderService {
  /**
   * Build context configuration from assistant settings
   */
  async buildConfigFromAssistant(
    userId: string,
    assistantId: string | undefined | null,
    userQuery: string
  ): Promise<ContextConfig> {
    // If no assistant, return minimal config
    if (!assistantId) {
      return {
        userId,
        assistantId: undefined,
        userQuery,
        features: {
          assistantPrompt: { enabled: false },
          businessContext: { enabled: false },
          rag: { enabled: true, limit: 5, isolateToAssistant: false },
        },
      };
    }

    // Fetch assistant to get configuration flags
    const assistant = await prisma.assistants.findUnique({
      where: { id: assistantId },
      select: {
        excludeBusinessContext: true,
        isolateRagContext: true,
      },
    });

    if (!assistant) {
      // Assistant not found, use minimal config
      return {
        userId,
        assistantId: undefined,
        userQuery,
        features: {
          assistantPrompt: { enabled: false },
          businessContext: { enabled: false },
          rag: { enabled: true, limit: 5, isolateToAssistant: false },
        },
      };
    }

    // Build config from assistant settings
    return {
      userId,
      assistantId,
      userQuery,
      features: {
        assistantPrompt: { enabled: true },
        businessContext: { enabled: !assistant.excludeBusinessContext },
        rag: {
          enabled: true,
          assistantId,
          isolateToAssistant: assistant.isolateRagContext,
          limit: 5,
        },
      },
    };
  }

  /**
   * Get assistant base prompt
   */
  private async getAssistantPrompt(
    assistantId: string
  ): Promise<string | null> {
    try {
      const assistant = await prisma.assistants.findUnique({
        where: { id: assistantId },
        select: { basePrompt: true },
      });

      return assistant?.basePrompt || null;
    } catch (error) {
      logger.error("Error fetching assistant prompt:", error);
      return null;
    }
  }

  /**
   * Get business context from user profile
   */
  private async getBusinessContext(userId: string): Promise<string | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { clerkUserId: userId },
        select: { businessProfile: true },
      });

      if (!user?.businessProfile) {
        return null;
      }

      const profile = user.businessProfile as BusinessProfile;

      // Build business prompt similar to generateBusinessPrompt.ts
      const parts: string[] = [];

      if (profile.businessName) {
        parts.push(`The business name is ${profile.businessName}`);
      }

      if (profile.businessType) {
        parts.push(`the business type is ${profile.businessType}`);
      }

      if (profile.businessSize) {
        parts.push(`and the business has ${profile.businessSize} employees`);
      }

      if (profile.businessDescription) {
        parts.push(
          `\n\nHere is the business description and notes: ${profile.businessDescription}`
        );
      }

      return parts.length > 0 ? parts.join(", ") : null;
    } catch (error) {
      logger.error("Error fetching business context:", error);
      return null;
    }
  }

  /**
   * Get RAG context from knowledge base
   */
  private async getRagContext(
    userId: string,
    assistantId: string | undefined,
    isolateToAssistant: boolean,
    userQuery: string
  ): Promise<string | null> {
    try {
      const results = await findRelevantContent(
        userQuery,
        userId,
        assistantId,
        isolateToAssistant,
        5
      );

      if (results.length === 0) {
        return null;
      }

      const contextParts = results.map(
        (r, i) =>
          `[${i + 1}] (relevance: ${(r.similarity * 100).toFixed(0)}%)\n${r.content}`
      );

      return contextParts.join("\n\n");
    } catch (error) {
      logger.error("Error fetching RAG context:", error);
      return null;
    }
  }

  /**
   * Build context using new config-driven approach
   */
  async buildContextFromConfig(config: ContextConfig): Promise<string> {
    const parts: string[] = [];

    try {
      // 1. Assistant Base Prompt (if enabled and override not provided)
      if (config.features.assistantPrompt?.enabled) {
        if (config.features.assistantPrompt.override) {
          parts.push(config.features.assistantPrompt.override);
        } else if (config.assistantId) {
          const assistantPrompt = await this.getAssistantPrompt(
            config.assistantId
          );
          if (assistantPrompt) {
            parts.push(assistantPrompt);
          }
        }
      }

      // 2. Business Context (if enabled)
      if (config.features.businessContext?.enabled) {
        const businessContext = await this.getBusinessContext(config.userId);
        if (businessContext) {
          parts.push(
            "Before we begin, I would like to give you some background on my business:"
          );
          parts.push(businessContext);
        }
      }

      // 3. RAG Context (if enabled)
      if (config.features.rag?.enabled) {
        const ragAssistantId =
          config.features.rag.assistantId || config.assistantId;
        const isolateToAssistant =
          config.features.rag.isolateToAssistant || false;

        const ragContext = await this.getRagContext(
          config.userId,
          ragAssistantId,
          isolateToAssistant,
          config.userQuery
        );
        if (ragContext) {
          parts.push("Relevant Knowledge Base Context:");
          parts.push(ragContext);
        }
      }

      // 4. Formatting instructions
      parts.push(
        "FORMATTING: Always format your responses using proper Markdown syntax."
      );

      return parts.join("\n\n");
    } catch (error) {
      logger.error("Error building context from config:", error);
      // Fallback to minimal context
      return "FORMATTING: Always format your responses using proper Markdown syntax.";
    }
  }
}

export const contextBuilderService = new ContextBuilderService();
