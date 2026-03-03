import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getConceptById, getCategoryById } from '../data';
import FlowchartViewer from '../components/FlowchartViewer';
import MemoryVisualizer from '../components/MemoryVisualizer';
import ExplanationPanel from '../components/ExplanationPanel';

export default function ConceptPage() {
    const { conceptId } = useParams();
    const concept = getConceptById(conceptId);
    const [activeStep, setActiveStep] = useState(0);

    if (!concept) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h1 className="text-3xl font-bold text-zinc-300">Concept not found</h1>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    const category = getCategoryById(concept.category);
    const hasMemory = concept.steps?.some((s) => s.memory);
    const currentStep = concept.steps?.[activeStep];
    const currentMemory = currentStep?.memory || null;

    return (
        <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header / Title */}
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                    <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <span className="text-zinc-700">/</span>
                    <Link to={`/category/${concept.category}`} className="hover:text-indigo-400 transition-colors">{category?.name || concept.category}</Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">{concept.title}</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center gap-4 text-white">
                    <span className="p-2 md:p-3 bg-white/5 rounded-2xl border border-white/5">{concept.icon}</span>
                    <span>{concept.title}</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">{concept.description}</p>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
                <div className="flex flex-col gap-6">
                    {/* Flowchart */}
                    <FlowchartViewer concept={concept} activeStep={activeStep} />

                    {/* Code Section — shows the code this step is visualizing */}
                    {currentStep?.code && (
                        <div className="flex flex-col glass-panel rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10">
                                <h2 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                    Code
                                </h2>
                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/10 text-zinc-400">
                                    {currentStep.language || 'javascript'}
                                </span>
                            </div>
                            <pre className="p-6 overflow-x-auto text-sm leading-relaxed custom-scrollbar"><code className="font-mono text-zinc-300">{currentStep.code}</code></pre>
                        </div>
                    )}

                    {/* Memory visualization */}
                    {hasMemory && currentMemory && (
                        <div className="flex flex-col glass-panel rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10">
                                <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                                    <span>🧠</span> Memory & Execution
                                </h2>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/20">
                                    Step {activeStep + 1}
                                </span>
                            </div>
                            <MemoryVisualizer memoryState={currentMemory} activeStep={activeStep} />
                        </div>
                    )}
                </div>

                <ExplanationPanel
                    concept={concept}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                />
            </div>
        </motion.div>
    );
}
