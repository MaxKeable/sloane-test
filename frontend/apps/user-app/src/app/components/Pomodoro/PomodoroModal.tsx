import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (workMinutes: number, breakMinutes: number) => void;
}

const scrollbarStyles = `
  .pomodoro-modal-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .pomodoro-modal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .pomodoro-modal-scroll::-webkit-scrollbar-thumb {
    background: #FDF3E3;
    opacity: 0.3;
  }
  .pomodoro-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: #FDF3E3;
    opacity: 0.5;
  }
`;

const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  onStartTimer,
}) => {
  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [showMore, setShowMore] = useState(false);

  if (!isOpen) return null;

  const presetOptions = [
    { work: 25, break: 5, label: "25/5 - Classic Pomodoro" },
    { work: 50, break: 10, label: "50/10 - Extended Focus" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <style>{scrollbarStyles}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#4b8052] rounded-xl p-8 max-w-xl w-full m-4 max-h-[90vh] overflow-y-auto pomodoro-modal-scroll"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-cream">Mindful Timer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-cream/10 rounded-full transition-colors"
          >
            <FaTimes className="text-brand-cream" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-brand-cream mb-2">
            The Pomodoro Technique helps you maintain focus and take mindful
            breaks. Choose a preset timer or create your own custom interval.
          </p>

          <div
            className="flex items-center gap-2 text-brand-cream cursor-pointer hover:text-brand-cream/80 transition-colors"
            onClick={() => setShowMore(!showMore)}
          >
            <span className="text-sm underline">
              {showMore
                ? "Show Less"
                : "The Benefits of the Pomodoro Technique"}
            </span>
            {showMore ? (
              <FaChevronUp className="text-sm" />
            ) : (
              <FaChevronDown className="text-sm" />
            )}
          </div>

          {showMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-brand-cream/90 space-y-4 bg-brand-cream/5 p-4 rounded-lg text-sm"
            >
              <p>
                The Pomodoro Technique is a time management method developed by
                Francesco Cirillo in the late 1980s. It uses a timer to break
                work into focused intervals, traditionally 25 minutes in length,
                separated by short breaks.
              </p>
              <div>
                <p className="font-semibold mb-2">Why it works:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Reduces mental fatigue by incorporating regular breaks
                  </li>
                  <li>Helps maintain high levels of focus and concentration</li>
                  <li>Creates a sense of urgency that promotes productivity</li>
                  <li>
                    Makes large tasks more manageable by breaking them down
                  </li>
                  <li>Improves work quality by maintaining mental freshness</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Best practices:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use work sessions for single, focused tasks</li>
                  <li>Take proper breaks away from your screen</li>
                  <li>
                    Start with the classic 25/5 ratio and adjust as needed
                  </li>
                  <li>
                    Track your progress and adjust intervals to your natural
                    rhythm
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4 my-8">
          {presetOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => onStartTimer(option.work, option.break)}
              className="w-full p-4 rounded-lg border border-brand-cream text-brand-cream hover:bg-brand-cream/10 transition-colors text-left"
            >
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm opacity-80">
                {option.work} min work / {option.break} min break
              </div>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-brand-cream">
            Custom Timer
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-brand-cream text-sm mb-1 block">
                Work Minutes
              </label>
              <input
                type="number"
                value={customWork}
                onChange={(e) => setCustomWork(Number(e.target.value))}
                min="1"
                className="w-full pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream focus:outline-none focus:border-brand-cream transition-colors"
              />
            </div>
            <div>
              <label className="text-brand-cream text-sm mb-1 block">
                Break Minutes
              </label>
              <input
                type="number"
                value={customBreak}
                onChange={(e) => setCustomBreak(Number(e.target.value))}
                min="1"
                className="w-full pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream focus:outline-none focus:border-brand-cream transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onStartTimer(customWork, customBreak)}
            className="px-4 py-2 rounded-lg bg-brand-cream text-[#4b8052] hover:bg-brand-cream/90 transition-colors"
          >
            Start Custom Timer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PomodoroModal;
