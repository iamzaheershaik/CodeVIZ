import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="fixed top-4 left-4 right-4 h-16 bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex justify-center transition-all shadow-2xl">
            <div className="w-full max-w-7xl px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
                    <div className="text-2xl animate-[spin_20s_linear_infinite]">⚙️</div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400">CodeViz</span>
                </Link>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
                    <Link
                        to="/ai-explain"
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                            location.pathname === '/ai-explain' 
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                            : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                        🤖 AI Explain
                    </Link>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    {categories.map((cat) => {
                        const isActive = location.pathname.includes(cat.id);
                        return (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.id}`}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                                    isActive
                                    ? 'bg-white/10 text-white shadow-inner border border-white/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
