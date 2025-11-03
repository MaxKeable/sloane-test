// ***************************************************************
//                 IMPORTS
// ***************************************************************

// ***************************************************************
//                 Types
// ***************************************************************
export interface Slide {
    title: string;
    content: string[];
    icon: any;
}

export interface EditorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface SlideContentProps {
    slide: Slide;
    currentIndex: number;
    totalSlides: number;
}

export interface NavigationProps {
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrevious: () => void;
    nextSlide: Slide;
    prevSlide: Slide;
}

export interface PaginationProps {
    currentIndex: number;
    totalSlides: number;
}

export interface NavigationButtonProps {
    direction: 'next' | 'previous';
    onClick: () => void;
    slideTitle: string;
}

// ***************************************************************
//                 EXPORTS
// ***************************************************************

// ***************************************************************
//                 NOTES
// ***************************************************************
// - All types are exported for use across AddModal components
// - Slide interface defines the structure for each slide content
// - Props interfaces define the expected props for each component 