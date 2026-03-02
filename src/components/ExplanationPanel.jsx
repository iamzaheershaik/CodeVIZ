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
        <div className="explanation-panel glass-card">
            <h2>📖 Step-by-Step Explanation</h2>

            {/* Controls */}
            <div className="step-controls">
                <button onClick={handlePrev} disabled={activeStep <= 0} title="Previous step">
                    ◀
                </button>
                <button className="play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={handleNext} disabled={activeStep >= total - 1} title="Next step">
                    ▶
                </button>

                <div className="step-progress">
                    <span className="step-label">
                        Step {activeStep + 1} of {total}
                    </span>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="speed-control">
                    <span>Speed:</span>
                    <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                        <option value={6000}>0.5x</option>
                        <option value={4000}>1x</option>
                        <option value={2500}>1.5x</option>
                        <option value={1500}>2x</option>
                    </select>
                </div>
            </div>

            {/* Step Cards */}
            <div className="all-steps">
                <AnimatePresence mode="wait">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.node + idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className={`step-card ${idx === activeStep ? 'active' : 'inactive'}`}
                            onClick={() => {
                                setIsPlaying(false);
                                setActiveStep(idx);
                            }}
                        >
                            <div className="step-number">{idx + 1}</div>
                            <h3>{step.title}</h3>

                            {idx === activeStep && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="step-explanation">{step.explanation}</p>
                                    {step.code && (
                                        <div className="step-code">
                                            <SyntaxHighlighter
                                                language={step.language === 'jsx' ? 'javascript' : step.language}
                                                style={vscDarkPlus}
                                                customStyle={{
                                                    margin: 0,
                                                    padding: '16px',
                                                    background: 'rgba(0,0,0,0.4)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                }}
                                                wrapLongLines
                                            >
                                                {step.code}
                                            </SyntaxHighlighter>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
