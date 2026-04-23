import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { Users, Shield, Wrench, User as UserIcon, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await authApi.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleToggle = async (userId, role, hasRole) => {
    const action = hasRole ? 'REMOVE' : 'ADD';
    try {
      await authApi.updateUserRole(userId, role, action);
      toast.success(`Role ${action === 'ADD' ? 'added' : 'removed'} successfully`);
      loadUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Role update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto p-10 text-center animate-pulse text-slate-400">Loading Users...</div>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel overflow-hidden mt-6 rounded-3xl p-6 shadow-xl relative z-10">
          <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100"><Users size={20} className="text-pink-400"/> System Users</h2>
        <button onClick={loadUsers} className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"><RefreshCw size={14}/> Refresh</button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-white/10">
              <th className="p-4 pl-0">User Details</th>
              <th className="p-4">Provider</th>
              <th className="p-4">Roles</th>
              <th className="p-4 text-right pr-0">Manage Roles</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 pl-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-800">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" alt=""/>
                      ) : (
                        <UserIcon size={14} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{user.name || 'No Name'}</p>
                      <p className="text-xs text-slate-500">{user.email || user.githubUsername}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-mono uppercase text-slate-400">{user.provider || 'LOCAL'}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles && user.roles.map(r => (
                      <span key={r} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {r.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 pr-0 text-right">
                  <div className="flex justify-end gap-2">
                    <RoleBtn 
                      icon={<Shield size={12}/>} 
                      active={user.roles?.includes('ROLE_ADMIN')} 
                      onClick={() => handleRoleToggle(user.id, 'ROLE_ADMIN', user.roles?.includes('ROLE_ADMIN'))}
                      label="Admin"
                    />
                    <RoleBtn 
                      icon={<Wrench size={12}/>} 
                      active={user.roles?.includes('ROLE_TECHNICIAN')} 
                      onClick={() => handleRoleToggle(user.id, 'ROLE_TECHNICIAN', user.roles?.includes('ROLE_TECHNICIAN'))}
                      label="Tech"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
}

const RoleBtn = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
      active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'
    }`}
  >
    {icon} {label}
  </button>
);
