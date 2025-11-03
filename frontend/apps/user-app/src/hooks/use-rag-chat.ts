import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useStreamRagChat } from "../api/use-rag-api";

type MessageRole = "user" | "assistant";

type ToolCall = {
  tool: string;
  args: Record<string, unknown>;
};

type Message = {
  role: MessageRole;
  content: string;
  toolCalls?: ToolCall[];
};

export const useRagChat = (chatId: string, assistantId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [currentToolCalls, setCurrentToolCalls] = useState<ToolCall[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const streamChat = useStreamRagChat();

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
    );
    socketRef.current = socket;

    socket.emit("joinRoom", chatId);

    socket.on("rag_response", (response: string) => {
      setCurrentResponse(response);
      setIsStreaming(true);
    });

    socket.on(
      "rag_tool_call",
      ({
        toolName,
        args,
      }: {
        toolName: string;
        args: Record<string, unknown>;
      }) => {
        setCurrentToolCalls((prev) => [...prev, { tool: toolName, args }]);
      }
    );

    socket.on(
      "stream_end",
      ({
        response,
        toolCalls,
      }: {
        response: string;
        toolCalls: ToolCall[];
      }) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response, toolCalls },
        ]);
        setCurrentResponse("");
        setCurrentToolCalls([]);
        setIsStreaming(false);
      }
    );

    return () => {
      socket.off("rag_response");
      socket.off("rag_tool_call");
      socket.off("stream_end");
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsStreaming(true);

      try {
        await streamChat.mutateAsync({
          chatId,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          assistantId,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        setIsStreaming(false);
      }
    },
    [chatId, messages, assistantId, streamChat]
  );

  const displayMessages = currentResponse
    ? [
        ...messages,
        {
          role: "assistant" as const,
          content: currentResponse,
          toolCalls: currentToolCalls,
        },
      ]
    : messages;

  return {
    messages: displayMessages,
    sendMessage,
    isStreaming,
  };
};
