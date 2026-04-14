import React from 'react';
import { MapPin, Clock, User, AlertCircle } from 'lucide-react';
import { TicketStatusBadge } from './TicketStatusBadge';
import { PRIORITY_COLORS } from '../utils/statusColors';
import { cn } from '../utils/cn';

export const TicketCard = ({ ticket, onClick }) => {
  const priorityClass = PRIORITY_COLORS[ticket?.priority] || PRIORITY_COLORS.DEFAULT;
  const createdAt = ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div
      onClick={onClick}
      className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:glass-panel-strong hover:-translate-y-1 cursor-pointer group flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-fuchsia-400 transition-colors">
            {ticket?.category || 'Uncategorized'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono tracking-wider opacity-60">#{String(ticket?.id ?? '').slice(0, 8)}</p>
        </div>
        <TicketStatusBadge status={ticket?.status} />
      </div>

      <p className="text-sm text-slate-300 line-clamp-2 mb-6 leading-relaxed flex-grow font-light">
        {ticket?.description}
      </p>

      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <MapPin size={12} className="text-fuchsia-400" />
          <span className="truncate">{ticket?.location || 'Unknown location'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <Clock size={12} className="text-violet-400" />
          <span>{createdAt}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider', priorityClass)}>
          <AlertCircle size={12} />
          <span>
            {ticket?.priority || 'UNKNOWN'}
          </span>
        </div>
        {ticket?.assignedTechnician && (
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <User size={12} className="text-indigo-400" />
            <span className="truncate">{ticket.assignedTechnician}</span>
          </div>
        )}
      </div>
    </div>
  );
};
