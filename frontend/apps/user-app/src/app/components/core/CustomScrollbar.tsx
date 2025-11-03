// ***************************************************************
//                 IMPORTS
// ***************************************************************
import React from 'react';

// ***************************************************************
//                 Types
// ***************************************************************
interface CustomScrollbarProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'thin' | 'hidden';
}

// ***************************************************************
//                 Styles
// ***************************************************************
const getScrollbarStyles = (variant: string) => {
    switch (variant) {
        case 'thin':
            return `
                .custom-scrollbar-thin::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #FDF3E3;
                    opacity: 0.3;
                    border-radius: 4px;
                }
                .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #FDF3E3;
                    opacity: 0.5;
                }
            `;
        case 'hidden':
            return `
                .custom-scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar-hidden {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `;
        default:
            return `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #FDF3E3;
                    opacity: 0.3;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #FDF3E3;
                    opacity: 0.5;
                }
            `;
    }
};

// ***************************************************************
//                 Components
// ***************************************************************
const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
    children,
    className = '',
    variant = 'default'
}) => {
    const scrollbarClass = `custom-scrollbar${variant !== 'default' ? `-${variant}` : ''}`;
    const combinedClassName = `${scrollbarClass} ${className}`.trim();

    return (
        <>
            <style>{getScrollbarStyles(variant)}</style>
            <div className={combinedClassName}>
                {children}
            </div>
        </>
    );
};

// ***************************************************************
//                 RENDER
// ***************************************************************

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default CustomScrollbar;

// ***************************************************************
//                 NOTES
// ***************************************************************
// - Global scrollbar component with multiple variants
// - Default: 5px width scrollbar (matches your current style)
// - Thin: 3px width scrollbar for more subtle appearance
// - Hidden: Completely hidden scrollbar
// - Can be imported and used across the entire app 