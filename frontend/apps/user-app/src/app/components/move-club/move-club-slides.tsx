import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slide1 from "./Slides/Slide1";
import Slide2 from "./Slides/Slide2";
import Slide3 from "./Slides/Slide3";
import Slide4 from "./Slides/Slide4";
import Slide5 from "./Slides/Slide5";

// Move slideTimings outside the component
const slideTimings = [
  4400, // Slide1: 3 seconds
  8300, // Slide2: 5 seconds (longer for the animated background)
  7000, // Slide3: 4 seconds
  8000, // Slide4: 3.5 seconds
  5500, // Slide5: 4.5 seconds
];

type Props = {
  dateTime: Date;
};

function MoveClubSlides({ dateTime }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % 5);
    }, slideTimings[current]);
    return () => clearTimeout(timeout);
  }, [current]);

  return (
    <div className="flex flex-row w-full h-full items-center rounded-lg bg-brand-green-dark cursor-pointer hover:bg-brand-green-dark/90 transition-colors ">
      {/* Left Column - Animated Slides */}
      <div className="flex-1 w-full h-full flex flex-col justify-start items-center md:pt-4 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            {current === 0 && <Slide1 />}
            {current === 1 && <Slide2 />}
            {current === 2 && <Slide3 />}
            {current === 3 && <Slide4 />}
            {current === 4 && <Slide5 dateTime={dateTime} />}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Right Column - Image */}
      <div className="flex-1 flex justify-center ">
        <img
          src="/images/moveClub.png"
          alt="Get It Done"
          className="w-full h-auto shadow-lg rounded-r-lg"
        />
      </div>
    </div>
  );
}

export default MoveClubSlides;
