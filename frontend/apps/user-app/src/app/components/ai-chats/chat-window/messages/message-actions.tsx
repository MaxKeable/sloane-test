import React, { useState } from "react";
import { FaCopy, FaListAlt, FaArrowUp } from "react-icons/fa";

interface MessageActionsProps {
  answer: string;
  messageId: string;
  onCopy: (text: string) => void;
  onSaveAction: (text: string) => void;
  onScrollToTop: (messageId: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  answer,
  messageId,
  onCopy,
  onSaveAction,
  onScrollToTop,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    onCopy(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveAction(answer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const buttonClass = `flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg 
    ${"text-brand-cream/80 bg-brand-cream/10 hover:bg-brand-cream/20"} transition-all duration-300 ease-in-out group overflow-hidden`;

  return (
    <div className="w-full flex justify-center gap-3 items-center relative -ml-6 mb-4">
      <button className={buttonClass} onClick={handleCopy}>
        <span className="flex items-center gap-1.5">
          <FaCopy className="text-xs opacity-70 min-w-[14px]" />
          <span className="min-w-[30px]">Copy</span>
          <span className="group-hover:max-w-[150px] max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out">
            {copied ? " (Copied!)" : " Response"}
          </span>
        </span>
      </button>

      <button className={buttonClass} onClick={handleSave}>
        <span className="flex items-center gap-1.5">
          <FaListAlt className="text-xs opacity-70 min-w-[14px]" />
          <span className="min-w-[30px]">Save</span>
          <span className="group-hover:max-w-[150px] max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out">
            {saved ? " (Added!)" : " as Action"}
          </span>
        </span>
      </button>

      <button
        className={buttonClass}
        onClick={() => onScrollToTop(messageId)}
        title="Scroll to top of response"
      >
        <span className="flex items-center gap-1.5">
          <FaArrowUp className="text-xs opacity-70 min-w-[14px]" />
          <span className="min-w-[30px]">Top</span>
          <span className="group-hover:max-w-[150px] max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out">
            of Response
          </span>
        </span>
      </button>
    </div>
  );
};
