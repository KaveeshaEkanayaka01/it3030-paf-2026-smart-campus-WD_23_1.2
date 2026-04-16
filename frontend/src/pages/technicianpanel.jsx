import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList, RefreshCcw, ShieldCheck, UserCheck, Wrench } from 'lucide-react';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { getCurrentUserId, getCurrentUserRole, setCurrentUserRole, ticketService } from '../services/ticketService';

const TECH_ROLES = ['ADMIN', 'STAFF', 'TECHNICIAN'];

const getAllowedStatusOptions = (ticketStatus) => {
  const normalizedStatus = String(ticketStatus || 'OPEN').toUpperCase();

  if (normalizedStatus === 'OPEN') {
    return ['IN_PROGRESS'];
  }

  if (normalizedStatus === 'IN_PROGRESS') {
    return ['RESOLVED'];
  }

  if (normalizedStatus === 'RESOLVED') {
    return ['CLOSED'];
  }

  return [];
};

export const TechnicianPanelPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingTicketId, setSavingTicketId] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleInput, setRoleInput] = useState(getCurrentUserRole());
  const [currentRole, setCurrentRole] = useState(getCurrentUserRole());

  const currentUserId = getCurrentUserId() || 'wd23-student';
  const canManage = TECH_ROLES.includes(currentRole);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError('Failed to load tickets for technician workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const applyTestRole = () => {
    if (!setCurrentUserRole(roleInput)) {
      setError('Enter a valid role before continuing.');
      return;
    }

    setCurrentRole(getCurrentUserRole());
    setError('');
  };

  const updateTicketInState = (updatedTicket) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === updatedTicket.id ? { ...ticket, ...updatedTicket } : ticket)));
  };

  const handleClaim = async (ticket) => {
    if (!canManage) {
      return;
    }

    try {
      setSavingTicketId(ticket.id);
      setError('');
      const updated = await ticketService.assignTechnician(ticket.id, currentUserId, currentRole);
      updateTicketInState(updated || { ...ticket, assignedTechnician: currentUserId });
    } catch (err) {
      console.error('Failed to claim ticket:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error;
      setError(backendMessage || 'Failed to claim ticket.');
    } finally {
      setSavingTicketId('');
    }
  };

  const handleNextStatus = async (ticket) => {
    if (!canManage) {
      return;
    }

    const next = getAllowedStatusOptions(ticket.status)[0];
    if (!next) {
      return;
    }

    try {
      setSavingTicketId(ticket.id);
      setError('');
      const updated = await ticketService.updateStatus(ticket.id, next, currentRole);
      updateTicketInState(updated || { ...ticket, status: next });
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      const backendMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error;
      setError(backendMessage || 'Failed to update ticket status.');
    } finally {
      setSavingTicketId('');
    }
  };

  const filteredTickets = useMemo(() => {
    const needle = search.toLowerCase();
    const base = tickets.filter((ticket) => {
      const assigned = String(ticket.assignedTechnician || '').toLowerCase();
      const mine = assigned === currentUserId.toLowerCase();
      const unassigned = !assigned;
      return mine || unassigned;
    });

    return base.filter((ticket) => (
      String(ticket.category || '').toLowerCase().includes(needle)
      || String(ticket.location || '').toLowerCase().includes(needle)
      || String(ticket.description || '').toLowerCase().includes(needle)
      || String(ticket.createdBy || '').toLowerCase().includes(needle)
    ));
  }, [tickets, search, currentUserId]);

  const assignedToMe = filteredTickets.filter(
    (ticket) => String(ticket.assignedTechnician || '').toLowerCase() === currentUserId.toLowerCase(),
  );
  const unassigned = filteredTickets.filter((ticket) => !String(ticket.assignedTechnician || '').trim());

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 relative">
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.15)_0%,_rgba(168,85,247,0)_70%)] opacity-60 blur-3xl" />
      
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between relative z-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-4">
            <Wrench size={12} className="text-violet-400" />
            Technician Workspace
          </p>
          <h1 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Action Queue</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 font-medium">
            Focused board for your assigned work and available tickets you can claim.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadTickets}
            className="flex items-center gap-2 glass-panel px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:glass-panel-strong transition-all hover:-translate-y-0.5"
          >
            <RefreshCcw size={16} className="text-indigo-400" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-tickets')}
            className="glass-panel px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:glass-panel-strong transition-all hover:-translate-y-0.5"
          >
            My Tickets
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 shadow-lg shadow-black/20 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {!canManage && (
        <div className="mb-8 glass-panel border-amber-500/30 bg-amber-500/10 p-6 rounded-2xl backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Testing Mode Role Setup</p>
          <p className="mt-1 text-sm text-amber-200/80">
            Set TECHNICIAN, STAFF, or ADMIN to claim and update tickets from this workspace.
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

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="glass-panel-strong rounded-2xl p-6 shadow-lg border-t-[3px] border-t-indigo-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserCheck size={80} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">Logged in as</p>
          <p className="mt-2 text-lg font-bold text-slate-200 relative z-10 truncate">{currentUserId}</p>
        </div>
        <div className="glass-panel-strong rounded-2xl p-6 shadow-lg border-t-[3px] border-t-emerald-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ClipboardList size={80} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">Assigned to me</p>
          <p className="mt-2 text-3xl font-black text-emerald-400 relative z-10">{assignedToMe.length}</p>
        </div>
        <div className="glass-panel-strong rounded-2xl p-6 shadow-lg border-t-[3px] border-t-amber-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={80} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">Unassigned queue</p>
          <p className="mt-2 text-3xl font-black text-amber-400 relative z-10">{unassigned.length}</p>
        </div>
      </div>

      <div className="mb-8 glass-panel rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category, location, description, or creator"
          className="w-full glass-input rounded-xl px-5 py-4 text-sm outline-none text-slate-200 placeholder:text-slate-500 font-medium"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-56 animate-pulse glass-panel rounded-2xl" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="glass-panel border-dashed border-white/20 p-12 text-center rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
             <CheckCircle2 size={24} className="text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-400">No assigned or unassigned tickets matched your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTickets.map((ticket) => {
            const mine = String(ticket.assignedTechnician || '').toLowerCase() === currentUserId.toLowerCase();
            const canAdvance = mine && getAllowedStatusOptions(ticket.status).length > 0;
            const nextStatus = getAllowedStatusOptions(ticket.status)[0];
            const isSaving = savingTicketId === ticket.id;

            return (
              <div key={ticket.id} className="glass-panel p-6 shadow-xl rounded-2xl flex flex-col group hover:glass-panel-strong transition-all duration-300">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{ticket.category || 'Ticket'}</p>
                    <h3 className="mt-1 text-lg font-bold uppercase tracking-tight text-slate-100 group-hover:text-violet-300 transition-colors">{ticket.location || 'No location'}</h3>
                  </div>
                  <TicketStatusBadge status={ticket.status} />
                </div>

                <p className="line-clamp-2 text-sm text-slate-300 font-light leading-relaxed flex-grow">{ticket.description || 'No description provided.'}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-t border-white/10 pt-5">
                  <div className="glass-panel bg-black/20 p-3 rounded-xl border border-white/5">
                    <p>Created By</p>
                    <p className="mt-1 text-slate-200 truncate">{ticket.createdBy || 'Unknown'}</p>
                  </div>
                  <div className="glass-panel bg-black/20 p-3 rounded-xl border border-white/5">
                    <p>Technician</p>
                    <p className="mt-1 text-slate-200 truncate">{ticket.assignedTechnician || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {!mine && !ticket.assignedTechnician && (
                    <button
                      type="button"
                      disabled={!canManage || isSaving}
                      onClick={() => handleClaim(ticket)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
                    >
                      <UserCheck size={14} />
                      {isSaving ? 'Claiming...' : 'Claim Ticket'}
                    </button>
                  )}

                  {canAdvance && (
                    <button
                      type="button"
                      disabled={!canManage || isSaving}
                      onClick={() => handleNextStatus(ticket)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
                    >
                      <Wrench size={14} />
                      {isSaving ? 'Updating...' : `Move to ${nextStatus.replace('_', ' ')}`}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <ClipboardList size={14} />
                    View Details
                  </button>
                </div>

                {mine && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
                    <ShieldCheck size={14} />
                    Assigned to you
                  </p>
                )}

                {ticket.status === 'CLOSED' && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 w-fit">
                    <CheckCircle2 size={14} />
                    Ticket completed
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
