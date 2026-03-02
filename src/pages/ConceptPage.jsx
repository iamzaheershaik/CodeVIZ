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
            <div className="concept-page">
                <h1>Concept not found</h1>
                <Link to="/" className="back-link">← Back to Home</Link>
            </div>
        );
    }

    const category = getCategoryById(concept.category);
    const hasMemory = concept.steps?.some((s) => s.memory);
    const currentStep = concept.steps?.[activeStep];
    const currentMemory = currentStep?.memory || null;

    return (
        <motion.div
            className="concept-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span className="sep">/</span>
                <Link to={`/category/${concept.category}`}>{category?.name || concept.category}</Link>
                <span className="sep">/</span>
                <span>{concept.title}</span>
            </div>

            {/* Title */}
            <div className="concept-title-section">
                <h1>{concept.icon} {concept.title}</h1>
                <p>{concept.description}</p>
            </div>

            {/* Split Layout */}
            <div className="concept-layout">
                <div className="viz-combined">
                    {/* Flowchart */}
                    <FlowchartViewer concept={concept} activeStep={activeStep} />

                    {/* Code Section — shows the code this step is visualizing */}
                    {currentStep?.code && (
                        <div className="code-panel glass-card">
                            <div className="code-panel-header">
                                <h2>💻 Code</h2>
                                <span className="code-lang-badge">{currentStep.language || 'javascript'}</span>
                            </div>
                            <pre className="code-display"><code>{currentStep.code}</code></pre>
                        </div>
                    )}

                    {/* Memory visualization */}
                    {hasMemory && currentMemory && (
                        <div className="memory-panel glass-card">
                            <div className="memory-panel-header">
                                <h2>🧠 Memory & Execution</h2>
                                <span className="memory-step-badge">Step {activeStep + 1}</span>
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
