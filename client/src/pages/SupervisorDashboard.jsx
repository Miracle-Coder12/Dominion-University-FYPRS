import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
    Users,
    CheckCircle,
    Clock,
    Search,
    Filter,
    ArrowRight,
    Eye,
    MessageSquare,
    AlertCircle,
    Plus,
    FileCheck,
    FileText,
    LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';

const SupervisorDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { projects, loading } = useSelector((state) => state.projects);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Filter projects for the dashboard
    const pendingProjects = projects.filter(p => p.status === 'Pending' || !p.status);
    const approvedProjects = projects.filter(p => p.status === 'Approved');

    useEffect(() => {
        dispatch(fetchProjects({ search: searchTerm, page }));
    }, [dispatch, searchTerm, page]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lecturer Dashboard</h1>
                    <p className="text-gray-500 mt-1">Review student submissions and manage project approvals.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => navigate('/projects/upload')} className="rounded-xl shadow-lg shadow-blue-100 py-6">
                        <Plus className="w-5 h-5 mr-2" />
                        New Submission
                    </Button>
                    <Button 
                        onClick={handleLogout}
                        className="rounded-xl shadow-lg bg-white text-red-600 hover:bg-red-50 py-6 px-8 border border-red-100 font-bold"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                    </Button>
                </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area: Pending Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Pending Reviews</CardTitle>
                                <CardDescription>Projects awaiting your evaluation and feedback.</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-100 px-3 py-1">
                                {pendingProjects.length} Action Required
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="relative group mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    placeholder="Filter pending projects by student name or topic..."
                                    className="pl-10 bg-gray-50/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Projects Table-like List */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Project Topic</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">Loading submissions...</td>
                                            </tr>
                                        ) : pendingProjects.length > 0 ? (
                                            pendingProjects.map((project) => (
                                                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-900 leading-tight mb-1">{project.title}</p>
                                                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0">
                                                            {project.department_name}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{project.student_name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                        {new Date(project.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-none h-8"
                                                            onClick={() => navigate(`/projects/${project.id}`)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Review
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/30">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                                        <p>Great job! All submissions have been reviewed.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Notifications / Alerts */}
                    <Card className="rounded-2xl border-gray-200 shadow-sm border-t-4 border-t-purple-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-purple-600" />
                                System Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                <p className="text-xs font-bold text-purple-700 mb-1 leading-none uppercase tracking-wider">Upcoming Deadline</p>
                                <p className="text-sm text-purple-900 font-medium leading-tight">Project submission phase ends in 3 days.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-700 mb-1 leading-none uppercase tracking-wider">New Forum Message</p>
                                <p className="text-sm text-blue-900 font-medium leading-tight">Research coordination meeting at 2:00 PM.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions / Resources */}
                    <Card className="rounded-2xl border-gray-200 shadow-sm bg-gray-900 text-white overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-bold">Resources</CardTitle>
                            <CardDescription className="text-gray-400">Supervisor toolkits and rubrics.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-6">
                            {[
                                { name: 'Grading Rubric v2.1', size: '1.2 MB' },
                                { name: 'Thesis Formatting Guide', size: '4.5 MB' },
                                { name: 'Anti-Plagiarism Policy', size: '0.8 MB' }
                            ].map((doc) => (
                                <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <div>
                                            <p className="text-sm font-semibold">{doc.name}</p>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{doc.size}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-gray-500" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
