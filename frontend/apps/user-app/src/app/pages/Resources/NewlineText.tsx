// NewlineText.tsx
import React from 'react';

interface NewlineTextProps {
  text: string | undefined;
}

const NewlineText: React.FC<NewlineTextProps> = ({ text = "" }) => {
  return (
    <>
      {text.split('\n').map((str, index, array) => (
        <React.Fragment key={index}>
          <p className="text-brand-cream">{str}</p> {/* Tailwind CSS class for white text */}
          {index !== array.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

export default NewlineText;
