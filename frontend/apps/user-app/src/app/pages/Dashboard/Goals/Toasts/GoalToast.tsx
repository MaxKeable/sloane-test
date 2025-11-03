import React from 'react';
import { toast, Toast, Renderable } from 'react-hot-toast';

interface GoalToastProps {
    message: string;
    onDismiss: () => void;
}

const GoalToast: React.FC<GoalToastProps> = ({ message, onDismiss }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
                {/* <div className="bg-[#4b8052]/10 p-2 rounded-full">
                    <span className="text-[#4b8052] text-lg">✓</span>
                </div> */}
                <span className="text-[#4b8052] font-medium">
                    {message}
                </span>
            </div>
            <button
                onClick={onDismiss}
                className="px-3 py-1 bg-[#4b8052] text-white rounded-lg hover:bg-[#4b8052]/90 transition-colors mt-2 sm:mt-0 w-full sm:w-auto"
            >
                Okaysdfsdf
            </button>
        </div>
    );
};

export const showToast = (renderToast: (t: Toast) => Renderable) => {
    toast(renderToast, {
        position: "top-center",
        duration: 3000,
        style: {
            background: "var(--brand-cream, #Fdf3e3)",
            padding: "16px",
            maxWidth: "95%",
            width: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
        },
    });
};

export default GoalToast; 