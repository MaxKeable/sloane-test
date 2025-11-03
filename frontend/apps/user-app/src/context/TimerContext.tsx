import React, { createContext, useContext, useState, useEffect } from "react";
import PomodoroModal from "../app/components/Pomodoro/PomodoroModal";

interface TimerContextType {
  isTimerVisible: boolean;
  setIsTimerVisible: (visible: boolean) => void;
  showPomodoroModal: boolean;
  openPomodoroModal: () => void;
  closePomodoroModal: () => void;
  handleStartTimer: (workMinutes: number, breakMinutes: number) => void;
  timerConfig: {
    workMinutes: number;
    breakMinutes: number;
  };
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or default values
  const [isTimerVisible, setIsTimerVisible] = useState(() => {
    const stored = localStorage.getItem("timerVisible");
    return stored ? JSON.parse(stored) : false;
  });

  const [showPomodoroModal, setShowPomodoroModal] = useState(false);

  const [timerConfig, setTimerConfig] = useState(() => {
    const stored = localStorage.getItem("timerConfig");
    return stored
      ? JSON.parse(stored)
      : {
          workMinutes: 25,
          breakMinutes: 5,
        };
  });

  // Persist timer visibility to localStorage
  useEffect(() => {
    localStorage.setItem("timerVisible", JSON.stringify(isTimerVisible));
  }, [isTimerVisible]);

  // Persist timer config to localStorage
  useEffect(() => {
    localStorage.setItem("timerConfig", JSON.stringify(timerConfig));
  }, [timerConfig]);

  const openPomodoroModal = () => {
    setShowPomodoroModal(true);
  };

  const closePomodoroModal = () => {
    setShowPomodoroModal(false);
  };

  const handleStartTimer = (workMinutes: number, breakMinutes: number) => {
    setTimerConfig({ workMinutes, breakMinutes });
    setIsTimerVisible(true);
    setShowPomodoroModal(false);
  };

  return (
    <TimerContext.Provider
      value={{
        isTimerVisible,
        setIsTimerVisible,
        showPomodoroModal,
        openPomodoroModal,
        closePomodoroModal,
        handleStartTimer,
        timerConfig,
      }}
    >
      {children}
      {showPomodoroModal && (
        <PomodoroModal
          isOpen={showPomodoroModal}
          onClose={closePomodoroModal}
          onStartTimer={handleStartTimer}
        />
      )}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

export default TimerContext;
