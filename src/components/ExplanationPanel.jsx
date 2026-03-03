import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { playStepSound } from '../utils/audio';

export default function ExplanationPanel({ concept, activeStep, setActiveStep }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(4000);
    const intervalRef = useRef(null);

    const steps = concept?.steps || [];
    const total = steps.length;

    useEffect(() => {
        if (total > 0) {
            playStepSound();
        }
    }, [activeStep, total]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setActiveStep((prev) => {
                    if (prev >= total - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, speed, total, setActiveStep]);

    const handlePrev = () => {
        setIsPlaying(false);
        setActiveStep((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setIsPlaying(false);
        setActiveStep((prev) => Math.min(total - 1, prev + 1));
    };

    const togglePlay = () => {
        if (activeStep >= total - 1) {
            setActiveStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const progress = total > 0 ? ((activeStep + 1) / total) * 100 : 0;

    return (
        <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden border-indigo-500/20 sticky top-6 max-h-[calc(100vh-48px)]">
            <div className="flex items-center gap-3 px-6 py-5 bg-black/40 border-b border-white/10 shrink-0">
                <span className="text-xl">📖</span>
                <h2 className="font-bold text-white tracking-wide">Step-by-Step Explanation</h2>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 p-5 bg-zinc-950/50 border-b border-indigo-500/20 shrink-0 shadow-inner">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                        <button 
                            onClick={handlePrev} 
                            disabled={activeStep <= 0} 
                            title="Previous step"
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button 
                            onClick={togglePlay} 
                            title={isPlaying ? 'Pause' : 'Play'}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                            ) : (
                                <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={activeStep >= total - 1} 
                            title="Next step"
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-500 font-medium">Speed</span>
                        <select 
                            value={speed} 
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <option value={6000}>0.5x</option>
                            <option value={4000}>1x</option>
                            <option value={2500}>1.5x</option>
                            <option value={1500}>2x</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <span>Progress</span>
                        <span className="text-indigo-400">{activeStep + 1} / {total}</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-cyan-400 transition-all duration-300 ease-out" 
                            style={{ width: `${progress}%` }} 
                        />
                    </div>
                </div>
            </div>

            {/* Step Cards */}
            <div className="flex-1 overflow-y-auto p-5 pb-10 flex flex-col gap-3 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {steps.map((step, idx) => {
                        const isActive = idx === activeStep;
                        return (
                            <motion.div
                                key={step.node + idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className={`flex flex-col rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_4px_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20' 
                                        : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'
                                }`}
                                onClick={() => {
                                    setIsPlaying(false);
                                    setActiveStep(idx);
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors ${
                                        isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg' 
                                            : 'bg-white/10 text-zinc-400'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0 flex-1 mt-1.5">
                                        <h3 className={`font-semibold text-base transition-colors ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                            {step.title}
                                        </h3>
                                        
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-zinc-300 text-sm leading-relaxed mt-3 mb-4 break-words whitespace-pre-wrap">{step.explanation}</p>
                                                    {step.code && (
                                                        <div className="rounded-lg overflow-x-auto border border-white/10 text-xs shadow-inner w-full min-w-0">
                                                            <div className="min-w-0 w-full">
                                                                <SyntaxHighlighter
                                                                    language={step.language === 'jsx' ? 'javascript' : step.language || 'javascript'}
                                                                    style={vscDarkPlus}
                                                                    customStyle={{
                                                                        margin: 0,
                                                                        padding: '1rem',
                                                                        background: 'rgba(0,0,0,0.6)',
                                                                    }}
                                                                    wrapLongLines={true}
                                                                >
                                                                    {step.code}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
