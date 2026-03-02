import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ConceptPage from './pages/ConceptPage';
import AIExplainPage from './pages/AIExplainPage';

export default function App() {
    return (
        <Router>
            <div className="app-layout">
                <div className="app-bg" />
                <Navbar />
                <main className="main-content">
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
