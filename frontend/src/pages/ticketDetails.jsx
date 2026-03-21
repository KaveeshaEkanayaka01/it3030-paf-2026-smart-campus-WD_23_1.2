import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  Wrench,
} from 'lucide-react';
import { getCurrentUserId, ticketService } from '../services/ticketService';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { CommentSection } from '../components/commentSection';
import { cn } from '../utils/cn';

const UPDATE_STATUSES = ['IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const currentUserId = getCurrentUserId() || 'wd23-student';

  const mapCommentForUI = (comment) => ({
    id: String(comment.id),
    text: comment.message || '',
    authorName: comment.createdBy || 'Unknown',
    authorId: comment.createdBy || '',
    createdAt: comment.createdAt || new Date().toISOString(),
  });

  const loadComments = useCallback(async (ticketId) => {
    const commentData = await ticketService.getTicketComments(ticketId);
    setComments((commentData || []).map(mapCommentForUI));
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) {
        setError('Invalid ticket id.');
        setLoading(false);
        return;
      }

      try {
        const [ticketData, attachmentData] = await Promise.all([
          ticketService.getTicketById(id),
          ticketService.getTicketAttachments(id),
        ]);
        setTicket(ticketData);
        setAttachments(attachmentData || []);
        await loadComments(id);
      } catch (err) {
        console.error('Failed to fetch ticket:', err);
        setError('Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, loadComments]);

  const handleAddComment = async (text) => {
    if (!id) {
      return;
    }

    try {
      await ticketService.addComment(id, text, currentUserId);
      await loadComments(id);
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!id) {
      return;
    }

    try {
      await ticketService.deleteComment(commentId);
      await loadComments(id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment.');
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!id || !ticket || statusUpdating) {
      return;
    }

    setStatusUpdating(true);
    try {
      const updated = await ticketService.updateStatus(id, status);
      setTicket(updated || { ...ticket, status });
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update ticket status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">{error}</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">Ticket not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="group mb-10 flex items-center gap-2 text-zinc-500 transition-colors hover:text-black"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Tickets</span>
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <div className="border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-black">{ticket.category || 'Ticket'}</h1>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ticket ID: #{ticket.id}</p>
              </div>
              <TicketStatusBadge status={ticket.status} />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 border-y border-zinc-100 py-6 md:grid-cols-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Created By</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase text-black">
                  <User size={14} />
                  <span>{ticket.createdBy || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Date</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase text-black">
                  <Calendar size={14} />
                  <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Location</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase text-black">
                  <MapPin size={14} />
                  <span>{ticket.location || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
                <FileText size={16} />
                Description
              </h3>
              <p className="border border-zinc-100 bg-zinc-50 p-4 text-sm font-medium leading-relaxed text-zinc-700">
                {ticket.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
                <ImageIcon size={16} />
                Attachments ({attachments.length})
              </h3>

              {attachments.length === 0 ? (
                <p className="text-sm font-medium text-zinc-500">No attachments uploaded for this ticket.</p>
              ) : (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2">
                      <span className="truncate text-xs font-semibold text-zinc-700">{attachment.fileName}</span>
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{attachment.fileType || 'file'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-zinc-100 pt-8">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="border-2 border-black bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
              <Wrench size={16} />
              Technician Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {UPDATE_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(status)}
                  className={cn(
                    'border px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all',
                    ticket.status === status
                      ? 'border-black bg-black text-white'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-black hover:text-black',
                    statusUpdating ? 'cursor-not-allowed opacity-50' : '',
                  )}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {ticket.assignedTechnician && (
            <div className="bg-black p-8 text-white shadow-lg">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Assigned Technician</p>
              <p className="mt-3 text-lg font-black uppercase tracking-tight">{ticket.assignedTechnician}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
