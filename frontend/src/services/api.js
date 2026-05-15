import axios from 'axios';

const buildApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (!rawUrl) {
    return 'http://localhost:5000/api';
  }

  const normalized = rawUrl.replace(/\/+$/, '');
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

const API_BASE_URL = buildApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Expense services
export const expenseService = {
  getAll: (params) => api.get('/expenses', { params }),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: () => api.get('/expenses/stats/summary'),
  getMonthlyStats: (year) => api.get('/expenses/stats/monthly', { params: { year } }),
  getCategoryStats: (params) => api.get('/expenses/stats/category', { params }),
  getSpendingTrend: (days) => api.get('/expenses/stats/trend', { params: { days } }),
  getInsights: () => api.get('/expenses/stats/insights'),
};

// User services
export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
