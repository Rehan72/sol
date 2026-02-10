import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';
import RealisticSun from './RealisticSun';

const GlobalLoader = () => {
    const { loading } = useLoading();

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-deep-navy/80 backdrop-blur-sm"
                >
                    {/* Atmospheric Glow */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-radial-gradient from-solar-yellow/10 to-transparent blur-[100px] pointer-events-none" />

                    <div className="relative flex flex-col items-center">
                        {/* Scaled down version of the realistic sun */}
                        <div className="relative w-32 h-32 mb-8">
                             <RealisticSun className="w-full h-full scale-75" />
                        </div>

                        {/* Animated Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-black tracking-widest text-white uppercase italic">
                                SYNCING<span className="text-solar-yellow ml-2">DATA</span>
                            </h2>
                            <div className="flex gap-1 justify-center mt-3">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3]
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                        className="w-1.5 h-1.5 rounded-full bg-solar-yellow"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="film-grain" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
