import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (credentials) => api.post('/auth/register', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Doctor API
export const doctorAPI = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  searchDoctors: (specialty) => api.get('/doctors/search', { params: { specialty } }),
  getNearbyDoctors: (latitude, longitude, limit = 10) =>
    api.get('/doctors/nearby', { params: { latitude, longitude, limit } }),
};

// Appointment API
export const appointmentAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getUserAppointments: () => api.get('/appointments'),
  getActiveAppointments: () => api.get('/appointments/active'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  cancelAppointment: (id) => api.put(`/appointments/${id}/cancel`),
};

export default api;