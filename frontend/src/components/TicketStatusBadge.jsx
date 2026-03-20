import { AlertCircle, CheckCircle2, Circle, Clock3, XCircle } from 'lucide-react';
import { STATUS_COLORS } from '../utils/statusColors';
import { cn } from '../utils/cn';

const STATUS_META = {
  OPEN: {
    icon: AlertCircle,
    ringClass: 'ring-blue-200/70',
  },
  IN_PROGRESS: {
    icon: Clock3,
    ringClass: 'ring-amber-200/70',
  },
  RESOLVED: {
    icon: CheckCircle2,
    ringClass: 'ring-emerald-200/70',
  },
  CLOSED: {
    icon: Circle,
    ringClass: 'ring-zinc-300/70',
  },
  REJECTED: {
    icon: XCircle,
    ringClass: 'ring-rose-200/70',
  },
  DEFAULT: {
    icon: Circle,
    ringClass: 'ring-zinc-300/70',
  },
};

export const TicketStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || 'OPEN').toUpperCase();
  const badgeClass = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.DEFAULT;
  const statusMeta = STATUS_META[normalizedStatus] || STATUS_META.DEFAULT;
  const StatusIcon = statusMeta.icon;
  const label = normalizedStatus.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm ring-1',
        statusMeta.ringClass,
        badgeClass,
      )}
    >
      <StatusIcon size={12} strokeWidth={2.4} />
      <span>{label}</span>
    </span>
  );
};
