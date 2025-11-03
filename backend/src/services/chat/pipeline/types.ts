import { ModelMessage } from "ai";

export interface PipelineContext {
  input: SendMessageInput;
  userId: string;

  chat?: ChatData;
  contextConfig?: ContextConfig;
  systemPrompt?: string;
  messages?: ModelMessage[];
  tools?: Record<string, any>;
  aiResponse?: string;
  response?: string;
  savedMessage?: SavedMessage;
}

export interface SendMessageInput {
  chatId: string;
  message: string;
  file?: FileAttachment;
  enableWebSearch?: boolean;
  selectedModel?: string;
}

export interface FileAttachment {
  data: string;
  mimeType: string;
  filename: string;
}

export interface ChatData {
  id: string;
  user: string;
  assistant: string | null;
  messages: ChatMessage[];
  sessionContext?: {
    currentTopic: string | null;
    keyDecisions: string[];
    lastUpdated: Date;
  } | null;
  folderId: string | null;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  file_type?: string | null;
  imageUrl?: string | null;
  imageName?: string | null;
}

export interface SavedMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  file_type?: string;
  imageName?: string;
}

export interface ContextConfig {
  userId: string;
  assistantId?: string;
  chatId?: string;
  userQuery: string;

  features: {
    memory?: {
      enabled: boolean;
      maxItems?: number;
    };
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
      chatId?: string;
      isolateToAssistant?: boolean;
      includeChatContext?: boolean;
      limit?: number;
    };
  };
}

export interface ResolvedContext {
  memory?: string | null;
  assistantPrompt?: string | null;
  businessContext?: string | null;
  ragContext?: string | null;
}

export type PipelineStep = (
  context: PipelineContext
) => Promise<PipelineContext>;

export interface PipelineConfig {
  steps: PipelineStep[];
}

export interface StreamingOptions {
  chatId: string;
  messages: ModelMessage[];
  systemPrompt: string;
  file?: FileAttachment;
  userId: string;
  assistantId?: string;
  tools?: Record<string, any>;
  selectedModel?: string;
}

export interface StreamingCallbacks {
  onComplete: (response: string) => Promise<void>;
  onToolCall?: (toolName: string, args: any) => void;
  onError?: (error: Error) => void;
}
