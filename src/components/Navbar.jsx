import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">⚙️</div>
                    <span>CodeViz</span>
                </Link>
                <div className="navbar-links">
                    <Link
                        to="/ai-explain"
                        className={`ai-nav-link ${location.pathname === '/ai-explain' ? 'active' : ''}`}
                    >
                        🤖 AI Explain
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            className={location.pathname.includes(cat.id) ? 'active' : ''}
                        >
                            {cat.icon} {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
