import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectDetails, uploadNewVersion } from '../features/projects/projectSlice';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentProject, loading, error } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);

    const [selectedVersion, setSelectedVersion] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [changeDesc, setChangeDesc] = useState('');
    const [file, setFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchProjectDetails(id));
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
    if (error) return <div className="error-message" style={{ textAlign: 'center', marginTop: '2rem' }}>{error}</div>;
    if (!currentProject || !currentProject.project) return null;

    const { project, versions } = currentProject;

    // Normalize path for Windows: replace \ with /
    const fileUrl = selectedVersion ? `http://localhost:5000/${selectedVersion.file_path.replace(/\\/g, '/')}` : '';

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => navigate('/dashboard')} style={{ width: 'auto', marginBottom: '1rem', background: 'none', color: 'var(--primary-color)', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                &larr; Back to Dashboard
            </button>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Sidebar / Info */}
                <div style={{ width: '300px', flexShrink: 0, overflowY: 'auto', paddingRight: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{project.title}</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                        Version {selectedVersion?.version_number}
                    </p>

                    <div style={{ marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select Version</label>
                        <select
                            value={selectedVersion?.id || ''}
                            onChange={handleVersionChange}
                            style={{ marginBottom: '1rem' }}
                        >
                            {versions.map(v => (
                                <option key={v.id} value={v.id}>
                                    v{v.version_number} - {new Date(v.upload_date).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>
                            "{selectedVersion?.change_description}"
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Abstract</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{project.description}</p>
                    </div>

                    {['Student'].includes(user?.role) && (
                        <div>
                            <button onClick={() => setShowUpload(!showUpload)} style={{ marginBottom: '1rem' }}>
                                {showUpload ? 'Cancel Update' : 'Upload New Version'}
                            </button>
                            {showUpload && (
                                <form onSubmit={handleFileUpload} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Change Description"
                                        value={changeDesc}
                                        onChange={(e) => setChangeDesc(e.target.value)}
                                        required
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <button type="submit" disabled={uploadLoading}>
                                        {uploadLoading ? 'Uploading...' : 'Submit Version'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Document Viewer */}
                <div style={{ flex: 1, background: '#e9ecef', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedVersion ? (
                        <iframe
                            src={fileUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="Document Viewer"
                        />
                    ) : (
                        <p>Select a version to view</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
