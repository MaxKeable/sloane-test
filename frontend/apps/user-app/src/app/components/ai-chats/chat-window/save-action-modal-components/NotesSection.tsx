import React from 'react';

interface NotesSectionProps {
    description: string;
    onDescriptionChange: (description: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
    description,
    onDescriptionChange,
}) => (
    <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-brand-cream">Notes</h3>
        <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 focus:ring-0 min-h-[100px] border border-brand-cream/30 shadow-sm"
            placeholder="Add some extra notes..."
        />
    </div>
); 