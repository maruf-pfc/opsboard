import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    content: string;
    author: { name: string; };
    createdAt: string;
}

type CommentSectionProps = {
    taskId: string;
    comments: Comment[];
    onUpdate: () => void;
}

export function CommentSection({ taskId, comments, onUpdate }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tasks/${taskId}/comments`, { content: newComment });
            toast.success('Comment posted!');
            setNewComment('');
            onUpdate();
        } catch (error) {
            toast.error('Failed to post comment.');
        }
    };

    return (
        <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-800">Comments</h4>
            <form onSubmit={handleAddComment} className="mt-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
                <button type="submit" className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                    Post Comment
                </button>
            </form>
            <div className="mt-4 space-y-4">
                {comments.map(comment => (
                    <div key={comment._id} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                           {comment.author.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm">
                                <span className="font-semibold">{comment.author.name}</span>
                                <span className="text-gray-500 ml-2">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </p>
                            <p className="text-gray-700 bg-gray-100 p-2 rounded-md mt-1">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}