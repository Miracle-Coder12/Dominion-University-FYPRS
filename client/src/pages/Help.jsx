import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageCircle, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { motion } from 'motion/react';

const Help = () => {
    const navigate = useNavigate();

    const contacts = [
        {
            role: 'System Administrator',
            name: 'Dominion IT Support',
            email: 'admin-support@dominion.edu',
            phone: '+234 800 DOMINION',
            icon: ShieldCheck,
            color: 'bg-blue-600'
        },
        {
            role: 'Academic Coordinator',
            name: 'Prof. Adebayo',
            email: 'coordinator@dominion.edu',
            phone: '+234 801 223 4455',
            icon: GraduationCap,
            color: 'bg-indigo-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="mb-8 group"
                >
                    <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help?</h1>
                    <p className="text-gray-600 text-lg">Contact our administration or academic staff for assistance with your projects.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow">
                                <CardHeader className={`${contact.color} text-white p-8`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-white/20 p-3 rounded-2xl">
                                            <contact.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{contact.role}</p>
                                            <CardTitle className="text-2xl font-bold">{contact.name}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                                            <p className="font-semibold">{contact.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                                            <p className="font-semibold">{contact.phone}</p>
                                        </div>
                                    </div>
                                    <Button className={`w-full py-6 rounded-2xl font-bold ${contact.color} text-white hover:opacity-90`}>
                                        <MessageCircle className="mr-2 w-5 h-5" />
                                        Send Message
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">FAQs & Documentation</h2>
                    <p className="text-gray-500 mb-6">Find quick answers to common questions about project submission and approval.</p>
                    <Button variant="outline" className="rounded-xl px-8 border-gray-200">
                        View Knowledge Base
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Help;
