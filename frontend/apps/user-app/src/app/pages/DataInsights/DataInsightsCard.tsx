import React from "react";

// Brand palette (reordered to interleave blue/green with earthy colors)
const palette = [
    { name: "Ocean", bg: "#bdd8d4", text: "#003b1f" }, // blue-green
    { name: "Cacao", bg: "#9f9071", text: "#fff" },    // earthy
    { name: "Mint", bg: "#b8e1bf", text: "#003b1f" },  // green
    { name: "Tumeric", bg: "#f4d78e", text: "#7a5a00" }, // earthy
    { name: "Matcha", bg: "#e2edab", text: "#3a5a1f" }, // green
    { name: "Chai", bg: "#dfc99e", text: "#5a4a2f" },   // earthy
    { name: "Clay", bg: "#ddb794", text: "#5a3a1f" },   // earthy
    { name: "Coconut", bg: "#e6dccb", text: "#5a4a2f" }, // earthy
];

interface DataInsightsCardProps {
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    onClick?: () => void;
    colorIdx?: number;
}

const DataInsightsCard: React.FC<DataInsightsCardProps> = ({ icon, title, value, onClick, colorIdx = 0 }) => {
    const color = palette[colorIdx % palette.length];
    return (
        <div
            className={`rounded-lg p-4 border transition-all duration-300 shadow-md cursor-pointer select-none`}
            style={{
                background: color.bg,
                color: color.text,
                borderColor: color.bg,
                opacity: onClick ? 1 : 0.95,
                pointerEvents: onClick ? 'auto' : 'none',
            }}
            onClick={onClick}
            tabIndex={onClick ? 0 : -1}
            role={onClick ? "button" : undefined}
        >
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-xs font-extrabold" style={{ color: color.text }}>{title}</span>
            </div>
            <p className="text-lg font-semibold mt-1" style={{ color: color.text }}>{value}</p>
        </div>
    );
};

export default DataInsightsCard; 