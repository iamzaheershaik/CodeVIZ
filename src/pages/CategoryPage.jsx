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
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h1 className="text-3xl font-bold text-zinc-300">Category not found</h1>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className="flex flex-col gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col gap-4 border-b border-white/10 pb-10">
                <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                    <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">{category.name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-4 text-white">
                    <span className="p-3 bg-white/5 rounded-2xl border border-white/5">{category.icon}</span>
                    <span>{category.name}</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">{category.description}</p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {category.concepts.map((concept) => (
                    <Link key={concept.id} to={`/concept/${concept.id}`}>
                        <motion.div
                            className="flex flex-col h-full p-6 glass-panel rounded-2xl group hover:border-indigo-500/30 transition-colors"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
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
                                <span className="text-xs font-medium text-zinc-500">
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
