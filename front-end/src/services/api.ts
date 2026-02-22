import axios from 'axios';
import type { User, Note, UserProfile, UpdateProfileData, ApiResponse, PaginatedNotes } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
})

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

// Define types
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// AUTH
export const authAPI = {
  register: (data: RegisterData) => api.post<ApiResponse<{ user: User, token: string }>>('/auth/register', data),
  login:    (data: LoginData) => api.post<ApiResponse<{ user: User, token: string }>>('/auth/login', data),
  getMe:    () => api.get<ApiResponse<User>>('/auth/me'),
};

// NOTES
export const notesAPI = {
  getAll:      (params?: Record<string, any>) => api.get<ApiResponse<PaginatedNotes>>('/notes', { params }),
  getNearby:   (params?: Record<string, any>) => api.get<ApiResponse<Note[]>>('/notes/nearby', { params }),
  getById:     (id: string) => api.get<ApiResponse<Note>>(`/notes/${id}`),
  getMyNotes:  () => api.get<ApiResponse<Note[]>>('/notes/user/me'),
  getSaved:    () => api.get<ApiResponse<Note[]>>('/notes/user/saved'),
  create:      (data: Partial<Note>) => api.post<ApiResponse<Note>>('/notes', data),
  update:      (id: string, data: Partial<Note>) => api.put<ApiResponse<Note>>(`/notes/${id}`, data),
  delete:      (id: string) => api.delete<ApiResponse<void>>(`/notes/${id}`),
  toggleLike:  (id: string) => api.post<ApiResponse<{ liked: boolean; likesCount: number }>>(`/notes/${id}/like`),
  toggleSave:  (id: string) => api.post<ApiResponse<{ saved: boolean }>>(`/notes/${id}/save`),
  addComment:  (id: string, text: string) => api.post<ApiResponse<Note>>(`/notes/${id}/comments`, { text }),
  deleteComment: (id: string, commentId: string) => api.delete<ApiResponse<void>>(`/notes/${id}/comments/${commentId}`),
}
// USERS
export const usersAPI = {
  getProfile: (username: string) => api.get<ApiResponse<UserProfile>>(`/users/${username}`),

  updateProfile: (data: UpdateProfileData) => api.put<ApiResponse<UserProfile>>('/users/profile', data),
};


export default api;