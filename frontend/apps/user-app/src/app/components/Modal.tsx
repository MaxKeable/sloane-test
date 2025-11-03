import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-brand-cream px-8 py-4 rounded-lg shadow-lg max-w-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-brand-green text-brand-cream py-2 px-4 rounded-full hover:bg-brand-green-dark hover:text-brand-logo transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
