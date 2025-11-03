import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Handle click on the modal content to stop propagation
  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Prevent clicks from closing the modal
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-75 bg-black/60 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose} // This handles clicks on the backdrop directly
    >
      <motion.div
        className="bg-brand-green shadow-xl p-8 relative rounded-lg max-w-md w-full mx-4 overflow-y-auto"
        style={{
          maxHeight: "80vh",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        initial={{ scale: 0.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={handleModalContentClick} // Prevent modal close when clicking inside the modal content
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-brand-cream hover:text-brand-logo hover:cursor-pointer transition-colors duration-200"
        >
          <CloseIcon />
        </button>
        <div className="content text-brand-cream pt-2">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
