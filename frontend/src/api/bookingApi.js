import axios from 'axios';

// Backend runs on port 8091 (see backend/src/main/resources/application.properties)
const API_BASE = 'http://localhost:8091/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Bookings ────────────────────────────────────────────
export const bookingApi = {
  // 1. POST /api/bookings — Create booking
  create: (data) => api.post('/bookings', data),

  // 2. GET /api/bookings/my?userId=x — My bookings
  getMyBookings: (userId) => api.get(`/bookings/my?userId=${userId}`),

  // 3. GET /api/bookings — All bookings (admin)
  getAll: () => api.get('/bookings'),

  // 4. PUT /api/bookings/{id}/approve
  approve: (id) => api.put(`/bookings/${id}/approve`, {}),

  // 5. PUT /api/bookings/{id}/reject
  reject: (id, reason) => api.put(`/bookings/${id}/reject`, { reason: reason }),

  // 6. PUT /api/bookings/{id}/cancel
  cancel: (id, userId, role) => api.put(`/bookings/${id}/cancel`, { userId: userId, role: role }),

  // 7. GET /api/bookings/resource/{resourceId}
  getByResource: (resourceId) => api.get(`/bookings/resource/${resourceId}`),

  // Bonus: GET /api/bookings/stats
  getStats: () => api.get('/bookings/stats'),
};
