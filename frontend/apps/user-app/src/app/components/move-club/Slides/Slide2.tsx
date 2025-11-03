import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tickerText = "Move Club   ".repeat(10);

const TickerRow = ({ reverse = false, className = "" }) => (
    <motion.div
        className={`absolute w-full flex items-center overflow-hidden pointer-events-none select-none ${className}`}
        animate={{
            x: reverse ? ['80%', '-80%'] : ['-80%', '80%'],
        }}
        transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 12,
            ease: 'linear',
        }}
        style={{ height: '100%' }}
    >
        <span className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest text-brand-cream opacity-10 whitespace-nowrap min-w-max">
            {tickerText}
        </span>
    </motion.div>
);

const MoveClubBackground = () => (
    <div className="absolute inset-0 w-full h-full z-0">
        <div className="relative w-full h-full">
            <div className="absolute top-0 w-full h-1/3">
                <TickerRow reverse={false} className="h-full" />
            </div>
            <div className="absolute top-1/3 w-full h-1/3">
                <TickerRow reverse={true} className="h-full" />
            </div>
            <div className="absolute top-2/3 w-full h-1/3">
                <TickerRow reverse={false} className="h-full" />
            </div>
        </div>
    </div>
);

const slideVariants1 = {
    initial: { y: 80, opacity: 0 },
    animate: {
        y: [80, 8, -8, -80],
        opacity: [0, 1, 1, 0],
        transition: {
            y: {
                times: [0, 0.25, 0.75, 1],
                duration: 3.6,
                ease: ['easeOut', 'linear', 'easeIn'],
            },
            opacity: {
                times: [0, 0.25, 0.75, 1],
                duration: 3.6,
                ease: ['linear', 'linear', 'linear'],
            }
        }
    },
    exit: { y: -80, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
};

const slideVariants2 = {
    initial: { y: 80, opacity: 0 },
    animate: {
        y: [80, 8, -8, -80],
        opacity: [0, 1, 1, 0],
        transition: {
            y: {
                times: [0, 0.2, 0.85, 1],
                duration: 4.4,
                ease: ['easeOut', 'linear', 'easeIn'],
            },
            opacity: {
                times: [0, 0.2, 0.85, 1],
                duration: 4.4,
                ease: ['linear', 'linear', 'linear'],
            }
        }
    },
    exit: { y: -80, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
};

const slideContents = [
    <>
        A focused <span className="font-bold text-brand-logo">co-working</span> session with <span className="font-bold text-brand-white"> like-minded </span>business owners.
    </>,
    <>
        Tap into <span className="font-bold text-brand-white">deep work, mindfulness breaks,</span> and sneak peeks at the latest (and upcoming) <span className="font-bold text-brand-logo ">Sloane features</span>.
    </>
];

const Slide2: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const durations = [3600, 4200];
        const timeout = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % slideContents.length);
        }, durations[activeIndex]);
        return () => clearTimeout(timeout);
    }, [activeIndex]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-1 md:px-2 ">
            <MoveClubBackground />
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-2 md:px-4" style={{ minHeight: 200 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        variants={activeIndex === 1 ? slideVariants2 : slideVariants1}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 p-2 md:p-4 max-w-xs md:max-w-xl mx-auto w-full"
                        style={{ position: 'absolute' }}
                    >
                        <p className="text-xs md:text-sm text-brand-white leading-relaxed text-center">
                            {slideContents[activeIndex]}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Slide2; 