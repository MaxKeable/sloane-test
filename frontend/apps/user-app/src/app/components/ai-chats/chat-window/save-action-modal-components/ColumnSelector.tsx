import React from 'react';

const COLUMN_OPTIONS = {
    idea: "Idea",
    toDo: "To Do",
    inProgress: "In Progress",
    complete: "Complete",
} as const;

interface ColumnSelectorProps {
    currentColumn: string;
    onColumnChange: (column: string) => void;
    isMobile?: boolean;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    currentColumn,
    onColumnChange,
    isMobile = false,
}) => (
    <div>
        <h3 className="text-lg font-semibold mb-2 text-brand-cream">
            Select Column
        </h3>
        <div className={`grid ${isMobile ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-4'} gap-2`}>
            {Object.entries(COLUMN_OPTIONS).map(([value, label]) => (
                <button
                    key={value}
                    onClick={() => onColumnChange(value)}
                    className={`px-4 py-2 rounded-lg transition-colors ${currentColumn === value
                            ? "bg-brand-green text-brand-cream border border-brand-cream/70 shadow-lg"
                            : "bg-brand-green-dark/20 text-brand-cream/80 hover:bg-brand-green/20 border border-brand-cream/30 shadow-sm"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
); 