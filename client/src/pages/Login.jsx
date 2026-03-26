import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginUser } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { motion } from 'motion/react';

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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-200">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <h1 className="font-bold text-2xl text-gray-900 tracking-tight">Dominion University</h1>
                        <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mt-1">Project Repository</p>
                    </div>
                </div>

                <Card className="border-gray-200 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@university.edu"
                                        className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all py-6 h-12"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" virtual="true" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all py-6 h-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-6 h-12 rounded-xl text-md font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Sign in</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8 border-t border-gray-50 pt-6 mt-2">
                        <p className="text-sm text-center text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="mt-8 text-center text-xs text-gray-400 font-medium">
                    &copy; 2026 Dominion University. Secured Academic Repository.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
