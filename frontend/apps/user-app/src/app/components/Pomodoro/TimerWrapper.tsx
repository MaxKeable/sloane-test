import React from "react";
import Timer from "./Timer";
import { useTimer } from "../../../context/TimerContext";

const TimerWrapper: React.FC = () => {
  const { isTimerVisible, setIsTimerVisible, timerConfig } = useTimer();

  if (!isTimerVisible) return null;

  return (
    <>
      {/* Desktop Timer */}
      <div className="hidden lg:block relative">
        <Timer
          workMinutes={timerConfig.workMinutes}
          breakMinutes={timerConfig.breakMinutes}
          onStop={() => setIsTimerVisible(false)}
          onComplete={() => {
            setIsTimerVisible(false);
          }}
        />
      </div>

      {/* Mobile Timer */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <Timer
          workMinutes={timerConfig.workMinutes}
          breakMinutes={timerConfig.breakMinutes}
          onStop={() => setIsTimerVisible(false)}
          onComplete={() => {
            setIsTimerVisible(false);
          }}
        />
      </div>
    </>
  );
};

export default TimerWrapper;
