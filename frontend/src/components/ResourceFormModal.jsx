import { useEffect, useState } from 'react'
import { X, Save, PlusCircle } from 'lucide-react'

const TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

const defaultForm = {
  name: '',
  type: 'LECTURE_HALL',
  capacity: '',
  location: '',
  description: '',
  status: 'ACTIVE',
  imageUrl: '',
  availableFrom: '',
  availableTo: '',
}

export default function ResourceFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        type: initialData.type || 'LECTURE_HALL',
        capacity: initialData.capacity ?? '',
        location: initialData.location || '',
        description: initialData.description || '',
        status: initialData.status || 'ACTIVE',
        imageUrl: initialData.imageUrl || '',
        availableFrom: initialData.availableFrom || '',
        availableTo: initialData.availableTo || '',
      })
    } else {
      setForm(defaultForm)
    }
  }, [initialData, open])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      capacity: Number(form.capacity),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl glass-card p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {initialData ? 'Edit Resource' : 'Create Resource'}
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Manage resource catalogue details
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type} style={{ backgroundColor: '#0f172a' }}>
                    {type.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                min="0"
                value={form.capacity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status} style={{ backgroundColor: '#0f172a' }}>
                    {status.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Available From
              </label>
              <input
                name="availableFrom"
                type="time"
                value={form.availableFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Available To
              </label>
              <input
                name="availableTo"
                type="time"
                value={form.availableTo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(148,163,184,0.22)',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              }}
            >
              {initialData ? <Save size={16} /> : <PlusCircle size={16} />}
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}