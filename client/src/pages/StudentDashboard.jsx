import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectSlice';
import { fetchRecentActivity } from '../features/reading/progressSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
    FileText,
    CheckCircle2,
    Clock,
    Eye,
    Bell,
    History,
    FileSignature,
    BookOpen,
    Search
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { projects, loading } = useSelector((state) => state.projects);
    const { recentActivity } = useSelector((state) => state.progress);

    useEffect(() => {
        dispatch(fetchProjects({ page: 1, limit: 100 }));
        dispatch(fetchRecentActivity());
    }, [dispatch]);

    const totalRead = recentActivity.length;
    
    // Fallbacks if data doesn't exist
    const currentlyReadingProject = recentActivity.length > 0 ? recentActivity[0] : null;

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-12 mt-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
                    <p className="text-gray-500 mt-1 uppercase text-xs font-bold tracking-widest leading-none">Welcome back, {user?.name || user?.username || 'Ayantunde Boluwatife Emmanuel'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => navigate('/projects')}
                        className="bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 font-bold rounded-2xl px-6 shadow-sm flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Search Projects
                    </Button>
                </div>
            </div>

            {/* Metrics Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative rounded-2xl border-gray-200 border-l-4 border-l-blue-600 p-6 flex flex-col justify-between overflow-hidden shadow-sm">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Projects Read</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalRead}</h3>
                    </div>
                    <div className="absolute top-6 right-6 p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText className="w-6 h-6" />
                    </div>
                </Card>

                <Card 
                    className="relative rounded-2xl border-gray-200 border-l-4 border-l-green-500 p-6 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden shadow-sm active:scale-95"
                    onClick={() => currentlyReadingProject && navigate(`/projects/${currentlyReadingProject.id}`)}
                >
                    <div className="pr-12">
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Currently Reading</p>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                            {currentlyReadingProject ? currentlyReadingProject.title : 'None selected'}
                        </h3>
                        {currentlyReadingProject && <p className="text-xs text-blue-600 font-bold mt-2">Resume Reading &rarr;</p>}
                    </div>
                    <div className="absolute top-6 right-6 p-2 bg-green-50 text-green-600 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                    </div>
                </Card>

                <Card className="relative rounded-2xl border-gray-200 border-l-4 border-l-yellow-500 p-6 flex flex-col justify-between overflow-hidden shadow-sm">
                    <div className="pr-12">
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Announcements</p>
                        <h3 className="text-sm font-medium text-gray-700 italic">No new announcements from lecturers.</h3>
                    </div>
                    <div className="absolute top-6 right-6 p-2 bg-yellow-50 text-yellow-600 rounded-xl">
                        <Bell className="w-6 h-6" />
                    </div>
                </Card>

                <Card 
                    className="relative rounded-2xl border-gray-200 border-l-4 border-l-orange-500 p-6 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-all overflow-hidden shadow-sm active:scale-95"
                    onClick={() => navigate('/history')}
                >
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Reading History</p>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1">See History</h3>
                        <p className="text-xs text-orange-600 font-bold mt-2">View History &rarr;</p>
                    </div>
                    <div className="absolute top-6 right-6 p-2 bg-orange-50 text-orange-600 rounded-xl">
                        <History className="w-6 h-6" />
                    </div>
                </Card>
            </div>

            {/* List of 5 Last Opened Projects */}
            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-gray-900">Recently Opened Projects</h3>
                <div className="grid gap-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                        <Card 
                            key={activity.id} 
                            className="p-5 flex items-center justify-between border border-gray-100 rounded-2xl hover:border-blue-200 cursor-pointer transition-colors hover:shadow-sm"
                            onClick={() => navigate(`/projects/${activity.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                                    <FileSignature className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{activity.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Last read page {activity.last_page}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-gray-500 rounded-xl">
                                <Eye className="w-4 h-4 mr-2" /> View
                            </Button>
                        </Card>
                    ))}
                    {recentActivity.length === 0 && !loading && (
                        <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 italic">
                            You haven't opened any projects yet. Check out the repository to start reading!
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-blue-50/60 border border-blue-100 p-8 rounded-3xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Rubric & Guides</h4>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">View the project rubric and guidelines provided by your supervisor.</p>
                    <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold shadow-sm rounded-xl h-11 px-6">View Guidelines</Button>
                </div>
                <div className="bg-green-50/60 border border-green-100 p-8 rounded-3xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Contact Supervisor</h4>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">Have questions? Reach out to your assigned supervisor directly.</p>
                    <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold shadow-sm rounded-xl h-11 px-6">Send Message</Button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
