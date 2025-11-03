import React from "react";
import { motion } from "framer-motion";
import { FaCheckSquare } from "react-icons/fa";

const checklist = [
  "Empower Together",
  "Like-minded peeps",
  "Get it done",
  "Discover hidden Sloane features",
  "Have your say in what Sloane builds next",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.5, // subtle delay after h2
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, color: "#b6b6b6", y: 30, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    color: "#FFF7E6", // brand cream
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.35,
    },
  }),
};

const h2Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const Slide3: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.h2
        className="text-sm md:text-md lg:text-lg font-bold text-brand-cream text-center mb-2 leading-none -mt-1 md:-mt-4"
        variants={h2Variants}
        initial="hidden"
        animate="show"
      >
        We Work, Vibe, & Connect.
      </motion.h2>

      <motion.div
        className="flex flex-col gap-2 w-full max-w-xs px-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {checklist.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center"
            custom={i}
            variants={itemVariants}
          >
            <span className="mr-3 text-xs lg:text-sm">
              <FaCheckSquare className="text-brand-logo" />
            </span>
            <span className="text-xs lg:text-sm font-thin">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Slide3;
