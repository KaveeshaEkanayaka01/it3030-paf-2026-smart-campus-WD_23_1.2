import { useState, useEffect, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';
import { useUser } from '../context/UserContext';
import StatusBadge from '../components/StatusBadge';
import RejectionModal from '../components/RejectionModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { buildBookingReferenceMap } from '../utils/bookingReference';
import {
  LayoutDashboard, CheckCircle, XCircle, Ban, RefreshCw,
  Search, ChevronDown, ChevronUp, Users, Clock, CheckSquare, AlertCircle, Trash2
} from 'lucide-react';

const FILTER_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

export default function AdminDashboardPage() {
  const { currentUser } = useUser();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [rejectModal, setRejectModal] = useState(null); // booking to reject

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        bookingApi.getAll(),
        bookingApi.getStats(),
      ]);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id) => {
    try {
      const response = await bookingApi.approve(id);
      if (response?.data) {
        toast.success('Booking approved successfully!');
        fetchData();
      } else {
        toast.error('No response from server');
      }
    } catch (err) {
      console.error('Approve error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to approve booking.');
    }
  };

  const handleRejectConfirm = async (id, reason) => {
    try {
      const response = await bookingApi.reject(id, reason);
      if (response?.data) {
        toast.success('Booking rejected successfully.');
        fetchData();
      } else {
        toast.error('No response from server');
      }
    } catch (err) {
      console.error('Reject error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to reject booking.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const response = await bookingApi.cancel(id, currentUser.userId, 'ADMIN');
      if (response?.data) {
        toast.success('Booking cancelled successfully.');
        fetchData();
      } else {
        toast.error('No response from server');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to cancel booking.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking from database permanently?')) return;
    try {
      await bookingApi.deleteById(id);
      toast.success('Booking deleted from database.');
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete booking.');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const filtered = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b =>
      search === '' ||
      b.resourceName.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const bookingReferences = buildBookingReferenceMap(bookings);

  const statCards = [
    { label: 'Total', value: stats.TOTAL || 0, icon: <Users size={20} />, color: 'var(--accent-mid)', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Pending', value: stats.PENDING || 0, icon: <Clock size={20} />, color: 'var(--status-pending)', bg: 'var(--status-pending-bg)' },
    { label: 'Approved', value: stats.APPROVED || 0, icon: <CheckSquare size={20} />, color: 'var(--status-approved)', bg: 'var(--status-approved-bg)' },
    { label: 'Rejected', value: stats.REJECTED || 0, icon: <AlertCircle size={20} />, color: 'var(--status-rejected)', bg: 'var(--status-rejected-bg)' },
  ];

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(15,23,42,0.04)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div className="min-h-screen py-10 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--status-pending), var(--accent-mid))' }}>
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Review and manage all booking requests</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/10" style={{ color: 'var(--accent-mid)' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3" style={{ color: 'var(--muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by resource, user, or purpose..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'transparent', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: filter === f ? (f === 'PENDING' ? 'var(--status-pending-bg)' : f === 'APPROVED' ? 'var(--status-approved-bg)' : f === 'REJECTED' ? 'var(--status-rejected-bg)' : 'var(--status-cancelled-bg)') : 'transparent',
                  color: filter === f ? (f === 'ALL' ? 'var(--accent-mid)' : f === 'PENDING' ? 'var(--status-pending)' : f === 'APPROVED' ? 'var(--status-approved)' : f === 'REJECTED' ? 'var(--status-rejected)' : 'var(--status-cancelled)') : 'var(--muted)',
                  border: filter === f ? '1px solid rgba(15,23,42,0.06)' : '1px solid rgba(15,23,42,0.04)',
                }}
              >
                {f} {f !== 'ALL' && `(${bookings.filter(b => b.status === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                    <tr style={{ background: 'transparent' }}>
                    <th style={thStyle} onClick={() => handleSort('id')}><span className="flex items-center gap-1">Booking Ref<SortIcon field="id" /></span></th>
                    <th style={thStyle} onClick={() => handleSort('resourceName')}><span className="flex items-center gap-1">Resource<SortIcon field="resourceName" /></span></th>
                    <th style={thStyle} onClick={() => handleSort('userName')}><span className="flex items-center gap-1">User<SortIcon field="userName" /></span></th>
                    <th style={thStyle} onClick={() => handleSort('startTime')}><span className="flex items-center gap-1">Time Slot<SortIcon field="startTime" /></span></th>
                    <th style={thStyle}>Purpose</th>
                    <th style={thStyle} onClick={() => handleSort('status')}><span className="flex items-center gap-1">Status<SortIcon field="status" /></span></th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400">
                        No bookings match your criteria.
                      </td>
                    </tr>
                  ) : filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      className="transition-colors"
                        style={{
                        borderBottom: '1px solid rgba(15,23,42,0.04)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.02)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.02)'}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }} className="text-xs font-mono">{bookingReferences[b.id]}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.resourceName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.resourceId}</p>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{b.userName}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{b.userId}</p>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{format(new Date(b.startTime), 'MMM d, yyyy')}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {format(new Date(b.startTime), 'hh:mm a')} – {format(new Date(b.endTime), 'hh:mm a')}
                        </p>
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: 180 }}>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{b.purpose}</p>
                        {b.status === 'REJECTED' && b.rejectionReason && (
                          <p className="text-xs mt-1" style={{ color: 'var(--status-rejected)' }} title={b.rejectionReason}>
                            ✗ {b.rejectionReason.substring(0, 40)}{b.rejectionReason.length > 40 ? '...' : ''}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={b.status} size="sm" /></td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          {b.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(b.id)}
                                title="Approve"
                                className="p-1.5 rounded-lg transition-all hover:scale-110"
                                style={{ background: 'var(--status-approved-bg)', color: 'var(--status-approved)', border: '1px solid var(--status-approved-border)' }}
                              >
                                <CheckCircle size={15} />
                              </button>
                              <button
                                onClick={() => setRejectModal(b)}
                                title="Reject"
                                className="p-1.5 rounded-lg transition-all hover:scale-110"
                                style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', border: '1px solid var(--status-rejected-border)' }}
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                            <button
                              onClick={() => handleCancel(b.id)}
                              title="Cancel"
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled)', border: '1px solid var(--status-cancelled-border)' }}
                            >
                              <Ban size={15} />
                            </button>
                          )}
                          {(b.status === 'REJECTED' || b.status === 'CANCELLED') && (
                            <button
                              onClick={() => handleDelete(b.id)}
                              title="Delete from DB"
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.35)' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-slate-500">Showing {filtered.length} of {bookings.length} bookings</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModal && (
        <RejectionModal
          booking={rejectModal}
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectModal(null)}
        />
      )}
    </div>
  );
}
