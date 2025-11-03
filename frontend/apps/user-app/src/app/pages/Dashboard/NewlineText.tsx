// NewlineText.tsx
import React from "react";

interface NewlineTextProps {
  text: string | undefined;
  className?: string;
}

const NewlineText: React.FC<NewlineTextProps> = ({
  text = "",
  className = "",
}) => {
  // Handle undefined or empty text
  if (!text) return null;

  // Replace literal '\n' with actual newlines
  const processedText = text.replace(/\\n/g, "\n");

  // Split by newline characters (handles both \n and \n\n)
  const paragraphs = processedText.split(/\n\n+/); // Split by double newlines for paragraphs

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, pIndex) => {
        // Handle single newlines within paragraphs
        const lines = paragraph.split(/\n/);

        return (
          <div key={pIndex} className="paragraph">
            {lines.map((line, lIndex) => (
              <React.Fragment key={`${pIndex}-${lIndex}`}>
                {line || " "}
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default NewlineText;
