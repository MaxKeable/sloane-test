import React from "react";
import Icon from "../../../Icons/Icon";
import { Markdown } from "./markdown";
import { ChatLoading } from "./loading-message";
import { MessageActions } from "./message-actions";

interface AssistantMessageProps {
  answer?: string;
  isLoading: boolean;
  isLastMessage: boolean;
  isStreaming: boolean;
  messageId: string;
  onCopy: (text: string) => void;
  onSaveAction: (text: string) => void;
  onScrollToTop: (messageId: string) => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  answer,
  isLoading,
  isLastMessage,
  isStreaming,
  messageId,
  onCopy,
  onSaveAction,
  onScrollToTop,
}) => {
  return (
    <div className="flex items-start">
      <Icon name="ai" className="mr-2 -mt-4" />
      <div className="flex flex-col">
        <p
          className={`text-brand-logo
          text-[16px] font-bold mb-2`}
        >
          sloane
        </p>
        {isLoading && isLastMessage && !answer ? (
          <div className="w-full flex justify-start items-center">
            <ChatLoading />
          </div>
        ) : (
          <>
            <Markdown data={answer ?? ""} />
            {!isStreaming && (
              <MessageActions
                answer={answer ?? ""}
                messageId={messageId}
                onCopy={onCopy}
                onSaveAction={onSaveAction}
                onScrollToTop={onScrollToTop}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
