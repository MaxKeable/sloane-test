import React from 'react';

const PRIORITY_OPTIONS = ["None", "Low", "Medium", "High"] as const;

interface PrioritySelectorProps {
    priority: string;
    onPriorityChange: (priority: string) => void;
    isMobile?: boolean;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
    priority,
    onPriorityChange,
    isMobile = false,
}) => (
    <div className={isMobile ? "flex-1 min-w-[200px]" : "mb-4"}>
        <div className="flex items-center mb-1">
            <h3 className="text-lg font-semibold text-brand-cream">Priority</h3>
        </div>
        <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={`p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border border-brand-cream/30 shadow-sm focus:ring-0 cursor-pointer ${isMobile ? "w-full" : "w-1/2"
                }`}
        >
            {PRIORITY_OPTIONS.map((option) => (
                <option
                    key={option}
                    value={option}
                    className="bg-brand-green text-brand-cream"
                >
                    {option}
                </option>
            ))}
        </select>
    </div>
); 