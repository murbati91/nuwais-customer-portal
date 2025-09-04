// services/api.ts - API Client Service
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://laundry-api.bahrain-ai.com/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // Authentication
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { email, password }),
    
    register: (userData: {
      name: string;
      email: string;
      password: string;
      phone: string;
      address?: string;
    }) => api.post('/auth/register', userData),
    
    profile: () => api.get('/auth/profile'),
  },

  // Services
  services: {
    getAll: () => api.get('/services'),
    getByCategory: (category: string) => api.get(`/services?category=${category}`),
  },

  // Bookings
  bookings: {
    create: (bookingData: {
      service_ids: string[];
      pickup_date: string;
      pickup_time: string;
      pickup_address?: string;
      delivery_address?: string;
      special_instructions?: string;
      quantities?: Record<string, number>;
    }) => api.post('/bookings', bookingData),
    
    getAll: (page = 1, limit = 10, status?: string) => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.append('status', status);
      return api.get(`/bookings?${params}`);
    },
    
    getById: (id: string) => api.get(`/bookings/${id}`),
  },
};

export default api;