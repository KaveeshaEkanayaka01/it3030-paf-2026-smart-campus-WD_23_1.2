import React, { useState } from 'react';
import { MessageSquare, Pencil, Send, Trash2, User } from 'lucide-react';

const isPrivilegedRole = (role) => ['ADMIN', 'STAFF', 'TECHNICIAN'].includes(String(role || '').toUpperCase());

export const CommentSection = ({ comments, onAddComment, onDeleteComment, onUpdateComment, currentUserId, currentUserRole }) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState('');
  const [editingText, setEditingText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text || '');
  };

  const cancelEditing = () => {
    setEditingCommentId('');
    setEditingText('');
  };

  const submitEdit = async (commentId) => {
    if (!editingText.trim()) {
      return;
    }

    await onUpdateComment(commentId, editingText.trim());
    cancelEditing();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-slate-100 font-bold border-b border-white/10 pb-6">
        <MessageSquare size={20} className="text-fuchsia-400" />
        <h2 className="uppercase tracking-widest text-sm">Comments ({comments.length})</h2>
      </div>

      <div className="space-y-5 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="glass-panel rounded-2xl p-6 transition-all hover:glass-panel-strong"
          >
              {(() => {
                const canManage = comment.isOwner || comment.authorId === currentUserId || isPrivilegedRole(currentUserRole);
                const isEditing = editingCommentId === comment.id;

                return (
                  <>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100 tracking-tight">{comment.authorName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1 backdrop-blur-sm border border-white/10">
                    <button
                      onClick={() => (isEditing ? cancelEditing() : startEditing(comment))}
                      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-3 mt-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full glass-input rounded-xl p-4 text-sm font-medium"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => submitEdit(comment.id)}
                      className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-lg bg-white/10 px-5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/20 transition-all border border-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed font-light mt-2 bg-black/20 rounded-xl p-4 border border-white/5">
                  {comment.text}
                </p>
              )}
                  </>
                );
              })()}
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl flex justify-center items-center opacity-60">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <MessageSquare size={14} />
              No comments yet
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full glass-input rounded-2xl p-6 pr-16 text-sm min-h-[140px] resize-none font-medium shadow-inner"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="absolute bottom-6 right-6 p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:scale-110 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
        </button>
      </form>
    </div>
  );
};
