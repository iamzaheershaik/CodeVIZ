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
            className="ai-explain-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="ai-header">
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="sep">/</span>
                    <span>AI Explain</span>
                </div>
                <h1>🤖 AI Concept Explainer</h1>
                <p>Type any programming concept — Gemini AI will generate flowcharts, memory visualizations, and step-by-step execution breakdowns.</p>
            </div>

            {/* Search Form */}
            <form className="ai-search-form" onSubmit={handleSubmit}>
                <div className="ai-input-wrapper">
                    <span className="ai-input-icon">✨</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., How does JavaScript handle arrays internally?"
                        className="ai-input"
                        disabled={loading}
                        id="ai-search-input"
                    />
                    <button
                        type="submit"
                        className="ai-submit-btn"
                        disabled={loading || !query.trim()}
                    >
                        {loading ? <span className="ai-spinner" /> : 'Explain'}
                    </button>
                </div>
            </form>

            {/* Suggestions */}
            {!concept && !loading && !error && (
                <motion.div
                    className="ai-suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3>💡 Try these topics:</h3>
                    <div className="suggestion-tags">
                        {suggestions.map((s) => (
                            <button key={s} className="suggestion-tag" onClick={() => handleSuggestion(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Loading */}
            <AnimatePresence>
                {loading && (
                    <motion.div className="ai-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="ai-loading-content">
                            <div className="ai-loading-spinner" />
                            <h3>Generating explanation...</h3>
                            <p>Gemini AI is creating flowcharts, memory visualizations, and step-by-step execution for "<strong>{query}</strong>"</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <motion.div className="ai-error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <span>❌</span>
                    <div>
                        <strong>Error</strong>
                        <p>{error}</p>
                    </div>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </motion.div>
            )}

            {/* Result */}
            {concept && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="ai-result-header">
                        <h2>{concept.icon} {concept.title}</h2>
                        <p>{concept.description}</p>
                        <span className="difficulty-badge ai-generated">AI Generated</span>
                    </div>

                    <div className="concept-layout">
                        <div className="viz-combined">
                            {/* Flowchart with fullscreen */}
                            <FlowchartViewer concept={concept} activeStep={activeStep} />

                            {/* Code Section */}
                            {currentStep?.code && (
                                <div className="code-panel glass-card">
                                    <div className="code-panel-header">
                                        <h2>💻 Code</h2>
                                        <span className="code-lang-badge">{currentStep.language || 'javascript'}</span>
                                    </div>
                                    <pre className="code-display"><code>{currentStep.code}</code></pre>
                                </div>
                            )}

                            {/* Memory */}
                            {hasMemory && currentMemory && (
                                <div className="memory-panel glass-card">
                                    <div className="memory-panel-header">
                                        <h2>🧠 Memory & Execution</h2>
                                        <span className="memory-step-badge">Step {activeStep + 1}</span>
                                    </div>
                                    <MemoryVisualizer memoryState={currentMemory} activeStep={activeStep} />
                                </div>
                            )}

                            {/* V8 Engine Pipeline */}
                            {hasV8 && currentV8 && (
                                <V8EngineVisualizer v8State={currentV8} activeStep={activeStep} />
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
                <div className="ai-history">
                    <h3>🕐 Recent Queries</h3>
                    <div className="history-tags">
                        {history.map((h) => (
                            <button key={h.id} className="suggestion-tag" onClick={() => handleSuggestion(h.query)}>
                                {h.title || h.query}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
