import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL.replace(/\/$/, ""), // remove trailing slash
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;