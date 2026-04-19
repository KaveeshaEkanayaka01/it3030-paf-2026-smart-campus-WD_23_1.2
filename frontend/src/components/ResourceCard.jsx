import { MapPin, Users, Wrench, Pencil, Trash2, Clock3 } from 'lucide-react'

export default function ResourceCard({
  resource,
  isAdmin = false,
  onEdit,
  onDelete,
}) {
  const statusColor =
    resource?.status === 'ACTIVE'
      ? 'var(--status-approved)'
      : 'var(--status-rejected)'

  const statusBg =
    resource?.status === 'ACTIVE'
      ? 'var(--status-approved-bg)'
      : 'var(--status-rejected-bg)'

  return (
    <div className="glass-card p-5 rounded-2xl h-full flex flex-col">
      {resource?.imageUrl ? (
        <img
          src={resource.imageUrl}
          alt={resource?.name || 'Resource'}
          className="w-full h-44 object-cover rounded-xl mb-4"
        />
      ) : (
        <div
          className="w-full h-44 rounded-xl mb-4 flex items-center justify-center text-sm font-semibold"
          style={{
            background: 'rgba(15, 23, 42, 0.35)',
            color: 'var(--text-secondary)',
          }}
        >
          No Image
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {resource?.name}
          </h3>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent-mid)' }}
          >
            {String(resource?.type || '').replaceAll('_', ' ')}
          </p>
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            color: statusColor,
            background: statusBg,
            border: `1px solid ${statusColor}33`,
          }}
        >
          {resource?.status}
        </span>
      </div>

      <p
        className="text-sm mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {resource?.description || 'No description available.'}
      </p>

      <div className="space-y-2 text-sm mb-5">
        <div
          className="flex items-center gap-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <MapPin size={15} style={{ color: 'var(--accent-mid)' }} />
          <span>{resource?.location || 'N/A'}</span>
        </div>

        <div
          className="flex items-center gap-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Users size={15} style={{ color: 'var(--accent-mid)' }} />
          <span>Capacity: {resource?.capacity ?? 0}</span>
        </div>

        <div
          className="flex items-center gap-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Clock3 size={15} style={{ color: 'var(--accent-mid)' }} />
          <span>
            {resource?.availableFrom && resource?.availableTo
              ? `${resource.availableFrom} - ${resource.availableTo}`
              : 'No availability window'}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        {isAdmin ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(resource)}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--accent-mid)',
                border: '1px solid rgba(99,102,241,0.18)',
              }}
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={() => onDelete?.(resource)}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: 'rgba(239,68,68,0.12)',
                color: 'var(--status-rejected)',
                border: '1px solid rgba(239,68,68,0.18)',
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ) : (
          <div
            className="w-full px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: 'rgba(14,165,233,0.08)',
              color: 'var(--accent-mid)',
              border: '1px solid rgba(14,165,233,0.12)',
            }}
          >
            <Wrench size={16} />
            View Only
          </div>
        )}
      </div>
    </div>
  )
}