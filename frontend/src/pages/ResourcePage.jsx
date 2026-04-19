import { useCallback, useEffect, useState } from 'react'
import {
  Search,
  RefreshCw,
  PlusCircle,
  Boxes,
  Grid2X2,
  List,
} from 'lucide-react'
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
  const [minCapacityFilter, setMinCapacityFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [viewingResource, setViewingResource] = useState(null)
  const [layout, setLayout] = useState('grid')

  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}

      if (typeFilter !== 'ALL') params.type = typeFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (locationFilter.trim()) params.location = locationFilter.trim()
      if (search.trim()) params.q = search.trim()
      if (minCapacityFilter !== '') params.minCapacity = Number(minCapacityFilter)

      const res = await resourceApi.getAll(params)
      setResources(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter, locationFilter, search, minCapacityFilter])

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchResources()
    }, 300)

    return () => clearTimeout(timeout)
  }, [fetchResources])

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
    const resourceId = editingResource?.id || editingResource?._id
    if (!resourceId) return

    try {
      setSaving(true)
      await resourceApi.update(resourceId, payload)
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
    const resourceId = resource?.id || resource?._id
    if (!resourceId) return
    if (!window.confirm(`Delete "${resource.name}"?`)) return

    try {
      await resourceApi.deleteById(resourceId)
      toast.success('Resource deleted successfully.')
      fetchResources()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete resource.')
    }
  }

  const openCreateModal = () => {
    setViewingResource(null)
    setEditingResource(null)
    setModalOpen(true)
  }

  const openEditModal = (resource) => {
    setViewingResource(null)
    setEditingResource(resource)
    setModalOpen(true)
  }

  const openViewModal = (resource) => {
    setEditingResource(null)
    setViewingResource(resource)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingResource(null)
    setViewingResource(null)
  }

  return (
    <div className="min-h-screen py-10 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
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
                className="text-sm uppercase tracking-[0.18em]"
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
                className="px-5 py-3 rounded-2xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
                }}
              >
                <PlusCircle size={16} />
                New Resource
              </button>
            )}
          </div>
        </div>

        <div
          className="glass-card p-4 mb-6 flex flex-col lg:flex-row gap-3 items-stretch"
          style={{
            background: 'rgba(148,163,184,0.18)',
            border: '1px solid rgba(148,163,184,0.18)',
          }}
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--muted)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, type, location, or description..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none"
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148,163,184,0.18)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-4 rounded-2xl text-sm outline-none min-w-[160px]"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148,163,184,0.18)',
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
            className="px-4 py-4 rounded-2xl text-sm outline-none min-w-[180px]"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148,163,184,0.18)',
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
            className="px-4 py-4 rounded-2xl text-sm outline-none min-w-[180px]"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148,163,184,0.18)',
              color: 'var(--text-primary)',
            }}
          />

          <input
            type="number"
            min="0"
            value={minCapacityFilter}
            onChange={(e) => setMinCapacityFilter(e.target.value)}
            placeholder="Min capacity"
            className="px-4 py-4 rounded-2xl text-sm outline-none min-w-[160px]"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148,163,184,0.18)',
              color: 'var(--text-primary)',
            }}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className="w-14 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background:
                  layout === 'grid'
                    ? 'linear-gradient(135deg, var(--accent-start), var(--accent-end))'
                    : 'rgba(15, 23, 42, 0.85)',
                color: '#fff',
                border: '1px solid rgba(148,163,184,0.18)',
                boxShadow:
                  layout === 'grid'
                    ? '0 0 20px rgba(34,211,238,0.25)'
                    : 'none',
              }}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              type="button"
              onClick={() => setLayout('list')}
              className="w-14 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background:
                  layout === 'list'
                    ? 'linear-gradient(135deg, var(--accent-start), var(--accent-end))'
                    : 'rgba(15, 23, 42, 0.85)',
                color: '#fff',
                border: '1px solid rgba(148,163,184,0.18)',
                boxShadow:
                  layout === 'list'
                    ? '0 0 20px rgba(34,211,238,0.25)'
                    : 'none',
              }}
            >
              <List size={18} />
            </button>
          </div>
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
                {resources.length}
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
        ) : resources.length === 0 ? (
          <div className="glass-card p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            No resources found.
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id || resource._id}
                resource={resource}
                isAdmin={isAdmin}
                layout="grid"
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id || resource._id}
                resource={resource}
                isAdmin={isAdmin}
                layout="list"
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ResourceFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={editingResource ? handleUpdate : handleCreate}
        initialData={editingResource || viewingResource}
        loading={saving}
        readOnly={Boolean(viewingResource)}
      />
    </div>
  )
}