// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';
import { motion } from 'framer-motion';

// ***************************************************************
//                 Types
// ***************************************************************
interface SlideCounterProps {
    currentIndex: number;
    totalSlides: number;
    label?: string;
}

// ***************************************************************
//                 Components
// ***************************************************************
const SlideCounter: React.FC<SlideCounterProps> = ({ currentIndex, totalSlides, label }) => {
    const displayLabel = label || 'Move Club';
    return (
        <motion.div
            key={`counter-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 md:mb-6"
        >
            <span className="text-sm font-medium text-brand-green/70 tracking-wider uppercase">
                {displayLabel} {currentIndex + 1} of {totalSlides}
            </span>
        </motion.div>
    );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default SlideCounter;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Shows current slide position with animated transitions
// - Uses brand colors and typography styling
// - Responsive margin spacing 