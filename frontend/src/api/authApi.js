import api from './axios';

export const authApi = {
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (userId, role, action) =>
    api.put(`/users/${userId}/role`, { role, action }),
};