import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { saveProgress } from '../features/reading/progressSlice';
import { createAnnotation, fetchAnnotations } from '../features/reading/annotationSlice';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker from CDN - using a more robust URL for version 10
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const colors = [
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff5722', // Deep Orange
    '#4caf50', // Green
    '#2196f3', // Blue
    '#9c27b0', // Purple
    '#e91e63'  // Pink
];

const InteractiveViewer = ({ projectId, versionId, filePath, initialPage = 1 }) => {
    const dispatch = useDispatch();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [selection, setSelection] = useState(null);
    const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
    const [showAnnotations, setShowAnnotations] = useState(true);
    const viewerRef = useRef(null);
    const pageWrapperRef = useRef(null);

    const { annotations } = useSelector(state => state.annotations);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (versionId) {
            dispatch(fetchAnnotations(versionId));
        }
    }, [versionId, dispatch]);

    // Sync page number when initialPage (from progress) loads
    useEffect(() => {
        if (initialPage && initialPage !== pageNumber) {
            setPageNumber(initialPage);
        }
    }, [initialPage]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const changePage = (offset) => {
        const newPage = Math.min(Math.max(pageNumber + offset, 1), numPages);
        setPageNumber(newPage);
        // Auto-save progress
        dispatch(saveProgress({ projectId, versionId, lastPage: newPage }));
    };

    const handleMouseUp = () => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0 && pageWrapperRef.current) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Get positions relative to the PAGE WRAPPER so highlights stay aligned
            const pageRect = pageWrapperRef.current.getBoundingClientRect();
            const viewerRect = viewerRef.current.getBoundingClientRect();

            setToolbarPos({
                top: rect.top - viewerRect.top - 55,
                left: rect.left - viewerRect.left + (rect.width / 2) - 100
            });

            setSelection({
                text: sel.toString(),
                rects: Array.from(range.getClientRects()).map(r => ({
                    top: r.top - pageRect.top,
                    left: r.left - pageRect.left,
                    width: r.width,
                    height: r.height
                }))
            });
        } else {
            setSelection(null);
        }
    };

    const applyHighlight = (color) => {
        if (!selection) return;

        const annotationData = {
            versionId,
            pageNumber,
            color,
            type: 'highlight',
            positionData: selection.rects,
            content: selection.text
        };

        dispatch(createAnnotation(annotationData));
        setSelection(null);
        window.getSelection().removeAllRanges();
    };

    return (
        <div className="pdf-viewer-container" ref={viewerRef} onMouseUp={handleMouseUp}>
            <div className="pdf-controls">
                <button onClick={() => changePage(-1)} disabled={pageNumber <= 1}>Previous</button>
                <span>Page {pageNumber} of {numPages}</span>
                <button onClick={() => changePage(1)} disabled={pageNumber >= numPages}>Next</button>
                <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowAnnotations(!showAnnotations)}
                        style={{ background: showAnnotations ? 'var(--primary-color)' : '#999', fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                    >
                        {showAnnotations ? 'Hide' : 'Show'} Annotations
                    </button>
                </div>
            </div>

            {selection && (
                <div className="floating-toolbar" style={{ top: toolbarPos.top, left: toolbarPos.left }}>
                    {colors.map(c => (
                        <div
                            key={c}
                            className="color-dot"
                            style={{ backgroundColor: c }}
                            onClick={() => applyHighlight(c)}
                        />
                    ))}
                </div>
            )}

            <div className="pdf-page-wrapper" ref={pageWrapperRef}>
                {filePath ? (
                    <Document
                        file={`http://localhost:5000/${filePath.replace(/\\/g, '/')}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div>Loading Document PDF...</div>}
                        cMapUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`}
                        cMapPacked={true}
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            width={window.innerWidth > 1200 ? 800 : 600}
                        />
                    </Document>
                ) : (
                    <div style={{ padding: '2rem' }}>No document file provided.</div>
                )}

                {/* Annotation Overlay */}
                {showAnnotations && (
                    <div className="highlight-layer">
                        {annotations
                            .filter(a => Number(a.page_number) === Number(pageNumber))
                            .map(ann => (
                                ann.position_data && ann.position_data.map((rect, idx) => (
                                    <div
                                        key={`${ann.id}-${idx}`}
                                        className="highlight-item"
                                        style={{
                                            top: rect.top,
                                            left: rect.left,
                                            width: rect.width,
                                            height: rect.height,
                                            backgroundColor: ann.color
                                        }}
                                        title={`Annotated by ${ann.username}`}
                                    />
                                ))
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveViewer;
