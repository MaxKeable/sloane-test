import React from 'react';
import { FaTimes, FaCheckSquare } from 'react-icons/fa';

interface Note {
    id: string;
    text: string;
    checked: boolean;
}

interface ChecklistSectionProps {
    notes: Note[];
    onNoteChange: (index: number, text: string) => void;
    onToggleChecked: (index: number) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: () => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
    notes,
    onNoteChange,
    onToggleChecked,
    onRemoveNote,
    onAddNote,
}) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-brand-cream flex items-center gap-2">
            <FaCheckSquare />
            Checklist
        </h3>
        <div className="space-y-3">
            {notes.map((note, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 text-brand-cream border-b border-brand-cream/20 pb-2"
                >
                    <input
                        type="checkbox"
                        checked={note.checked}
                        onChange={() => onToggleChecked(index)}
                        className="w-4 h-4 rounded border-brand-cream/50 text-brand-green focus:ring-brand-green/50"
                    />
                    <input
                        type="text"
                        value={note.text}
                        onChange={(e) => onNoteChange(index, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onAddNote();
                            }
                        }}
                        placeholder="Add a checklist item..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-brand-cream placeholder-brand-cream/50 checklist-input"
                    />
                    <button
                        onClick={() => onRemoveNote(index)}
                        className="text-brand-cream/80 hover:text-brand-cream"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
            ))}
        </div>
        <p className="text-sm text-brand-cream/60 mt-2 italic">
            Press Enter to add another checklist item
        </p>
    </div>
); 