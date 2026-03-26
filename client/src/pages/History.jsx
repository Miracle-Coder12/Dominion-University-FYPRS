import React from 'react';
import { Card } from '../components/ui/Card';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reading History</h1>
                <p className="text-gray-500 mt-1">Review all the projects you have explored.</p>
            </div>
            
            <Card className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white text-gray-500 italic">
                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <HistoryIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 not-italic">No history records found yet.</h3>
                <p className="mt-2 max-w-xs mx-auto">Start reading projects from the repository to build your reading history.</p>
            </Card>
        </div>
    );
};

export default History;
