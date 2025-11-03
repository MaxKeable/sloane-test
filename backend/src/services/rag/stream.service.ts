import { ModelMessage } from "ai";
import { streamRagChat } from "./chat.service";
import { Namespace } from "socket.io";
import { logger } from "../../../utils/logger";

let io: Namespace | null = null;

export const setSocketIO = (socketIO: Namespace) => {
  io = socketIO;

  io.on("connection", (socket) => {
    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      logger.info(`[RAG] Socket ${socket.id} joined room ${chatId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`[RAG] Socket ${socket.id} disconnected`);
    });
  });
};

export const streamRagChatToSocket = async (
  chatId: string,
  messages: ModelMessage[],
  userId: string,
  assistantId?: string,
  systemPrompt?: string
) => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  logger.info(`[RAG] Starting stream for chatId: ${chatId}`);

  let fullResponse = "";
  const toolCalls: Array<{ tool: string; args: any }> = [];

  const result = await streamRagChat(messages, {
    userId,
    assistantId,
    systemPrompt,
    onToolCall: (toolName: string, args: any) => {
      logger.info(`[RAG] Tool call: ${toolName}`, args);
      toolCalls.push({ tool: toolName, args });
      io!.to(chatId).emit("rag_tool_call", { toolName, args });
    },
  });

  logger.info(`[RAG] Starting to consume full stream...`);
  let chunkCount = 0;

  for await (const part of result.fullStream) {
    if (part.type === "text-delta") {
      chunkCount++;
      fullResponse += part.text;
      io!.to(chatId).emit("rag_response", fullResponse);
      logger.debug(`[RAG] Text delta: "${part.text}"`);
    } else if (part.type === "tool-call") {
      logger.info(`[RAG] Tool call in stream: ${part.toolName}`);
    } else if (part.type === "tool-result") {
      logger.info(`[RAG] Tool result in stream: ${part.toolName}`);
    } else {
      logger.debug(`[RAG] Stream event: ${part.type}`);
    }
  }

  logger.info(
    `[RAG] Stream complete. Chunks: ${chunkCount}, Length: ${fullResponse.length}`
  );

  setTimeout(() => {
    logger.info(`[RAG] Emitting stream_end to room: ${chatId}`);
    io!.to(chatId).emit("stream_end", {
      response: fullResponse,
      toolCalls,
    });
  }, 500);

  return {
    success: true,
    message: "Streaming completed",
    response: fullResponse,
    toolCalls,
  };
};
