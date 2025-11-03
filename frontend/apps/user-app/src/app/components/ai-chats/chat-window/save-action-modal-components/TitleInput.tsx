import React from 'react';

interface TitleInputProps {
    title: string;
    onTitleChange: (title: string) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-brand-cream">Title</h3>
        </div>
        <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a title..."
            className="w-full px-4 py-2 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border border-brand-cream/30 shadow-sm focus:ring-0"
        />
    </div>
); 