import React from "react";
import { useUser } from "@clerk/clerk-react";
import { MessageBubble } from "./message-bubble";
import { EmptyState } from "./empty-state";
import { toIMessage } from "../types/message.types";
import type { ChatMessage } from "../../../../../types/chat";

interface MessageListProps {
  messages?: ChatMessage[];
  isMessageLoading: boolean;
  isStreaming: boolean;
  onCopy: (text: string) => void;
  onSaveAction: (text: string) => void;
  onScrollToTop: (messageId: string) => void;
  responseRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isMessageLoading,
  isStreaming,
  onCopy,
  onSaveAction,
  onScrollToTop,
  responseRefs,
  messagesEndRef,
}) => {
  const { user } = useUser();

  if (!messages || messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {messages.map((message: ChatMessage, index: number) => {
        const iMessage = toIMessage(message);
        const isLastMessage = index === messages.length - 1;
        return (
          <MessageBubble
            key={iMessage._id}
            message={iMessage}
            userImageUrl={user?.imageUrl}
            isLoading={isMessageLoading}
            isLastMessage={isLastMessage}
            isStreaming={isStreaming && isLastMessage}
            onCopy={onCopy}
            onSaveAction={onSaveAction}
            onScrollToTop={onScrollToTop}
            setRef={(el) => {
              responseRefs.current[iMessage._id] = el;
              if (isLastMessage && messagesEndRef.current) {
                // This is handled by messagesEndRef
              }
            }}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
};
