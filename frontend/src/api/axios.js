import axios from 'axios';
import { store } from '../store/index';
import { authActions } from '../store/auth';

const api = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL || 'http://localhost:1000/api/v1').replace(/\/$/, ''),
});

// ── Request interceptor: auto-attach Authorization header ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: force logout on 401/403 ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only force logout on 401 (token missing/expired).
    // 403 (role-denied) means user IS authenticated — do NOT log them out.
    if (error.response?.status === 401) {
      store.dispatch(authActions.logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
