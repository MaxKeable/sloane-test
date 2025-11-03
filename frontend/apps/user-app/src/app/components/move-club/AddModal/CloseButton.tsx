// ***************************************************************
//     IMPORTS
// ***************************************************************
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// ***************************************************************
//     Types
// ***************************************************************
interface CloseButtonProps {
    onClose: () => void;
}

// ***************************************************************
//     Components
// ***************************************************************
const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
    return (
        <button
            onClick={onClose}
            className="absolute right-6 top-6 text-brand-green/70 hover:text-brand-green transition-colors duration-300 z-20"
        >
            <FontAwesomeIcon icon={faPlus} className="h-6 w-6 rotate-45" />
        </button>
    );
};

// ***************************************************************
//     RENDER
// ***************************************************************

// ***************************************************************
//     EXPORTS
// ***************************************************************
export default CloseButton;

// ***************************************************************
//     NOTES
// ***************************************************************
// - Simple close button with plus icon rotated 45 degrees
// - Positioned absolutely in top-right corner
// - Uses brand colors with hover effects 