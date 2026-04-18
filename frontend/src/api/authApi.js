import api from './axios';

export const authApi = {
  getMe: () => api.get('/auth/me'),
  login: (data) => api.post('/auth/login', data),
  getAllUsers: () => api.get('/users'),
  getTechnicians: () => api.get('/users/technicians'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (userId, role, action) =>
    api.put(`/users/${userId}/role`, { role, action }),
};