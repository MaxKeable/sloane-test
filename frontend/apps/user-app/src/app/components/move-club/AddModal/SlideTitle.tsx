// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';
import { motion } from 'framer-motion';

// ***************************************************************
//                 Types
// ***************************************************************
interface SlideTitleProps {
    title: string;
    currentIndex: number;
}

// ***************************************************************
//                 Components
// ***************************************************************
const SlideTitle: React.FC<SlideTitleProps> = ({ title, currentIndex }) => {
    return (
        <motion.h3
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-brand-green leading-tight relative z-10"
        >
            {title}
        </motion.h3>
    );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default SlideTitle;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Animated slide title with entrance and exit animations
// - Responsive typography sizing
// - Uses brand green color and proper spacing 