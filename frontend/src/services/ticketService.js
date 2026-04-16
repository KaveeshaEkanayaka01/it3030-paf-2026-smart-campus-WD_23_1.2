import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const USER_KEYS = ['currentUser', 'userId', 'username'];
const ROLE_KEYS = ['currentUserRole', 'userRole', 'role'];

const normalizeStoredUser = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (typeof parsed === 'string') {
      return parsed.trim() || null;
    }

    if (parsed && typeof parsed === 'object') {
      const candidate = parsed.userId || parsed.username || parsed.name || parsed.email;
      return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
    }
  } catch {
    return rawValue.trim() || null;
  }

  return null;
};

export const getCurrentUserId = () => {
  for (const key of USER_KEYS) {
    const value = normalizeStoredUser(localStorage.getItem(key));
    if (value) {
      return value;
    }
  }

  return null;
};

export const setCurrentUserId = (userId) => {
  const normalized = String(userId || '').trim();
  if (!normalized) {
    return false;
  }

  localStorage.setItem('currentUser', normalized);
  return true;
};

export const getCurrentUserRole = () => {
  for (const key of ROLE_KEYS) {
    const value = normalizeStoredUser(localStorage.getItem(key));
    if (value) {
      return value.toUpperCase();
    }
  }

  return 'USER';
};

export const setCurrentUserRole = (role) => {
  const normalized = String(role || '').trim().toUpperCase();
  if (!normalized) {
    return false;
  }

  localStorage.setItem('currentUserRole', normalized);
  return true;
};

export const ticketService = {
  createTicket: async (ticketData) => {
    const createdBy = getCurrentUserId();
    if (!createdBy) {
      throw new Error('Missing user identity. Set localStorage currentUser, userId, or username.');
    }

    const response = await api.post('/tickets', {
      ...ticketData,
      createdBy,
    });
    return response.data;
  },

  getMyTickets: async (createdBy) => {
    if (!createdBy) {
      throw new Error('Missing createdBy for /tickets/my endpoint.');
    }

    const response = await api.get('/tickets/my', {
      params: { createdBy },
    });
    return response.data;
  },

  getAllTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  getTicketAttachments: async (id) => {
    const response = await api.get(`/tickets/${id}/attachments`);
    return response.data;
  },

  assignTechnician: async (id, technician, actorRole = getCurrentUserRole()) => {
    const response = await api.put(`/tickets/${id}/assign`, null, {
      params: { technician, actorRole },
    });
    return response.data;
  },

  updateStatus: async (id, status, actorRole = getCurrentUserRole(), resolutionNotes = '', rejectionReason = '') => {
    const response = await api.put(`/tickets/${id}/status`, {
      status,
      actorRole,
      resolutionNotes,
      rejectionReason,
    });
    return response.data;
  },

  deleteTicket: async (id, actorRole = getCurrentUserRole()) => {
    const response = await api.delete(`/tickets/${id}`, {
      params: { actorRole },
    });
    return response.data;
  },

  getTicketComments: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  addComment: async (ticketId, text, currentUserId) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, {
      message: text,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  updateComment: async (commentId, text, actorUserId, actorRole = getCurrentUserRole()) => {
    const response = await api.put(
      `/comments/${commentId}`,
      { message: text },
      {
        params: { actorUserId, actorRole },
      },
    );
    return response.data;
  },

  deleteComment: async (commentId, actorUserId, actorRole = getCurrentUserRole()) => {
    const response = await api.delete(`/comments/${commentId}`, {
      params: { actorUserId, actorRole },
    });
    return response.data;
  },

  uploadAttachments: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/tickets/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
