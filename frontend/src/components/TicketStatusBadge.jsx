import React from 'react'

const STATUS_STYLES = {
  OPEN: 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
  IN_PROGRESS: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30',
  RESOLVED: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
  CLOSED: 'bg-slate-500/20 text-slate-300 border border-slate-400/30',
  REJECTED: 'bg-rose-500/20 text-rose-300 border border-rose-400/30',
}

export function TicketStatusBadge({ status }) {
  const normalized = String(status || 'OPEN').toUpperCase()
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        STATUS_STYLES[normalized] || STATUS_STYLES.OPEN
      }`}
    >
      {normalized.replace('_', ' ')}
    </span>
  )
}
