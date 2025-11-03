import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Handle click on the modal content to stop propagation
  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent clicks from closing the modal
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-75 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose} // This handles clicks on the backdrop directly
    >
      <motion.div
        className="bg-brand-green-dark border-2 border-brand-logo shadow-lg p-8 relative rounded-md"
        style={{
          maxWidth: '420px',
          minHeight: '200px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind CSS shadow is being overridden for more control if needed
        }}
        initial={{ scale: 0.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={handleModalContentClick} // Prevent modal close when clicking inside the modal content
      >
        {children}
        <button
          onClick={onClose} // Handles closing the modal when the close button is clicked
          className="absolute top-5 right-5 text-white text-xl"
        >
          &times; {/* Close button */}
        </button>
      </motion.div>
    </div>
  );
};

export default Modal;
