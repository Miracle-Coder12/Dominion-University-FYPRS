import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="auth-card">
                <img src="/logo.svg" alt="Dominion University" className="auth-logo" />
                <h2>Welcome Back</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Login to your account</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
