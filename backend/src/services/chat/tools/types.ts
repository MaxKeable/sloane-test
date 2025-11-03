
export interface ToolFactoryOptions {
  userId: string;
  assistantId: string | null;
  callbacks?: ToolCallbacks;
}

export interface ToolCallbacks {
  onToolCall?: (toolName: string, args: any) => void;
}

export interface EnabledTools {
  rag?: boolean;
  webSearch?: boolean;
}
