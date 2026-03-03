import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ConceptPage from './pages/ConceptPage';
import AIExplainPage from './pages/AIExplainPage';

export default function App() {
    return (
        <Router>
            <div className="relative flex min-h-screen flex-col !overflow-x-hidden selection:bg-primary/30">
                {/* Global glowing orb background */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
                    <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-[120px]" />
                </div>
                
                <Navbar />
                
                <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col gap-12">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryId" element={<CategoryPage />} />
                        <Route path="/concept/:conceptId" element={<ConceptPage />} />
                        <Route path="/ai-explain" element={<AIExplainPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
