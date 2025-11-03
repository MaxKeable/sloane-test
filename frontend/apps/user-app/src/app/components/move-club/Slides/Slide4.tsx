import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.5,
        },
    },
};

const fadeSlide = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.5,
            delay: i * 0.5,
            ease: [0.4, 0.0, 0.2, 1],
        },
    }),
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] },
    },
};

const fadeSlideDown = {
    hidden: { opacity: 0, y: -40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] },
    },
};

const fadeSlideLeft = {
    hidden: { opacity: 0, x: -40 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] },
    },
};

const fadeSlideRight = {
    hidden: { opacity: 0, x: 40 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] },
    },
};

const Slide4: React.FC = () => {
    return (
        <motion.div
            className="relative w-full h-full flex flex-col items-center justify-center -mt-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* ANIMATION 3 - Top Left Text (from bottom up) */}
            <motion.div
                className=" text-left"
                variants={fadeSlideUp}
                initial="hidden"
                animate="show"
            >
                <div className="text-xs md:text-sm font-thin text-brand-cream" style={{ color: '#FDF3E3' }}>
                    Networking that<br />
                    ACTUALLY <span className="font-bold">grows</span><br />
                    your business
                </div>
            </motion.div>

            {/* Center MOVE with lines and circles */}
            <motion.div
                className="flex flex-col items-center justify-center"
                variants={fadeSlide}
            >
                {/* Top line and circle - ANIMATION 2 ANIMATE IN FROM THE LEFT*/}
                <div className="flex flex-col items-center mb-2 -ml-12">
                    <motion.div className="w-[5px] h-[5px] lg:w-2 lg:h-2 rounded-full bg-brand-cream" style={{ background: '#FDF3E3' }} variants={fadeSlideLeft} initial="hidden" animate="show" />
                    <motion.div className="w-[1px] h-2 lg:h-4 bg-brand-cream" style={{ background: '#FDF3E3' }} variants={fadeSlideLeft} initial="hidden" animate="show" />
                </div>
                {/* MOVE - ANIMATION 1 */}
                <motion.div className="text-2xl lg:text-5xl font-extrabold tracking-tight leading-none text-brand-cream -mt-2" variants={fadeSlide} custom={0} initial="hidden" animate="show">
                    MOVE
                </motion.div>
                {/* Bottom line and circle - ANIMATION 2 ANIMATE IN FROM THE RIGHT */}
                <div className="flex flex-col items-center mb-2 -mr-12">
                    <motion.div className="w-[1px] h-2 lg:h-4 bg-brand-cream" style={{ background: '#FDF3E3' }} variants={fadeSlideRight} initial="hidden" animate="show" />
                    <motion.div className="w-[5px] h-[5px] lg:w-2 lg:h-2 rounded-full bg-brand-cream" style={{ background: '#FDF3E3' }} variants={fadeSlideRight} initial="hidden" animate="show" />
                </div>
            </motion.div>

            {/* ANIMATION 3 - Bottom Right Text (from top down) */}
            <motion.div
                className=" text-right max-w-xs"
                variants={fadeSlideDown}
                initial="hidden"
                animate="show"
            >
                <div className="text-xs md:text-sm font-thin text-brand-cream" style={{ color: '#FDF3E3' }}>
                    No awkward intros.<br />
                    No cold pitching.<br />
                    Just <span className="font-bold">real connections,</span><br />
                    ideas, and <span className="font-bold">momentum.</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Slide4; 