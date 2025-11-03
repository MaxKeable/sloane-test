import React from 'react';

interface FooterProps {
    isEditing: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    isEditing,
    onCancel,
    onSubmit,
}) => (
    <div className="flex flex-col justify-end gap-4 mt-6">
        <button
            onClick={onCancel}
            className="px-4 py-2 text-brand-cream/80 hover:text-brand-cream transition-colors border-2 border-brand-cream rounded-lg"
        >
            Cancel
        </button>
        <button
            onClick={onSubmit}
            className={`px-4 py-2 rounded-lg transition-colors ${isEditing
                ? "bg-brand-green text-brand-cream hover:bg-brand-green/90"
                : "bg-brand-cream text-brand-green-dark hover:bg-brand-cream/90"
                }`}
        >
            {isEditing ? "Update Action" : "Save Action"}
        </button>
    </div>
); 