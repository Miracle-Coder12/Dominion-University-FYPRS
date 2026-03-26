import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  GraduationCap, 
  ArrowRight, 
  Users, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  Database,
  BarChart3,
  CheckCircle2,
  Lock,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion } from 'motion/react';

const Home = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({
        students: '...',
        projects: '...',
        lecturers: '...',
        departments: '...'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/public/stats');
                setStatsData(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Active Students', value: `${statsData.students}+`, icon: Users },
        { label: 'Projects Submitted', value: `${statsData.projects}+`, icon: FileText },
        { label: 'Lecturers', value: `${statsData.lecturers}+`, icon: BookOpen },
        { label: 'Departments', value: `${statsData.departments}`, icon: Database },
    ];

    const features = [
        {
            title: 'For Students',
            description: 'Preview available projects, add annotations, and download research materials easily.',
            icon: GraduationCap,
            benefits: ['Preview available project and add annotations', 'Download available projects', 'Real-time status tracking']
        },
        {
            title: 'For Lecturers',
            description: 'Review submissions, provide detailed feedback, and manage student projects efficiently.',
            icon: Users,
            benefits: ['PDF preview & annotations', 'Streamlined approval workflow', 'Comment & feedback tools']
        },
        {
            title: 'For Administrators',
            description: 'Comprehensive management tools, analytics, and reporting for institutional oversight.',
            icon: ShieldCheck,
            benefits: ['User & department management', 'Advanced analytics & reports', 'System configuration']
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-900 leading-tight">Dominion University</h1>
                            <p className="text-xs text-gray-500 font-medium">Final Year Project Repository</p>
                        </div>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                        <Link to="/signup">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">Register</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 text-center lg:text-left">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-8"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Trusted by 5,000+ students
                                </motion.div>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8"
                                >
                                    Your Academic <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Excellence, Preserved Forever</span>
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed"
                                >
                                    The comprehensive platform for submitting, managing, and accessing final year projects. 
                                    Built for students, lecturers, and administrators at Dominion University.
                                </motion.p>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                                >
                                    <Button 
                                        onClick={() => navigate('/signup')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200 w-full sm:w-auto"
                                    >
                                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-7 rounded-2xl text-lg font-bold border-gray-200 hover:bg-gray-50 w-full sm:w-auto"
                                    >
                                        Browse Projects
                                    </Button>
                                </motion.div>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex-1 w-full max-w-xl"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[2.5rem] opacity-20 blur-2xl font-bold"></div>
                                    <div className="relative bg-gradient-to-tr from-blue-600 to-blue-500 rounded-[2rem] p-8 shadow-2xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 h-32 animate-pulse"></div>
                                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-24 animate-pulse"></div>
                                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-24 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything You Need in One Place</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">A complete ecosystem for academic project management and collaboration</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <feature.icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                            <p className="text-gray-600 mb-8 leading-relaxed">{feature.description}</p>
                                            <ul className="space-y-4">
                                                {feature.benefits.map((benefit, bIndex) => (
                                                    <li key={bIndex} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                                        <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        </div>
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-blue-600 py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-700 opacity-50 skew-y-3 origin-left scale-150"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center text-white">
                                    <div className="text-4xl lg:text-5xl font-extrabold mb-2">{stat.value}</div>
                                    <div className="text-blue-100 font-medium opacity-80 uppercase tracking-widest text-xs uppercase">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                            
                            <div className="relative z-10 max-w-3xl mx-auto font-bold text-lg">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Ready to Get Started?</h2>
                                <p className="text-blue-50 mb-12 text-lg lg:text-xl font-medium opacity-90">
                                    Join thousands of students and faculty members using our platform to manage academic excellence.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                                    <Button 
                                        onClick={() => navigate('/signup')}
                                        className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-7 rounded-2xl text-lg font-bold w-full sm:w-auto"
                                    >
                                        Create Account
                                    </Button>
                                    <Button 
                                        onClick={() => navigate('/login')}
                                        className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 rounded-2xl text-lg font-bold w-full sm:w-auto"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center gap-6">
                        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
                            <a href="#" className="hover:text-blue-600">About</a>
                            <a href="#" className="hover:text-blue-600">Help</a>
                            <Link to="/login" className="hover:text-blue-600">Login</Link>
                            <Link to="/admin/login" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                <Lock className="w-4 h-4" />
                                Admin Portal
                            </Link>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                            <p>© 2026 Dominion University. All rights reserved.</p>
                            <p className="mt-1">Final Year Project Repository System</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Help Icon */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/help')}
                className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-400 flex items-center justify-center z-50 hover:bg-blue-700 transition-colors"
                title="Need Help?"
            >
                <HelpCircle className="w-8 h-8" />
            </motion.button>
        </div>
    );
};

export default Home;
