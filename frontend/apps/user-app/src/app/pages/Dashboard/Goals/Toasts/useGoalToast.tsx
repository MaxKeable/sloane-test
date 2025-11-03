import React from "react";
import { toast } from "react-hot-toast";

const toastConfig = {
    position: "top-center" as const,
    duration: 3000,
    style: {
        background: "var(--brand-cream, #Fdf3e3)",
        padding: "16px",
        maxWidth: "95%",
        width: "auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
    },
};

interface GoalToastHook {
    showGoalAddedToast: () => void;
    showGoalUpdatedToast: () => void;
    showGoalDeletedToast: () => void;
    showGoalsClearedToast: () => void;
    showMonthlyGoalsClearedToast: () => void;
}

export const useGoalToast = (): GoalToastHook => {
    const showToast = (message: string) => {
        toast(
            (t) => (
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[#4b8052] font-medium">{message}</span>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-[#4b8052] text-white rounded-lg hover:bg-[#4b8052]/90 transition-colors mt-2 sm:mt-0 w-full sm:w-auto"
                    >
                        Okay
                    </button>
                </div>
            ),
            toastConfig
        );
    };

    return {
        showGoalAddedToast: () => showToast("GOAL ADDED SUCCESSFULLY"),
        showGoalUpdatedToast: () => showToast("GOAL UPDATED SUCCESSFULLY"),
        showGoalDeletedToast: () => showToast("GOAL DELETED SUCCESSFULLY"),
        showGoalsClearedToast: () => showToast("GOALS CLEARED SUCCESSFULLY"),
        showMonthlyGoalsClearedToast: () => showToast("MONTHLY GOALS CLEARED SUCCESSFULLY"),
    };
}; 