import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';

export const CommentSection = ({ comments, onAddComment, onDeleteComment, currentUserId }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-black font-black border-b border-zinc-100 pb-6">
        <MessageSquare size={20} className="text-black" />
        <h2 className="uppercase tracking-widest text-sm">Comments ({comments.length})</h2>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-zinc-50 rounded-none p-6 border border-zinc-100"
          >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-black flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-black uppercase tracking-tight">{comment.authorName}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {comment.authorId === currentUserId && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-2 text-zinc-300 hover:text-black transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                {comment.text}
              </p>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-xs font-bold uppercase tracking-widest italic">No comments yet.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-white border border-zinc-200 rounded-none p-6 pr-16 text-sm focus:border-black outline-none transition-all min-h-[120px] resize-none font-medium"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="absolute bottom-6 right-6 p-3 bg-black text-white rounded-none hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
