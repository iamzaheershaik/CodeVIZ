import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { explainConcept } from '../utils/gemini';
import FlowchartViewer from '../components/FlowchartViewer';
import MemoryVisualizer from '../components/MemoryVisualizer';
import V8EngineVisualizer from '../components/V8EngineVisualizer';
import ExplanationPanel from '../components/ExplanationPanel';

export default function AIExplainPage() {
    const [query, setQuery] = useState('');
    const [concept, setConcept] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setConcept(null);
        setActiveStep(0);

        try {
            const result = await explainConcept(query.trim());
            setConcept(result);
            setHistory((prev) => [
                { query: query.trim(), title: result.title, id: Date.now() },
                ...prev.slice(0, 9),
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (text) => {
        setQuery(text);
    };

    const suggestions = [
        'Chrome V8 Engine Execution Pipeline',
        'How JavaScript Arrays work internally',
        'Python List memory allocation',
        'How JavaScript Promises execute step by step',
        'React useState hook internal execution',
        'How Python Dictionary hash table works',
        'JavaScript closure memory and scope chain',
        'How async/await runs on the event loop',
        'How HTTP request flows through the network',
        'Python generator yield execution flow',
        'How JavaScript garbage collection works',
        'Node.js require() module loading internal',
        'How recursion uses the call stack',
    ];

    const hasMemory = concept?.steps?.some((s) => s.memory);
    const hasV8 = concept?.steps?.some((s) => s.v8Engine);
    const currentStep = concept?.steps?.[activeStep];
    const currentMemory = currentStep?.memory || null;
    const currentV8 = currentStep?.v8Engine || null;

    return (
        <motion.div
            className="flex flex-col gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
                <div className="flex justify-center items-center gap-3 text-sm font-medium text-zinc-500 mb-2">
                    <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">AI Explain</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white inline-flex items-center justify-center gap-3">
                    <span className="text-5xl">🤖</span> AI Concept Explainer
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed">
                    Type any programming concept — Gemini AI will generate flowcharts, memory visualizations, and step-by-step execution breakdowns.
                </p>
            </div>

            {/* Search Form */}
            <form className="max-w-3xl w-full mx-auto relative z-10" onSubmit={handleSubmit}>
                <div className="relative group flex items-center">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-xl">
                        ✨
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., How does JavaScript handle arrays internally?"
                        className="w-full pl-14 pr-36 py-5 bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl text-lg text-white placeholder-zinc-500 shadow-[0_0_30px_rgba(99,102,241,0.15)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        disabled={loading}
                        id="ai-search-input"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={loading || !query.trim()}
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Explain'}
                    </button>
                </div>
            </form>

            {/* Suggestions */}
            {!concept && !loading && !error && (
                <motion.div
                    className="max-w-4xl mx-auto w-full flex flex-col items-center gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">💡 Try these topics:</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {suggestions.map((s) => (
                            <button 
                                key={s} 
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap" 
                                onClick={() => handleSuggestion(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Loading */}
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        className="max-w-2xl mx-auto w-full p-10 glass-panel rounded-3xl flex flex-col items-center text-center gap-6 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)]" 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Generating AI Explanation...</h3>
                        <p className="text-zinc-400 text-lg">
                            Hang tight! Gemini is visualizing <strong className="text-white">"{query}"</strong>
                            <br />Creating flowcharts, parsing memory states, and building steps.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <motion.div 
                    className="max-w-2xl mx-auto w-full p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-4" 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-2xl mt-1">❌</span>
                    <div className="flex-1">
                        <strong className="block text-lg font-bold text-rose-400 mb-1">Error Generating Explanation</strong>
                        <p className="text-rose-300/80 leading-relaxed">{error}</p>
                    </div>
                    <button 
                        onClick={() => setError(null)}
                        className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors text-sm font-bold"
                    >
                        Dismiss
                    </button>
                </motion.div>
            )}

            {/* Result */}
            {concept && (
                <motion.div className="flex flex-col gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex flex-col gap-4 border-b border-indigo-500/20 pb-8 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent rounded-t-3xl p-6 -mx-6 px-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">{concept.icon}</span>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{concept.title}</h2>
                                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI Generated</span>
                            </div>
                        </div>
                        <p className="text-lg text-zinc-400 mt-2 max-w-4xl">{concept.description}</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
                        <div className="flex flex-col gap-6">
                            {/* Flowchart with fullscreen */}
                            <FlowchartViewer concept={concept} activeStep={activeStep} />

                            {/* Code Section */}
                            {currentStep?.code && (
                                <div className="flex flex-col glass-panel border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(99,102,241,0.05)]">
                                    <div className="flex items-center justify-between px-6 py-4 bg-indigo-500/10 border-b border-indigo-500/20">
                                        <h2 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                            Code
                                        </h2>
                                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 text-zinc-400">
                                            {currentStep.language || 'javascript'}
                                        </span>
                                    </div>
                                    <pre className="p-6 overflow-x-auto text-sm leading-relaxed custom-scrollbar"><code className="font-mono text-zinc-300">{currentStep.code}</code></pre>
                                </div>
                            )}

                            {/* Memory */}
                            {hasMemory && currentMemory && (
                                <div className="flex flex-col glass-panel border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(6,182,212,0.05)]">
                                    <div className="flex items-center justify-between px-6 py-4 bg-cyan-500/10 border-b border-cyan-500/20">
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

                            {/* V8 Engine Pipeline */}
                            {hasV8 && currentV8 && (
                                <div className="mt-4">
                                     <V8EngineVisualizer v8State={currentV8} activeStep={activeStep} />
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
            )}

            {/* History */}
            {history.length > 0 && !loading && (
                <div className="max-w-4xl mx-auto mt-12 w-full flex flex-col items-center gap-6 border-t border-white/10 pt-12">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">🕐 Recent AI Queries:</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {history.map((h) => (
                            <button 
                                key={h.id} 
                                className="px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-sm text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all" 
                                onClick={() => handleSuggestion(h.query)}
                            >
                                {h.title || h.query}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
