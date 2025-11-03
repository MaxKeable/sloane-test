// ***************************************************************
    // IMPORTS
//     ***************************************************************
import React from 'react';
import Pagination from './Pagination';
import NavigationButton from './NavigationButton';
import { Slide } from './types';

// ***************************************************************
    // Types
//     ***************************************************************
    interface DesktopNavigationProps {
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
const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
        currentIndex,
        totalSlides,
        onNext,
        onPrevious,
        nextSlide,
        prevSlide
    }) => {
    return (
        <div className="hidden md:flex md:items-center md:justify-between w-full">
            <NavigationButton
                direction="previous"
                onClick={onPrevious}
                slideTitle={prevSlide.title}
            />

            <div className="flex items-center justify-center flex-1 px-8">
                <Pagination currentIndex={currentIndex} totalSlides={totalSlides} />
            </div>

            <NavigationButton
                direction="next"
                onClick={onNext}
                slideTitle={nextSlide.title}
            />
        </div>
    );
};

// ***************************************************************
    // RENDER
//     ***************************************************************

// ***************************************************************
    // EXPORTS
//     ***************************************************************
export default DesktopNavigation;

// ***************************************************************
    // NOTES
//     ***************************************************************
    // - Desktop - specific navigation layout
        // - Uses Pagination and NavigationButton components
            // - Hidden on mobile screens 