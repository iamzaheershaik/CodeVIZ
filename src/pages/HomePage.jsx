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
        <div className="home-page">
            {/* Hero */}
            <motion.section
                className="hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>
                    Visualize <span className="gradient-text">Code Concepts</span>
                    <br />Instantly
                </h1>
                <p>
                    Pick any concept from JavaScript, React, Node.js, Networking, Git,
                    System Design, or Python — get an interactive flowchart with
                    step-by-step animated explanations.
                </p>
            </motion.section>

            {/* Search */}
            <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search concepts... (e.g. Event Loop, Closures, TCP)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="search-input"
                />
            </div>
            <div style={{ textAlign: 'center', marginTop: '-40px', marginBottom: '40px' }}>
                <Link to={`/ai-explain`} className="ai-cta-link">
                    🤖 Can't find what you need? <strong>Ask AI to explain any concept →</strong>
                </Link>
            </div>

            {/* Search Results */}
            {searchResults && (
                <motion.div
                    className="categories-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h2>
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </h2>
                    <div className="concepts-grid">
                        {searchResults.map((concept) => (
                            <Link key={concept.id} to={`/concept/${concept.id}`}>
                                <motion.div className="concept-card glass-card" whileHover={{ scale: 1.02 }}>
                                    <div className="concept-icon">{concept.icon}</div>
                                    <h3>{concept.title}</h3>
                                    <p className="concept-desc">{concept.description}</p>
                                    <div className="concept-meta">
                                        <span className={`difficulty-badge ${concept.difficulty}`}>
                                            {concept.difficulty}
                                        </span>
                                        <span className="step-count">{concept.steps.length} steps</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                        {searchResults.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                                No concepts found. Try a different search term.
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Categories Grid */}
            {!searchResults && (
                <motion.section
                    className="categories-section"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2>Explore by Category</h2>
                    <div className="category-grid">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/category/${cat.id}`}>
                                <motion.div
                                    className="category-card glass-card"
                                    data-color={cat.color}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="category-icon">{cat.icon}</div>
                                    <h3>{cat.name}</h3>
                                    <p>{cat.description}</p>
                                    <div className="category-count">
                                        📚 {cat.concepts.length} concept{cat.concepts.length !== 1 ? 's' : ''}
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
