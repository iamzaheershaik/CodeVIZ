import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryById } from '../data';

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

export default function CategoryPage() {
    const { categoryId } = useParams();
    const category = getCategoryById(categoryId);

    if (!category) {
        return (
            <div className="category-page">
                <h1>Category not found</h1>
                <Link to="/" className="back-link">← Back to Home</Link>
            </div>
        );
    }

    return (
        <motion.div
            className="category-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="category-header">
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="sep">/</span>
                    <span>{category.name}</span>
                </div>
                <h1>
                    {category.icon} {category.name}
                </h1>
                <p>{category.description}</p>
            </div>

            <motion.div
                className="concepts-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {category.concepts.map((concept) => (
                    <Link key={concept.id} to={`/concept/${concept.id}`}>
                        <motion.div
                            className="concept-card glass-card"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="concept-icon">{concept.icon}</div>
                            <h3>{concept.title}</h3>
                            <p className="concept-desc">{concept.description}</p>
                            <div className="concept-meta">
                                <span className={`difficulty-badge ${concept.difficulty}`}>
                                    {concept.difficulty}
                                </span>
                                <span className="step-count">
                                    {concept.steps.length} step{concept.steps.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
}
