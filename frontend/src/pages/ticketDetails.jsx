import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  User,
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  MessageCircleWarning,
  Wrench,
} from 'lucide-react';
import { getCurrentUserId, getCurrentUserRole, ticketService } from '../services/ticketService';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { CommentSection } from '../components/commentSection';
import { cn } from '../utils/cn';

const UPDATE_STATUSES = ['IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIVILEGED_ROLES = ['ADMIN', 'STAFF', 'TECHNICIAN'];

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [technician, setTechnician] = useState('');
  const [assigning, setAssigning] = useState(false);
  const currentUserId = getCurrentUserId() || 'wd23-student';
  const currentUserRole = getCurrentUserRole();
  const canManageTicket = PRIVILEGED_ROLES.includes(currentUserRole);

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
      await ticketService.deleteComment(commentId, currentUserId, currentUserRole);
      await loadComments(id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment.');
    }
  };

  const handleUpdateComment = async (commentId, text) => {
    if (!id) {
      return;
    }

    try {
      await ticketService.updateComment(commentId, text, currentUserId, currentUserRole);
      await loadComments(id);
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError('Failed to update comment.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!id || !ticket || statusUpdating || !canManageTicket) {
      return;
    }

    if (selectedStatus === 'REJECTED' && !rejectionReason.trim()) {
      setError('Rejection reason is required when setting status to REJECTED.');
      return;
    }

    setStatusUpdating(true);
    setError('');
    try {
      const updated = await ticketService.updateStatus(
        id,
        selectedStatus,
        currentUserRole,
        resolutionNotes,
        rejectionReason,
      );
      setTicket(updated || { ...ticket, status: selectedStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || 'Failed to update ticket status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!id || !canManageTicket || !technician.trim()) {
      return;
    }

    setAssigning(true);
    setError('');
    try {
      const updated = await ticketService.assignTechnician(id, technician.trim(), currentUserRole);
      setTicket(updated || { ...ticket, assignedTechnician: technician.trim() });
      setTechnician('');
    } catch (err) {
      console.error('Failed to assign technician:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || 'Failed to assign technician.');
    } finally {
      setAssigning(false);
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

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Preferred Contact</p>
                <p className="mt-2 text-sm font-semibold text-zinc-700">{ticket.preferredContact || 'N/A'}</p>
              </div>
              <div className="border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Resolution Notes</p>
                <p className="mt-2 text-sm font-semibold text-zinc-700">{ticket.resolutionNotes || 'N/A'}</p>
              </div>
            </div>

            {ticket.status === 'REJECTED' && (
              <div className="mt-4 border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-700">
                  <MessageCircleWarning size={14} />
                  Rejection Reason
                </p>
                <p className="mt-2 text-sm font-semibold text-red-700">{ticket.rejectionReason || 'N/A'}</p>
              </div>
            )}

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
                onUpdateComment={handleUpdateComment}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
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
            <div className="space-y-3">
              {!canManageTicket && (
                <p className="text-xs font-semibold text-zinc-500">
                  Status updates are available only for ADMIN/STAFF/TECHNICIAN roles.
                </p>
              )}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={!canManageTicket || statusUpdating}
                className="w-full border border-zinc-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black disabled:opacity-60"
              >
                {UPDATE_STATUSES.map((status) => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>

              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Resolution notes (used for RESOLVED/CLOSED updates)"
                disabled={!canManageTicket || statusUpdating}
                rows={3}
                className="w-full border border-zinc-300 bg-white px-3 py-2 text-xs outline-none focus:border-black disabled:opacity-60"
              />

              {selectedStatus === 'REJECTED' && (
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Rejection reason (required for REJECTED)"
                  disabled={!canManageTicket || statusUpdating}
                  rows={3}
                  className="w-full border border-red-300 bg-red-50 px-3 py-2 text-xs outline-none focus:border-red-500 disabled:opacity-60"
                />
              )}

              <button
                type="button"
                disabled={!canManageTicket || statusUpdating}
                onClick={handleUpdateStatus}
                className={cn(
                  'w-full border border-black bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all',
                  (!canManageTicket || statusUpdating) ? 'cursor-not-allowed opacity-50' : 'hover:bg-zinc-800',
                )}
              >
                {statusUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className="border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
              <CheckCircle2 size={16} />
              Assign Technician
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="Technician username or id"
                disabled={!canManageTicket || assigning}
                className="w-full border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-black disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleAssignTechnician}
                disabled={!canManageTicket || assigning || !technician.trim()}
                className={cn(
                  'w-full border border-black bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all',
                  (!canManageTicket || assigning || !technician.trim()) ? 'cursor-not-allowed opacity-50' : 'hover:bg-zinc-800',
                )}
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
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
