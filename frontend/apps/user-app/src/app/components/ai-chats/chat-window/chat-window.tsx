import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import "@/App.css";
import { useScrollBehavior } from "./hooks/use-scroll-behavior";
import { cleanMarkdownResponse } from "./utils/string-helpers";
import { useSocket } from "./hooks/use-socket";
import { showSuccessToast } from "../../Toast/SuccessToast";
import { ChatInput } from "./input/chat-input";
import { SaveActionModal } from "./popups/save-action-modal";
import { MessageList } from "./messages/message-list";

export function ChatWindow() {
  const {
    selectedChat,
    setSelectedChat,
    question,
    selectChat,
    isMessageLoading,
    saveAction,
    processMessageBatch,
  } = useChat();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // Get assistantId from URL params
  const assistantId = params.assistantId || "";

  // Fetch assistant data to get prompts (if available)
  const [waitingMessage, setWaitingMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn] = useState("idea");
  const [currentText, setCurrentText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Scroll behavior hook
  const {
    messagesEndRef,
    chatContainerRef,
    responseRefs,
    handleUserScroll,
    scrollToResponseTop,
  } = useScrollBehavior({
    messages: selectedChat?.messages,
    isMessageLoading,
  });

  // Handle OpenAI streaming response
  const handleOpenAiResponse = useCallback(
    (fullResponse: string) => {
      console.log("Streaming response:", fullResponse);
      const cleanedResponse = cleanMarkdownResponse(fullResponse);

      // Set streaming state to true when receiving streaming data
      setIsStreaming(true);

      setSelectedChat((currentChat) => {
        if (!currentChat || currentChat.id !== selectedChat?.id)
          return currentChat;
        const newMessages = [...currentChat.messages];
        const lastMessage = newMessages[newMessages.length - 1];
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          id: lastMessage?.id || Date.now().toString(),
          question: question,
          answer: cleanedResponse || "",
          createdAt: lastMessage?.createdAt || new Date(),
          updatedAt: new Date(),
        };
        return {
          ...currentChat,
          messages: newMessages,
        };
      });
    },
    [selectedChat?.id, question]
  );

  // Handle stream end
  const handleStreamEnd = useCallback(
    (fullResponse: string) => {
      const cleanedResponse = cleanMarkdownResponse(fullResponse);

      // Set streaming state to false when stream ends
      setIsStreaming(false);

      let newMessage;

      setSelectedChat((currentChat) => {
        if (!currentChat || currentChat.id !== selectedChat?.id)
          return currentChat;
        const newMessages = [...currentChat.messages];
        const lastMessage = newMessages[newMessages.length - 1];

        newMessage = {
          ...lastMessage,
          id: lastMessage?.id || Date.now().toString(),
          question: question,
          answer: cleanedResponse,
          createdAt: lastMessage?.createdAt || new Date(),
          updatedAt: new Date(),
        };

        newMessages[newMessages.length - 1] = newMessage;

        return {
          ...currentChat,
          messages: newMessages,
        };
      });

      if (newMessage) {
        processMessageBatch(newMessage);
      }
    },
    [selectedChat?.id, question, processMessageBatch]
  );

  // Socket connection
  useSocket({
    chatId: selectedChat?.id,
    onResponse: handleOpenAiResponse,
    onStreamEnd: handleStreamEnd,
  });

  // Handle chat selection from URL params
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId) {
      console.log("chat-window: Loading chat from URL param:", chatId);
      selectChat(chatId);
    }
  }, [searchParams]);

  // Manage waiting message
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMessageLoading) {
      setWaitingMessage("Let me work on that ...");
      timeoutId = setTimeout(() => {
        setWaitingMessage("Still thinking ...");
      }, 5000);
    } else {
      setWaitingMessage("");
    }

    return () => clearTimeout(timeoutId);
  }, [isMessageLoading]);

  // Handle copy
  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Text copied to clipboard!", true, "copy");
    } catch (err) {
      console.error("Failed to copy text:", err);
      showSuccessToast("Failed to copy text. Please try again.", false, "copy");
    }
  };

  // Handle save action
  const handleActionClick = (text: string) => {
    setCurrentText(text);
    setIsModalOpen(true);
  };

  const handleSaveAction = async ({
    title,
    text,
    column,
    notes,
    colour,
    dueDate,
    tags,
    description,
    priority,
  }: {
    title: string;
    text: string;
    column: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
  }) => {
    try {
      if (!selectedChat || !currentText) return;

      await saveAction({
        title,
        text: currentText,
        column,
        notes,
        colour,
        dueDate,
        tags,
        description,
        priority,
      });

      showSuccessToast("Action saved successfully!", true, "action");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving action:", error);
      showSuccessToast("Failed to save action", true, "action");
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-full h-full overflow-hidden items-center">
      <div
        className="flex-1 w-full select-text overflow-y-auto overflow-x-hidden pb-32"
        ref={chatContainerRef}
        onScroll={handleUserScroll}
      >
        <MessageList
          messages={selectedChat?.messages}
          isMessageLoading={isMessageLoading}
          isStreaming={isStreaming}
          waitingMessage={waitingMessage}
          onCopy={handleCopyClick}
          onSaveAction={handleActionClick}
          onScrollToTop={scrollToResponseTop}
          responseRefs={responseRefs}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {selectedChat && (
        <div className="w-full max-w-[800px] mx-auto absolute bottom-0 left-0 right-0 px-4">
          <p
            className={`text-xs text-brand-cream/70
            } text-center`}
          >
            Sloane can make mistakes, please check important information
          </p>
          <ChatInput
            room={selectedChat.id ?? "defaultRoom"}
            assistantId={assistantId}
          />
        </div>
      )}

      <SaveActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAction}
        selectedColumn={selectedColumn}
        text={currentText}
        hideSloaneChatSection={false}
      />
    </div>
  );
}
