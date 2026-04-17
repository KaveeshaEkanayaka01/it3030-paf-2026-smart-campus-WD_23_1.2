import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { bookingApi } from '../api/bookingApi';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, Clock, MapPin, FileText, ChevronRight } from 'lucide-react';

const RESOURCES = [
  { id: 'room_001', name: 'Conference Room A' },
  { id: 'room_002', name: 'Conference Room B' },
  { id: 'lab_001', name: 'Computer Lab 1' },
  { id: 'lab_002', name: 'Computer Lab 2' },
  { id: 'hall_001', name: 'Main Auditorium' },
  { id: 'gym_001', name: 'Sports Hall' },
];

export default function CreateBookingPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    resourceId: '',
    resourceName: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  const handleResourceChange = (e) => {
    const selected = RESOURCES.find(r => r.id === e.target.value);
    setForm(prev => ({
      ...prev,
      resourceId: selected?.id || '',
      resourceName: selected?.name || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resourceId) { toast.error('Please select a resource.'); return; }
    if (!form.startTime || !form.endTime) { toast.error('Please set start and end time.'); return; }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error('End time must be after start time.');
      return;
    }

    setLoading(true);
    try {
      await bookingApi.create({
        ...form,
        userId: currentUser.userId,
        userName: currentUser.userName,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
      });
      toast.success('Booking created successfully! Awaiting approval.');
      navigate('/my-bookings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}>
              <PlusCircle size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>New Booking</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reserve a resource for your event</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          {/* Resource Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <MapPin size={14} style={{ color: 'var(--accent-mid)' }} /> Resource
            </label>
            <select
              value={form.resourceId}
              onChange={handleResourceChange}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{ background: 'transparent', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-primary)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
              onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.06)'}
              required
            >
              <option value="">Select a resource...</option>
              {RESOURCES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Calendar size={14} style={{ color: 'var(--accent-mid)' }} /> Start Time
              </label>
              <input
                type="datetime-local"
                value={form.startTime}
                min={today}
                onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ background: 'transparent', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
                onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.06)'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--accent-mid)' }} /> End Time
              </label>
              <input
                type="datetime-local"
                value={form.endTime}
                min={form.startTime || today}
                onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ background: 'transparent', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
                onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.06)'}
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText size={14} style={{ color: 'var(--accent-mid)' }} /> Purpose
            </label>
            <textarea
              value={form.purpose}
              onChange={e => setForm(prev => ({ ...prev, purpose: e.target.value }))}
              rows={4}
              placeholder="Describe the purpose of this booking..."
              className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-secondary outline-none resize-none transition-all duration-200"
              style={{ background: 'transparent', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-primary)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
              onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.06)'}
              required
            />
          </div>

          {/* User info preview */}
          <div className="p-3 rounded-xl" style={{ background: 'var(--accent-start)', border: '1px solid rgba(15,23,42,0.04)', color: 'white' }}>
            <p className="text-xs">
              Booking as: <span className="font-medium">{currentUser.userName}</span>
              <span className="mx-2">·</span>
              ID: <span className="font-mono text-xs">{currentUser.userId}</span>
            </p>
          </div>

          {/* Submit */}
         <button
  type="submit"
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
  style={{ background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))' }}
>
  {loading ? (
    <>
      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      Submitting...
    </>
  ) : (
    <>
      <PlusCircle size={18} />
      Submit Booking
      <ChevronRight size={16} />
    </>
  )}
</button>
        </form>
      </div>
    </div>
  );
}
