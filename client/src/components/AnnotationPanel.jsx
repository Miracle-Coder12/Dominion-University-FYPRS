import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../features/reading/annotationSlice';

const AnnotationPanel = ({ versionId }) => {
    const dispatch = useDispatch();
    const { annotations, loading } = useSelector(state => state.annotations);
    const [commentText, setCommentText] = useState('');
    const [selectedAnn, setSelectedAnn] = useState(null);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentText || !selectedAnn) return;

        dispatch(addComment({ annotationId: selectedAnn.id, commentText }));
        setCommentText('');
    };

    return (
        <div className="annotation-panel" style={{ padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Annotations</h3>

            <div className="annotations-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                {annotations.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem' }}>No highlights yet.</p>}

                {annotations.map(ann => (
                    <div
                        key={ann.id}
                        onClick={() => setSelectedAnn(ann)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: selectedAnn?.id === ann.id ? '#f0f7ff' : '#f9f9f9',
                            borderLeft: `4px solid ${ann.color}`,
                            marginBottom: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <p style={{ fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Page {ann.page_number}</p>
                        <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.25rem 0', fontStyle: 'italic' }}>
                            "{ann.content?.substring(0, 50)}..."
                        </p>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>By {ann.username}</span>
                    </div>
                ))}
            </div>

            {selectedAnn && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Add Comment</h4>
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Type a comment..."
                            style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', minHeight: '60px' }}
                        />
                        <button type="submit" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AnnotationPanel;
