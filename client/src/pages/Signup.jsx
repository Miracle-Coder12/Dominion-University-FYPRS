import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Building, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { motion, AnimatePresence } from 'motion/react';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Student');
    const [formData, setFormData] = useState({
        full_name: '',
        matric_number: '',
        email: '',
        password: '',
        confirmPassword: '',
        department_id: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const departments = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Information Technology' },
        { id: 3, name: 'Software Engineering' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getRoleId = (roleName) => {
        switch (roleName) {
            case 'Student': return 2;
            case 'Lecturer': return 3; // Lecturer role_id is 3 based on init_db.js
            default: return 2;
        }
    }

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.department_id) {
            setError('Please select a department');
            return false;
        }
        return true;
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        try {
            // Generate a username from email or name if required by backend, 
            // but controller seems to take 'username' explicitly. 
            // Let's use name without spaces for username.
            const username = formData.full_name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

            await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                username: username,
                role_id: getRoleId(role)
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[600px] space-y-8"
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
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h1>
                        <p className="text-gray-500">Join Dominion University's Project Repository</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-8 md:p-10 space-y-8">
                        {/* Role Switcher */}
                        <Tabs defaultValue="Student" onValueChange={setRole} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 h-12 rounded-xl">
                                <TabsTrigger value="Student" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all font-medium">Student</TabsTrigger>
                                <TabsTrigger value="Lecturer" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all font-medium">Lecturer</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form onSubmit={submitForm} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            placeholder="John Doe"
                                            className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="matric_number" className="text-sm font-semibold text-gray-700">
                                        {role === 'Student' ? 'Matric Number' : 'Staff ID'}
                                    </Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="matric_number"
                                            name="matric_number"
                                            placeholder={role === 'Student' ? "DU0851" : "STF9981"}
                                            className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                            value={formData.matric_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department_id" className="text-sm font-semibold text-gray-700">Department</Label>
                                <div className="relative group">
                                    <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                                    <select
                                        id="department_id"
                                        name="department_id"
                                        className="w-full h-12 pl-10 pr-10 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm appearance-none outline-none text-gray-600"
                                        value={formData.department_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select your department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={role === 'Student' ? "student@dominion.edu" : "staff@dominion.edu"}
                                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-medium flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Account created successfully! Redirecting to login...
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-md font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : "Create Account"}
                            </Button>
                        </form>

                        <div className="pt-2 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Signup;
