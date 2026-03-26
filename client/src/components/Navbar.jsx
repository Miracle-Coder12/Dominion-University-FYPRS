import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    Dominion <span>FYPRS</span>
                </Link>
                <div className="navbar-links">
                    <span className="user-welcome">Welcome, {user?.username}</span>
                    {user?.role === 'Admin' && (
                        <Link to="/admin" className="admin-link" style={{ marginRight: '1rem', color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
                            Admin Panel
                        </Link>
                    )}
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
