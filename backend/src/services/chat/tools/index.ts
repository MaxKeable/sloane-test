import { createRagTools } from "./rag-tools.factory";
import { createWebSearchTools } from "./web-search-tools.factory";
import { ToolFactoryOptions, EnabledTools } from "./types";

export interface CreateChatToolsOptions extends ToolFactoryOptions {
  enabledTools: EnabledTools;
  isolateRagToAssistant?: boolean;
}

export function createChatTools(options: CreateChatToolsOptions) {
  const {
    userId,
    assistantId,
    enabledTools,
    isolateRagToAssistant = false,
    callbacks,
  } = options;

  const tools: Record<string, any> = {};

  if (enabledTools.rag) {
    const ragTools = createRagTools(
      { userId, assistantId, callbacks },
      isolateRagToAssistant
    );
    Object.assign(tools, ragTools);
  }

  if (enabledTools.webSearch) {
    const webSearchTools = createWebSearchTools({
      userId,
      assistantId,
      callbacks,
    });
    Object.assign(tools, webSearchTools);
  }

  return tools;
}

export * from "./types";
export { createRagTools } from "./rag-tools.factory";
export { createWebSearchTools } from "./web-search-tools.factory";
