import React from "react";
import { FileAttachmentDisplay } from "./file-attachment-display";
import { extractQuestionText } from "../utils/message-helpers";

interface UserMessageProps {
  userImageUrl?: string;
  questionText: string;
  fileType?: string;
  imageUrl?: string;
  imageName?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  userImageUrl,
  questionText,
  fileType,
  imageUrl,
  imageName,
}) => {
  const displayQuestion = extractQuestionText(questionText);

  return (
    <div className="w-full flex justify-end">
      <div className="flex flex-col items-end gap-2 max-w-lg pb-2">
        <div className="flex gap-2">
          <p className={`text-brand-cream font-bold`}>You</p>
          <img
            src={userImageUrl}
            alt="profile"
            className="size-6 rounded-full"
          />
        </div>
        <FileAttachmentDisplay
          fileType={fileType || ""}
          questionText={questionText}
          imageUrl={imageUrl}
          imageName={imageName}
        />
        <div className="bg-white/30 p-2 rounded-md">
          <p className={`text-[16px]  text-brand-green-light`}>
            {displayQuestion}
          </p>
        </div>
      </div>
    </div>
  );
};
