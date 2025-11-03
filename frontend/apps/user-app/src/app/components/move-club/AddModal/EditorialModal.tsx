// ***************************************************************
// IMPORTS
//     ***************************************************************
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CloseButton from './CloseButton';
import BackgroundIcon from './BackgroundIcon';
import SlideContent from './SlideContent';
import Navigation from './Navigation';
import { slides } from './slideData';
import { EditorialModalProps } from './types';



// ***************************************************************
// Components
//     ***************************************************************
const EditorialModal: React.FC<EditorialModalProps> = ({ isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = slides.length;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[(currentIndex + 1) % totalSlides];
    const prevSlide = slides[(currentIndex - 1 + totalSlides) % totalSlides];

    const onNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
    const onPrevious = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            <motion.div
                layout
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="relative w-full max-w-4xl h-[90vh] md:max-h-[80vh] rounded-3xl bg-brand-cream/95 shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <BackgroundIcon icon={currentSlide.icon} currentIndex={currentIndex} />
                <CloseButton onClose={onClose} />

                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        <SlideContent
                            slide={currentSlide}
                            currentIndex={currentIndex}
                            totalSlides={totalSlides}
                        />
                    </div>

                    <Navigation
                        currentIndex={currentIndex}
                        totalSlides={totalSlides}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        nextSlide={nextSlide}
                        prevSlide={prevSlide}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};



// ***************************************************************
// EXPORTS
//     ***************************************************************
export default EditorialModal;

// ***************************************************************
// NOTES
//     ***************************************************************
// - Main modal component that orchestrates all smaller components
// - Manages slide state and navigation logic
// - Uses Framer Motion for smooth animations
// - Responsive design with proper event handling 