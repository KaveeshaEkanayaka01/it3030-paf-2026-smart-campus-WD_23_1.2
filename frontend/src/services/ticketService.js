import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const USER_KEYS = ['currentUser', 'userId', 'username'];

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

  getTicketById: async () => {
    throw new Error('Ticket details endpoint is not available in the current backend API.');
  },

  assignTechnician: async (id, technician) => {
    const response = await api.put(`/tickets/${id}/assign`, null, {
      params: { technician },
    });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/tickets/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  addComment: async () => {
    throw new Error('Comments are temporarily unavailable in this frontend build.');
  },

  deleteComment: async () => {
    throw new Error('Comments are temporarily unavailable in this frontend build.');
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
