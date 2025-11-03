/***************************************************************
                IMPORTS
***************************************************************/
import { FC, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";

/***************************************************************
                Types
***************************************************************/
interface ChatFileInputProps {
  onFileChange: (file: File | null) => void;
  className?: string;
}

/***************************************************************
                COMPONENT
***************************************************************/
export function ChatFileInput({ onFileChange, className }: ChatFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onFileChange(selected);
  };

  return (
    <div className={`flex items-center ${className || ""}`}>
      <button
        type="button"
        onClick={handleIconClick}
        className=""
        aria-label="Attach file"
      >
        <FiPaperclip className="w-6 h-6 text-white" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

/***************************************************************
                NOTES
***************************************************************/
/*
- Only renders the paperclip icon from react-icons and file input.
- Accepts any file type for future extensibility.
- No thumbnail or preview logic.
- Follows project coding rules and template.
*/
