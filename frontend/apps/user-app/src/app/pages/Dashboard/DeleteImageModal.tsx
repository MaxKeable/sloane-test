import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaTimes } from "react-icons/fa";

interface UploadImageModalProps {
  isOpen: boolean;
  isDeleteAllImages: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteImageModal: React.FC<UploadImageModalProps> = ({ isOpen, isDeleteAllImages,isDeleting, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete();
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "80vh",
          display: "flex",
          width: "95%",
          padding: "30px",
          maxWidth: 600,
        }}
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-cream mb-2 mt-0">
                {isDeleteAllImages ? "Delete All Images" : "Delete Image"}
              </h2>
              <div className="h-1 w-20 bg-brand-cream rounded"></div>
            </div>
            <button onClick={onClose} className="text-brand-cream hover:text-brand-cream/80">
              <FaTimes size={20} />
            </button>
          </div>

          <p className="text-brand-cream/80 text-base font-medium">
            Are you sure you want to permanently delete {isDeleteAllImages ? "All images?" : "this image?"}
          </p>

          <div className="flex justify-end flex-wrap gap-5 mt-8">
            <button
              className="px-8 py-2 rounded-lg border border-brand-cream text-brand-cream hover:bg-brand-cream/10 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2  rounded-lg bg-brand-cream text-[#4b8052] hover:bg-brand-cream/50 transition-colors"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteImageModal;
