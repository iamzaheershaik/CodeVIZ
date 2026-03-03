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
        <div className="flex flex-col glass-panel border-orange-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(249,115,22,0.05)]">
            <div className="flex items-center justify-between px-6 py-4 bg-orange-500/10 border-b border-orange-500/20">
                <h2 className="text-sm font-bold text-orange-400 flex items-center gap-2">
                    <span>🌐</span> Chrome V8 Engine Pipeline
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/20">
                    Execution Environment
                </span>
            </div>

            <div className="p-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-black/20">
                {STAGES.map((stage, i) => {
                    const isActive = stage.id === currentStageId;
                    const isPassed = STAGES.findIndex(s => s.id === currentStageId) > i;

                    return (
                        <div key={stage.id} className="flex items-center">
                            <motion.div
                                className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl border transition-colors ${
                                    isActive 
                                        ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] z-10' 
                                        : isPassed 
                                            ? 'bg-emerald-500/5 border-emerald-500/50' 
                                            : 'bg-white/5 border-white/10'
                                }`}
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{
                                    scale: isActive ? 1.05 : 0.95,
                                    opacity: isActive ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`text-2xl md:text-3xl mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : isPassed ? 'opacity-80' : 'opacity-40 grayscale'}`}>{stage.icon}</div>
                                <div className={`text-[10px] md:text-xs font-bold text-center leading-tight ${isActive ? 'text-orange-300' : isPassed ? 'text-emerald-400/80' : 'text-zinc-500'}`}>{stage.label}</div>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl border-2 border-orange-400"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 0.5, scale: 1.15 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Arrow connecting stages */}
                            {i < STAGES.length - 1 && (
                                <div className={`flex items-center justify-center w-6 md:w-8 font-bold text-lg md:text-xl transition-colors ${
                                    isActive || isPassed ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'text-zinc-700'
                                }`}>
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
                    className="p-5 bg-gradient-to-br from-orange-500/10 to-transparent border-t border-orange-500/20"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    <div className="text-sm font-medium text-orange-200/80 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <strong>Current V8 Status: </strong> 
                        <span className="text-orange-100">{STAGES.find(s => s.id === currentStageId)?.desc || 'Initializing...'}</span>
                    </div>
                    {v8State.details && (
                        <div className="text-sm text-zinc-400 leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                            {v8State.details}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
