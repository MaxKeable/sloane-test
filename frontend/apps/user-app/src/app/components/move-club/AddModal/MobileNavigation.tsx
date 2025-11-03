// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';
import Pagination from './Pagination';
import NavigationButton from './NavigationButton';
import { Slide } from './types';

// ***************************************************************
//                 Types
// ***************************************************************
interface MobileNavigationProps {
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrevious: () => void;
    nextSlide: Slide;
    prevSlide: Slide;
}

// ***************************************************************
//                 Components
// ***************************************************************
const MobileNavigation: React.FC<MobileNavigationProps> = ({
    currentIndex,
    totalSlides,
    onNext,
    onPrevious,
    nextSlide,
    prevSlide
}) => {
    return (
        <div className="flex flex-col gap-4 md:hidden">
            <Pagination currentIndex={currentIndex} totalSlides={totalSlides} />
            <div className="flex justify-between items-center">
                <NavigationButton
                    direction="previous"
                    onClick={onPrevious}
                    slideTitle={prevSlide.title}
                    isMobile={true}
                />
                <NavigationButton
                    direction="next"
                    onClick={onNext}
                    slideTitle={nextSlide.title}
                    isMobile={true}
                />
            </div>
        </div>
    );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default MobileNavigation;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Mobile-specific navigation layout
// - Uses Pagination and NavigationButton components
// - Hidden on desktop screens 