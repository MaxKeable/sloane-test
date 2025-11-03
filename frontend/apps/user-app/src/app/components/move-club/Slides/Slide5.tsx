import React from "react";
import { motion } from "framer-motion";

// Inline MoveClubBackground (from Slide2, just the background rows)
const tickerText = "Move Club   ".repeat(10);

const TickerRow = ({ reverse = false, className = "" }) => (
  <motion.div
    className={`absolute w-full flex items-center overflow-hidden pointer-events-none select-none ${className}`}
    animate={{
      x: reverse ? ["80%", "-80%"] : ["-80%", "80%"],
    }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      duration: 12,
      ease: "linear",
    }}
    style={{ height: "100%" }}
  >
    <span className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest text-brand-cream opacity-10 whitespace-nowrap min-w-max">
      {tickerText}
    </span>
  </motion.div>
);

const MoveClubBackground = () => (
  <div className="absolute inset-0 w-full h-full z-0">
    <div className="relative w-full h-full">
      <div className="absolute top-0 w-full h-1/3">
        <TickerRow reverse={false} className="h-full" />
      </div>
      <div className="absolute top-1/3 w-full h-1/3">
        <TickerRow reverse={true} className="h-full" />
      </div>
      <div className="absolute top-2/3 w-full h-1/3">
        <TickerRow reverse={false} className="h-full" />
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 18, delay: i * 0.18 },
  }),
};

type Props = {
  dateTime: Date;
};

const Slide5: React.FC<Props> = ({ dateTime }) => {
  const infoRows = () => [
    [
      "🗓️",
      `${dateTime.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}`,
    ],
    [
      "⏰",
      `${dateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} AEST (Brisbane Time)`,
    ],
    ["💻", "Online. Free. Focused. Friendly."],
    ["✨", "Click to Save Your Seat"],
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Animated background text */}
      <div className="absolute inset-0 z-0 opacity-50 md:-mt-2">
        <MoveClubBackground />
      </div>
      {/* Foreground content with animation */}
      <motion.div
        className="relative z-10 text-center  w-full flex flex-col items-center justify-center -mt-4 md:-mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h3
          className="text-sm md:text-lg lg:text-2xl font-semibold text-brand-cream/90 leading-none"
          variants={itemVariants}
          custom={0}
        >
          When & Where
        </motion.h3>
        <div className="space-y-3 text-xs lg:text-sm text-brand-cream font-thing text-left px-4">
          {infoRows().map(([icon, text], i) => (
            <motion.div
              key={i}
              className="flex space-x-2 items-center"
              variants={itemVariants}
              custom={i + 1}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Slide5;
