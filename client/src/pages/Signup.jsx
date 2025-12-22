import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Student',
        department_id: 1
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const departments = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Information Technology' },
        { id: 3, name: 'Software Engineering' }
    ];

    const roles = ['Student', 'Lecturer'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getRoleId = (roleName) => {
        switch (roleName) {
            case 'Student': return 2;
            case 'Lecturer': return 3;
            default: return 2;
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                role_id: getRoleId(formData.role)
            });
            alert('Registration Successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <div className="auth-card">
                <img src="/logo.svg" alt="Dominion University" className="auth-logo" />
                <h2>Create Account</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Join the academic community</p>

                <form onSubmit={submitForm}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
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

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select name="department_id" value={formData.department_id} onChange={handleChange}>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>

                        <select name="role" value={formData.role} onChange={handleChange} style={{ width: '140px' }}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
