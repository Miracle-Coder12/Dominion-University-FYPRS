import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Upload,
    FileText,
    Type,
    AlignLeft,
    Building2,
    ShieldCheck,
    AlertCircle,
    X,
    FileCheck,
    Loader2
} from 'lucide-react';
import { createProject, extractMetadata } from '../features/projects/projectSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Separator } from '../components/ui/Separator';
import { motion, AnimatePresence } from 'motion/react';

const ProjectUpload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
        agreed: false
    });

    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFormData({ ...formData, file: selectedFile });
            if (selectedFile.type === 'application/pdf') {
                await runMetadataExtraction(selectedFile);
            }
        }
    };

    const runMetadataExtraction = async (file) => {
        const data = new FormData();
        data.append('projectFile', file);
        const result = await dispatch(extractMetadata(data));
        if (extractMetadata.fulfilled.match(result)) {
            const { title, description } = result.payload;
            setFormData(prev => ({
                ...prev,
                title: title || prev.title,
                description: description || prev.description
            }));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFormData({ ...formData, file: selectedFile });
            if (selectedFile.type === 'application/pdf') {
                await runMetadataExtraction(selectedFile);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file || !formData.agreed) return;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('projectFile', formData.file);

        const result = await dispatch(createProject(data));
        if (createProject.fulfilled.match(result)) {
            navigate('/dashboard');
        } else {
            alert("Upload failed: " + result.payload);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Submission</h1>
                <p className="text-gray-500 mt-1">Submit your final year research for peer review and repository archiving.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Project Details</CardTitle>
                            <CardDescription>Enter the basic information about your research work.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase text-gray-400">Project Title</Label>
                                <div className="relative group">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="title"
                                        placeholder="e.g. Design of an AI-Driven Academic Repository"
                                        className="pl-10 h-12 bg-gray-50/50 rounded-xl"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase text-gray-400">Executive Summary / Abstract</Label>
                                <div className="relative group">
                                    <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <textarea
                                        id="description"
                                        placeholder="Briefly describe your research findings and methodology..."
                                        className="w-full min-h-[160px] pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none text-sm leading-relaxed"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Upload Area */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Project Document</CardTitle>
                            <CardDescription>Upload research files (PDF, DOCX, PPTX, XLSX, ZIP) - Max 25MB.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50/50'
                                    } ${formData.file ? 'border-green-300 bg-green-50/30' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <AnimatePresence mode="wait">
                                    {formData.file ? (
                                        <motion.div
                                            key="selected"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center gap-3 text-center"
                                        >
                                            <div className="bg-green-100 p-4 rounded-2xl text-green-600 shadow-sm">
                                                <FileCheck className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{formData.file.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                    {(formData.file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                                                onClick={() => setFormData({ ...formData, file: null })}
                                            >
                                                <X className="w-3.5 h-3.5 mr-2" />
                                                Remove and Change
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center gap-4 text-center"
                                        >
                                            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                                                <Upload className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Drag & drop your files here</p>
                                                <p className="text-xs text-gray-500 mt-1">or click the button below to browse your files</p>
                                            </div>
                                            <label className="cursor-pointer">
                                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" onChange={handleFileChange} />
                                                <div className="bg-white px-6 py-2 rounded-xl text-sm font-bold border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                    Browse Explorer
                                                </div>
                                            </label>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Policies & Action */}
                <aside className="space-y-6">
                    <Card className="rounded-2xl border-gray-200 shadow-sm border-t-4 border-t-blue-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                Integrity Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                                    By submitting, you certify that this work is original and adheres to the university's academic integrity standards.
                                </p>
                            </div>

                            <div className="flex items-start gap-3 mt-4">
                                <input
                                    type="checkbox"
                                    id="agreed"
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                    checked={formData.agreed}
                                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                    required
                                />
                                <Label htmlFor="agreed" className="text-[11px] text-gray-500 leading-tight block">
                                    I confirm that I have reviewed the <span className="text-blue-600 font-bold hover:underline cursor-pointer">Submission Guidelines</span> and consent to peer review.
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button
                            type="submit"
                            className="w-full py-7 rounded-2xl text-md font-bold shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
                            disabled={loading || !formData.file || !formData.agreed}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing Submission...
                                </>
                            ) : (
                                <>
                                    <FileCheck className="w-5 h-5 mr-2" />
                                    Finish Submission
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full py-6 rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel and Discard
                        </Button>
                    </div>

                    <Separator className="my-6" />

                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Support Line</p>
                        <p className="text-xs text-gray-700 font-semibold mt-1">support@dominion.edu.ng</p>
                    </div>
                </aside>
            </form>
        </div>
    );
};

export default ProjectUpload;
