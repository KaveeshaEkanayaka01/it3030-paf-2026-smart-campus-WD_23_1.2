import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, RefreshCcw, Search, UserCheck, Wrench, Trash2 } from 'lucide-react';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { getCurrentUserId, getCurrentUserRole, setCurrentUserRole, ticketService } from '../api/ticketService';

const PRIVILEGED_ROLES = ['ADMIN', 'STAFF', 'TECHNICIAN'];

const getAllowedStatusOptions = (ticketStatus, role) => {
  const normalizedStatus = String(ticketStatus || 'OPEN').toUpperCase();
  const normalizedRole = String(role || 'USER').toUpperCase();

  if (normalizedStatus === 'OPEN') {
    return normalizedRole === 'ADMIN' ? ['IN_PROGRESS', 'REJECTED'] : ['IN_PROGRESS'];
  }

  if (normalizedStatus === 'IN_PROGRESS') {
    return normalizedRole === 'ADMIN' ? ['RESOLVED', 'REJECTED'] : ['RESOLVED'];
  }

  if (normalizedStatus === 'RESOLVED') {
    return normalizedRole === 'ADMIN' ? ['CLOSED', 'REJECTED'] : ['CLOSED'];
  }

  return [];
};

export const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [technician, setTechnician] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [roleInput, setRoleInput] = useState(getCurrentUserRole());
  const [currentRole, setCurrentRole] = useState(getCurrentUserRole());

  const currentUserId = getCurrentUserId() || 'wd23-student';
  const canManage = PRIVILEGED_ROLES.includes(currentRole);

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId],
  );

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllTickets();
      setTickets(data || []);
      if (!selectedTicketId && data?.length) {
        setSelectedTicketId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError('Failed to load all tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    const allowed = getAllowedStatusOptions(selectedTicket.status, currentRole);
    setSelectedStatus((current) => (allowed.includes(current) ? current : allowed[0] || ''));
  }, [selectedTicket, currentRole]);

  const applyTestRole = () => {
    if (!setCurrentUserRole(roleInput)) {
      setError('Enter a valid role before continuing.');
      return;
    }

    setCurrentRole(getCurrentUserRole());
    setError('');
  };

  const refreshSelected = async () => {
    if (!selectedTicketId) {
      return;
    }

    await loadTickets();
  };

  const handleAssign = async () => {
    if (!selectedTicket || !technician.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      await ticketService.assignTechnician(selectedTicket.id, technician.trim(), currentRole);
      setTechnician('');
      await loadTickets();
    } catch (err) {
      console.error('Failed to assign technician:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error;
      setError(backendMessage || 'Failed to assign technician.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedTicket) {
      return;
    }

    const allowed = getAllowedStatusOptions(selectedTicket.status, currentRole);
    if (!allowed.includes(selectedStatus)) {
      setError('That status is not allowed from the ticket current state.');
      return;
    }

    if (selectedStatus === 'REJECTED' && !rejectionReason.trim()) {
      setError('Rejection reason is required when rejecting a ticket.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await ticketService.updateStatus(
        selectedTicket.id,
        selectedStatus,
        currentRole,
        resolutionNotes,
        rejectionReason,
      );
      setResolutionNotes('');
      setRejectionReason('');
      await loadTickets();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error;
      setError(backendMessage || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) {
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ticket "${selectedTicket.category || 'Ticket'}" from ${selectedTicket.location || 'unknown location'}? This cannot be undone.`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      await ticketService.deleteTicket(selectedTicket.id, currentRole);
      const remainingTickets = tickets.filter((ticket) => ticket.id !== selectedTicket.id);
      setTickets(remainingTickets);
      setSelectedTicketId(remainingTickets[0]?.id || '');
      await loadTickets();
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error;
      setError(backendMessage || 'Failed to delete ticket.');
    } finally {
      setSaving(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const needle = search.toLowerCase();
    return (
      String(ticket.category || '').toLowerCase().includes(needle) ||
      String(ticket.location || '').toLowerCase().includes(needle) ||
      String(ticket.description || '').toLowerCase().includes(needle) ||
      String(ticket.createdBy || '').toLowerCase().includes(needle)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 relative">
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.15)_0%,_rgba(236,72,153,0)_70%)] opacity-60 blur-3xl shadow-none" />
      
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between relative z-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-pink-300 mb-4">
            <Shield size={12} className="text-pink-400" />
            Admin Panel
          </p>
          <h1 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Ticket Control</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 font-medium">
            Assign technicians and move tickets through the workflow from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshSelected}
            className="flex items-center gap-2 glass-panel px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:glass-panel-strong transition-all hover:-translate-y-0.5"
          >
            <RefreshCcw size={16} className="text-pink-400" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/technician')}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-500/20 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all"
          >
            Technician Workspace
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-tickets')}
            className="glass-panel px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:glass-panel-strong transition-all hover:-translate-y-0.5"
          >
            Back to Tickets
          </button>
        </div>
      </div>

      {!canManage && (
        <div className="mb-8 glass-panel border-amber-500/30 bg-amber-500/10 p-6 rounded-2xl backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Testing Mode Role Setup</p>
          <p className="mt-1 text-sm text-amber-200/80">
            Set ADMIN, STAFF, or TECHNICIAN for assignment and status updates. Delete remains ADMIN only.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none text-slate-200 cursor-pointer"
            >
              <option value="USER" className="bg-slate-900 text-slate-200">USER</option>
              <option value="TECHNICIAN" className="bg-slate-900 text-slate-200">TECHNICIAN</option>
              <option value="STAFF" className="bg-slate-900 text-slate-200">STAFF</option>
              <option value="ADMIN" className="bg-slate-900 text-slate-200">ADMIN</option>
            </select>
            <button
              type="button"
              onClick={applyTestRole}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
            >
              Use This Role
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 glass-panel border-rose-500/30 bg-rose-500/10 p-5 rounded-2xl text-sm font-semibold text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr] relative z-10">
        <div className="glass-panel rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col h-[75vh]">
          <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="bg-white/5 p-2 rounded-lg">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets"
              className="w-full bg-transparent text-sm outline-none text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {loading ? (
            <div className="space-y-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-28 animate-pulse glass-panel rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left transition-all duration-300 p-5 rounded-2xl ${
                    selectedTicketId === ticket.id 
                    ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/50' 
                    : 'glass-panel hover:glass-panel-strong border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{ticket.category || 'Ticket'}</p>
                      <h3 className="mt-1.5 text-sm font-bold uppercase tracking-tight text-slate-200 line-clamp-1">{ticket.location || 'No location'}</h3>
                    </div>
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed font-light">{ticket.description || 'No description provided.'}</p>
                  <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1"><Shield size={10} /> {ticket.createdBy || 'Unknown'}</span>
                    <span className="truncate max-w-[120px]">{ticket.assignedTechnician || 'Unassigned'}</span>
                  </div>
                </button>
              ))}
              {filteredTickets.length === 0 && (
                <div className="glass-panel border-dashed border-white/20 p-8 text-center rounded-2xl">
                   <p className="text-sm font-semibold text-slate-400">No tickets match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!selectedTicket ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 shadow-xl flex flex-col items-center justify-center min-h-[50vh]">
              <div className="bg-white/5 p-4 rounded-full mb-4">
                 <Shield size={32} className="text-slate-500" />
              </div>
              <p className="text-lg font-semibold tracking-wide">Select a ticket to manage it.</p>
            </div>
          ) : (
            <>
              <div className="glass-panel-strong rounded-3xl p-8 shadow-xl backdrop-blur-md">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-1">Selected Ticket</p>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white">
                      {selectedTicket.category || 'Ticket'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300 font-medium">{selectedTicket.location || 'No location provided'}</p>
                  </div>
                  <TicketStatusBadge status={selectedTicket.status} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="glass-panel bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Created By</p>
                    <p className="mt-2 text-sm font-semibold text-slate-200 truncate">{selectedTicket.createdBy || 'N/A'}</p>
                  </div>
                  <div className="glass-panel bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Priority</p>
                    <div className="mt-2">
                      <PriorityBadge priority={selectedTicket.priority} className="text-[11px]" />
                    </div>
                  </div>
                  <div className="glass-panel bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Preferred Contact</p>
                    <p className="mt-2 text-sm font-semibold text-slate-200 truncate">{selectedTicket.preferredContact || 'N/A'}</p>
                  </div>
                  <div className="glass-panel bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Technician</p>
                    <p className="mt-2 text-sm font-semibold text-pink-300 truncate">{selectedTicket.assignedTechnician || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="mt-6 glass-panel p-5 rounded-2xl">
                   <p className="text-sm font-light leading-relaxed text-slate-300">{selectedTicket.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="glass-panel rounded-3xl p-8 shadow-xl">
                  <h3 className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5 text-xs font-bold uppercase tracking-widest text-slate-100">
                    <UserCheck size={18} className="text-emerald-400" />
                    Assign Technician
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      placeholder="Technician username or id"
                      disabled={!canManage || saving}
                      className="w-full glass-input rounded-xl px-4 py-3.5 text-sm outline-none text-slate-200 placeholder:text-slate-500 disabled:opacity-50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleAssign}
                      disabled={!canManage || saving || !technician.trim()}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none"
                    >
                      {saving ? 'Saving...' : 'Assign Technician'}
                    </button>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-8 shadow-xl">
                  <h3 className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5 text-xs font-bold uppercase tracking-widest text-slate-100">
                    <Wrench size={18} className="text-indigo-400" />
                    Update Status
                  </h3>
                  <div className="space-y-4">
                    <p className="text-[10px] font-semibold text-slate-400 bg-white/5 p-2 rounded-lg inline-block px-3">
                      Allows: {getAllowedStatusOptions(selectedTicket.status, currentRole).join(', ') || 'none'}
                    </p>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={!canManage || saving}
                      className="w-full glass-input rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider outline-none text-slate-200 disabled:opacity-50 cursor-pointer"
                    >
                      {getAllowedStatusOptions(selectedTicket.status, currentRole).map((status) => (
                        <option key={status} value={status} className="bg-slate-900 text-slate-200">
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Resolution notes"
                      disabled={!canManage || saving}
                      rows={3}
                      className="w-full resize-none glass-input rounded-xl px-4 py-3.5 text-sm outline-none text-slate-200 placeholder:text-slate-500 disabled:opacity-50 font-medium"
                    />
                    {selectedStatus === 'REJECTED' && (
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Rejection reason"
                        disabled={!canManage || saving}
                        rows={3}
                        className="w-full resize-none bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3.5 text-sm outline-none text-rose-200 placeholder:text-rose-500/50 disabled:opacity-50"
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={!canManage || saving || !selectedStatus}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:shadow-none"
                    >
                      {saving ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel border-rose-500/30 bg-rose-500/10 p-8 rounded-3xl shadow-xl backdrop-blur-md mt-6">
                <h3 className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  <Trash2 size={16} />
                  Admin Delete
                </h3>
                <p className="text-sm text-rose-200/80 mb-6">
                  Delete this ticket permanently. This action is limited to ADMIN and cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteTicket}
                  disabled={currentRole !== 'ADMIN' || saving}
                  className="w-full sm:w-auto rounded-xl bg-rose-500 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-rose-600 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-rose-500"
                >
                  {saving ? 'Deleting...' : 'Delete Ticket'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
