import { ModelMessage } from "ai";
import { streamRagChat } from "./chat.service";
import { Namespace } from "socket.io";

let io: Namespace | null = null;

export const setSocketIO = (socketIO: Namespace) => {
  io = socketIO;

  io.on("connection", (socket) => {
    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      console.log(`[RAG] Socket ${socket.id} joined room ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[RAG] Socket ${socket.id} disconnected`);
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

  console.log(`[RAG] Starting stream for chatId: ${chatId}`);

  let fullResponse = "";
  const toolCalls: Array<{ tool: string; args: any }> = [];

  const result = await streamRagChat(messages, {
    userId,
    assistantId,
    systemPrompt,
    onToolCall: (toolName: string, args: any) => {
      console.log(`[RAG] Tool call: ${toolName}`, args);
      toolCalls.push({ tool: toolName, args });
      io!.to(chatId).emit("rag_tool_call", { toolName, args });
    },
  });

  console.log(`[RAG] Starting to consume full stream...`);
  let chunkCount = 0;

  for await (const part of result.fullStream) {
    if (part.type === "text-delta") {
      chunkCount++;
      fullResponse += part.text;
      io!.to(chatId).emit("rag_response", fullResponse);
      console.log(`[RAG] Text delta: "${part.text}"`);
    } else if (part.type === "tool-call") {
      console.log(`[RAG] Tool call in stream: ${part.toolName}`);
    } else if (part.type === "tool-result") {
      console.log(`[RAG] Tool result in stream: ${part.toolName}`);
    } else {
      console.log(`[RAG] Stream event: ${part.type}`);
    }
  }

  console.log(
    `[RAG] Stream complete. Chunks: ${chunkCount}, Length: ${fullResponse.length}`
  );

  setTimeout(() => {
    console.log(`[RAG] Emitting stream_end to room: ${chatId}`);
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
