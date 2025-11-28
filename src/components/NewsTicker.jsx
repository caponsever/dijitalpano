import React from 'react';
import { motion } from 'framer-motion';

const NewsTicker = ({ text }) => {
    return (
        <div className="bg-blue-900 text-white overflow-hidden py-3 relative flex items-center shadow-inner">
            <div className="absolute left-0 top-0 bottom-0 bg-blue-800 px-4 z-10 flex items-center font-bold text-yellow-400 shadow-md">
                DUYURULAR
            </div>
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex whitespace-nowrap pl-32"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30, // Adjust speed based on text length ideally
                        ease: "linear"
                    }}
                >
                    <span className="text-lg font-medium tracking-wide">{text}</span>
                </motion.div>
            </div>
        </div>
    );
};

export default NewsTicker;
