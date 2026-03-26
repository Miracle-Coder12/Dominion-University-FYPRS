import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { saveProgress } from '../features/reading/progressSlice';
import { createAnnotation, fetchAnnotations, addComment } from '../features/reading/annotationSlice';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize,
    Highlighter,
    Eye,
    EyeOff,
    Search,
    MousePointer2,
    Trash2,
    CheckCircle2,
    X,
    MessageCircle,
    Send
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const highlightColors = [
    { name: 'Yellow', value: '#ffeb3b', text: 'text-yellow-600' },
    { name: 'Amber', value: '#ffc107', text: 'text-amber-600' },
    { name: 'Green', value: '#4caf50', text: 'text-green-600' },
    { name: 'Blue', value: '#2196f3', text: 'text-blue-600' },
    { name: 'Purple', value: '#9c27b0', text: 'text-purple-600' },
    { name: 'Pink', value: '#e91e63', text: 'text-pink-600' },
    { name: 'Orange', value: '#ff9800', text: 'text-orange-600' }
];

const InteractiveViewer = ({ projectId, versionId, filePath, initialPage = 1 }) => {
    const dispatch = useDispatch();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [scale, setScale] = useState(1.2);
    const [selection, setSelection] = useState(null);
    const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
    const [showAnnotations, setShowAnnotations] = useState(true);
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    const [commentText, setCommentText] = useState('');
    const viewerRef = useRef(null);
    const pageWrapperRef = useRef(null);

    const { annotations } = useSelector(state => state.annotations);
    const { user } = useSelector(state => state.auth);

    const currentAnnotation = selectedAnnotation ? annotations.find((a) => a.id === selectedAnnotation.id) || selectedAnnotation : null;

    useEffect(() => {
        if (versionId) {
            dispatch(fetchAnnotations(versionId));
        }
    }, [versionId, dispatch]);

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
        dispatch(saveProgress({ projectId, versionId, lastPage: newPage }));
    };

    const handleMouseUp = () => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0 && pageWrapperRef.current) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const pageRect = pageWrapperRef.current.getBoundingClientRect();
            const viewerRect = viewerRef.current.getBoundingClientRect();

            setToolbarPos({
                top: rect.top - viewerRect.top - 65,
                left: rect.left - viewerRect.left + (rect.width / 2) - 130
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

        dispatch(createAnnotation({
            versionId,
            pageNumber,
            color,
            type: 'highlight',
            positionData: selection.rects,
            content: selection.text
        }));
        setSelection(null);
        window.getSelection().removeAllRanges();
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 rounded-3xl relative overflow-hidden select-none" ref={viewerRef} onMouseUp={handleMouseUp}>
            {/* Contextual Toolbar for Selections */}
            {selection && (
                <div
                    className="absolute z-50 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-blue-100 flex items-center gap-2 animate-in fade-in zoom-in-95"
                    style={{ top: toolbarPos.top, left: toolbarPos.left }}
                >
                    <div className="flex items-center gap-1 border-r border-gray-100 pr-2 mr-1">
                        <Highlighter className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Highlight</span>
                    </div>
                    <div className="flex gap-1.5">
                        {highlightColors.map(c => (
                            <button
                                key={c.value}
                                className="w-5 h-5 rounded-full border border-white shadow-sm ring-1 ring-black/5 hover:scale-125 hover:rotate-12 transition-all cursor-pointer"
                                style={{ backgroundColor: c.value }}
                                onClick={() => applyHighlight(c.value)}
                                title={c.name}
                            />
                        ))}
                    </div>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-red-50 hover:text-red-500 rounded-md">
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}

            {/* Viewer Controls - Floating Top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-white/50 ring-1 ring-black/5">
                <div className="flex items-center gap-1 mr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-gray-100"
                        disabled={pageNumber <= 1}
                        onClick={() => changePage(-1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex flex-col items-center min-w-[80px]">
                        <p className="text-[10px] font-bold text-gray-400 leading-none uppercase tracking-widest">Page</p>
                        <p className="text-xs font-bold text-gray-900 tabular-nums">{pageNumber} <span className="text-gray-300 mx-1">/</span> {numPages || '...'}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-gray-100"
                        disabled={pageNumber >= numPages}
                        onClick={() => changePage(1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className="flex items-center gap-1 mx-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-mono text-[10px] px-2 py-0 border-none h-6">
                        {Math.round(scale * 100)}%
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className="flex gap-1 ml-2">
                    <Button
                        variant={showAnnotations ? "default" : "ghost"}
                        size="icon"
                        className={`h-8 w-8 rounded-xl transition-all ${showAnnotations ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400'}`}
                        onClick={() => setShowAnnotations(!showAnnotations)}
                        title={showAnnotations ? "Hide Reviews" : "Show Reviews"}
                    >
                        {showAnnotations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-gray-400 group">
                        <Maximize className="w-4 h-4 group-hover:text-blue-600" />
                    </Button>
                </div>
            </div>

            {/* Scrollable View Area */}
            <div className="flex-1 overflow-auto custom-scrollbar flex justify-center py-20 px-4 scroll-smooth">
                <div
                    className="relative shadow-2xl shadow-blue-900/20 bg-white ring-1 ring-black/10 origin-top transition-transform duration-200 select-text"
                    ref={pageWrapperRef}
                    style={{ transform: `scale(${scale})` }}
                >
                    {filePath ? (
                        <Document
                            file={filePath.startsWith('http') ? filePath : `http://localhost:5000/${filePath.replace(/\\/g, '/')}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="p-20 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-400 font-medium">Rendering PDF Engine...</p>
                                </div>
                            }
                            cMapUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`}
                            cMapPacked={true}
                        >
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                width={800}
                                className="shadow-none border-none"
                            />
                        </Document>
                    ) : (
                        <div className="p-20 text-center text-gray-400 italic">No document binary stream detected.</div>
                    )}

                    {/* Highly precise Annotation Overlay */}
                    {showAnnotations && (
                        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300">
                            {annotations
                                .filter(a => Number(a.page_number) === Number(pageNumber))
                                .map(ann => (
                                    ann.position_data && ann.position_data.map((rect, idx) => (
                                        <div
                                            key={`${ann.id}-${idx}`}
                                            className="absolute opacity-40 hover:opacity-60 transition-opacity mix-blend-multiply cursor-help pointer-events-auto"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAnnotation(ann);
                                            }}
                                            style={{
                                                top: rect.top,
                                                left: rect.left,
                                                width: rect.width,
                                                height: rect.height,
                                                backgroundColor: ann.color
                                            }}
                                            title={`Review by ${ann.username}`}
                                        />
                                    ))
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Panel */}
            {currentAnnotation && (
                <div className="absolute top-4 right-4 z-50 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col max-h-[80%] animate-in slide-in-from-right-8">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            Comments
                        </h3>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedAnnotation(null)} className="h-8 w-8 hover:bg-gray-100 rounded-full">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 text-sm border-b border-gray-100 flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full mt-1 shrink-0 ring-4 ring-white shadow-sm" style={{ backgroundColor: currentAnnotation.color }} />
                        <p className="font-medium text-gray-700 italic line-clamp-3">"{currentAnnotation.content}"</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {(!currentAnnotation.comments || currentAnnotation.comments.length === 0) ? (
                            <p className="text-sm text-gray-400 text-center py-8">No comments yet. Start the discussion!</p>
                        ) : (
                            currentAnnotation.comments.map((comment, i) => (
                                <div key={comment.id || i} className="bg-gray-50 rounded-xl p-3 text-sm">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="font-bold text-gray-900">{comment.user_name || comment.username || 'User'}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(comment.created_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && commentText.trim()) {
                                        dispatch(addComment({ annotationId: currentAnnotation.id, content: commentText.trim() }));
                                        setCommentText('');
                                    }
                                }}
                                placeholder="Add a comment..."
                                className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                            />
                            <Button
                                onClick={() => {
                                    if(commentText.trim()) {
                                        dispatch(addComment({ annotationId: currentAnnotation.id, content: commentText.trim() }));
                                        setCommentText('');
                                    }
                                }}
                                disabled={!commentText.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Status Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-40 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3" /> Select text to add review highlights</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="flex items-center gap-1.5 text-blue-600/70"><CheckCircle2 className="w-3 h-3 text-blue-500" /> SECURED BY DOMINION REPOSITORY</span>
                </div>
                <div>PDF v1.7 • {filePath?.split('.').pop()?.toUpperCase() || 'N/A'}</div>
            </div>
        </div>
    );
};

export default InteractiveViewer;
