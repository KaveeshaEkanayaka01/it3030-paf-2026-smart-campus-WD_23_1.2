import React, { useMemo, useState } from 'react';
import { LockKeyhole, LogIn, RotateCcw, UserRound } from 'lucide-react';
import {
  getCurrentUserId,
  getCurrentUserRole,
  setCurrentUserId,
  setCurrentUserRole,
} from '../services/ticketService';

const ROLES = ['USER', 'TECHNICIAN', 'STAFF', 'ADMIN'];

const getDefaultUserByRole = (role) => {
  const normalized = String(role || 'USER').toUpperCase();
  if (normalized === 'ADMIN') return 'wd23-admin';
  if (normalized === 'STAFF') return 'wd23-staff';
  if (normalized === 'TECHNICIAN') return 'wd23-tech';
  return 'wd23-student';
};

export const TempAuthPanel = () => {
  const [userIdInput, setUserIdInput] = useState(getCurrentUserId() || '');
  const [roleInput, setRoleInput] = useState(getCurrentUserRole());
  const [message, setMessage] = useState('');

  const activeUser = useMemo(() => getCurrentUserId() || 'none', [message]);
  const activeRole = useMemo(() => getCurrentUserRole(), [message]);

  const applyTemporaryLogin = () => {
    const finalUserId = String(userIdInput || '').trim() || getDefaultUserByRole(roleInput);
    const userApplied = setCurrentUserId(finalUserId);
    const roleApplied = setCurrentUserRole(roleInput);

    if (!userApplied || !roleApplied) {
      setMessage('Could not apply temporary login. Please try again.');
      return;
    }

    setUserIdInput(finalUserId);
    setMessage(`Logged in as ${finalUserId} (${String(roleInput).toUpperCase()})`);
  };

  const useRolePreset = (role) => {
    setRoleInput(role);
    setUserIdInput(getDefaultUserByRole(role));
    setMessage('Preset selected. Click apply to activate.');
  };

  const clearTemporaryLogin = () => {
    ['currentUser', 'userId', 'username', 'currentUserRole', 'userRole', 'role'].forEach((key) => {
      localStorage.removeItem(key);
    });
    setUserIdInput('');
    setRoleInput('USER');
    setMessage('Temporary login cleared.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] border border-zinc-200 bg-white p-4 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-3">
        <LockKeyhole size={16} className="text-black" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-black">Temporary Login</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Session</p>
          <p className="text-xs font-semibold text-zinc-700">{activeUser} ({activeRole})</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">User ID</label>
          <div className="flex items-center gap-2 border border-zinc-300 bg-zinc-50 px-3 py-2">
            <UserRound size={14} className="text-zinc-500" />
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g. wd23-student"
              className="w-full bg-transparent text-xs font-semibold outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Role</label>
          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            className="w-full border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => useRolePreset(role)}
              className="border border-zinc-300 bg-zinc-50 px-1 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:border-black hover:text-black"
            >
              {role.slice(0, 1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={applyTemporaryLogin}
            className="inline-flex items-center justify-center gap-2 border border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:bg-zinc-800"
          >
            <LogIn size={12} />
            Apply
          </button>
          <button
            type="button"
            onClick={clearTemporaryLogin}
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-700 hover:border-black hover:text-black"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        </div>

        {message && <p className="text-[10px] font-semibold text-zinc-500">{message}</p>}
      </div>
    </div>
  );
};
