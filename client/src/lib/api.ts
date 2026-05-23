import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' && 
        !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        // Refresh failed — clear auth
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// ============================================
// PROJECTS API
// ============================================

export const projectsAPI = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/projects', { params }),
  
  get: (id: string) =>
    api.get(`/projects/${id}`),
  
  create: (data: any) =>
    api.post('/projects', data),
  
  update: (id: string, data: any) =>
    api.patch(`/projects/${id}`, data),
  
  publish: (id: string, scheduledFor?: string) =>
    api.post(`/projects/${id}/publish`, { scheduledFor }),
  
  delete: (id: string) =>
    api.delete(`/projects/${id}`),
  
  // Memories
  addMemory: (projectId: string, data: any) =>
    api.post(`/projects/${projectId}/memories`, data),
  
  updateMemory: (projectId: string, memoryId: string, data: any) =>
    api.patch(`/projects/${projectId}/memories/${memoryId}`, data),
  
  deleteMemory: (projectId: string, memoryId: string) =>
    api.delete(`/projects/${projectId}/memories/${memoryId}`),
  
  // Gallery
  addGalleryItem: (projectId: string, data: any) =>
    api.post(`/projects/${projectId}/gallery`, data),
  
  updateGalleryItem: (projectId: string, itemId: string, data: any) =>
    api.patch(`/projects/${projectId}/gallery/${itemId}`, data),
  
  deleteGalleryItem: (projectId: string, itemId: string) =>
    api.delete(`/projects/${projectId}/gallery/${itemId}`),
};

// ============================================
// MEDIA API
// ============================================

export const mediaAPI = {
  upload: (file: File, projectId?: string, onProgress?: (p: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });
  },
  
  list: (params?: { type?: string; page?: number }) =>
    api.get('/media', { params }),
  
  delete: (id: string) =>
    api.delete(`/media/${id}`),
};

// ============================================
// PUBLIC API
// ============================================

export const publicAPI = {
  getMemory: (slug: string, password?: string) =>
    api.get(`/public/memory/${slug}`, { params: { password } }),
};

// ============================================
// AI API
// ============================================

export const aiAPI = {
  generateMessage: (data: {
    personOneName?: string;
    personTwoName?: string;
    occasion?: string;
    tone?: string;
    yearsTogeter?: number;
    details?: string;
  }) => api.post('/ai/generate-message', data),
};
