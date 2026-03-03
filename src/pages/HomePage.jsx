import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, searchConcepts } from '../data';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        return searchConcepts(searchQuery);
    }, [searchQuery]);

    return (
        <div className="flex flex-col gap-16 pt-10">
            {/* Hero */}
            <motion.section
                className="text-center max-w-4xl mx-auto px-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Interactive architecture visualizer
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Visualize <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">Code Concepts</span>
                    <br />Instantly
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Pick any concept from JavaScript, React, Node.js, Networking, Git,
                    System Design, or Python — get an interactive flowchart with
                    step-by-step animated explanations.
                </p>
            </motion.section>

            {/* Search */}
            <div className="max-w-2xl w-full mx-auto relative z-10 px-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search concepts... (e.g. Event Loop, Closures, TCP)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl text-lg text-white placeholder-zinc-500 shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                </div>
                
                <div className="mt-8 text-center">
                    <Link to={`/ai-explain`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-zinc-300 hover:text-white hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all">
                        <span>🤖</span>
                        <span>Can't find what you need?</span>
                        <strong className="text-indigo-300">Ask AI to explain any concept &rarr;</strong>
                    </Link>
                </div>
            </div>

            {/* Search Results */}
            {searchResults && (
                <motion.div
                    className="flex flex-col gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h2 className="text-2xl font-bold text-center">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {searchResults.map((concept) => (
                            <Link key={concept.id} to={`/concept/${concept.id}`}>
                                <motion.div className="flex flex-col h-full p-6 glass-panel rounded-2xl group hover:border-indigo-500/30 transition-colors" whileHover={{ scale: 1.02 }}>
                                    <div className="text-4xl mb-4 p-4 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">{concept.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">{concept.title}</h3>
                                    <p className="text-zinc-400 text-sm flex-grow mb-6 leading-relaxed">{concept.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                            concept.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            concept.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            concept.difficulty === 'Advanced' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            concept.difficulty === 'Expert' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                            {concept.difficulty}
                                        </span>
                                        <span className="text-xs font-medium text-zinc-500">{concept.steps.length} steps</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                        {searchResults.length === 0 && (
                            <p className="text-zinc-500 text-center col-span-full py-12">
                                No concepts found. Try a different search term.
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Categories Grid */}
            {!searchResults && (
                <motion.section
                    className="flex flex-col gap-10 mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Explore by Category</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/category/${cat.id}`}>
                                <motion.div
                                    className="flex flex-col items-center text-center p-8 glass-panel rounded-3xl group hover:border-white/20 transition-colors h-full"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="text-5xl mb-6 p-4 rounded-2xl bg-white/5 drop-shadow-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all">{cat.icon}</div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400">{cat.name}</h3>
                                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed px-4">{cat.description}</p>
                                    
                                    <div className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/5 text-xs font-semibold text-zinc-300 group-hover:bg-white/10 transition-colors">
                                        <span>📚</span>
                                        <span>{cat.concepts.length} Concept{cat.concepts.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            )}
        </div>
    );
}
