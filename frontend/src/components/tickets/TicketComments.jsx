import { useState, useEffect } from 'react';
import { commentApi } from '../../api/commentApi';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TicketComments({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const loadComments = async () => {
    try {
      const res = await commentApi.getComments(ticketId);
      setComments(res.data);
    } catch {
      toast.error('Failed to load comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await commentApi.addComment(ticketId, newComment);
      setComments(prev => [...prev, res.data]);
      setNewComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const res = await commentApi.updateComment(commentId, editContent);
      setComments(prev => prev.map(c => c.id === commentId ? res.data : c));
      setEditingId(null);
      toast.success('Comment updated');
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentApi.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        💬 Comments ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              {comment.authorAvatar && (
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <span className="font-medium text-sm text-gray-800">
                  {comment.authorName}
                </span>
                {comment.edited && (
                  <span className="text-xs text-gray-400 ml-2">(edited)</span>
                )}
                <p className="text-xs text-gray-400">
                  {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {editingId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-sm">{comment.content}</p>
            )}

            {comment.isOwner && editingId !== comment.id && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-lg p-3 text-sm
                     resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 self-end py-3"
        >
          <FaPaperPlane size={16} />
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}