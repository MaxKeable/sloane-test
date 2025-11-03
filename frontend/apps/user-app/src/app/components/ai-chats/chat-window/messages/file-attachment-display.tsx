import React from "react";
import Icon from "../../../Icons/Icon";

interface FileAttachmentDisplayProps {
  fileType: string;
  questionText: string;
  imageUrl?: string;
  imageName?: string;
}

export const FileAttachmentDisplay: React.FC<FileAttachmentDisplayProps> = ({
  fileType,
  questionText,
  imageUrl,
  imageName,
}) => {
  if (!fileType) return null;

  if (fileType === "PDF") {
    const filename = questionText?.split("filename:")[1]?.trim() || "PDF";

    return (
      <div className="w-fit flex flex-col items-start mt-4">
        <div className="flex flex-col items-start relative">
          <div className="p-2 rounded-md mb-1 bg-brand-cream">
            <Icon name="pdf" className="w-12 h-12 text-red-700 mb-1" />
          </div>
          <span
            className={`text-sm font-medium truncate max-w-[160px] text-center ${"text-brand-cream"}`}
          >
            {filename}
          </span>
        </div>
      </div>
    );
  }

  if (fileType === "Image") {
    return (
      <div className="w-fit flex flex-col items-start mt-4">
        <div className="flex flex-col items-start relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageName || "uploaded"}
              className="h-auto w-24 object-cover rounded-md mb-1"
              style={{ border: "none", boxShadow: "none" }}
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  e.currentTarget.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "flex flex-col items-center justify-center h-12 w-12 rounded-md bg-brand-cream";
                  fallback.innerHTML = `<span id='img-fallback-icon'></span><span class='text-xs mt-1 text-brand-green-dark'>${imageName || "image"}</span>`;
                  parent.appendChild(fallback);
                  setTimeout(() => {
                    const iconContainer =
                      parent.querySelector("#img-fallback-icon");
                    if (iconContainer) {
                      import("../../../Icons/Icon").then(
                        ({ default: Icon }) => {
                          const iconElem = document.createElement("span");
                          iconElem.innerHTML = `<svg class='w-8 h-8 text-brand-green-dark' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6'></path></svg>`;
                          iconContainer.appendChild(iconElem);
                        }
                      );
                    }
                  }, 0);
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center p-4 justify-center h-16 w-16 rounded-md bg-brand-cream">
              <Icon name="image" className="w-8 h-8 text-brand-green-dark" />
              <span className="text-xs mt-1 text-brand-green-dark">
                {imageName || "image"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
