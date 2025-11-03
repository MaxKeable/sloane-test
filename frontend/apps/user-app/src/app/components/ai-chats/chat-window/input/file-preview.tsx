import React from "react";
import Icon from "../../../Icons/Icon";
import { FiFile } from "react-icons/fi";

interface FilePreviewProps {
  file: File;
  theme: string;
  onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  theme,
  onRemove,
}) => {
  // Image preview
  if (file.type.startsWith("image/")) {
    return (
      <div className="flex justify-start mb-2 relative w-fit">
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-auto w-24 object-cover rounded-md ml-8"
          style={{ border: "none", boxShadow: "none" }}
          onLoad={(e) =>
            URL.revokeObjectURL((e.target as HTMLImageElement).src)
          }
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5 flex items-center justify-center border border-gray-300 hover:bg-red-100"
          aria-label="Remove image"
          style={{ width: "20px", height: "20px" }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-gray-700"
          >
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  // PDF preview
  if (file.type === "application/pdf") {
    return (
      <div className="flex items-center mb-2 relative w-fit">
        <div className="flex flex-col items-start relative">
          <div className="p-2 rounded-md mb-1">
            <Icon name="pdf" className="w-12 h-12 text-red-700 mb-1" />
          </div>
          <span
            className={`text-sm font-medium truncate max-w-[160px] text-center ${
              theme === "dark" ? "text-brand-cream" : "text-brand-green-dark"
            }`}
          >
            {file.name}
          </span>

          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-3 right-[55%] bg-white rounded-full shadow p-0.5 flex items-center justify-center border border-gred-600 hover:bg-red-300"
            aria-label="Remove file"
            style={{ width: "24px", height: "24px" }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-red-500 hover:text-red-700"
            >
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Generic file preview
  return (
    <div className="flex items-center mb-2 relative w-fit bg-white rounded-md px-3 py-2 border border-gray-200">
      <FiFile className="w-7 h-7 text-brand-green-dark mr-2" />
      <span className="text-sm font-medium text-gray-800 mr-6 truncate max-w-[160px]">
        {file.name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5 flex items-center justify-center border border-gray-300 hover:bg-red-100"
        aria-label="Remove file"
        style={{ width: "20px", height: "20px" }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 text-gray-700"
        >
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

