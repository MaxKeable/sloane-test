import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

interface UseSocketProps {
  chatId?: string;
  namespace?: "/chat" | "/rag"; // Support for expert vs playground chats
  onResponse: (response: string) => void;
  onStreamEnd: (response: string) => void;
  onError?: (error: { message: string }) => void;
}

/**
 * Hook to manage Socket.IO connection for chat streaming
 * Supports namespace-based connections for expert (/chat) and playground (/rag) chats
 */
export const useSocket = ({
  chatId,
  namespace = "/chat", // Default to expert chat namespace
  onResponse,
  onStreamEnd,
  onError,
}: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    // Disconnect existing socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Create new socket connection with namespace
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    socketRef.current = io(baseUrl + namespace, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for new chat events (for /chat namespace)
    socketRef.current.on("chat:response", onResponse);
    socketRef.current.on("chat:stream_end", onStreamEnd);

    // Also listen for old events for backward compatibility
    socketRef.current.on("openai_response", onResponse);
    socketRef.current.on("stream_end", onStreamEnd);

    // Error handling
    if (onError) {
      socketRef.current.on("chat:error", onError);
    }

    // Join the chat room
    socketRef.current.emit("joinRoom", chatId);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat:response", onResponse);
        socketRef.current.off("chat:stream_end", onStreamEnd);
        socketRef.current.off("openai_response", onResponse);
        socketRef.current.off("stream_end", onStreamEnd);
        if (onError) {
          socketRef.current.off("chat:error", onError);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [chatId, namespace, onResponse, onStreamEnd, onError]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};

