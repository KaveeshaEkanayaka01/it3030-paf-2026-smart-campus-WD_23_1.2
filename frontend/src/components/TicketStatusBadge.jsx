import React from 'react'

const STATUS_STYLES = {
  OPEN: 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
  IN_PROGRESS: 'bg-[rgba(249,115,22,0.12)] text-[var(--primary)] border border-[rgba(249,115,22,0.22)]',
  RESOLVED: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
  CLOSED: 'bg-slate-100 text-slate-600 border border-slate-200',
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
