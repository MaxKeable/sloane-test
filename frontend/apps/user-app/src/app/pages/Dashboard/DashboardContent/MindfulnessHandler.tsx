/******************************************************************************************
                                    IMPORTS
******************************************************************************************/
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useTimer } from "../../../../context/TimerContext";

/******************************************************************************************
                                    COMPONENTS
******************************************************************************************/
import MindfulnessModal from "../../../components/Mindfulness/MindfulnessModal";

/******************************************************************************************
                                    TYPES
******************************************************************************************/

interface MindfulnessHandlerProps {
  onOpenMindfulness?: () => void;
  onOpenPomodoro?: () => void;
}

export interface MindfulnessHandlerRef {
  openMindfulness: () => void;
  openPomodoro: () => void;
}

const MindfulnessHandler = forwardRef<
  MindfulnessHandlerRef,
  MindfulnessHandlerProps
>(({ onOpenMindfulness, onOpenPomodoro }, ref) => {
  const [showMindfulness, setShowMindfulness] = useState(false);
  const { openPomodoroModal } = useTimer();

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openMindfulness: () => {
      setShowMindfulness(true);
    },
    openPomodoro: () => {
      setShowMindfulness(false);
      openPomodoroModal();
    },
  }));

  useEffect(() => {
    const checkMindfulnessPrompt = () => {
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

  // const handleOpenMindfulness = () => {
  //     setShowMindfulness(true);
  //     onOpenMindfulness?.();
  // };

  const handleOpenPomodoro = () => {
    setShowMindfulness(false);
    openPomodoroModal();
    onOpenPomodoro?.();
  };

  return (
    <MindfulnessModal
      isOpen={showMindfulness}
      onClose={() => setShowMindfulness(false)}
      onStartTimer={handleOpenPomodoro}
    />
  );
});

export default MindfulnessHandler;
