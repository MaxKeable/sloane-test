// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// ***************************************************************
//                 Types
// ***************************************************************
interface NavigationButtonProps {
    direction: 'next' | 'previous';
    onClick: () => void;
    slideTitle: string;
    isMobile?: boolean;
}

// ***************************************************************
//                 Components
// ***************************************************************
const NavigationButton: React.FC<NavigationButtonProps> = ({
    direction,
    onClick,
    slideTitle,
    isMobile = false
}) => {
    const icon = direction === 'next' ? faArrowRight : faArrowLeft;
    const iconClass = direction === 'next' ? 'rotate-[360deg]' : 'rotate-[-360deg]';
    const size = isMobile ? 'h-6 w-6' : 'h-8 w-8';
    const iconSize = isMobile ? 'h-3 w-3' : 'h-4 w-4';
    const textSize = isMobile ? 'text-xs' : 'text-sm';
    const labelSize = isMobile ? 'text-[10px]' : 'text-xs';

    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-2 md:gap-6 text-brand-green/70 hover:text-brand-green transition-colors duration-300"
        >
            {direction === 'previous' && (
                <>
                    <div className={`relative ${size}`}>
                        <div className="absolute inset-0 rounded-full border border-current"></div>
                        <FontAwesomeIcon
                            icon={icon}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${iconSize} transition-transform duration-500 group-hover:${iconClass}`}
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className={`${textSize} font-medium`}>
                            {isMobile ? slideTitle.split(' ')[0] : slideTitle.split(' ')[0]}
                        </span>
                        <span className={`${labelSize} font-medium tracking-wider uppercase text-brand-green/50`}>
                            Previous
                        </span>
                    </div>
                </>
            )}

            {direction === 'next' && (
                <>
                    <div className="flex flex-col items-end">
                        <span className={`${textSize} font-medium`}>
                            {isMobile ? slideTitle.split(' ')[0] : slideTitle.split(' ')[0]}
                        </span>
                        <span className={`${labelSize} font-medium tracking-wider uppercase text-brand-green/50`}>
                            Next
                        </span>
                    </div>
                    <div className={`relative ${size}`}>
                        <div className="absolute inset-0 rounded-full border border-current"></div>
                        <FontAwesomeIcon
                            icon={icon}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${iconSize} transition-transform duration-500 group-hover:${iconClass}`}
                        />
                    </div>
                </>
            )}
        </button>
    );
};



// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default NavigationButton;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Handles both next and previous navigation buttons
// - Supports mobile and desktop layouts
// - Includes animated icons and hover effects 