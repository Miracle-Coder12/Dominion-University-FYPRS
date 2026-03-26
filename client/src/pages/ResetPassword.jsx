import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { KeyRound, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Something went wrong');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    to="/login" 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group w-fit mx-auto"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Login
                </Link>

                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
                        <p className="text-gray-500">Enter your new password below</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-8 md:p-10 space-y-8">
                        <AnimatePresence mode="wait">
                            {!success ? (
                                <motion.form 
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit} 
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
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
                                                Resetting...
                                            </div>
                                        ) : "Reset Password"}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900">Password Reset</h2>
                                        <p className="text-gray-500">
                                            Your password has been successfully reset. Redirecting to login...
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
