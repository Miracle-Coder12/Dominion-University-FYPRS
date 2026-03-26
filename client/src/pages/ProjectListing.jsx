import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectSlice';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    ArrowLeft,
    FileText,
    Users,
    Calendar,
    ChevronDown,
    LayoutGrid
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'motion/react';

const ProjectListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projects, pagination, loading } = useSelector((state) => state.projects);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        department: '',
        supervisor: '',
        year: ''
    });

    useEffect(() => {
        dispatch(fetchProjects({ 
            search: searchTerm, 
            department: filters.department,
            supervisor: filters.supervisor,
            year: filters.year,
            page,
            limit: 25
        }));
    }, [dispatch, searchTerm, filters, page]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const renderPagination = () => {
        const { totalPages, page: currentPage } = pagination;
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="rounded-lg px-4 h-10 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                
                <div className="flex items-center gap-2 mx-4">
                    {pages.map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                p === currentPage
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className="rounded-lg px-4 h-10 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dominion Repository</h1>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Search projects by title, keyword, or abstract..."
                                className="w-full pl-12 pr-4 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-xl transition-all"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(-1)}
                        className="rounded-xl text-gray-600 hover:bg-gray-100 px-4 h-11"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
                {/* Advanced Filters Card */}
                <Card className="rounded-2xl border-gray-100 shadow-sm overflow-visible bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                            <Filter className="w-4 h-4" />
                            <span>Advanced Filters</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Department</label>
                                <div className="relative">
                                    <select
                                        value={filters.department}
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="">All Departments</option>
                                        <option value="1">Computer Science</option>
                                        <option value="2">Information Tech</option>
                                        <option value="3">Software Eng</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Supervisor</label>
                                <div className="relative">
                                    <select
                                        value={filters.supervisor}
                                        onChange={(e) => handleFilterChange('supervisor', e.target.value)}
                                        className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="">All Supervisors</option>
                                        <option value="1">Dr. Ayediran</option>
                                        <option value="2">Mrs. Ogundipe</option>
                                        <option value="3">Mr. Ige</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Year</label>
                                <div className="relative">
                                    <select
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="">All Years</option>
                                        <option value="2027">2027</option>
                                        <option value="2026">2026</option>
                                        <option value="2025">2025</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{pagination.totalProjects || 0} Projects Found</h2>
                    </div>
                    <div className="text-sm font-bold text-gray-400">
                        Page {pagination.page || 1} of {pagination.totalPages || 1}
                    </div>
                </div>

                {/* Project List */}
                <div className="space-y-4">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4"
                            >
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-50"></div>
                                <p className="text-lg font-bold">Scanning Repository...</p>
                            </motion.div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="group rounded-2xl border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 bg-white">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h3 className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors leading-tight">
                                                                    {project.title} {project.volume ? `(Vol. ${project.volume})` : ''}
                                                                </h3>
                                                                <Badge variant="secondary" className="bg-gray-50 text-gray-500 font-bold border-none h-7 px-3">
                                                                    {project.year || '2027'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-gray-500 text-sm line-clamp-2 mt-2 leading-relaxed">
                                                                {project.abstract || 'A comprehensive research project focusing on modern technological solutions and academic excellence in the current landscape...'}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-50">
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <LayoutGrid className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm font-medium">{project.department_name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <Users className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm font-medium">{project.supervisor_name || 'Dr. Supervisor'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex md:flex-col items-center justify-center border-l border-gray-50 pl-6 min-w-[160px]">
                                                        <Button 
                                                            onClick={() => navigate(`/projects/${project.id}`)}
                                                            variant="outline"
                                                            className="w-full rounded-xl border-gray-200 h-11 font-bold group-hover:border-blue-600 group-hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    We couldn't find any projects matching your search or filters. Try adjusting your criteria.
                                </p>
                                <Button 
                                    variant="link" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilters({ department: '', supervisor: '', year: '' });
                                    }}
                                    className="text-blue-600 font-bold mt-4"
                                >
                                    Clear all filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pagination Section */}
                    {projects.length > 0 && renderPagination()}
                </div>

                {/* Footer Search Section */}
                {!loading && (
                    <div className="mt-20 text-center space-y-6 pt-12 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-gray-400 underline decoration-gray-200 underline-offset-8">Can't find what you're looking for?</h3>
                        <div className="max-w-xl mx-auto relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Refine your search..."
                                className="w-full pl-12 pr-4 h-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-2xl transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectListing;
