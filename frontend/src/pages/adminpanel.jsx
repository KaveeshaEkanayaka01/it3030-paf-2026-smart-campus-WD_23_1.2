import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, RefreshCcw, Search, UserCheck, Wrench, Trash2 } from 'lucide-react';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { getCurrentUserId, getCurrentUserRole, setCurrentUserRole, ticketService } from '../services/ticketService';

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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Admin Panel</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-black">Ticket Control</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Assign technicians and move tickets through the workflow from one place.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={refreshSelected}
            className="flex items-center gap-2 border border-zinc-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-700 hover:border-black hover:text-black"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/technician')}
            className="border border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-black hover:text-white"
          >
            Technician Workspace
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-tickets')}
            className="border border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-zinc-800"
          >
            Back to Tickets
          </button>
        </div>
      </div>

      {!canManage && (
        <div className="mb-8 border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Testing Mode Role Setup</p>
          <p className="mt-1 text-sm text-amber-700">
            Set ADMIN, STAFF, or TECHNICIAN for assignment and status updates. Delete remains ADMIN only.
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <div className="border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Search size={16} className="text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 animate-pulse border border-zinc-100 bg-zinc-50" />
              ))}
            </div>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full border p-4 text-left transition-all ${selectedTicketId === ticket.id ? 'border-black bg-zinc-50' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{ticket.category || 'Ticket'}</p>
                      <h3 className="mt-1 text-sm font-black uppercase text-black">{ticket.location || 'No location'}</h3>
                    </div>
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <p className="line-clamp-2 text-xs text-zinc-600">{ticket.description || 'No description provided.'}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <span>{ticket.createdBy || 'Unknown user'}</span>
                    <span>{ticket.assignedTechnician || 'Unassigned'}</span>
                  </div>
                </button>
              ))}
              {filteredTickets.length === 0 && (
                <div className="border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                  No tickets match your search.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!selectedTicket ? (
            <div className="border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
              Select a ticket to manage it.
            </div>
          ) : (
            <>
              <div className="border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selected Ticket</p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-black">
                      {selectedTicket.category || 'Ticket'}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">{selectedTicket.location || 'No location provided'}</p>
                  </div>
                  <TicketStatusBadge status={selectedTicket.status} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="border border-zinc-100 bg-zinc-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Created By</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-700">{selectedTicket.createdBy || 'N/A'}</p>
                  </div>
                  <div className="border border-zinc-100 bg-zinc-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Priority</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-700">{selectedTicket.priority || 'N/A'}</p>
                  </div>
                  <div className="border border-zinc-100 bg-zinc-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Preferred Contact</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-700">{selectedTicket.preferredContact || 'N/A'}</p>
                  </div>
                  <div className="border border-zinc-100 bg-zinc-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assigned Technician</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-700">{selectedTicket.assignedTechnician || 'Unassigned'}</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-zinc-700">{selectedTicket.description || 'No description provided.'}</p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
                    <UserCheck size={16} />
                    Assign Technician
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      placeholder="Technician username or id"
                      disabled={!canManage || saving}
                      className="w-full border border-zinc-300 bg-white px-3 py-3 text-sm outline-none focus:border-black disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleAssign}
                      disabled={!canManage || saving || !technician.trim()}
                      className="w-full border border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Assign Technician'}
                    </button>
                  </div>
                </div>

                <div className="border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
                    <Wrench size={16} />
                    Update Status
                  </h3>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-zinc-500">
                      Allowed next statuses: {getAllowedStatusOptions(selectedTicket.status, currentRole).join(', ') || 'none'}
                    </p>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={!canManage || saving}
                      className="w-full border border-zinc-300 bg-white px-3 py-3 text-sm font-bold uppercase tracking-wider outline-none focus:border-black disabled:opacity-60"
                    >
                      {getAllowedStatusOptions(selectedTicket.status, currentRole).map((status) => (
                        <option key={status} value={status}>
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
                      className="w-full border border-zinc-300 bg-white px-3 py-3 text-sm outline-none focus:border-black disabled:opacity-60"
                    />
                    {selectedStatus === 'REJECTED' && (
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Rejection reason"
                        disabled={!canManage || saving}
                        rows={3}
                        className="w-full border border-red-300 bg-red-50 px-3 py-3 text-sm outline-none focus:border-red-500 disabled:opacity-60"
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={!canManage || saving || !selectedStatus}
                      className="w-full border border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-red-200 bg-red-50 p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-800">
                  <Trash2 size={16} />
                  Admin Delete
                </h3>
                <p className="text-sm text-red-700">
                  Delete this ticket permanently. This action is limited to ADMIN and cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteTicket}
                  disabled={currentRole !== 'ADMIN' || saving}
                  className="mt-4 w-full border border-red-800 bg-red-700 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
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
