import React, { useState, useEffect, useCallback } from "react";
import { FaPause, FaPlay, FaStop, FaCoffee } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface TimerProps {
  workMinutes: number;
  breakMinutes: number;
  onStop: () => void;
  onComplete: () => void;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isPaused: boolean;
  isBreak: boolean;
  waitingForUserInput: boolean;
}

const Timer: React.FC<TimerProps> = ({
  workMinutes,
  breakMinutes,
  onStop,
  onComplete,
}) => {
  // Initialize state from localStorage or default values
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const stored = localStorage.getItem('timerState');
    if (stored) {
      const parsed = JSON.parse(stored);
      // If stored state exists and timer was running, resume from stored state
      return parsed;
    }
    // Otherwise start fresh
    return {
      minutes: workMinutes,
      seconds: 0,
      isPaused: false,
      isBreak: false,
      waitingForUserInput: false,
    };
  });

  const { minutes, seconds, isPaused, isBreak, waitingForUserInput } = timerState;

  const [isShrunken, setIsShrunken] = useState(() => {
    // Check if the timer has been initialized before
    const hasBeenInitialized = localStorage.getItem('timerInitialized');
    return hasBeenInitialized === 'true';
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Persist timer state to localStorage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [timerState]);

  // Add shrink effect after 3 seconds, but only if the timer hasn't been initialized before
  useEffect(() => {
    const hasBeenInitialized = localStorage.getItem('timerInitialized');

    if (hasBeenInitialized !== 'true') {
      const shrinkTimer = setTimeout(() => {
        setIsShrunken(true);
        localStorage.setItem('timerInitialized', 'true');
      }, 3000);

      return () => clearTimeout(shrinkTimer);
    }
  }, []);

  const startShakeAnimation = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  };

  const getToastStyle = () => ({
    background: "#FDF3E3", // Tailwind brand-cream color
    padding: "16px",
    color: "#003b1f",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    width: "auto",
    maxWidth: "500px",
    margin: "0 auto",
  });

  const handlePause = () => {
    setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    toast.dismiss();
    toast(
      <div className="flex items-center justify-center gap-3 min-w-[300px]">
        <div className="bg-brand-green/20 p-2 rounded-full">
          {isPaused ? (
            <FaPause className="text-brand-green text-lg" />
          ) : (
            <FaPlay className="text-brand-green text-lg" />
          )}
        </div>
        <span className="text-brand-green-dark font-medium">
          Timer {isPaused ? "paused" : "resumed"}
        </span>
      </div>,
      {
        duration: 2000,
        position: "top-center",
        style: getToastStyle(),
        id: 'timer-pause'
      }
    );
  };

  const handleStop = useCallback(() => {
    // Clear timer state from localStorage when stopped
    localStorage.removeItem('timerState');
    setTimerState(prev => ({
      ...prev,
      isBreak: false,
      waitingForUserInput: false,
      isPaused: false,
      minutes: workMinutes,
      seconds: 0
    }));
    onStop();
    toast.dismiss(); // Dismiss any existing toasts
    toast(
      <div className="flex items-center justify-center gap-3 min-w-[300px]">
        <div className="bg-brand-green/20 p-2 rounded-full">⏹️</div>
        <span className="text-brand-green-dark font-medium">
          Timer stopped. Ready for your next focused session!
        </span>
      </div>,
      {
        duration: 2000,
        position: "top-center",
        style: getToastStyle(),
        id: 'timer-stop', // Add unique ID to prevent duplicates
      }
    );
  }, [onStop, workMinutes]);

  const showRepeatToast = useCallback(() => {
    toast.dismiss(); // Dismiss any existing toasts
    toast(
      (t) => (
        <div className="flex flex-col gap-4 min-w-[300px]">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-brand-green/20 p-2 rounded-full">
              <FaCoffee className="text-brand-green text-lg" />
            </div>
            <span className="text-brand-green-dark font-medium">
              {isBreak ? "Break" : "Work"} session completed!
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onStop();
              }}
              className="bg-red-500 text-brand-cream px-4 py-2 rounded-xl hover:bg-red-600 transition-colors w-full"
            >
              Stop
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onComplete();
              }}
              className="bg-brand-green text-brand-cream px-4 py-2 rounded-xl hover:bg-brand-green-dark transition-colors w-full"
            >
              Continue
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: getToastStyle(),
        id: 'timer-complete',
      }
    );
  }, [isBreak, onStop, onComplete]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused && !waitingForUserInput) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            if (prev.isBreak) {
              startShakeAnimation();
              showRepeatToast();
              return { ...prev, waitingForUserInput: true };
            } else {
              startShakeAnimation();
              toast.dismiss(); // Dismiss any existing toasts
              toast(
                <div className="flex items-center justify-center gap-3 min-w-[300px]">
                  <div className="bg-brand-green/20 p-2 rounded-full">
                    <FaCoffee className="text-brand-green text-lg" />
                  </div>
                  <span className="text-brand-green-dark font-medium">
                    Break time! Take a moment to relax.
                  </span>
                </div>,
                {
                  duration: 4000,
                  position: "top-center",
                  style: getToastStyle(),
                  id: 'break-time', // Add unique ID to prevent duplicates
                }
              );
              return {
                ...prev,
                isBreak: true,
                minutes: breakMinutes,
                seconds: 0,
              };
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused, waitingForUserInput, breakMinutes, showRepeatToast]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute right-0 top-0"
      style={{
        transform: `scale(${isShrunken && !isHovered ? 0.65 : 0.8})`,
        animation: isShaking
          ? "shake 1s cubic-bezier(.36,.07,.19,.97) both"
          : "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <style>
        {`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}
      </style>
      <div
        className={`px-6 py-3 rounded-xl shadow-lg border border-brand-green flex items-center space-x-4 ${isBreak ? "bg-brand-cream" : "bg-brand-green-mid"
          } backdrop-blur-sm relative`}
      >
        <div
          className={`text-2xl font-bold min-w-[100px] text-center ${isBreak ? "text-brand-green-dark" : "text-brand-cream"
            }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePause}
            className={`p-2 rounded-full transition-colors cursor-pointer ${isBreak
              ? "hover:bg-brand-green-dark/10"
              : "hover:bg-brand-cream/10"
              }`}
          >
            {isPaused ? (
              <FaPlay
                className={
                  isBreak ? "text-brand-green-dark" : "text-brand-cream"
                }
              />
            ) : (
              <FaPause
                className={
                  isBreak ? "text-brand-green-dark" : "text-brand-cream"
                }
              />
            )}
          </button>

          <button
            onClick={handleStop}
            className={`p-2 rounded-full transition-colors cursor-pointer ${isBreak
              ? "hover:bg-brand-green-dark/10"
              : "hover:bg-brand-cream/10"
              }`}
          >
            <FaStop
              className={isBreak ? "text-brand-green-dark" : "text-brand-cream"}
            />
          </button>
        </div>

        <div
          className={`text-sm ${isBreak ? "text-brand-green-dark/80" : "text-brand-cream/80"
            }`}
        >
          {isBreak ? "Break Time" : "Focus Time"}
        </div>
      </div>
    </div>
  );
};

export default Timer;
