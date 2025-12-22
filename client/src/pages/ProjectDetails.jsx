import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectDetails, uploadNewVersion } from '../features/projects/projectSlice';
import { fetchProgress } from '../features/reading/progressSlice';
import InteractiveViewer from '../components/InteractiveViewer';
import AnnotationPanel from '../components/AnnotationPanel';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentProject, loading, error } = useSelector((state) => state.projects);
    const { lastPage } = useSelector((state) => state.progress);
    const { user } = useSelector((state) => state.auth);

    const [selectedVersion, setSelectedVersion] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [changeDesc, setChangeDesc] = useState('');
    const [file, setFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchProjectDetails(id));
        dispatch(fetchProgress(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProject?.versions?.length > 0) {
            // Default to the first version in the list (which is usually latest based on ordering)
            // Or find is_current
            const current = currentProject.versions.find(v => v.is_current) || currentProject.versions[0];
            setSelectedVersion(current);
        }
    }, [currentProject]);

    const handleVersionChange = (e) => {
        const verId = parseInt(e.target.value);
        const version = currentProject.versions.find(v => v.id === verId);
        setSelectedVersion(version);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('change_description', changeDesc);
        formData.append('projectFile', file);

        // This action needs to be defined in slice or call axios directly for now if thunk not made
        // I made 'createProject' but not 'uploadNewVersion'? 
        // Let's implement generic axios call here or add thunk. 
        // Adding thunk later, using axios for speed now or check existence.
        // My plan didn't explicitly implement `uploadVersion` thunk code block, I only did `createProject`.
        // I'll assume I need to add it or do it here. 
        // Wait, I did check `projectSlice.js` content. It has `fetchProjects`, `createProject`, `fetchProjectDetails`.
        // It MISSES `uploadVersion`. I will implement it here with direct Axios for now to save a turn or add it to slice.
        // Direct axios is faster.

        try {
            const result = await dispatch(uploadNewVersion({ id, formData }));
            if (uploadNewVersion.fulfilled.match(result)) {
                dispatch(fetchProjectDetails(id)); // Refresh
                setShowUpload(false);
                setChangeDesc('');
                setFile(null);
            } else {
                alert("Upload failed: " + result.payload);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploadLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading project...</div>;
    if (error) return <div className="error-message" style={{ textAlign: 'center', marginTop: '5rem' }}>{error}</div>;
    if (!currentProject || !currentProject.project) return null;

    const { project, versions } = currentProject;

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
            <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ width: 'auto', background: 'white', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '0.5rem 1rem' }}
                >
                    &larr; Dashboard
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{project.title}</h1>
            </header>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <aside style={{ width: '320px', flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="auth-card" style={{ padding: '1.25rem', textAlign: 'left', alignItems: 'flex-start' }}>
                        <label style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Version History</label>
                        <select
                            value={selectedVersion?.id || ''}
                            onChange={handleVersionChange}
                            style={{ marginBottom: '1rem' }}
                        >
                            {versions.map(v => (
                                <option key={v.id} value={v.id}>
                                    v{v.version_number} ({new Date(v.upload_date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', borderLeft: '3px solid #ddd', paddingLeft: '0.75rem' }}>
                            {selectedVersion?.change_description}
                        </p>
                    </div>

                    <AnnotationPanel versionId={selectedVersion?.id} />

                    <div style={{ padding: '0 0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Abstract</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                            {project.description}
                        </p>
                    </div>

                    {['Student', 'Admin'].includes(user?.role) && (
                        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                            <button onClick={() => setShowUpload(!showUpload)} style={{ marginBottom: '1rem', backgroundColor: showUpload ? '#666' : 'var(--primary-color)' }}>
                                {showUpload ? 'Cancel' : 'Upload Revision'}
                            </button>
                            {showUpload && (
                                <div className="auth-card" style={{ padding: '1rem' }}>
                                    <form onSubmit={handleFileUpload}>
                                        <input
                                            type="text"
                                            placeholder="What changed?"
                                            value={changeDesc}
                                            onChange={(e) => setChangeDesc(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            required
                                        />
                                        <button type="submit" disabled={uploadLoading}>
                                            {uploadLoading ? 'Uploading...' : 'Upload v' + (versions.length + 1)}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </aside>

                {/* Main Viewer Area */}
                <section style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#f0f2f5', borderRadius: '12px' }}>
                    {selectedVersion ? (
                        <InteractiveViewer
                            projectId={id}
                            versionId={selectedVersion.id}
                            filePath={selectedVersion.file_path}
                            initialPage={lastPage}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <p>Loading document...</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProjectDetails;
