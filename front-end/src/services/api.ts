import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pinnote_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pinnote_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

// NOTES
export const notesAPI = {
  getAll:      (params) => api.get('/notes', { params }),
  getNearby:   (params) => api.get('/notes/nearby', { params }),
  getById:     (id)     => api.get(`/notes/${id}`),
  getMyNotes:  ()       => api.get('/notes/user/me'),
  getSaved:    ()       => api.get('/notes/user/saved'),
  create:      (data)   => api.post('/notes', data),
  update:      (id, data) => api.put(`/notes/${id}`, data),
  delete:      (id)     => api.delete(`/notes/${id}`),
  toggleLike:  (id)     => api.post(`/notes/${id}/like`),
  toggleSave:  (id)     => api.post(`/notes/${id}/save`),
  addComment:  (id, text) => api.post(`/notes/${id}/comments`, { text }),
  deleteComment: (id, commentId) => api.delete(`/notes/${id}/comments/${commentId}`),
};

// USERS
export const usersAPI = {
  getProfile:    (username) => api.get(`/users/${username}`),
  updateProfile: (data)     => api.put('/users/profile', data),
};

export default api;