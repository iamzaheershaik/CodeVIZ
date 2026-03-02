import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
    { id: 'Parser', icon: '📝', label: 'Parser', desc: 'JavaScript Source Text → Abstract Syntax Tree (AST)' },
    { id: 'AST', icon: '🌳', label: 'AST', desc: 'Abstract Syntax Tree' },
    { id: 'Ignition', icon: '🔥', label: 'Ignition', desc: 'Interpreter: AST → Bytecode' },
    { id: 'Bytecode', icon: '📦', label: 'Bytecode', desc: 'Execution of generic instructions' },
    { id: 'TurboFan', icon: '🏎️', label: 'TurboFan', desc: 'Optimizing Compiler: Bytecode → Optimized Machine Code' },
    { id: 'MachineCode', icon: '⚙️', label: 'Machine Code', desc: 'Direct execution on CPU architecture' },
    { id: 'Execution', icon: '⚡', label: 'Execution', desc: 'Running on CPU / Event Loop' }
];

export default function V8EngineVisualizer({ v8State, activeStep }) {
    if (!v8State) return null;

    const currentStageId = v8State.stage;

    return (
        <div className="v8-visualizer glass-card">
            <div className="v8-visualizer-header">
                <h2>🌐 Chrome V8 Engine Pipeline</h2>
                <span className="v8-step-badge">Execution Environment</span>
            </div>

            <div className="v8-pipeline">
                {STAGES.map((stage, i) => {
                    const isActive = stage.id === currentStageId;
                    const isPassed = STAGES.findIndex(s => s.id === currentStageId) > i;

                    return (
                        <div key={stage.id} className="v8-stage-container">
                            <motion.div
                                className={`v8-stage ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{
                                    scale: isActive ? 1.05 : 0.95,
                                    opacity: isActive ? 1 : 0.6,
                                    borderColor: isActive ? '#fb923c' : isPassed ? '#34d399' : 'rgba(255,255,255,0.1)',
                                    boxShadow: isActive ? '0 0 20px rgba(251, 146, 60, 0.4)' : 'none'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="v8-icon">{stage.icon}</div>
                                <div className="v8-stage-name">{stage.label}</div>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            className="v8-active-pulse"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Arrow connecting stages */}
                            {i < STAGES.length - 1 && (
                                <div className={`v8-arrow ${isPassed || isActive ? 'active' : ''}`}>
                                    →
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    className="v8-details"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    <div className="v8-details-label">
                        <strong>Current V8 Status: </strong>
                        {STAGES.find(s => s.id === currentStageId)?.desc || 'Initializing...'}
                    </div>
                    {v8State.details && (
                        <div className="v8-details-text">
                            {v8State.details}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
