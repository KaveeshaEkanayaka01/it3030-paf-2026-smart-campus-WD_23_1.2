import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { getCurrentUserId, setCurrentUserId, ticketService } from '../services/ticketService';
import { TicketCard } from '../components/ticketCard';

export const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [testUserInput, setTestUserInput] = useState(getCurrentUserId() || '');
  const [identityVersion, setIdentityVersion] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        setError('No current user found. Set localStorage currentUser, userId, or username.');
        return;
      }

      try {
        const data = await ticketService.getMyTickets(currentUserId);
        setTickets(data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to fetch tickets. Check backend availability and user identity.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [identityVersion]);

  const applyTestUser = () => {
    if (!setCurrentUserId(testUserInput)) {
      setError('Enter a valid user id before continuing.');
      return;
    }

    setError('');
    setLoading(true);
    setIdentityVersion((prev) => prev + 1);
  };

  const filteredTickets = tickets.filter((t) => 
    String(t.category || '').toLowerCase().includes(search.toLowerCase()) ||
    String(t.description || '').toLowerCase().includes(search.toLowerCase()) ||
    String(t.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Incident Tickets</h1>
          <p className="text-zinc-500 mt-2 font-bold uppercase text-[10px] tracking-widest">Track and manage your reported issues.</p>
        </div>
        <button
          onClick={() => navigate('/create-ticket')}
          className="bg-black text-white font-black px-8 py-4 rounded-none hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 flex items-center gap-3 uppercase tracking-widest text-sm"
        >
          <Plus size={20} />
          New Ticket
        </button>
      </div>

      {!getCurrentUserId() && (
        <div className="mb-6 border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Testing Mode User Setup</p>
          <p className="mt-1 text-sm text-amber-700">Login module is not connected yet. Set a temporary user id to load tickets.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={testUserInput}
              onChange={(e) => setTestUserInput(e.target.value)}
              placeholder="e.g. wd23-student"
              className="w-full border border-amber-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={applyTestUser}
              className="border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-zinc-800"
            >
              Use This User
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-none border border-zinc-200 p-6 mb-10 flex flex-col md:flex-row gap-6 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search tickets by category, location, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-none text-sm focus:border-black outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-zinc-500 hover:bg-black hover:text-white transition-all">
            <Filter size={20} />
          </button>
          <div className="h-full w-px bg-zinc-200 mx-2" />
          <button className="p-4 bg-black border border-black rounded-none text-white">
            <LayoutGrid size={20} />
          </button>
          <button className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-zinc-500 hover:bg-black hover:text-white transition-all">
            <List size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-zinc-50 animate-pulse rounded-none border border-zinc-200" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-zinc-50 rounded-none border-2 border-dashed border-zinc-200">
          <h3 className="text-xl font-black text-black uppercase tracking-tight">Unable to load tickets</h3>
          <p className="text-zinc-500 mt-2 max-w-lg mx-auto font-medium">{error}</p>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((ticket) => (
            <TicketCard 
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              key={ticket.id} 
              ticket={ticket} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-50 rounded-none border-2 border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100">
            <Search className="text-zinc-200" size={40} />
          </div>
          <h3 className="text-xl font-black text-black uppercase tracking-tight">No tickets found</h3>
          <p className="text-zinc-500 mt-2 max-w-xs mx-auto font-medium">
            {search ? "We couldn't find any tickets matching your search criteria." : "You haven't reported any incidents yet."}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/create-ticket')}
              className="mt-8 text-black font-black uppercase tracking-widest text-xs hover:underline underline-offset-4"
            >
              Report your first incident
            </button>
          )}
        </div>
      )}
    </div>
  );
};
