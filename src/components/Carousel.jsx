import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Carousel = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;

        const currentSlide = slides[currentIndex];
        const duration = (currentSlide.duration || 10) * 1000;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentIndex, slides]);

    if (slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900 text-white">
                <p className="text-2xl opacity-50">No slides to display</p>
            </div>
        );
    }

    const slide = slides[currentIndex];

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {slide.type === 'image' ? (
                        <img
                            src={slide.content}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 p-20">
                            <div className="text-center space-y-8 max-w-5xl">
                                <h2 className="text-6xl font-bold text-white leading-tight drop-shadow-lg">
                                    {slide.content}
                                </h2>
                                {slide.title && (
                                    <p className="text-3xl text-blue-200 font-light tracking-wide">
                                        {slide.title}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Slide Title Overlay for Images */}
                    {slide.type === 'image' && slide.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12 pt-32">
                            <h3 className="text-4xl font-bold text-white drop-shadow-md">{slide.title}</h3>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 z-20"
                style={{
                    width: '100%',
                    animation: `progress ${slides[currentIndex].duration}s linear`
                }}
            />
            <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
};

export default Carousel;
