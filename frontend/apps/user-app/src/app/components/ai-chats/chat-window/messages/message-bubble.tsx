import React from "react";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";
import { IMessage } from "../types/message.types";
import { getMessageFileType } from "../utils/message-helpers";

interface MessageBubbleProps {
  message: IMessage;
  userImageUrl?: string;
  isLoading: boolean;
  isLastMessage: boolean;
  isStreaming: boolean;
  onCopy: (text: string) => void;
  onSaveAction: (text: string) => void;
  onScrollToTop: (messageId: string) => void;
  setRef: (el: HTMLDivElement | null) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  userImageUrl,
  isLoading,
  isLastMessage,
  isStreaming,
  onCopy,
  onSaveAction,
  onScrollToTop,
  setRef,
}) => {
  const fileType = getMessageFileType(message);

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 my-8" ref={setRef}>
      <UserMessage
        userImageUrl={userImageUrl}
        questionText={message.question}
        fileType={fileType}
        imageUrl={message.imageUrl}
        imageName={message.imageName}
      />

      <AssistantMessage
        answer={message.answer}
        isLoading={isLoading}
        isLastMessage={isLastMessage}
        isStreaming={isStreaming}
        messageId={message._id}
        onCopy={onCopy}
        onSaveAction={onSaveAction}
        onScrollToTop={onScrollToTop}
      />
    </div>
  );
};
