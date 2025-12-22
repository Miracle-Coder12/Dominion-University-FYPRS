import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject } from '../features/projects/projectSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { projects, loading, error } = useSelector((state) => state.projects);
    const [showUpload, setShowUpload] = useState(false);

    // Upload Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('projectFile', file);

        const result = await dispatch(createProject(formData));
        if (createProject.fulfilled.match(result)) {
            setShowUpload(false);
            setTitle('');
            setDescription('');
            setFile(null);
            dispatch(fetchProjects()); // Refresh list
        } else {
            alert("Upload failed: " + result.payload);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Academic Repository</h1>
                    <p style={{ color: 'var(--text-light)' }}>Welcome, {user?.username} ({user?.role})</p>
                </div>
                {['Student', 'Admin'].includes(user?.role) && (
                    <button onClick={() => setShowUpload(!showUpload)} style={{ width: 'auto' }}>
                        {showUpload ? 'Cancel Upload' : 'Upload New Project'}
                    </button>
                )}
            </header>

            {showUpload && (
                <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    <h3>Upload Project</h3>
                    <form onSubmit={handleUpload}>
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Abstract / Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Project Document (PDF/DOC)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Submit Project'}
                        </button>
                    </form>
                </div>
            )}

            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {projects.map((project) => (
                    <div key={project.id} className="auth-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{project.title}</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            By {project.student_name} • {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                            {project.description?.substring(0, 100)}...
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', background: '#eef2f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                v{project.version_number}
                            </span>
                            {/* Future: Link to Details Page */}
                            <button style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !loading && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-light)' }}>
                        No projects found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
