import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../features/reading/annotationSlice';
import { MessageSquare, Send, User, Clock, Bookmark } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';


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
        <Card className="rounded-2xl border-gray-200 flex flex-col h-full overflow-hidden shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-sm flex items-center gap-2 font-bold text-gray-900">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Review Annotations
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {annotations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                        <div className="bg-gray-50 p-3 rounded-2xl mb-3">
                            <Bookmark className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">No highlights have been added to this version yet.</p>
                    </div>
                ) : (
                    annotations.map(ann => (
                        <div
                            key={ann.id}
                            onClick={() => setSelectedAnn(ann)}
                            className={`p-4 rounded-2xl transition-all cursor-pointer border-l-4 group relative ${selectedAnn?.id === ann.id
                                ? 'bg-blue-50/50 border-l-blue-600 shadow-sm'
                                : 'bg-gray-50/50 border-l-gray-200 hover:border-l-blue-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Page {ann.page_number}</span>
                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Just now
                                </span>
                            </div>
                            <p className="text-xs text-gray-700 italic leading-relaxed mb-3 line-clamp-2">
                                "{ann.content}"
                            </p>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100/50">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                                    {ann.username?.substring(0, 2)}
                                </div>
                                <span className="text-[10px] text-gray-500 font-semibold">{ann.username}</span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>

            {selectedAnn && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <form onSubmit={handleAddComment} className="relative">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your review comment..."
                            className="w-full text-xs p-3 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none bg-white min-h-[80px]"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute bottom-3 right-3 h-8 w-8 rounded-lg shadow-lg shadow-blue-200"
                            disabled={!commentText.trim()}
                        >
                            <Send className="w-3 h-3" />
                        </Button>
                    </form>
                    <p className="text-[9px] text-gray-400 mt-2 text-center">Press Enter to post your comment</p>
                </div>
            )}
        </Card>
    );
};

export default AnnotationPanel;
