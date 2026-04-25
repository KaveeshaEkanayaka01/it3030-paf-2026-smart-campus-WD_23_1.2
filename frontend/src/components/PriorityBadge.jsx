import React from 'react'
import { AlertTriangle } from 'lucide-react'

const PRIORITY_STYLES = {
  LOW: 'text-[var(--text-secondary)] bg-[var(--bg-section)] border border-[var(--border)]',
  MEDIUM: 'text-amber-700 bg-amber-100 border border-amber-200',
  HIGH: 'text-[var(--primary)] bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.22)]',
  CRITICAL: 'text-rose-700 bg-rose-100 border border-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.1)]',
  UNKNOWN: 'text-[var(--text-secondary)] bg-[var(--bg-section)] border border-[var(--border)]',
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
