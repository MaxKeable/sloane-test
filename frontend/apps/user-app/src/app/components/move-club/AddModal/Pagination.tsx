// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';

// ***************************************************************
//                 Types
// ***************************************************************
interface PaginationProps {
    currentIndex: number;
    totalSlides: number;
}

// ***************************************************************
//                 Components
// ***************************************************************
const Pagination: React.FC<PaginationProps> = ({ currentIndex, totalSlides }) => {
    return (
        <div className="flex justify-center">
            <div className="flex items-center gap-2">
                {[...Array(totalSlides)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === currentIndex
                                ? 'bg-brand-green w-4'
                                : 'bg-brand-green/20 hover:bg-brand-green/40'
                            }`}
                    />
                ))}
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
export default Pagination;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Shows current slide position with dots
// - Active dot is wider and full opacity
// - Inactive dots are smaller and semi-transparent 