import { useEffect, useState } from 'react';

export default function MemoryVisualizer({ memoryState, activeStep }) {
    const [animateKey, setAnimateKey] = useState(0);

    useEffect(() => {
        setAnimateKey((k) => k + 1);
    }, [activeStep]);

    if (!memoryState) return null;

    const state = memoryState;
    const stack = state.stack || [];
    const heap = state.heap || [];
    const output = state.output || [];

    // SVG dimensions
    const svgWidth = 1000;
    const stackX = 30;
    const heapX = 420;
    const outputX = 680;
    const headerY = 30;
    const startY = 65;
    const frameH = 40;

    const stackHeight = Math.max(stack.length * (frameH + 8) + 80, 200);
    const heapHeight = Math.max(heap.length * 70 + 80, 200);
    const svgHeight = Math.max(stackHeight, heapHeight, 280);

    return (
        <div className="memory-visualizer">
            <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="memory-svg">
                <defs>
                    <linearGradient id="stackGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(79,140,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(79,140,255,0.03)" />
                    </linearGradient>
                    <linearGradient id="heapGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(168,85,247,0.15)" />
                        <stop offset="100%" stopColor="rgba(168,85,247,0.03)" />
                    </linearGradient>
                    <linearGradient id="outputGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(52,211,153,0.15)" />
                        <stop offset="100%" stopColor="rgba(52,211,153,0.03)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* ===== CALL STACK ===== */}
                <rect x={stackX} y={10} width={360} height={svgHeight - 20} rx="12" fill="url(#stackGrad)" stroke="rgba(79,140,255,0.3)" strokeWidth="1" />
                <text x={stackX + 180} y={headerY} textAnchor="middle" fill="#4f8cff" fontSize="13" fontWeight="700">📚 CALL STACK</text>

                {stack.length === 0 && (
                    <text x={stackX + 180} y={startY + 40} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12" fontStyle="italic">empty</text>
                )}

                {stack.map((frame, i) => {
                    const y = startY + i * (frameH + 8);
                    const isTop = i === stack.length - 1;
                    return (
                        <g key={`stack-${i}-${animateKey}`} className="mem-animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <rect
                                x={stackX + 10} y={y} width={340} height={frameH} rx="8"
                                fill={isTop ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.04)'}
                                stroke={isTop ? '#4f8cff' : 'rgba(255,255,255,0.1)'}
                                strokeWidth={isTop ? 2 : 1}
                                filter={isTop ? 'url(#glow)' : ''}
                            />
                            <text x={stackX + 24} y={y + 16} fill={isTop ? '#4f8cff' : '#aaa'} fontSize="11" fontWeight="700">
                                {String(frame.name).length > 45 ? String(frame.name).substring(0, 42) + '...' : frame.name}
                            </text>
                            {frame.vars && (
                                <text x={stackX + 24} y={y + 32} fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="'Fira Code', monospace">
                                    {frame.vars.map(v => `${v.name}: ${v.value}`).join(', ').length > 45
                                        ? frame.vars.map(v => `${v.name}: ${v.value}`).join(', ').substring(0, 42) + '...'
                                        : frame.vars.map(v => `${v.name}: ${v.value}`).join(', ')}
                                </text>
                            )}
                            {/* Arrow to heap if reference */}
                            {frame.refTo && (
                                <line
                                    x1={stackX + 350} y1={y + frameH / 2}
                                    x2={heapX} y2={startY + (frame.refTo * 70) + 25}
                                    stroke="#4f8cff" strokeWidth="1.5" strokeDasharray="4 3"
                                    markerEnd="url(#arrowBlue)"
                                    opacity="0.6"
                                />
                            )}
                        </g>
                    );
                })}

                {/* ===== HEAP MEMORY ===== */}
                <rect x={heapX} y={10} width={230} height={svgHeight - 20} rx="12" fill="url(#heapGrad)" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                <text x={heapX + 115} y={headerY} textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="700">🧠 HEAP MEMORY</text>

                {heap.length === 0 && (
                    <text x={heapX + 115} y={startY + 40} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12" fontStyle="italic">empty</text>
                )}

                {heap.map((obj, i) => {
                    const y = startY + i * 70;
                    const isNew = obj.isNew;
                    return (
                        <g key={`heap-${i}-${animateKey}`} className={isNew ? 'mem-animate-in' : ''} style={{ animationDelay: `${i * 0.15}s` }}>
                            <rect
                                x={heapX + 10} y={y} width={210} height={60} rx="8"
                                fill={isNew ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)'}
                                stroke={isNew ? '#a855f7' : 'rgba(255,255,255,0.1)'}
                                strokeWidth={isNew ? 2 : 1}
                                filter={isNew ? 'url(#glow)' : ''}
                            />
                            <text x={heapX + 20} y={y + 16} fill="#a855f7" fontSize="10" fontWeight="600">{obj.address || `0x${(1000 + i * 8).toString(16)}`}</text>
                            <text x={heapX + 200} y={y + 16} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">{obj.type}</text>

                            {/* Render array cells */}
                            {obj.type === 'Array' && obj.values && (
                                <g>
                                    {obj.values.slice(0, 6).map((val, vi) => {
                                        const maxItems = Math.min(obj.values.length, 6);
                                        const cellW = Math.min(28, 180 / maxItems);
                                        const cx = heapX + 18 + vi * (cellW + 2);
                                        const valStr = String(val.v);
                                        const displayVal = valStr.length > 4 ? valStr.substring(0, 3) + '..' : valStr;
                                        return (
                                            <g key={vi}>
                                                <rect x={cx} y={y + 24} width={cellW} height={28} rx="4"
                                                    fill={val.highlight ? 'rgba(79,140,255,0.2)' : 'rgba(255,255,255,0.06)'}
                                                    stroke={val.highlight ? '#4f8cff' : 'rgba(255,255,255,0.1)'}
                                                />
                                                <text x={cx + cellW / 2} y={y + 37} textAnchor="middle" fill={val.highlight ? '#4f8cff' : '#ccc'} fontSize="9" fontFamily="'Fira Code', monospace">{displayVal}</text>
                                                <text x={cx + cellW / 2} y={y + 52} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">[{vi}]</text>
                                            </g>
                                        );
                                    })}
                                    {obj.values.length > 6 && (
                                        <text x={heapX + 18 + 6 * (Math.min(28, 180 / 6) + 2) + 5} y={y + 40} fill="rgba(255,255,255,0.5)" fontSize="12">...</text>
                                    )}
                                </g>
                            )}

                            {/* Render object properties */}
                            {obj.type === 'Object' && obj.props && (() => {
                                const propsStr = obj.props.map(p => `${p.k}: ${p.v}`).join(', ');
                                const displayProps = propsStr.length > 30 ? propsStr.substring(0, 27) + '...' : propsStr;
                                return (
                                    <text x={heapX + 20} y={y + 40} fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="'Fira Code', monospace">
                                        {'{'} {displayProps} {'}'}
                                    </text>
                                );
                            })()}

                            {/* Render string */}
                            {obj.type === 'String' && (() => {
                                const valStr = String(obj.value);
                                const displayStr = valStr.length > 30 ? valStr.substring(0, 27) + '...' : valStr;
                                return (
                                    <text x={heapX + 20} y={y + 40} fill="#34d399" fontSize="11" fontFamily="'Fira Code', monospace">
                                        "{displayStr}"
                                    </text>
                                );
                            })()}
                        </g>
                    );
                })}

                {/* ===== OUTPUT CONSOLE ===== */}
                {output.length > 0 && (
                    <>
                        <rect x={outputX} y={10} width={280} height={Math.max(output.length * 22 + 50, 100)} rx="12" fill="url(#outputGrad)" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
                        <text x={outputX + 140} y={headerY} textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="700">💻 OUTPUT</text>
                        {output.map((line, i) => {
                            const lineStr = String(line);
                            const displayLine = lineStr.length > 40 ? lineStr.substring(0, 37) + '...' : lineStr;
                            return (
                                <text key={i} x={outputX + 12} y={startY + i * 22} fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="'Fira Code', monospace"
                                    className="mem-animate-in" style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {'>'} {displayLine}
                                </text>
                            );
                        })}
                    </>
                )}

                {/* Arrow marker */}
                <defs>
                    <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6 Z" fill="#4f8cff" />
                    </marker>
                </defs>
            </svg>
        </div>
    );
}
