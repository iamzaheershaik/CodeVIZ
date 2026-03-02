import mermaid from 'mermaid';

export function initMermaid() {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
            darkMode: true,
            background: '#0a0a0f',
            primaryColor: '#1e3a5f',
            primaryTextColor: '#f0f0f5',
            primaryBorderColor: '#4f8cff',
            lineColor: '#4f8cff',
            secondaryColor: '#3b1f5e',
            tertiaryColor: '#1a1a2e',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            nodeBorder: '2px',
        },
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
            nodeSpacing: 50,
            rankSpacing: 60,
        },
        securityLevel: 'loose',
    });
}

export async function renderMermaid(id, definition) {
    try {
        const { svg } = await mermaid.render(id, definition);
        return svg;
    } catch (err) {
        console.error('Mermaid render error:', err);
        return `<div style="color: #f87171; padding: 20px;">Diagram render error</div>`;
    }
}
