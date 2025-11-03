// ***************************************************************
// IMPORTS
//     ***************************************************************
import React from 'react';
import { motion } from 'framer-motion';
import MobileNavigation from './MobileNavigation';
import DesktopNavigation from './DesktopNavigation';
import { Slide } from './types';

// ***************************************************************
// Types
//     ***************************************************************
interface NavigationProps {
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrevious: () => void;
    nextSlide: Slide;
    prevSlide: Slide;
}

// ***************************************************************
// Components
//     ***************************************************************
const Navigation: React.FC<NavigationProps> = ({
    currentIndex,
    totalSlides,
    onNext,
    onPrevious,
    nextSlide,
    prevSlide
}) => {
    return (
        <motion.div
            layout
            className="relative z-10 border-t border-brand-green/10 bg-brand-cream/95 flex-shrink-0"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="md:flex md:items-center md:justify-between p-3 md:p-6">
                <MobileNavigation
                    currentIndex={currentIndex}
                    totalSlides={totalSlides}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                />

                <DesktopNavigation
                    currentIndex={currentIndex}
                    totalSlides={totalSlides}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                />
            </div>
        </motion.div>
    );
};


// ***************************************************************
// EXPORTS
//     ***************************************************************
export default Navigation;

// ***************************************************************
// NOTES
//     ***************************************************************
// - Combines mobile and desktop navigation components
// - Uses Framer Motion for layout animations
// - Responsive design with proper spacing 