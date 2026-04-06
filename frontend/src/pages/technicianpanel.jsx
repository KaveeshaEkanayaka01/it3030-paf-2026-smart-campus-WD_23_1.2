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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Technician Workspace</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-black">Action Queue</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Focused board for your assigned work and available tickets you can claim.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadTickets}
            className="flex items-center gap-2 border border-zinc-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-700 hover:border-black hover:text-black"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-tickets')}
            className="border border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-800 hover:text-white"
          >
            My Tickets
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="border border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-zinc-800"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {!canManage && (
        <div className="mb-8 border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Testing Mode Role Setup</p>
          <p className="mt-1 text-sm text-amber-700">
            Set TECHNICIAN, STAFF, or ADMIN to claim and update tickets from this workspace.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full border border-amber-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            >
              <option value="USER">USER</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              type="button"
              onClick={applyTestRole}
              className="border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-zinc-800"
            >
              Use This Role
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logged in as</p>
          <p className="mt-2 text-sm font-semibold text-zinc-700">{currentUserId}</p>
        </div>
        <div className="border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assigned to me</p>
          <p className="mt-2 text-xl font-black text-black">{assignedToMe.length}</p>
        </div>
        <div className="border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Unassigned queue</p>
          <p className="mt-2 text-xl font-black text-black">{unassigned.length}</p>
        </div>
      </div>

      <div className="mb-6 border border-zinc-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category, location, description, or creator"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-44 animate-pulse border border-zinc-100 bg-zinc-50" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
          No assigned or unassigned tickets matched your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredTickets.map((ticket) => {
            const mine = String(ticket.assignedTechnician || '').toLowerCase() === currentUserId.toLowerCase();
            const canAdvance = mine && getAllowedStatusOptions(ticket.status).length > 0;
            const nextStatus = getAllowedStatusOptions(ticket.status)[0];
            const isSaving = savingTicketId === ticket.id;

            return (
              <div key={ticket.id} className="border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{ticket.category || 'Ticket'}</p>
                    <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-black">{ticket.location || 'No location'}</h3>
                  </div>
                  <TicketStatusBadge status={ticket.status} />
                </div>

                <p className="line-clamp-2 text-sm text-zinc-600">{ticket.description || 'No description provided.'}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <div className="border border-zinc-100 bg-zinc-50 p-3">
                    <p>Created By</p>
                    <p className="mt-1 text-zinc-700">{ticket.createdBy || 'Unknown'}</p>
                  </div>
                  <div className="border border-zinc-100 bg-zinc-50 p-3">
                    <p>Technician</p>
                    <p className="mt-1 text-zinc-700">{ticket.assignedTechnician || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {!mine && !ticket.assignedTechnician && (
                    <button
                      type="button"
                      disabled={!canManage || isSaving}
                      onClick={() => handleClaim(ticket)}
                      className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Wrench size={14} />
                      {isSaving ? 'Updating...' : `Move to ${nextStatus.replace('_', ' ')}`}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:border-black hover:text-black"
                  >
                    <ClipboardList size={14} />
                    View Details
                  </button>
                </div>

                {mine && (
                  <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    <ShieldCheck size={12} />
                    Assigned to you
                  </p>
                )}

                {ticket.status === 'CLOSED' && (
                  <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    <CheckCircle2 size={12} />
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
