import React from 'react'
import { AlertTriangle } from 'lucide-react'

const PRIORITY_STYLES = {
  LOW: 'text-emerald-200 bg-emerald-500/15 border border-emerald-400/30',
  MEDIUM: 'text-amber-200 bg-amber-500/15 border border-amber-400/30',
  HIGH: 'text-orange-200 bg-orange-500/15 border border-orange-400/30',
  CRITICAL: 'text-rose-200 bg-rose-500/15 border border-rose-400/40 shadow-[0_0_18px_rgba(244,63,94,0.18)]',
  UNKNOWN: 'text-slate-200 bg-slate-500/15 border border-slate-400/30',
}

export function PriorityBadge({ priority, className = '' }) {
  const normalized = String(priority || 'UNKNOWN').toUpperCase()
  const style = PRIORITY_STYLES[normalized] || PRIORITY_STYLES.UNKNOWN

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${style} ${className}`}
    >
      <AlertTriangle size={12} />
      {normalized}
    </span>
  )
}
