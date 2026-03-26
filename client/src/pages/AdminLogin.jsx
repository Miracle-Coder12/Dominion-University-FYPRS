import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginUser } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent } from '../components/ui/Card';
import { motion } from 'motion/react';

const AdminLogin = () => {
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
            // Check if user is actually an admin
            const user = result.payload.user;
            if (user.role === 'Admin') {
                navigate('/admin/users');
            } else {
                // If not admin, they shouldn't be here
                alert('Access Denied: Admin privileges required.');
                // Optionally log them out or redirect
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[500px] space-y-8"
            >
                {/* Back Link */}
                <Link 
                    to="/" 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group w-fit mx-auto"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 relative">
                        <GraduationCap className="w-8 h-8 text-white" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-lg border-2 border-white flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Portal</h1>
                        <p className="text-gray-500">Secure Institutional Access</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-8 md:p-10 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Administrative Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@dominion.edu"
                                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                                    <Link to="/forgot-password" virtual="true" className="text-xs font-bold text-blue-600 hover:underline underline-offset-4 transition-all">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-md font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying Credentials...
                                    </div>
                                ) : "Sign In to Portal"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-400 font-medium tracking-wide uppercase">
                    Institutional Access Only • Secured by RSA
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
