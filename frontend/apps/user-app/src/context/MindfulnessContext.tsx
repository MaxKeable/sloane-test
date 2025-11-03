import React, { createContext, useContext, useState, useEffect } from "react";
import MindfulnessModal from "../app/components/Mindfulness/MindfulnessModal";
import { useTimer } from "./TimerContext";

interface MindfulnessContextType {
  showMindfulness: boolean;
  openMindfulness: () => void;
  closeMindfulness: () => void;
}

const MindfulnessContext = createContext<MindfulnessContextType | undefined>(
  undefined
);

export const MindfulnessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showMindfulness, setShowMindfulness] = useState(false);
  const { handleStartTimer } = useTimer();

  const openMindfulness = () => {
    setShowMindfulness(true);
    localStorage.setItem("mindfulnessOpenedFromSidebar", "true");
  };

  const closeMindfulness = () => {
    setShowMindfulness(false);
    localStorage.removeItem("mindfulnessOpenedFromSidebar");
  };

  const handleStartTimerFromMindfulness = (
    workMinutes: number,
    breakMinutes: number
  ) => {
    handleStartTimer(workMinutes, breakMinutes);
    closeMindfulness();
  };

  // Auto-show mindfulness modal logic
  useEffect(() => {
    const excludedPaths = ["/", "/sign-up"];
    if (excludedPaths.includes(window.location.pathname)) return;

    const checkMindfulnessPrompt = () => {
      // Don't run auto-show logic if modal is already open or was manually opened
      if (showMindfulness) return;

      const fromSidebar = localStorage.getItem("mindfulnessOpenedFromSidebar");
      if (fromSidebar) return; // Don't auto-show if manually opened from sidebar

      const now = new Date();
      const lastSession = localStorage.getItem("lastMindfulnessSession");
      const nextShowStr = localStorage.getItem("mindfulnessNextShow");
      const autoShowEnabled =
        localStorage.getItem("mindfulnessAutoShow") !== "false";

      // If autoShow is disabled, don't show the modal
      if (!autoShowEnabled) return;

      // If there's a next show time set (from skip), check if we should show
      if (nextShowStr) {
        const nextShow = new Date(nextShowStr);
        if (now < nextShow) return;
      }

      // Check if we've already shown today
      if (lastSession) {
        const lastSessionDate = new Date(JSON.parse(lastSession).date);
        const startOfDay = new Date(now);
        startOfDay.setHours(3, 0, 0, 0); // Reset to 3 AM

        // If we've already had a session today, don't show
        if (lastSessionDate >= startOfDay) return;
      }

      // If we get here, we should show the modal after delay
      setTimeout(() => {
        setShowMindfulness(true);
      }, 2000);
    };

    checkMindfulnessPrompt();
  }, []); // Only run on mount

  return (
    <MindfulnessContext.Provider
      value={{
        showMindfulness,
        openMindfulness,
        closeMindfulness,
      }}
    >
      {children}
      {showMindfulness && (
        <MindfulnessModal
          isOpen={showMindfulness}
          onClose={closeMindfulness}
          onStartTimer={handleStartTimerFromMindfulness}
        />
      )}
    </MindfulnessContext.Provider>
  );
};

export const useMindfulness = () => {
  const context = useContext(MindfulnessContext);
  if (context === undefined) {
    throw new Error("useMindfulness must be used within a MindfulnessProvider");
  }
  return context;
};

export default MindfulnessContext;
