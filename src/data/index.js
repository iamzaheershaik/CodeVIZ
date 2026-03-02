import { javascriptConcepts } from './javascript';
import { reactConcepts } from './react';
import { nodejsConcepts } from './nodejs';
import { networkingConcepts } from './networking';
import { gitConcepts } from './git';
import { systemDesignConcepts } from './systemdesign';
import { pythonConcepts } from './python';

export const categories = [
    {
        id: 'javascript',
        name: 'JavaScript',
        icon: '⚡',
        color: 'blue',
        description: 'Core JS concepts: Event Loop, Closures, Promises, Prototypes, and more',
        concepts: javascriptConcepts,
    },
    {
        id: 'react',
        name: 'React',
        icon: '⚛️',
        color: 'cyan',
        description: 'Virtual DOM, Hooks lifecycle, State management, and rendering optimization',
        concepts: reactConcepts,
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        icon: '🟢',
        color: 'green',
        description: 'Event loop, Middleware, Streams, Cluster module, and scaling patterns',
        concepts: nodejsConcepts,
    },
    {
        id: 'networking',
        name: 'Computer Networking',
        icon: '🌐',
        color: 'purple',
        description: 'TCP/IP, DNS resolution, HTTP lifecycle, and the OSI model',
        concepts: networkingConcepts,
    },
    {
        id: 'git',
        name: 'Git',
        icon: '🔀',
        color: 'orange',
        description: 'Branching, Merge vs Rebase, Git internals, and undo strategies',
        concepts: gitConcepts,
    },
    {
        id: 'systemdesign',
        name: 'System Design',
        icon: '🏗️',
        color: 'pink',
        description: 'Load balancing, Caching, Database scaling, and Microservices',
        concepts: systemDesignConcepts,
    },
    {
        id: 'python',
        name: 'Python',
        icon: '🐍',
        color: 'red',
        description: 'GIL, Decorators, Generators, Context Managers, and memory management',
        concepts: pythonConcepts,
    },
];

export function getAllConcepts() {
    return categories.flatMap((cat) => cat.concepts);
}

export function getConceptById(id) {
    return getAllConcepts().find((c) => c.id === id);
}

export function getCategoryById(id) {
    return categories.find((cat) => cat.id === id);
}

export function searchConcepts(query) {
    const q = query.toLowerCase();
    return getAllConcepts().filter(
        (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
    );
}
