import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, RefreshCw, PlusCircle, Boxes } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { resourceApi } from '../api/resourceApi'
import ResourceCard from '../components/ResourceCard'
import ResourceFormModal from '../components/ResourceFormModal'

const FILTER_TYPES = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const FILTER_STATUS = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE']

export default function ResourcePage() {
  const { user } = useAuth()
  const isAdmin =
    Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN')

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [locationFilter, setLocationFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}

      if (typeFilter !== 'ALL') params.type = typeFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (locationFilter.trim()) params.location = locationFilter.trim()

      const res = await resourceApi.getAll(params)
      setResources(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter, locationFilter])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const q = search.trim().toLowerCase()
      if (!q) return true

      return (
        String(resource?.name || '').toLowerCase().includes(q) ||
        String(resource?.location || '').toLowerCase().includes(q) ||
        String(resource?.type || '').toLowerCase().includes(q) ||
        String(resource?.description || '').toLowerCase().includes(q)
      )
    })
  }, [resources, search])

  const handleCreate = async (payload) => {
    try {
      setSaving(true)
      await resourceApi.create(payload)
      toast.success('Resource created successfully.')
      setModalOpen(false)
      setEditingResource(null)
      fetchResources()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create resource.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (payload) => {
    if (!editingResource?.id) return

    try {
      setSaving(true)
      await resourceApi.update(editingResource.id, payload)
      toast.success('Resource updated successfully.')
      setModalOpen(false)
      setEditingResource(null)
      fetchResources()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update resource.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (resource) => {
    if (!resource?.id) return
    if (!window.confirm(`Delete "${resource.name}"?`)) return

    try {
      await resourceApi.deleteById(resource.id)
      toast.success('Resource deleted successfully.')
      fetchResources()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete resource.')
    }
  }

  const openCreateModal = () => {
    setEditingResource(null)
    setModalOpen(true)
  }

  const openEditModal = (resource) => {
    setEditingResource(resource)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen py-10 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              }}
            >
              <Boxes size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Resources
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Browse and manage campus facilities and assets
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchResources}
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10"
              style={{ color: 'var(--accent-mid)' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
                }}
              >
                <PlusCircle size={16} />
                New Resource
              </button>
            )}
          </div>
        </div>

        <div className="glass-card p-4 mb-6 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-3"
              style={{ color: 'var(--muted)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, type, location, or description."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'transparent',
                border: '1px solid rgba(15,23,42,0.06)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(148,163,184,0.25)',
              color: 'var(--text-primary)',
            }}
          >
            {FILTER_TYPES.map((type) => (
              <option key={type} value={type} style={{ backgroundColor: '#0f172a' }}>
                {type === 'ALL' ? 'All Types' : type.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(148,163,184,0.25)',
              color: 'var(--text-primary)',
            }}
          >
            {FILTER_STATUS.map((status) => (
              <option key={status} value={status} style={{ backgroundColor: '#0f172a' }}>
                {status === 'ALL' ? 'All Statuses' : status.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location"
            className="px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'transparent',
              border: '1px solid rgba(15,23,42,0.06)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-mid)' }}>
                {resources.length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Total
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--status-approved)' }}>
                {resources.filter((r) => r.status === 'ACTIVE').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Active
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--status-rejected)' }}>
                {resources.filter((r) => r.status === 'OUT_OF_SERVICE').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Out of Service
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-mid)' }}>
                {filteredResources.length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Showing
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="glass-card p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            Loading resources...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="glass-card p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ResourceFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingResource(null)
        }}
        onSubmit={editingResource ? handleUpdate : handleCreate}
        initialData={editingResource}
        loading={saving}
      />
    </div>
  )
}