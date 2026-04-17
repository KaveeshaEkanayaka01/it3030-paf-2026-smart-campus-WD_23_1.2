import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Timer,
  Clock
} from 'lucide-react';
import { getCurrentUserId, getCurrentUserRole, ticketService } from '../api/ticketService';
import { useAuth } from '../context/AuthContext';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { CommentSection } from '../components/commentSection';

const cn = (...values) => values.filter(Boolean).join(' ');

const UPDATE_STATUSES = ['IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIVILEGED_ROLES = ['ADMIN', 'STAFF', 'TECHNICIAN'];

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const currentUserId = user?.id || getCurrentUserId() || 'wd23-student';
  const currentUserRole = useMemo(() => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
    if (roles.includes('ROLE_STAFF')) return 'STAFF';
    if (roles.includes('ROLE_TECHNICIAN')) return 'TECHNICIAN';
    if (roles.includes('ROLE_USER')) return 'USER';
    return getCurrentUserRole();
  }, [user]);
  const canManageTicket = PRIVILEGED_ROLES.includes(currentUserRole);
  const hasSidePanel = canManageTicket || Boolean(ticket?.assignedTechnician);
  const currentUserName = useMemo(() => {
    const candidate = user?.name || user?.githubUsername || user?.email || '';
    return String(candidate).trim();
  }, [user]);
  const currentUserIdentitySet = useMemo(() => {
    return new Set(
      [
        currentUserId,
        user?.id,
        user?.email,
        user?.githubUsername,
      ]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    );
  }, [currentUserId, user]);

  const createdByDisplayName = useMemo(() => {
    const createdBy = String(ticket?.createdBy || '').trim();
    if (!createdBy) {
      return 'N/A';
    }

    if (currentUserIdentitySet.has(createdBy) && currentUserName) {
      return currentUserName;
    }

    return createdBy;
  }, [ticket?.createdBy, currentUserIdentitySet, currentUserName]);

  const mapCommentForUI = (comment) => ({
    id: String(comment.id),
    text: comment.content || '',
    authorName: comment.authorName || comment.authorId || 'Unknown',
    authorId: comment.authorId || '',
    createdAt: comment.createdAt || new Date().toISOString(),
    isOwner: Boolean(comment.isOwner),
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
      await ticketService.addComment(id, text);
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

  const handleUpdateComment = async (commentId, text) => {
    if (!id) {
      return;
    }

    try {
      await ticketService.updateComment(commentId, text);
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

  const getSlaTiming = (start, end) => {
    if (!start) return 'N/A';
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : Date.now();
    const diff = e - s; 
    
    if (diff < 0) return '0m';
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center glass-panel mt-12 rounded-3xl border-dashed border-rose-500/30">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-100">{error}</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-rose-500 text-white font-bold uppercase tracking-widest px-6 py-3 shadow-lg shadow-rose-500/20 hover:scale-105 transition-all text-xs"
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
    <div className="mx-auto max-w-6xl px-4 py-12 relative">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.15)_0%,_rgba(99,102,241,0)_70%)] opacity-60 blur-3xl" />

      <button
        onClick={() => navigate(-1)}
        className="group mb-10 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white glass-panel px-4 py-2 rounded-xl border border-white/10"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Tickets</span>
      </button>

      <div className={cn('grid grid-cols-1 gap-10 relative z-10', hasSidePanel ? 'lg:grid-cols-3' : 'max-w-4xl mx-auto')}>
        <div className={cn('space-y-8', hasSidePanel ? 'lg:col-span-2' : '')}>
          <div className="glass-panel rounded-3xl p-8 shadow-xl backdrop-blur-md">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">{ticket.category || 'Ticket'}</h1>
                <p className="mt-2 text-xs font-bold font-mono tracking-wider text-slate-500">#{ticket.id}</p>
              </div>
              <TicketStatusBadge status={ticket.status} />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 border-b border-white/10 pb-8 md:grid-cols-3">
              <div className="glass-panel p-4 rounded-xl text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Created By</p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase text-slate-100">
                  <User size={14} className="text-indigo-400" />
                  <span className="truncate">{createdByDisplayName}</span>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Date</p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase text-slate-100">
                  <Calendar size={14} className="text-fuchsia-400" />
                  <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Location</p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase text-slate-100">
                  <MapPin size={14} className="text-rose-400" />
                  <span className="truncate">{ticket.location || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Service-Level Agreement Timers (SLA) */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="glass-panel-strong p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Clock size={80} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time to Response</p>
                      <h4 className="text-2xl font-black text-emerald-400">{getSlaTiming(ticket.createdAt, ticket.firstRespondedAt)}</h4>
                   </div>
                   <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                     <Timer size={20} className="text-emerald-400" />
                   </div>
                </div>
                <p className="text-[9px] uppercase font-bold text-emerald-500/50 mt-3 relative z-10 tracking-wider">
                  {ticket.firstRespondedAt ? 'Responded' : 'Awaiting Response'}
                </p>
              </div>

              <div className="glass-panel-strong p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CheckCircle2 size={80} className="text-indigo-500" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time to Resolution</p>
                      <h4 className="text-2xl font-black text-indigo-400">{getSlaTiming(ticket.createdAt, ticket.resolvedAt)}</h4>
                   </div>
                   <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                     <CheckCircle2 size={20} className="text-indigo-400" />
                   </div>
                </div>
                <p className="text-[9px] uppercase font-bold text-indigo-500/50 mt-3 relative z-10 tracking-wider">
                  {ticket.resolvedAt ? 'Resolved' : 'Ongoing'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-200">
                <FileText size={16} className="text-purple-400" />
                Description
              </h3>
              <p className="glass-panel p-6 rounded-2xl text-sm font-light leading-relaxed text-slate-300">
                {ticket.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="glass-panel p-5 rounded-2xl border-l-[3px] border-l-fuchsia-500">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Preferred Contact</p>
                <p className="mt-2 text-sm font-semibold text-slate-200">{ticket.preferredContact || 'N/A'}</p>
              </div>
              <div className="glass-panel p-5 rounded-2xl border-l-[3px] border-l-indigo-500">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Resolution Notes</p>
                <p className="mt-2 text-sm font-semibold text-slate-200">{ticket.resolutionNotes || 'N/A'}</p>
              </div>
            </div>

            {ticket.status === 'REJECTED' && (
              <div className="mt-6 border border-rose-500/30 bg-rose-500/10 p-5 rounded-2xl backdrop-blur-md">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  <MessageCircleWarning size={14} />
                  Rejection Reason
                </p>
                <p className="mt-2 text-sm font-semibold text-rose-200">{ticket.rejectionReason || 'N/A'}</p>
              </div>
            )}

            <div className="mt-10">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-200">
                <ImageIcon size={16} className="text-purple-400" />
                Attachments ({attachments.length})
              </h3>

              {attachments.length === 0 ? (
                <p className="text-sm font-medium text-slate-500 bg-white/5 p-4 rounded-xl glass-panel">No attachments uploaded for this ticket.</p>
              ) : (
                <div className="space-y-3">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between glass-panel px-4 py-3 rounded-xl border border-white/10 hover:glass-panel-strong transition-all">
                      <span className="truncate text-sm font-semibold text-slate-200">{attachment.fileName}</span>
                      <span className="ml-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-black/20 px-2 py-1 rounded-lg">{attachment.fileType || 'file'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 border-t border-white/10 pt-10">
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

        <div className="space-y-8">
          {canManageTicket && (
            <>
              <div className="glass-panel-strong rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                <h3 className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5 text-xs font-bold uppercase tracking-widest text-slate-100">
                  <Wrench size={18} className="text-indigo-400" />
                  Technician Actions
                </h3>
                <div className="space-y-4">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={!canManageTicket || statusUpdating}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider outline-none text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {UPDATE_STATUSES.map((status) => (
                      <option key={status} value={status} className="bg-slate-900 text-slate-200">{status.replace('_', ' ')}</option>
                    ))}
                  </select>

                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Resolution notes (for RESOLVED/CLOSED)"
                    disabled={!canManageTicket || statusUpdating}
                    rows={3}
                    className="w-full resize-none glass-input rounded-xl px-4 py-3.5 text-xs outline-none text-slate-200 placeholder:text-slate-500 disabled:opacity-50 transition-all font-medium"
                  />

                  {selectedStatus === 'REJECTED' && (
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Rejection reason (required)"
                      disabled={!canManageTicket || statusUpdating}
                      rows={3}
                      className="w-full resize-none bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3.5 text-xs outline-none text-rose-200 placeholder:text-rose-500/50 disabled:opacity-50 transition-all"
                    />
                  )}

                  <button
                    type="button"
                    disabled={!canManageTicket || statusUpdating}
                    onClick={handleUpdateStatus}
                    className={cn(
                      'w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]',
                      (!canManageTicket || statusUpdating) ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:scale-[1.02] active:scale-95'
                    )}
                  >
                    {statusUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-8 shadow-xl backdrop-blur-md">
                <h3 className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5 text-xs font-bold uppercase tracking-widest text-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Assign Technician
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    placeholder="Technician username or id"
                    disabled={!canManageTicket || assigning}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-sm font-medium outline-none text-slate-200 placeholder:text-slate-500 disabled:opacity-50 transition-all focus:glass-panel-strong"
                  />
                  <button
                    type="button"
                    onClick={handleAssignTechnician}
                    disabled={!canManageTicket || assigning || !technician.trim()}
                    className={cn(
                      'w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]',
                      (!canManageTicket || assigning || !technician.trim()) ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:scale-[1.02] active:scale-95'
                    )}
                  >
                    {assigning ? 'Assigning...' : 'Assign Technician'}
                  </button>
                </div>
              </div>
            </>
          )}

          {ticket.assignedTechnician && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-white shadow-2xl">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Assigned Technician</p>
                   <p className="text-xl font-extrabold uppercase tracking-tight">{ticket.assignedTechnician}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/30">
                  <User size={24} className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
