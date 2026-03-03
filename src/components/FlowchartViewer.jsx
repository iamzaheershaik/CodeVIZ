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
                    // Make SVG scale up nicely
                    svgEl.style.width = '100%';
                    svgEl.style.height = '100%';
                    svgEl.style.minHeight = '400px';
                    svgEl.style.maxHeight = isFullscreen ? '90vh' : '75vh';
                    // Allow SVG to center properly without extreme zooming constraints in regular mode
                    svgEl.style.display = 'block';
                    svgEl.style.margin = 'auto';
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

        let activeNodeElement = null;

        nodes.forEach((node) => {
            node.classList.remove('active', 'visited', 'dimmed');
            const id = node.getAttribute('id') || '';

            if (activeNodeId && (id.includes(activeNodeId) || id.startsWith('flowchart-' + activeNodeId))) {
                node.classList.add('active');
                activeNodeElement = node;
            } else if (visitedIds.some((vid) => id.includes(vid) || id.startsWith('flowchart-' + vid))) {
                node.classList.add('visited');
            } else {
                node.classList.add('dimmed');
            }
        });

        // Progressive auto-scroll to active node
        if (activeNodeElement && containerRef.current) {
            try {
                activeNodeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } catch (err) {
                // Fallback for browsers that don't support scrollIntoView on SVG elements
                console.warn('scrollIntoView failed, falling back to container scroll', err);
            }
        }

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
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] transition-opacity" 
                    onClick={() => setIsFullscreen(false)} 
                />
            )}

            <div
                className={`flex flex-col glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
                    isFullscreen 
                        ? 'fixed top-[5%] left-[5%] w-[90%] h-[90%] z-[9999] shadow-2xl flex flex-col bg-zinc-900 border border-indigo-500/30' 
                        : ''
                }`}
                ref={panelRef}
            >
                <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 shrink-0">
                    <h2 className="text-sm font-bold text-indigo-400 flex items-center gap-2">📊 Live Flowchart</h2>
                    <div className="flex items-center gap-4">
                        {concept?.steps && (
                            <div className="flex items-center gap-2">
                                {concept.steps.map((step, idx) => (
                                    <span
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            idx === activeStep 
                                                ? 'bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125' 
                                                : idx < activeStep 
                                                    ? 'bg-indigo-400/50' 
                                                    : 'bg-zinc-700'
                                        }`}
                                        title={step.title}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ml-2"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                        >
                            {isFullscreen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                            )}
                        </button>
                    </div>
                </div>
                
                <div 
                    className={`mermaid-container live-flow flex-grow p-6 bg-zinc-950/50 rounded-b-2xl flex items-center justify-center overflow-auto ${isFullscreen ? 'h-full' : ''}`} 
                    ref={containerRef}
                >
                    <div className="text-zinc-500 text-sm">
                        Loading diagram...
                    </div>
                </div>
                
                {isFullscreen && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-zinc-400 text-sm border border-white/10 pointer-events-none shadow-lg">
                        Press <kbd className="px-2 py-0.5 bg-white/10 rounded font-mono text-zinc-300 ml-1">Esc</kbd> to exit fullscreen
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="fixed z-[10000] p-4 bg-zinc-900 border border-indigo-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-w-[300px] pointer-events-none font-sans transform -translate-x-1/2 -translate-y-full backdrop-blur-xl transition-opacity animate-in fade-in"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                >
                    <div className="text-sm font-bold text-indigo-300 mb-1 leading-tight">{tooltip.title}</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">{tooltip.text}</div>
                </div>
            )}
        </>
    );
}
