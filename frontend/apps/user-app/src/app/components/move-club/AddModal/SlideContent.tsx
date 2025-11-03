// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from "react";
import { motion } from "framer-motion";
import SlideCounter from "./SlideCounter";
import SlideTitle from "./SlideTitle";
import SlideText from "./SlideText";
import { Slide } from "./types";

// ***************************************************************
//                 Types
// ***************************************************************
interface SlideContentProps {
  slide: Slide;
  currentIndex: number;
  totalSlides: number;
}

// ***************************************************************
//                 Components
// ***************************************************************
const SlideContent: React.FC<SlideContentProps> = ({
  slide,
  currentIndex,
  totalSlides,
}) => {
  return (
    <>
      <motion.div
        layout
        className={`relative z-10 p-6 md:p-8 h-full overflow-y-auto`}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <SlideCounter currentIndex={currentIndex} totalSlides={totalSlides} />
        <SlideTitle title={slide.title} currentIndex={currentIndex} />
        <SlideText content={slide.content} currentIndex={currentIndex} />
      </motion.div>
    </>
  );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default SlideContent;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Main slide content container with all slide elements
// - Uses Framer Motion for layout animations
// - Responsive padding and overflow handling
