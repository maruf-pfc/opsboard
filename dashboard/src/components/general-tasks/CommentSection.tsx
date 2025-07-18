import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'; // Importing an icon for the post button

// Extend Comment interface to include profileImage for the author
interface Comment {
  _id: string;
  content: string;
  author: { name: string; profileImage?: string }; // Added profileImage
  createdAt: string;
  parentId?: string; // Added parentId for nested comments
}

type CommentSectionProps = {
  taskId: string;
  comments: Comment[];
  onUpdate: () => void;
};

export function CommentSection({
  taskId,
  comments,
  onUpdate,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    setIsPostingComment(true);
    try {
      await api.post(`/tasks/${taskId}/comments`, {
        content: newComment.trim(),
      });
      toast.success('Comment posted successfully!');
      setNewComment('');
      onUpdate(); // Trigger update in parent component (e.g., re-fetch task details)
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setIsPostingComment(false);
    }
  };

  // Filter top-level comments (those without a parentId)
  const topLevelComments = comments.filter((comment) => !comment.parentId);

  // Function to get replies for a given parent comment
  const getReplies = (parentCommentId: string) => {
    return comments
      .filter((comment) => comment.parentId === parentCommentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
      {' '}
      {/* Enhanced container styling */}
      <h4 className="text-lg font-bold text-gray-900 mb-4">
        Comments ({comments.length})
      </h4>
      {/* New Comment Input Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        {' '}
        {/* Added mb-6 */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          disabled={isPostingComment}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isPostingComment}
          className="mt-3 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isPostingComment ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 mr-2 -rotate-45" /> // Rotated icon
          )}
          Post Comment
        </button>
      </form>
      {/* Existing Comments */}
      {topLevelComments.length === 0 ? (
        <p className="text-sm text-gray-500 italic text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        // Added a fixed height with overflow-y-auto to ensure scrolling
        <div className="mt-4 space-y-6 h-96 overflow-y-auto pr-2">
          {' '}
          {/* Changed max-h-80 to fixed h-96 for consistent scroll */}
          {topLevelComments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              {/* Author Profile Image/Avatar */}
              <div className="flex-shrink-0">
                {comment.author.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-300 shadow-sm" // Styled image
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm border-2 border-indigo-300 shadow-sm">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                {' '}
                {/* Use flex-1 and min-w-0 for responsiveness */}
                <p className="text-sm mb-1">
                  <span className="font-bold text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className="text-gray-500 ml-3 text-xs">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </p>
                <p className="text-gray-800 bg-gray-100 p-3 rounded-lg mt-1 break-words shadow-sm border border-gray-200">
                  {' '}
                  {/* Enhanced styling */}
                  {comment.content}
                </p>
                {/* Replies (if any) */}
                {getReplies(comment._id).length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {' '}
                    {/* Indented replies */}
                    {getReplies(comment._id).map((reply) => (
                      <div key={reply._id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          {reply.author.profileImage ? (
                            <img
                              src={reply.author.profileImage}
                              alt={reply.author.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-purple-300 shadow-sm"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-xs border-2 border-purple-300 shadow-sm">
                              {reply.author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs mb-1">
                            <span className="font-bold text-gray-800">
                              {reply.author.name}
                            </span>
                            <span className="text-gray-500 ml-2 text-xs">
                              {formatDistanceToNow(new Date(reply.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </p>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded-lg mt-1 break-words shadow-sm border border-gray-100">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
