import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Users, Shield, Wrench, User as UserIcon, RefreshCw, Search, Settings2, UserCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const { user: currentUser, isAdmin } = useAuth();

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

  const handleDeleteUser = async (userId) => {
    if (!isAdmin()) {
      toast.error('Only admins can delete users.');
      return;
    }

    if (currentUser?.id === userId) {
      toast.error('You cannot delete your own account.');
      return;
    }

    const confirmDelete = window.confirm('Delete this user permanently? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await authApi.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      const roles = Array.isArray(user.roles) ? user.roles : [];
      if (roles.includes('ROLE_ADMIN')) acc.admin += 1;
      if (roles.includes('ROLE_TECHNICIAN')) acc.technician += 1;
      if (roles.includes('ROLE_USER')) acc.user += 1;
      return acc;
    }, { admin: 0, technician: 0, user: 0 });
  }, [users]);

  const filteredUsers = useMemo(() => {
    const needle = search.toLowerCase();
    return users.filter((user) => {
      const display = `${user.name || ''} ${user.email || ''} ${user.githubUsername || ''}`.toLowerCase();
      const roles = Array.isArray(user.roles) ? user.roles : [];
      const roleOk = roleFilter === 'ALL' || roles.includes(roleFilter);
      return roleOk && (needle === '' || display.includes(needle));
    });
  }, [users, search, roleFilter]);

  const roleFilters = [
    { label: 'All', value: 'ALL' },
    { label: 'Admins', value: 'ROLE_ADMIN' },
    { label: 'Technicians', value: 'ROLE_TECHNICIAN' },
    { label: 'Users', value: 'ROLE_USER' },
  ];

  if (loading) return (
    <div className="min-h-screen px-4 py-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl rounded-3xl border p-10 text-center animate-pulse" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.92)', color: 'var(--text-secondary)' }}>
        Loading user governance data...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border p-6 md:p-8" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(249,250,251,0.94))' }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ borderColor: 'rgba(249,115,22,0.28)', color: 'var(--primary)', background: 'rgba(249,115,22,0.08)' }}>
                <Settings2 size={12} /> Access Governance
              </p>
              <h1 className="mt-3 text-3xl font-black md:text-4xl" style={{ color: 'var(--text-primary)' }}>User & Role Administration</h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                Manage system accounts, role assignments, and privilege boundaries for secure operations.
              </p>
            </div>
            <button
              onClick={loadUsers}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ borderColor: 'var(--border)', background: 'white', color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.92)' }}>
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Accounts</p>
              <p className="mt-2 text-3xl font-black" style={{ color: 'var(--primary)' }}>{users.length}</p>
            </article>
            <article className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.92)' }}>
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Administrators</p>
              <p className="mt-2 text-3xl font-black" style={{ color: 'var(--status-approved)' }}>{roleCounts.admin}</p>
            </article>
            <article className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.92)' }}>
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Technicians</p>
              <p className="mt-2 text-3xl font-black" style={{ color: 'var(--status-pending)' }}>{roleCounts.technician}</p>
            </article>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border p-5" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.94)' }}>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search size={16} className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or username..."
                className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'white', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {roleFilters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setRoleFilter(item.value)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: roleFilter === item.value ? 'rgba(249,115,22,0.1)' : 'transparent',
                    color: roleFilter === item.value ? 'var(--primary)' : 'var(--text-secondary)',
                    border: roleFilter === item.value ? '1px solid rgba(249,115,22,0.28)' : '1px solid var(--border)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <th className="p-4 pl-0 text-[11px] font-black uppercase tracking-wider">User Details</th>
                  <th className="p-4 text-[11px] font-black uppercase tracking-wider">Provider</th>
                  <th className="p-4 text-[11px] font-black uppercase tracking-wider">Roles</th>
                  <th className="p-4 pr-0 text-right text-[11px] font-black uppercase tracking-wider">Manage Roles</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-[rgba(249,115,22,0.04)]" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                    <td className="p-4 pl-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: 'var(--border)', background: 'var(--bg-section)' }}>
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} className="h-full w-full rounded-full object-cover" alt="" />
                          ) : (
                            <UserIcon size={14} style={{ color: 'var(--text-secondary)' }} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name || 'No Name'}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email || user.githubUsername}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono uppercase" style={{ color: 'var(--text-secondary)' }}>{user.provider || 'LOCAL'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles && user.roles.map(r => (
                          <span key={r} className="rounded-md border px-2 py-0.5 text-[10px] font-bold" style={{ borderColor: 'rgba(249,115,22,0.22)', background: 'rgba(249,115,22,0.1)', color: 'var(--primary)' }}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 pr-0 text-right">
                      <div className="flex justify-end gap-2">
                        <RoleBtn
                          icon={<Shield size={12} />}
                          active={user.roles?.includes('ROLE_ADMIN')}
                          onClick={() => handleRoleToggle(user.id, 'ROLE_ADMIN', user.roles?.includes('ROLE_ADMIN'))}
                          label="Admin"
                        />
                        <RoleBtn
                          icon={<Wrench size={12} />}
                          active={user.roles?.includes('ROLE_TECHNICIAN')}
                          onClick={() => handleRoleToggle(user.id, 'ROLE_TECHNICIAN', user.roles?.includes('ROLE_TECHNICIAN'))}
                          label="Tech"
                        />
                        <RoleBtn
                          icon={<UserCheck size={12} />}
                          active={user.roles?.includes('ROLE_USER')}
                          onClick={() => handleRoleToggle(user.id, 'ROLE_USER', user.roles?.includes('ROLE_USER'))}
                          label="User"
                        />
                        {isAdmin() && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={currentUser?.id === user.id}
                            className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                              borderColor: 'rgba(239,68,68,0.3)',
                              background: currentUser?.id === user.id ? 'rgba(248,113,113,0.12)' : 'rgba(239,68,68,0.08)',
                              color: 'var(--status-rejected)',
                            }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No users found for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const RoleBtn = ({ icon, active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
      active ? 'hover:opacity-90' : 'hover:-translate-y-0.5'
    }`}
    style={
      active
        ? { background: 'rgba(16,185,129,0.16)', borderColor: 'rgba(16,185,129,0.32)', color: '#047857' }
        : { background: 'var(--bg-section)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
    }
  >
    {icon} {label}
  </button>
);
