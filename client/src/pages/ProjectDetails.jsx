import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Download,
    Eye,
    Info,
    MessageSquare,
    User,
    Building2,
    Calendar,
    GraduationCap,
    CheckCircle2,
    Send,
    FileText,
    Bookmark,
    MoreVertical,
    Share2,
    ArrowLeft
} from 'lucide-react';
import { fetchProjectDetails } from '../features/projects/projectSlice';
import { fetchProgress } from '../features/reading/progressSlice';
import InteractiveViewer from '../components/InteractiveViewer';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentProject, loading, error } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);
    const { lastPage } = useSelector((state) => state.progress);

    const [activeTab, setActiveTab] = useState('preview');
    const [selectedVersion, setSelectedVersion] = useState(null);

    useEffect(() => {
        dispatch(fetchProjectDetails(id));
        dispatch(fetchProgress(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProject?.versions?.length > 0) {
            const current = currentProject.versions.find(v => v.is_current) || currentProject.versions[0];
            setSelectedVersion(current);
        }
    }, [currentProject]);

    const handleDownload = () => {
        const filePath = selectedVersion?.file_path || currentProject?.versions?.find(v => v.is_current)?.file_path;
        if (filePath) {
            const url = filePath.startsWith('http') ? filePath : `http://localhost:5000/${filePath.replace(/\\/g, '/')}`;
            window.open(url, '_blank');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-50"></div>
            <p className="text-gray-500 font-bold">Opening academic records...</p>
        </div>
    );

    if (error || !currentProject?.project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-3xl m-8 border border-gray-100 shadow-sm">
            <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
                <Info className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
            <p className="text-gray-500 mt-2 max-w-md">{error || "The requested project could not be located in the repository."}</p>
            <Button onClick={() => navigate('/projects')} variant="primary" className="mt-8 rounded-2xl px-8 h-12">
                Return to Repository
            </Button>
        </div>
    );

    const { project } = currentProject;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Navigation Bar */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/projects')}
                            className="rounded-xl hover:bg-gray-100 px-3 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span className="font-bold">Back</span>
                        </Button>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-gray-900 leading-none flex items-center gap-3">
                                {project.title}
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-bold">
                                    Approved
                                </Badge>
                            </h1>
                            <p className="text-sm font-bold text-gray-400 mt-1">Review and provide feedback on the project submission</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                            <Share2 className="w-5 h-5 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </Button>
                        <Button 
                            onClick={handleDownload}
                            className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm font-bold rounded-xl h-11 px-6 ml-2 flex items-center gap-2 group transition-all"
                        >
                            <Download className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {/* Meta Information Bar */}
                <Card className="rounded-3xl border-gray-100 shadow-sm bg-white overflow-hidden mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Student</p>
                                    <h4 className="font-bold text-gray-900 leading-tight">{project.student_name}</h4>
                                    <p className="text-xs font-bold text-gray-400">{project.matric_number || 'DU0851'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Department</p>
                                    <h4 className="font-bold text-gray-900 leading-tight">{project.department_name}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Submitted</p>
                                    <h4 className="font-bold text-gray-900 leading-tight">{new Date(project.created_at).toLocaleDateString()}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Supervisor</p>
                                    <h4 className="font-bold text-gray-900 leading-tight">{project.supervisor_name || 'Miss Aromavo'}</h4>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* Tab Control */}
                        <div className="bg-gray-100/50 p-1.5 rounded-2xl flex items-center gap-1.5 w-fit">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-8 h-10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'preview'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-8 h-10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                                    activeTab === 'details'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                            >
                                <FileText className="w-4 h-4" />
                                Details
                            </button>
                        </div>

                        {/* Animated Tab Content */}
                        <AnimatePresence mode='wait'>
                            {activeTab === 'preview' ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm h-[800px] overflow-hidden relative flex flex-col group"
                                >
                                    {selectedVersion ? (
                                        <InteractiveViewer
                                            projectId={id}
                                            versionId={selectedVersion.id}
                                            filePath={selectedVersion.file_path}
                                            initialPage={lastPage}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[400px]">
                                            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                            <p className="text-gray-400 text-sm italic">Synchronizing binary stream...</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <Card className="rounded-3xl border-gray-100 shadow-sm bg-white overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className="space-y-8">
                                                <section>
                                                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                                                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                                        Abstract
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed text-lg italic">
                                                        {project.description || "Project metadata analysis and abstract content..."}
                                                    </p>
                                                </section>

                                                <section>
                                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                                        Project Information
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Status', value: project.status || 'Approved', isStatus: true },
                                                            { label: 'Student Name', value: project.student_name },
                                                            { label: 'Matric Number', value: project.matric_number || 'DU0851' },
                                                            { label: 'Department', value: project.department_name },
                                                            { label: 'Submission Date', value: new Date(project.created_at).toLocaleDateString() },
                                                            { label: 'Grade', value: project.grade || 'A', isGrade: true }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
                                                                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase tracking-widest">{item.label}</span>
                                                                {item.isStatus ? (
                                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1 font-black text-xs uppercase">
                                                                        {item.value}
                                                                    </Badge>
                                                                ) : item.isGrade ? (
                                                                    <span className="text-2xl font-black text-gray-900">{item.value}</span>
                                                                ) : (
                                                                    <span className="font-black text-gray-900 text-lg">{item.value}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Approval Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50/50 border border-green-100 rounded-[2rem] p-8 flex flex-col items-center gap-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CheckCircle2 className="w-32 h-32" />
                            </div>
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600 border border-green-50 z-10">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="text-center z-10">
                                <h4 className="text-xl font-black text-green-900">Project Approved</h4>
                                <p className="text-green-700 font-bold text-sm mt-1 uppercase tracking-widest">Grade Achieved: {project.grade || 'A'}</p>
                            </div>
                        </motion.div>

                        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-blue-600 p-8 text-white relative overflow-hidden">
                            <div className="absolute -bottom-8 -right-8 opacity-10">
                                <Bookmark className="w-40 h-40 rotate-12" />
                            </div>
                            <h3 className="text-xl font-black mb-4">Reading Progress</h3>
                            <p className="text-blue-100 font-medium text-sm leading-relaxed mb-6">Your progress is automatically saved as you read through the repository.</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>Current Page</span>
                                    <span>{lastPage || 1} / {project.total_pages || '...'}</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
