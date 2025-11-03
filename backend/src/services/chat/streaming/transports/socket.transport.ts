
import { chatNamespace } from "../../../../../index";
import { IStreamTransport } from "../types";
import { logger } from "../../../../../utils/logger";

export class SocketStreamTransport implements IStreamTransport {
  constructor(private readonly chatId: string) {}

  sendTextDelta(fullResponse: string): void {
    chatNamespace.to(this.chatId).emit("chat:response", fullResponse);
  }

  sendToolCall(toolName: string, args: any): void {
    logger.info("Tool call via socket transport", {
      chatId: this.chatId,
      toolName,
      args,
    });
    chatNamespace.to(this.chatId).emit("chat:tool_call", {
      toolName,
      args,
    });
  }

  sendToolResult(toolName: string, result: any): void {
    logger.info("Tool result via socket transport", {
      chatId: this.chatId,
      toolName,
      resultPreview:
        typeof result === "string"
          ? result.substring(0, 200)
          : JSON.stringify(result).substring(0, 200),
    });
    chatNamespace.to(this.chatId).emit("chat:tool_result", {
      toolName,
      result,
    });
  }

  sendStreamEnd(fullResponse: string): void {
    chatNamespace.to(this.chatId).emit("chat:stream_end", fullResponse);
  }

  sendError(error: Error): void {
    logger.error("Streaming error via socket transport", {
      chatId: this.chatId,
      error: error.message,
    });
    chatNamespace.to(this.chatId).emit("chat:error", {
      message: error.message || "An error occurred during streaming",
    });
  }
}
