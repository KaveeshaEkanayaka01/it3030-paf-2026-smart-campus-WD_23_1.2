import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Send, MapPin, Phone, Info, Tag, Sparkles } from 'lucide-react';
import { AttachmentUpload } from '../components/AttachmentUpload';
import { getCurrentUserId, setCurrentUserId, ticketService } from '../services/ticketService';

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
        setError('Cannot reach backend API. Make sure backend is running on http://localhost:8090.');
      } else {
        setError(backendMessage || `Failed to create ticket (HTTP ${err.response.status}).`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <button
        type="button"
        onClick={() => navigate('/my-tickets')}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Back to tickets
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative overflow-hidden border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(151,130,255,0.55)_0%,_rgba(151,130,255,0)_72%)]" />

          <p className="inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <Sparkles size={12} />
            Incident Desk
          </p>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-black md:text-5xl">Create Ticket</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
            Report maintenance issues with clear details so technicians can respond faster and accurately.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current User</p>
              <p className="mt-2 text-sm font-semibold text-zinc-700">{currentUser || 'Not set yet'}</p>
            </div>
            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Attachment Limit</p>
              <p className="mt-2 text-sm font-semibold text-zinc-700">Up to 3 images per ticket</p>
            </div>
            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Workflow</p>
              <p className="mt-2 text-sm font-semibold text-zinc-700">Open - In Progress - Resolved - Closed</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {!currentUser && (
            <div className="border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Testing Mode User Setup</p>
              <p className="mt-1 text-sm text-amber-700">Login module is not connected yet. Set a temporary user id to test ticket creation.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={testUserInput}
                  onChange={(e) => setTestUserInput(e.target.value)}
                  placeholder="e.g. wd23-student"
                  className="w-full border border-amber-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={applyTestUser}
                  className="border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-zinc-800"
                >
                  Use This User
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Issue Details</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 1 of 2</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Tag size={14} className="text-black" />
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm font-semibold outline-none transition-all focus:border-black"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <AlertCircle size={14} className="text-black" />
                    Priority
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm font-semibold outline-none transition-all focus:border-black"
                  >
                    {PRIORITIES.map(prio => (
                      <option key={prio} value={prio}>{prio}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <MapPin size={14} className="text-black" />
                    Location
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Building A, Room 302"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm font-semibold outline-none transition-all focus:border-black"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Info size={14} className="text-black" />
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full resize-none border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-black"
                  />
                  <p className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {formData.description.length} characters
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Phone size={14} className="text-black" />
                    Preferred Contact
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Email or phone number"
                    value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm font-semibold outline-none transition-all focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Attachments</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 2 of 2</p>
              </div>

              <AttachmentUpload files={files} setFiles={setFiles} />
              {uploadInfo && (
                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  {uploadInfo}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-black bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Submitting...' : (
                <span className="inline-flex items-center justify-center gap-3">
                  <Send size={18} />
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
