import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.35,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    show: {
        opacity: 1,
        scaleY: 1,
        transition: { type: 'spring', stiffness: 60, damping: 18 },
    },
};

const Slide1: React.FC = () => {
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCycle((prev) => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={cycle}
                className="flex flex-col justify-center items-center h-full w-full px-2 md:px-4 text-center max-w-xs md:max-w-full mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
            >
                {/* Top: Introducing */}
                <motion.div
                    variants={itemVariants}
                    className="text-brand-cream text-xs md:text-sm font-light tracking-wide opacity-80 mb-2 md:mb-4"
                    style={{ fontFamily: 'inherit', fontWeight: 300, transformOrigin: 'center bottom' }}
                >
                    Introducing
                </motion.div>

                {/* Center: Feature Text */}
                <motion.div
                    variants={itemVariants}
                    className="text-brand-cream text-lg md:text-3xl font-bold text-center mb-4 md:mb-8"
                    style={{ letterSpacing: '-0.02em', transformOrigin: 'center bottom' }}
                >
                    The <br />Move Club
                </motion.div>

                {/* Bottom: Get Sh!t Done */}
                <motion.div
                    variants={itemVariants}
                    className="text-brand-cream text-xs md:text-sm font-light tracking-wide opacity-80"
                    style={{ fontFamily: 'inherit', fontWeight: 100, transformOrigin: 'center bottom' }}
                >
                    Together We Move
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Slide1; 