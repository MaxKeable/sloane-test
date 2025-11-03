
import { ModelMessage } from "ai";


export interface StreamingOptions {
  chatId: string;
  messages: ModelMessage[];
  systemPrompt: string;
  file?: FileAttachment;
  userId: string;
  assistantId?: string;
  tools?: Record<string, any>;
  selectedModel?: string; // Override model for this message
}

export interface FileAttachment {
  data: string;       // base64
  mimeType: string;
  filename: string;
}

export interface StreamingCallbacks {
  onComplete: (response: string) => Promise<void>;
  onToolCall?: (toolName: string, args: any) => void;
  onError?: (error: Error) => void;
}


export interface IAIProvider {
  /**
   * Stream a chat response from the AI service
   */
  stream(
    options: StreamingOptions,
    transport: IStreamTransport,
    callbacks: StreamingCallbacks
  ): Promise<void>;
}

export interface AIModel {
  service: "openAi" | "anthropic" | "gemini" | "deepseek";
  model: any;  // Model instance from AI SDK
}


export interface IStreamTransport {
  /**
   * Send a text delta to the client
   */
  sendTextDelta(text: string): void;

  /**
   * Notify client about a tool call
   */
  sendToolCall(toolName: string, args: any): void;

  /**
   * Notify client about a tool result
   */
  sendToolResult(toolName: string, result: any): void;

  /**
   * Signal that streaming has completed
   */
  sendStreamEnd(fullResponse: string): void;

  /**
   * Send an error to the client
   */
  sendError(error: Error): void;
}


export interface StreamEvents {
  textDelta: { text: string; fullResponse: string };
  toolCall: { toolName: string; args: any };
  toolResult: { toolName: string; result: any };
  streamEnd: { fullResponse: string };
  error: { message: string };
}
