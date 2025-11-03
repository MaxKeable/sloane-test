import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PomodoroModal from "../Pomodoro/PomodoroModal";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { FaInfoCircle, FaCheck } from "react-icons/fa";
interface EmotionCategory {
  title: string;
  emotions: string[];
}

const emotionCategories: EmotionCategory[] = [
  {
    title: "Positive",
    emotions: [
      "Happy",
      "Excited",
      "Peaceful",
      "Grateful",
      "Inspired",
      "Confident",
      "Energetic",
      "Content",
      "Optimistic",
    ],
  },
  {
    title: "Neutral",
    emotions: [
      "Focused",
      "Calm",
      "Busy",
      "Tired",
      "Distracted",
      "Uncertain",
      "Contemplative",
      "Reserved",
      "Patient",
    ],
  },
  {
    title: "Challenging",
    emotions: [
      "Stressed",
      "Anxious",
      "Frustrated",
      "Overwhelmed",
      "Worried",
      "Annoyed",
      "Angry",
      "Unmotivated",
      "Confused",
    ],
  },
];

interface MindfulnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (workMinutes: number, breakMinutes: number) => void;
}

const scrollbarStyles = `
  .mindfulness-modal-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .mindfulness-modal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .mindfulness-modal-scroll::-webkit-scrollbar-thumb {
    background: #FDF3E3; /* Changed to brand-cream */
    opacity: 0.3;
  }
  .mindfulness-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: #FDF3E3;
    opacity: 0.5;
  }
`;

const MindfulnessModal: React.FC<MindfulnessModalProps> = ({
  isOpen,
  onClose,
  onStartTimer,
}) => {
  const { user } = useUser();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intentions, setIntentions] = useState<string[]>(["", "", ""]);
  const [gratitude, setGratitude] = useState<string[]>(["", "", ""]);
  const [happyHour, setHappyHour] = useState({ time: "", activity: "" });
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [autoShow, setAutoShow] = useState(() => {
    const saved = localStorage.getItem("mindfulnessAutoShow");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    if (!isOpen) return;

    const fromSidebar = localStorage.getItem("mindfulnessOpenedFromSidebar");
    const nextShowStr = localStorage.getItem("mindfulnessNextShow");
    const autoShowEnabled =
      localStorage.getItem("mindfulnessAutoShow") !== "false";

    // Only close if this is an auto-show (not from sidebar) and we're within the skip period
    if (nextShowStr && !fromSidebar && autoShowEnabled) {
      const nextShow = new Date(nextShowStr);
      const now = new Date();
      if (now < nextShow) {
        onClose();
        return;
      }
    }

    // Only remove the sidebar flag when the modal is closing, not opening
    // We'll handle this in the close handler instead
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleIntentionChange = (index: number, value: string) => {
    setIntentions((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const handleGratitudeChange = (index: number, value: string) => {
    setGratitude((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSubmit = () => {
    // Clean up the sidebar flag when submitting
    localStorage.removeItem("mindfulnessOpenedFromSidebar");
    const mindfulnessData = {
      date: new Date().toISOString(),
      emotions: selectedEmotions,
      intentions,
      gratitude,
      happyHour,
    };
    localStorage.setItem(
      "lastMindfulnessSession",
      JSON.stringify(mindfulnessData)
    );

    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full max-w-[500px]">
          <div className="flex items-center gap-2">
            <div className="bg-[#4b8052]/20 p-1.5 rounded-full shrink-0">
              <FaCheck className="text-[#4b8052] text-lg" />
            </div>
            <span className="text-[#4b8052] text-sm text-center sm:text-left">
              <span className="font-bold">
                Beautiful work on nurturing your mind today!
              </span>{" "}
              <br />
              Would you like to channel this mindful energy into focused,
              purposeful work with a Pomodoro timer?
            </span>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onStartTimer(25, 5); // Start with default 25/5 timer
                onClose();
              }}
              className="px-3 py-1.5 bg-[#4b8052] text-white rounded-lg hover:bg-[#4b8052]/90 transition-colors w-full sm:w-auto shrink-0"
            >
              Yes
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onClose();
              }}
              className="px-3 py-1.5 border border-[#4b8052] text-[#4b8052] rounded-lg hover:bg-[#4b8052]/10 transition-colors w-full sm:w-auto shrink-0"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 12000,
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          maxWidth: "500px",
          width: "95vw",
          margin: "0 auto",
          padding: "8px",
        },
      }
    );
  };

  const handleSkip = () => {
    // Clean up the sidebar flag when skipping
    localStorage.removeItem("mindfulnessOpenedFromSidebar");
    // Set next show time to 3 AM tomorrow
    const nextShowTime = new Date();
    if (nextShowTime.getHours() >= 3) {
      // If it's after 3 AM today, set for 3 AM tomorrow
      nextShowTime.setDate(nextShowTime.getDate() + 1);
    }
    nextShowTime.setHours(3, 0, 0, 0);

    localStorage.setItem("mindfulnessNextShow", nextShowTime.toISOString());

    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full max-w-[500px]">
          <div className="flex items-center gap-2">
            <div className="bg-[#4b8052]/20 p-1.5 rounded-full shrink-0">
              <FaCheck className="text-[#4b8052] text-lg" />
            </div>
            <span className="text-[#4b8052] text-sm text-center sm:text-left">
              You've skipped the mindfulness session for today. <br />
              We'll see you tomorrow!
            </span>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-[#4b8052] text-brand-cream rounded-lg hover:bg-[#4b8052]/90 transition-colors mt-2 sm:mt-0 w-full sm:w-auto shrink-0"
          >
            Okay
          </button>
        </div>
      ),
      {
        position: "top-center",
        duration: 4000,
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          maxWidth: "500px",
          width: "95vw",
          margin: "0 auto",
          padding: "8px",
        },
      }
    );
    onClose();
  };

  const handleAutoShowToggle = (checked: boolean) => {
    setAutoShow(checked);
    localStorage.setItem("mindfulnessAutoShow", checked.toString());
    if (!checked) {
      toast(
        (t) => (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full max-w-[500px]">
            <div className="flex items-center gap-2">
              <div className="bg-[#4b8052]/20 p-1.5 rounded-full shrink-0">
                <FaCheck className="text-[#4b8052] text-lg" />
              </div>
              <span className="text-[#4b8052] text-sm text-center sm:text-left">
                Daily mindfulness reminders paused. <br />
                You can turn them back on anytime through the sidebar.
              </span>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-[#4b8052] text-brand-cream rounded-lg hover:bg-[#4b8052]/90 transition-colors mt-2 sm:mt-0 w-full sm:w-auto shrink-0"
            >
              Okay
            </button>
          </div>
        ),
        {
          position: "top-center",
          duration: 4000,
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            maxWidth: "500px",
            width: "95vw",
            margin: "0 auto",
            padding: "8px",
          },
        }
      );
      onClose();
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, "0");
        const display = `${displayHour}:${displayMinute} ${period}`;
        const value = `${hour.toString().padStart(2, "0")}:${displayMinute}`;
        options.push({ display, value });
      }
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <style>{scrollbarStyles}</style>
      {!showPomodoroModal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#4b8052] rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto mindfulness-modal-scroll m-4"
        >
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-brand-cream">
                Daily Mindfulness
              </h2>
              <button
                onClick={handleSkip}
                className="text-brand-cream/70 hover:text-brand-cream text-xs transition-colors duration-200 border border-brand-cream/60 rounded-full px-3 py-1"
              >
                Skip For Now
              </button>
            </div>
            <p className="text-brand-cream/90 text-base leading-relaxed">
              {getTimeBasedGreeting()}, {user?.firstName}! 🌿 <br />
              Start your work feeling calm and focused. A quick mindfulness
              check-in can reduce stress and boost productivity.
            </p>
          </div>

          {/* Emotions Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {emotionCategories.map((category, index) => (
              <div key={index} className="bg-brand-cream/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-brand-cream">
                  {category.title}
                </h3>
                <div className="space-y-1">
                  {category.emotions.map((emotion, emoIndex) => (
                    <label
                      key={emoIndex}
                      className={`flex items-center space-x-2 p-1 cursor-pointer ${
                        selectedEmotions.includes(emotion) ? "font-bold" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmotions.includes(emotion)}
                        onChange={() => handleEmotionToggle(emotion)}
                        className="w-4 h-4 rounded border-brand-cream/50 text-brand-logo focus:ring-brand-logo/50 accent-brand-logo cursor-pointer"
                      />
                      <span className="text-brand-cream">{emotion}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Intentions Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-brand-cream">
              3 Intentions/Achievements for Today
            </h3>
            {intentions.map((intention, index) => (
              <input
                key={index}
                type="text"
                value={intention}
                onChange={(e) => handleIntentionChange(index, e.target.value)}
                placeholder={`Intention ${index + 1}`}
                className="w-full mb-4 pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream placeholder-brand-cream/50 focus:outline-none focus:border-brand-cream transition-colors"
              />
            ))}
          </div>

          {/* Gratitude Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-brand-cream">
              3 Things You're Grateful For
            </h3>
            {gratitude.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => handleGratitudeChange(index, e.target.value)}
                placeholder={`Gratitude ${index + 1}`}
                className="w-full mb-4 pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream placeholder-brand-cream/50 focus:outline-none focus:border-brand-cream transition-colors"
              />
            ))}
          </div>

          {/* Happy Hour Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-brand-cream flex items-center gap-2">
              Time For You?
              <div className="relative group">
                <FaInfoCircle className="text-brand-cream/50 hover:text-brand-cream cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-brand-cream text-brand-green-dark text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-normal">
                  Choose a time of day you'll dedicate to yourself purely for
                  you. No work, pure enjoyment.
                </div>
              </div>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={happyHour.time}
                onChange={(e) =>
                  setHappyHour((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream focus:outline-none focus:border-brand-cream transition-colors [&>option]:bg-[#4b8052] cursor-pointer"
              >
                <option value="" className="bg-[#4b8052]">
                  Select a time
                </option>
                {generateTimeOptions().map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#4b8052]"
                  >
                    {option.display}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={happyHour.activity}
                onChange={(e) =>
                  setHappyHour((prev) => ({
                    ...prev,
                    activity: e.target.value,
                  }))
                }
                placeholder="What will you do?"
                className="pb-1 bg-transparent border-b border-brand-cream/30 text-brand-cream placeholder-brand-cream/50 focus:outline-none focus:border-brand-cream transition-colors"
              />
            </div>
          </div>

          {/* Bottom section - Daily Check-in Toggle */}
          <div className="mt-8 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-brand-cream/20 pt-4 gap-4 sm:gap-0">
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-brand-cream text-sm">
                Daily Mindfulness Check-in
              </span>
              <span className="text-brand-cream/60 text-[14px]">
                Toggle off to pause daily reminders. You can switch it back on
                anytime through the sidebar.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-brand-cream text-sm min-w-[30px]">
                {autoShow ? "On" : "Off"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoShow}
                  onChange={(e) => handleAutoShowToggle(e.target.checked)}
                />
                <div className="w-11 h-6 bg-brand-cream/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-cream after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cream/55"></div>
              </label>
            </div>
          </div>

          {/* Bottom section - Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleSkip}
                className="hover:bg-brand-cream/10 transition-colors text-brand-cream border border-brand-cream rounded-lg px-4 py-2 w-full sm:w-auto"
              >
                Skip for Today
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-brand-cream text-[#4b8052] hover:bg-brand-cream/50 transition-colors w-full sm:w-auto"
              >
                Save Thoughts
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <PomodoroModal
          isOpen={true}
          onClose={() => {
            setShowPomodoroModal(false);
            onClose();
          }}
          onStartTimer={(workMinutes: number, breakMinutes: number) => {
            onStartTimer(workMinutes, breakMinutes);
            setShowPomodoroModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default MindfulnessModal;
