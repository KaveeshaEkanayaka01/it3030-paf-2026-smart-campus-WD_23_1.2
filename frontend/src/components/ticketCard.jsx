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
      className="bg-white rounded-none border border-zinc-200 p-6 shadow-sm hover:shadow-xl hover:border-black transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-black text-black group-hover:underline decoration-2 underline-offset-4 transition-all">
            {ticket?.category || 'Uncategorized'}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1 font-mono">ID: #{String(ticket?.id ?? '').slice(0, 8)}</p>
        </div>
        <TicketStatusBadge status={ticket?.status} />
      </div>

      <p className="text-sm text-zinc-600 line-clamp-2 mb-6 leading-relaxed">
        {ticket?.description}
      </p>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400">
          <MapPin size={12} />
          <span>{ticket?.location || 'Unknown location'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400">
          <Clock size={12} />
          <span>{createdAt}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-[10px] font-bold uppercase', priorityClass)}>
          <AlertCircle size={12} className="text-black" />
          <span>
            {ticket?.priority || 'UNKNOWN'}
          </span>
        </div>
        {ticket?.assignedTechnician && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400">
            <User size={12} />
            <span>{ticket.assignedTechnician}</span>
          </div>
        )}
      </div>
    </div>
  );
};
