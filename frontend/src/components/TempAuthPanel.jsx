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
    <div className="fixed bottom-4 right-4 z-50 w-[320px] glass-panel-strong rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
        <LockKeyhole size={18} className="text-indigo-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-100">Dev Login</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Active Session</p>
          <p className="text-xs font-medium text-indigo-300">{activeUser} <span className="text-slate-500">({activeRole})</span></p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">User ID</label>
          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2.5">
            <UserRound size={14} className="text-slate-400" />
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g. wd23-student"
              className="w-full bg-transparent text-xs font-medium outline-none text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Role</label>
          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider outline-none text-slate-200"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => useRolePreset(role)}
              className="rounded-lg bg-white/5 px-1 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-white/10 hover:text-white border border-white/5"
            >
              {role.slice(0, 1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={applyTemporaryLogin}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <LogIn size={12} />
            Apply
          </button>
          <button
            type="button"
            onClick={clearTemporaryLogin}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-all hover:bg-white/10 hover:text-white border border-white/10"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        </div>

        {message && <p className="text-[10px] font-medium text-emerald-400">{message}</p>}
      </div>
    </div>
  );
};
