
import prisma from "../../../../../config/client";
import { logger } from "../../../../../utils/logger";

export interface AssistantResolverOptions {
  assistantId: string;
  enabled: boolean;
  override?: string;  // Optional override for the base prompt
}

export interface AssistantConfig {
  excludeBusinessContext: boolean;
  isolateRagContext: boolean;
}

export async function resolveAssistantPrompt(
  options: AssistantResolverOptions
): Promise<string | null> {
  if (!options.enabled) {
    return null;
  }

  if (options.override) {
    return options.override;
  }

  try {
    const assistant = await prisma.assistants.findUnique({
      where: { id: options.assistantId },
      select: { basePrompt: true },
    });

    return assistant?.basePrompt || null;
  } catch (error) {
    logger.error("Error resolving assistant prompt:", error);
    return null;
  }
}

export async function resolveAssistantConfig(
  assistantId: string
): Promise<AssistantConfig> {
  try {
    const assistant = await prisma.assistants.findUnique({
      where: { id: assistantId },
      select: {
        excludeBusinessContext: true,
        isolateRagContext: true,
      },
    });

    if (!assistant) {
      return {
        excludeBusinessContext: false,
        isolateRagContext: false,
      };
    }

    return {
      excludeBusinessContext: assistant.excludeBusinessContext,
      isolateRagContext: assistant.isolateRagContext,
    };
  } catch (error) {
    logger.error("Error resolving assistant config:", error);
    return {
      excludeBusinessContext: false,
      isolateRagContext: false,
    };
  }
}
