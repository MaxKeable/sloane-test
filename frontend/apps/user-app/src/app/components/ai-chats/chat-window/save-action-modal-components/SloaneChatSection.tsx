import React, { useState } from "react";
import { FaCopy, FaEdit } from "react-icons/fa";
// CSS module removed - styles no longer needed
// import styles from "../SaveActionModal.module.css";
import { markdownToHtml } from "./markdownToHtml";
// import { WysiwygEditor } from './WysiwygEditor';

interface SloaneChatSectionProps {
  initialText: string; // Markdown
  onCopyMarkdown: () => void;
  markdownRef: React.RefObject<HTMLDivElement>;
}

export const SloaneChatSection: React.FC<SloaneChatSectionProps> = ({
  initialText,
  onCopyMarkdown,
  markdownRef,
}) => {
  // Convert Markdown to HTML for initial value
  const initialHtml = markdownToHtml(initialText);

  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState(initialHtml);
  const [displayHtml, setDisplayHtml] = useState(initialHtml);

  const handleEdit = () => {
    setEditedHtml(displayHtml);
    setIsEditing(true);
  };

  const handleSave = () => {
    setDisplayHtml(editedHtml);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedHtml(displayHtml);
    setIsEditing(false);
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-2 text-brand-cream">
            Text From Sloane Chat
          </h3>
          <div className="flex gap-2">
            <button
              onClick={onCopyMarkdown}
              className="text-brand-cream hover:text-brand-cream/80 p-1"
              title="Copy text"
            >
              <FaCopy size={14} />
            </button>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="text-brand-cream hover:text-brand-cream/80 p-1"
                title="Edit text"
              >
                <FaEdit size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className="mb-4 bg-brand-cream p-4 rounded-lg shadow-lg"
      >
        {isEditing ? (
          <>
            {/* TODO: FIX THIS */}
            {/* <WysiwygEditor value={editedHtml} onChange={setEditedHtml} /> */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="px-4 py-1 rounded bg-brand-green text-brand-cream hover:bg-brand-green-dark"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1 rounded bg-brand-green-dark text-brand-cream hover:bg-brand-green"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div
            ref={markdownRef}
            dangerouslySetInnerHTML={{ __html: displayHtml }}
            className="[&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream"
          />
        )}
      </div>
    </>
  );
};
