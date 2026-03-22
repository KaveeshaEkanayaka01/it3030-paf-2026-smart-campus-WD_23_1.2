import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Send, MapPin, Phone, Info, Tag } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Report an Incident</h1>
        <p className="text-zinc-500 mt-2 font-bold uppercase text-[10px] tracking-widest">Maintenance & Resource Management</p>
      </div>

      {!currentUser && (
        <div className="mb-6 border border-amber-200 bg-amber-50 p-4">
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

      <form onSubmit={handleSubmit} className="space-y-12">
        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-none border border-zinc-200 p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <Tag size={14} className="text-black" />
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-sm focus:border-black outline-none transition-all font-bold"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <AlertCircle size={14} className="text-black" />
                Priority
              </label>
              <select
                required
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-sm focus:border-black outline-none transition-all font-bold"
              >
                {PRIORITIES.map(prio => (
                  <option key={prio} value={prio}>{prio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
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
              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-sm focus:border-black outline-none transition-all font-bold"
            />
          </div>

          <div className="space-y-3">
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
              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-sm focus:border-black outline-none transition-all resize-none font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Phone size={14} className="text-black" />
              Preferred Contact
            </label>
            <input
              required
              type="text"
              placeholder="Email or Phone number"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-sm focus:border-black outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="bg-white rounded-none border border-zinc-200 p-10 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
            Attachments
          </h3>
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
          className="w-full bg-black text-white font-black py-5 rounded-none hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          {loading ? 'Submitting...' : (
            <>
              <Send size={20} />
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
};
