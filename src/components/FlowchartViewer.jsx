import { useEffect, useRef, useCallback, useState } from 'react';
import { initMermaid, renderMermaid } from '../utils/mermaidInit';

let mermaidInitialized = false;

export default function FlowchartViewer({ concept, activeStep }) {
    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const renderIdRef = useRef(0);
    const [rendered, setRendered] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, text: '', title: '', x: 0, y: 0 });

    const renderDiagram = useCallback(async () => {
        if (!concept?.mermaid || !containerRef.current) return;

        if (!mermaidInitialized) {
            initMermaid();
            mermaidInitialized = true;
        }

        renderIdRef.current += 1;
        const currentRenderId = renderIdRef.current;
        const uniqueId = `mermaid-${concept.id}-${currentRenderId}`;

        try {
            const svg = await renderMermaid(uniqueId, concept.mermaid);
            if (containerRef.current && renderIdRef.current === currentRenderId) {
                containerRef.current.innerHTML = svg;

                const svgEl = containerRef.current.querySelector('svg');
                if (svgEl) {
                    svgEl.style.width = '100%';
                    svgEl.style.height = 'auto';
                    svgEl.style.maxHeight = isFullscreen ? '85vh' : '60vh';
                }

                setRendered(true);
            }
        } catch (err) {
            console.error('Flowchart render error:', err);
        }
    }, [concept, isFullscreen]);

    useEffect(() => {
        setRendered(false);
        renderDiagram();
    }, [renderDiagram]);

    // Build a map of nodeId → step info for tooltips
    const nodeStepMap = useRef({});
    useEffect(() => {
        if (!concept?.steps) return;
        const map = {};
        concept.steps.forEach((step) => {
            if (step.node && !map[step.node]) {
                map[step.node] = { title: step.title, explanation: step.explanation };
            }
        });
        nodeStepMap.current = map;
    }, [concept]);

    // Attach hover listeners to nodes for tooltips
    useEffect(() => {
        if (!containerRef.current || !rendered || !concept?.steps) return;

        const nodes = containerRef.current.querySelectorAll('.node');

        const handleMouseEnter = (e, node) => {
            const id = node.getAttribute('id') || '';
            // Find matching step
            let matched = null;
            for (const [nodeId, info] of Object.entries(nodeStepMap.current)) {
                if (id.includes(nodeId) || id.startsWith('flowchart-' + nodeId)) {
                    matched = info;
                    break;
                }
            }
            if (matched) {
                const rect = node.getBoundingClientRect();
                setTooltip({
                    show: true,
                    title: matched.title,
                    text: matched.explanation,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                });
            }
        };

        const handleMouseLeave = () => {
            setTooltip((t) => ({ ...t, show: false }));
        };

        nodes.forEach((node) => {
            node.style.cursor = 'pointer';
            node.addEventListener('mouseenter', (e) => handleMouseEnter(e, node));
            node.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            nodes.forEach((node) => {
                node.removeEventListener('mouseenter', handleMouseEnter);
                node.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [rendered, concept]);

    // Highlight nodes based on active step
    useEffect(() => {
        if (!containerRef.current || !rendered || !concept?.steps) return;

        const nodes = containerRef.current.querySelectorAll('.node');
        const edges = containerRef.current.querySelectorAll('.edgePath');

        const visitedIds = [];
        const activeNodeId = concept.steps[activeStep]?.node;
        for (let i = 0; i < activeStep; i++) {
            if (concept.steps[i]?.node) visitedIds.push(concept.steps[i].node);
        }

        nodes.forEach((node) => {
            node.classList.remove('active', 'visited', 'dimmed');
            const id = node.getAttribute('id') || '';

            if (activeNodeId && (id.includes(activeNodeId) || id.startsWith('flowchart-' + activeNodeId))) {
                node.classList.add('active');
            } else if (visitedIds.some((vid) => id.includes(vid) || id.startsWith('flowchart-' + vid))) {
                node.classList.add('visited');
            } else {
                node.classList.add('dimmed');
            }
        });

        edges.forEach((edge, idx) => {
            edge.classList.remove('edge-active', 'edge-visited', 'edge-dimmed');
            if (idx < activeStep) {
                edge.classList.add('edge-visited');
            } else if (idx === activeStep) {
                edge.classList.add('edge-active');
            } else {
                edge.classList.add('edge-dimmed');
            }
        });
    }, [activeStep, concept, rendered]);

    // Close fullscreen on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isFullscreen]);

    useEffect(() => {
        if (rendered) {
            const svgEl = containerRef.current?.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxHeight = isFullscreen ? '85vh' : '60vh';
            }
        }
    }, [isFullscreen, rendered]);

    return (
        <>
            {isFullscreen && (
                <div className="fullscreen-backdrop" onClick={() => setIsFullscreen(false)} />
            )}

            <div
                className={`flowchart-panel glass-card ${isFullscreen ? 'flowchart-fullscreen' : ''}`}
                ref={panelRef}
            >
                <div className="flowchart-header">
                    <h2>📊 Live Flowchart</h2>
                    <div className="flowchart-controls">
                        {concept?.steps && (
                            <div className="flow-indicator">
                                {concept.steps.map((step, idx) => (
                                    <span
                                        key={idx}
                                        className={`flow-dot ${idx === activeStep ? 'dot-active' : idx < activeStep ? 'dot-visited' : 'dot-pending'
                                            }`}
                                        title={step.title}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            className="fullscreen-btn"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                        >
                            {isFullscreen ? '✕' : '⛶'}
                        </button>
                    </div>
                </div>
                <div className="mermaid-container live-flow" ref={containerRef}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Loading diagram...
                    </div>
                </div>
                {isFullscreen && (
                    <div className="fullscreen-hint">Press <kbd>Esc</kbd> to exit fullscreen</div>
                )}
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="flowchart-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                >
                    <div className="tooltip-title">{tooltip.title}</div>
                    <div className="tooltip-text">{tooltip.text}</div>
                </div>
            )}
        </>
    );
}
