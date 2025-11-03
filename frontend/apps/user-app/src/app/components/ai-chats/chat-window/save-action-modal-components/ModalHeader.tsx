import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalHeaderProps {
    isEditing: boolean;
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ isEditing, onClose }) => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-brand-cream mb-2">
                {isEditing ? "Edit Action" : "Create New Action"}
            </h2>
            <div className="h-1 w-20 bg-brand-cream rounded"></div>
        </div>
        <button
            onClick={onClose}
            className="text-brand-cream hover:text-brand-cream/80"
        >
            <FaTimes size={20} />
        </button>
    </div>
); 