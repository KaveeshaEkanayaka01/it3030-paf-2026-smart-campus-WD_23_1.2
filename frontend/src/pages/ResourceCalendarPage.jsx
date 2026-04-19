import { useState, useEffect } from 'react';
import { bookingApi } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import { buildBookingReferenceMap } from '../utils/bookingReference';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const RESOURCES = [
  { id: 'room_001', name: 'Conference Room A' },
  { id: 'room_002', name: 'Conference Room B' },
  { id: 'lab_001', name: 'Computer Lab 1' },
  { id: 'lab_002', name: 'Computer Lab 2' },
  { id: 'hall_001', name: 'Main Auditorium' },
  { id: 'gym_001', name: 'Sports Hall' },
];

const STATUS_COLORS = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  CANCELLED: 'status-cancelled',
};

export default function ResourceCalendarPage() {
  const [selectedResource, setSelectedResource] = useState(RESOURCES[0].id);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await bookingApi.getByResource(selectedResource);
        setBookings(res.data);
      } catch {
        toast.error('Failed to load resource bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedResource]);

  const getBookingsForDay = (day) =>
    bookings.filter(b => isSameDay(parseISO(b.startTime), day));

  const selectedResourceName = RESOURCES.find(r => r.id === selectedResource)?.name;

  // Build calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(new Date(d));
    d = addDays(d, 1);
  }

  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];
  const bookingReferences = buildBookingReferenceMap(bookings);

  return (
    <div className="min-h-screen py-10 px-4 page-enter">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
            <CalendarDays size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Resource Calendar</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View booking schedule by resource</p>
          </div>
        </div>

        {/* Resource Selector */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row items-center gap-3">
          <MapPin size={16} style={{ color: 'var(--accent-mid)', flexShrink: 0 }} />
          <div className="flex gap-2 flex-wrap">
            {RESOURCES.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedResource(r.id); setSelectedDay(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: selectedResource === r.id ? 'rgba(99,102,241,0.06)' : 'transparent',
                  color: selectedResource === r.id ? 'var(--accent-mid)' : 'var(--text-secondary)',
                  border: selectedResource === r.id ? '1px solid rgba(99,102,241,0.08)' : '1px solid rgba(15,23,42,0.04)',
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 glass-card p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: 'var(--accent-mid)' }}
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-bold text-white text-lg">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: 'var(--accent-mid)' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: 'var(--text-secondary)' }}>{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  const dayBookings = getBookingsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const hasBookings = dayBookings.length > 0;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className="min-h-[60px] p-1 rounded-xl cursor-pointer transition-all duration-150"
                      style={{
                        background: isSelected
                          ? 'rgba(99,102,241,0.06)'
                          : isToday
                          ? 'rgba(99,102,241,0.03)'
                          : 'transparent',
                        border: isSelected
                          ? '1px solid rgba(99,102,241,0.08)'
                          : isToday
                          ? '1px solid rgba(99,102,241,0.05)'
                          : '1px solid transparent',
                        opacity: isCurrentMonth ? 1 : 0.3,
                      }}
                    >
                      <p
                        className="text-xs font-medium text-center mb-1"
                        style={{ color: isToday ? 'var(--accent-mid)' : 'var(--text-secondary)' }}
                      >
                        {format(day, 'd')}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {dayBookings.slice(0, 2).map(b => (
                          <div
                            key={b.id}
                            className="rounded px-1 text-[9px] font-semibold truncate"
                            style={{
                              background: `var(--${STATUS_COLORS[b.status]}-bg)`,
                              color: `var(--${STATUS_COLORS[b.status]})`,
                              border: `1px solid var(--${STATUS_COLORS[b.status]}-border)`,
                            }}
                          >
                            {format(parseISO(b.startTime), 'HH:mm')}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <p className="text-[9px] text-center" style={{ color: 'var(--text-secondary)' }}>+{dayBookings.length - 2}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {Object.entries(STATUS_COLORS).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  <span className="text-xs text-slate-500 capitalize">{s.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Selected Day Details */}
          <div className="glass-card p-5">
            {selectedDay ? (
              <>
                <h3 className="font-bold text-white mb-1">{format(selectedDay, 'EEEE, MMMM d')}</h3>
                <p className="text-sm text-slate-400 mb-4">
                  {selectedDayBookings.length} booking{selectedDayBookings.length !== 1 ? 's' : ''} for {selectedResourceName}
                </p>
                {selectedDayBookings.length === 0 ? (
                  <div className="text-center py-10">
                    <CalendarDays size={36} className="mx-auto mb-3" style={{ color: '#334155' }} />
                    <p className="text-slate-500 text-sm">No bookings on this day</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayBookings.map(b => (
                      <div key={b.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <StatusBadge status={b.status} size="sm" />
                          <span className="text-xs text-slate-500 font-mono">{bookingReferences[b.id]}</span>
                        </div>
                        <p className="text-sm font-medium text-white">{b.userName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{b.purpose?.substring(0, 60)}</p>
                        <p className="text-xs mt-2" style={{ color: '#818cf8' }}>
                          {format(parseISO(b.startTime), 'hh:mm a')} – {format(parseISO(b.endTime), 'hh:mm a')}
                        </p>
                        {b.status === 'REJECTED' && b.rejectionReason && (
                          <p className="text-xs mt-1" style={{ color: '#f87171' }}>⚠ {b.rejectionReason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <CalendarDays size={44} className="mx-auto mb-4" style={{ color: '#1e293b' }} />
                <p className="text-slate-400 font-medium text-sm">Select a day</p>
                <p className="text-slate-600 text-xs mt-1">Click any date to see bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
