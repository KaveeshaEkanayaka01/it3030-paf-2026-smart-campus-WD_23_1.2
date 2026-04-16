import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Send, MapPin, Phone, Info, Tag, Sparkles } from 'lucide-react';
import { AttachmentUpload } from '../components/AttachmentUpload';
import { getCurrentUserId, setCurrentUserId, ticketService } from '../api/ticketService';

const CATEGORIES = [
  'Classroom Equipment',
  'Lab Computers',
  'Projectors/AV',
  'Electrical/Lighting',
  'Plumbing',
  'Furniture',
  'Wi-Fi/Network',
  'Other'
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [uploadInfo, setUploadInfo] = useState('');
  const [currentUser, setCurrentUser] = useState(getCurrentUserId() || '');
  const [testUserInput, setTestUserInput] = useState(getCurrentUserId() || '');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    priority: 'MEDIUM',
    location: '',
    contact: ''
  });

  const applyTestUser = () => {
    if (!setCurrentUserId(testUserInput)) {
      setError('Enter a valid user id before continuing.');
      return;
    }

    setCurrentUser(getCurrentUserId() || '');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadInfo('');
    setLoading(true);

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      setError('No current user found. Set localStorage currentUser, userId, or username.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: `${formData.category} issue`,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        location: formData.location,
        preferredContact: formData.contact,
        createdBy: currentUserId,
      };

      const ticket = await ticketService.createTicket(payload);

      if (files.length > 0) {
        const uploadResults = await Promise.allSettled(
          files.map((file) => ticketService.uploadAttachments(ticket.id, file)),
        );
        const successCount = uploadResults.filter((result) => result.status === 'fulfilled').length;
        const failedCount = uploadResults.length - successCount;

        if (failedCount === 0) {
          setUploadInfo(`${successCount} image file(s) uploaded successfully.`);
        } else {
          setUploadInfo(`${successCount} image(s) uploaded, ${failedCount} failed.`);
        }
      }

      navigate('/my-tickets');
    } catch (err) {
      console.error('Failed to create ticket:', err);
      const responseData = err?.response?.data;
      const backendMessage =
        (typeof responseData === 'string' && responseData) ||
        responseData?.message ||
        responseData?.error ||
        '';

      if (!err?.response) {
        setError('Cannot reach backend API. Make sure backend is running on http://localhost:8091.');
      } else {
        setError(backendMessage || `Failed to create ticket (HTTP ${err.response.status}).`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 relative">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.15)_0%,_rgba(99,102,241,0)_70%)] opacity-60 blur-3xl shadow-none" />
      
      <button
        type="button"
        onClick={() => navigate('/my-tickets')}
        className="group mb-8 inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-white hover:glass-panel-strong border border-white/10 relative z-10"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Back to tickets
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] relative z-10">
        <aside className="glass-panel-strong rounded-3xl p-8 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-6 w-fit">
              <Sparkles size={12} className="text-indigo-400" />
              Incident Desk
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 md:text-5xl">Create Ticket</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 font-medium">
              Report maintenance issues with clear details so technicians can respond faster and accurately.
            </p>
          </div>

          <div className="mt-12 grid gap-4">
            <div className="glass-panel rounded-xl p-5 border-l-[3px] border-l-indigo-500 relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                <Info size={100} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current User</p>
              <p className="text-sm font-bold text-slate-200 truncate">{currentUser || 'Not set yet'}</p>
            </div>
            <div className="glass-panel rounded-xl p-5 border-l-[3px] border-l-fuchsia-500 relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                 <Tag size={100} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Attachment Limit</p>
              <p className="text-sm font-bold text-slate-200">Up to 3 images per ticket</p>
            </div>
            <div className="glass-panel rounded-xl p-5 border-l-[3px] border-l-rose-500 relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                 <Send size={100} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Workflow</p>
              <p className="text-sm font-bold text-slate-200">Open - In Progress - Resolved - Closed</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {!currentUser && (
            <div className="glass-panel border-amber-500/30 bg-amber-500/10 p-6 rounded-2xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Testing Mode User Setup</p>
              <p className="mt-1 text-sm text-amber-200/80">Login module is not connected yet. Set a temporary user id to test ticket creation.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={testUserInput}
                  onChange={(e) => setTestUserInput(e.target.value)}
                  placeholder="e.g. wd23-student"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium outline-none text-slate-200 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={applyTestUser}
                  className="bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                >
                  Use This User
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="glass-panel border-rose-500/30 bg-rose-500/10 p-5 rounded-2xl text-sm font-semibold text-rose-300">
                {error}
              </div>
            )}

            <div className="glass-panel rounded-3xl p-6 shadow-xl backdrop-blur-md md:p-8 border border-white/10">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-100 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-400" />
                  Issue Details
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">Step 1 of 2</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-sm font-medium outline-none text-slate-200 cursor-pointer appearance-none bg-slate-900/50 focus:bg-slate-800/80 transition-all border border-white/10"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-slate-200">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Priority
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-sm font-medium outline-none text-slate-200 cursor-pointer appearance-none bg-slate-900/50 focus:bg-slate-800/80 transition-all border border-white/10"
                  >
                    {PRIORITIES.map(prio => (
                      <option key={prio} value={prio} className="bg-slate-900 text-slate-200">{prio}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Location
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Building A, Room 302"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-sm outline-none text-slate-200 placeholder:text-slate-500 font-medium transition-all"
                  />
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full resize-none glass-input rounded-xl px-4 py-3.5 text-sm outline-none text-slate-200 placeholder:text-slate-500 font-medium transition-all"
                  />
                  <p className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Preferred Contact
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Email or phone number"
                    value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-3.5 text-sm outline-none text-slate-200 placeholder:text-slate-500 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 shadow-xl backdrop-blur-md md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-100 flex items-center gap-2">
                  <Info size={16} className="text-fuchsia-400" />
                  Attachments
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">Step 2 of 2</p>
              </div>

              <AttachmentUpload files={files} setFiles={setFiles} />
              
              {uploadInfo && (
                <div className="glass-panel border-emerald-500/30 bg-emerald-500/10 px-4 py-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {uploadInfo}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:scale-100"
            >
              {loading ? 'Submitting...' : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Send size={16} />
                  Submit Ticket
                </span>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
