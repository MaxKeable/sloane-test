// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';
import { motion } from 'framer-motion';

// ***************************************************************
//                 Types
// ***************************************************************
interface SlideTextProps {
    content: string[];
    currentIndex: number;
}

// ***************************************************************
//                 Components
// ***************************************************************
const SlideText: React.FC<SlideTextProps> = ({ content, currentIndex }) => {
    return (
        <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-sm md:text-base text-brand-green/80 leading-relaxed max-w-2xl relative z-10 space-y-2"
        >
            {content.map((line, index) => (
                line.trim() === '' ? (
                    <div key={index} className="h-4" />
                ) : (
                    <p key={index} className="text-sm md:text-base text-brand-green/80 leading-relaxed">
                        {line}
                    </p>
                )
            ))}
        </motion.div>
    );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default SlideText;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Renders slide content with proper spacing for empty lines
// - Animated content transitions with delay
// - Responsive typography and brand colors 