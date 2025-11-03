import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateChat,
  useSendMessage,
  useUpdateChatTitle,
  useDeleteChat,
} from "../api/use-chat-api";
import type { Chat } from "../types/chat";
import { useTRPCClient } from "../providers/api-provider";

interface IChatContextState {
  selectedChat: Chat | undefined;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  selectChat: (chatId: string) => Promise<void>;
  sendChat: (
    prompt: string,
    assistantId: string,
    file?: File | null,
    chatId?: string,
    folderId?: string,
    enableWebSearch?: boolean,
    selectedModel?: string | null
  ) => Promise<void>;
  createChat: (assistantId: string, folderId?: string) => Promise<Chat>;
  isMessageLoading: boolean;
  question: string;
  saveAction: (data: {
    title: string;
    text: string;
    column: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
    chatId?: string;
    messageId?: string;
  }) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, newTitle: string) => Promise<void>;
  processMessageBatch: (message: any) => Promise<void>;
  resetChat: () => void;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
}

const ChatContext = createContext<IChatContextState | undefined>(undefined);

export const useChat = () => useContext(ChatContext)!;

export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { getToken, userId } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [selectedModel, setSelectedModelState] = useState<string | null>(null);
  const trpcClient = useTRPCClient();

  // tRPC mutations
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();
  const updateTitleMutation = useUpdateChatTitle();
  const deleteChatMutation = useDeleteChat();

  // Load selected model from localStorage when chat changes
  useEffect(() => {
    if (selectedChat?.id) {
      const storageKey = `selectedModel_${selectedChat.id}`;
      const savedModel = localStorage.getItem(storageKey);
      setSelectedModelState(savedModel);
    }
  }, [selectedChat?.id]);

  // Save selected model to localStorage when it changes
  const setSelectedModel = useCallback((model: string | null) => {
    setSelectedModelState(model);
    if (selectedChat?.id) {
      const storageKey = `selectedModel_${selectedChat.id}`;
      if (model) {
        localStorage.setItem(storageKey, model);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [selectedChat?.id]);

  // Define selectChat before using it in useEffect
  const selectChat = useCallback(
    async (chatId: string) => {
      console.log("selectChat called with chatId:", chatId);

      try {
        // Skip server fetch for temporary optimistic ids
        if (chatId.startsWith("temp-")) {
          return;
        }
        // Use tRPC client directly for imperative queries
        const chat = await trpcClient.chats.get.query({ chatId });
        console.log("selectChat result:", chat);
        setSelectedChat(chat);
      } catch (error) {
        console.error("Error selecting chat:", error);
      }
    },
    [trpcClient]
  );

  // Auto-select chat from URL params
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (
      chatId &&
      !chatId.startsWith("temp-") &&
      (!selectedChat || selectedChat.id !== chatId)
    ) {
      selectChat(chatId);
    }
  }, [searchParams, selectChat, selectedChat]);

  const sendChat = async (
    prompt: string,
    assistantId: string,
    file?: File | null,
    chatId?: string,
    folderId?: string,
    enableWebSearch?: boolean,
    selectedModelOverride?: string | null
  ) => {
    setIsMessageLoading(true);
    setQuestion(prompt);

    let finalChatId = chatId || selectedChat?.id;

    // If a temp chat is selected, block sending until it's materialized
    if (finalChatId && finalChatId.startsWith("temp-")) {
      try {
        const realChat = await createChat(assistantId, folderId);
        finalChatId = realChat.id;
      } catch (e) {
        setIsMessageLoading(false);
        return;
      }
    }

    // Create new chat if needed
    if (!finalChatId) {
      const chat = await createChat(assistantId, folderId);
      finalChatId = chat.id;
    }

    const tempMessageId = Date.now().toString();

    let imageUrl = "";
    let imageName = "";
    if (file && file.type.startsWith("image/")) {
      imageUrl = URL.createObjectURL(file);
      imageName = file.name;
    }

    const optimisticMessage = {
      id: tempMessageId,
      question: prompt,
      answer: "",
      file_type:
        file?.type === "application/pdf"
          ? "PDF"
          : file?.type?.startsWith("image/")
            ? "Image"
            : undefined,
      imageUrl: imageUrl || undefined,
      imageName: imageName || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSelectedChat((currentChat: any) => ({
      ...currentChat,
      messages: [...(currentChat?.messages || []), optimisticMessage],
    }));

    try {
      // Convert file to base64 if present
      let fileData:
        | { data: string; mimeType: string; filename: string }
        | undefined;
      if (file) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // Remove data URL prefix
          };
          reader.readAsDataURL(file);
        });

        fileData = {
          data: base64,
          mimeType: file.type,
          filename: file.name,
        };
      }

      // Use the override if provided, otherwise use the state value
      const modelToUse = selectedModelOverride !== undefined
        ? selectedModelOverride
        : selectedModel;

      await sendMessageMutation.mutateAsync({
        chatId: finalChatId!,
        message: prompt,
        file: fileData,
        enableWebSearch: enableWebSearch ?? false,
        selectedModel: modelToUse || undefined,
      });

      // Socket.IO will handle the streaming response
      // The message will be updated via socket events in the chat window component
    } catch (error) {
      console.error("Error sending chat message:", error);
      setSelectedChat((currentChat: any) => {
        const updatedMessages = currentChat.messages.map((message: any) =>
          message.id === tempMessageId
            ? { ...message, answer: "Failed to get response", status: "failed" }
            : message
        );
        return { ...currentChat, messages: updatedMessages };
      });
    } finally {
      setIsMessageLoading(false);
    }
  };

  const createChat = async (
    assistantId: string,
    folderId?: string
  ): Promise<Chat> => {
    const chat = await createChatMutation.mutateAsync({
      assistantId,
      folderId,
    });

    setSelectedChat(chat);
    return chat;
  };

  const saveAction = async (data: {
    title: string;
    text: string;
    column: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
    chatId?: string;
    messageId?: string;
  }) => {
    try {
      const token = await getToken();
      if (!token || !userId) {
        console.error("Token or User ID is missing for saving action");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/actions/save-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save action: ${errorData.error || response.statusText}`
        );
      }

      const responseData = await response.json();
      window.dispatchEvent(new CustomEvent("actionCreated"));
      return responseData;
    } catch (error) {
      console.error("Failed to save action:", error);
      throw error;
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatMutation.mutateAsync({ chatId });

      // If the deleted chat was selected, clear the selection
      if (selectedChat?.id === chatId) {
        setSelectedChat(undefined);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const resetChat = () => {
    setSelectedChat(undefined);
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await updateTitleMutation.mutateAsync({ chatId, title: newTitle });

      // Update selected chat if it's the one being renamed
      if (selectedChat?.id === chatId) {
        setSelectedChat((prev: any) => ({ ...prev, title: newTitle }));
      }
    } catch (error) {
      console.error("Error updating chat title:", error);
    }
  };

  const processMessageBatch = async (message: any) => {
    // Implementation for message batch processing if needed
    console.log("Processing message batch:", message);
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        selectChat,
        sendChat,
        createChat,
        isMessageLoading,
        question,
        saveAction,
        deleteChat,
        updateChatTitle,
        processMessageBatch,
        resetChat,
        selectedModel,
        setSelectedModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
