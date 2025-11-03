// ***************************************************************
//     IMPORTS
//     ***************************************************************
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ***************************************************************
//     Types
//     ***************************************************************
    interface BackgroundIconProps {
    icon: any;
    currentIndex: number;
}

// ***************************************************************
//     Components
//     ***************************************************************
const BackgroundIcon: React.FC<BackgroundIconProps> = ({ icon, currentIndex }) => {
    return (
        <motion.div
            key={`icon-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute -right-32 -top-32"
        >
            <FontAwesomeIcon
                icon={icon}
                className="h-[32rem] w-[32rem] text-brand-green/30"
            />
        </motion.div>
    );
};

// // ***************************************************************
//     RENDER
// //     ***************************************************************

// // ***************************************************************
//     EXPORTS
// //     ***************************************************************
export default BackgroundIcon;

// // ***************************************************************
//     NOTES
// //     ***************************************************************
//     - Animated background icon that changes with slide transitions
//         - Positioned absolutely with large size and low opacity
//             - Uses Framer Motion for smooth animations 