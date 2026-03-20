import { STATUS_COLORS } from '../utils/statusColors';
import { cn } from '../utils/cn';

export const TicketStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || 'OPEN').toUpperCase();
  const badgeClass = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.DEFAULT;

  return (
    <span
      className={cn(
        'inline-flex items-center border px-3 py-1 text-[10px] font-black uppercase tracking-widest',
        badgeClass,
      )}
    >
      {normalizedStatus}
    </span>
  );
};
