import React from 'react';

interface VidModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const VidModal: React.FC<VidModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      console.log("Overlay clicked");
      onClose();
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    console.log("Close button clicked");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <button
        onClick={handleButtonClick}
        className="fixed top-4 right-4 text-brand-orange text-3xl z-50"
      >
        &times;
      </button>
      <div className="relative bg-black rounded-md shadow-lg max-w-3xl w-full overflow-y-auto max-h-full p-1">
        {children}
      </div>
    </div>
  );
};

export default VidModal;
