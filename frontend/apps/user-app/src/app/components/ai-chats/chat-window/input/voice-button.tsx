import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggle,
}) => {
  const [showHoverText, setShowHoverText] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      setShowHoverText(true);
      setTimeout(() => {
        setShowHoverText(false);
      }, 2000);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setShowHoverText(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout);
    };
  });

  const handleClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error(
        "Speech recognition is not supported in this browser. Please try Chrome."
      );
      return;
    }

    onToggle();

    if (!isListening) {
      toast(
        <div className="flex items-center justify-center gap-3">
          <div className="bg-brand-green/20 p-2 rounded-full">🎤</div>
          <span className="text-brand-green-dark font-medium text-sm">
            <span className="font-bold">Mic on</span> - Start speaking and
            Sloane will hear you. <br />
            Click mic to turn off when you're finished.
          </span>
        </div>,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            padding: "14px",
            color: "#003b1f",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            width: "auto",
            maxWidth: "500px",
            margin: "0 auto",
          },
        }
      );
    } else {
      toast(
        <div className="flex items-center justify-center gap-3">
          <div className="bg-brand-green/20 p-2 rounded-full text-sm">🎤</div>
          <span className="text-brand-green-dark font-medium">
            <span className="font-bold">Mic off!</span> Thanks for sharing!
          </span>
        </div>,
        {
          duration: 1500,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            padding: "14px",
            color: "#003b1f",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            width: "auto",
            maxWidth: "500px",
            margin: "0 auto",
          },
        }
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="text-2xl p-2 rounded-full transition-transform duration-300 relative group hidden"
    >
      {isListening && (
        <>
          <span className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-50" />
          <span
            className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}
      <span
        className={`hidden lg:block absolute -top-12 -left-24 bg-brand-cream text-brand-green-dark px-3 py-2 rounded-lg text-xs whitespace-pre-line text-center opacity-0 ${
          showHoverText ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200 pointer-events-none w-48`}
      >
        Press to use the microphone
      </span>
      <span
        className={`inline-block transition-transform duration-300 ${
          isListening ? "text-red-500 rotate-0" : "text-gray-500 -rotate-45"
        }`}
      >
        🎤
      </span>
    </button>
  );
};

