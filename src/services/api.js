// client/src/services/api.js - Updated with Daily Report service
import axios from 'axios';

// Updated to match backend port
const API_BASE_URL = 'http://localhost:10000/api';
// const API_BASE_URL = 'https://cautionjune2server.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
      localStorage.removeItem('authToken');
      // Redirect to login when implemented
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Party/Client API methods
export const partyService = {
  getAll: (queryString = '') => api.get(`/parties${queryString}`),
  getById: (id) => api.get(`/parties/${id}`),
  getByPartyId: (partyId) => api.get(`/parties/partyId/${partyId}`),
  create: (partyData) => api.post('/parties', partyData),
  update: (id, partyData) => api.put(`/parties/${id}`, partyData),
  delete: (id) => api.delete(`/parties/${id}`),
  getStats: () => api.get('/parties/stats'),
  
  // Enhanced CRM methods
  addComment: (id, commentData) => api.post(`/parties/${id}/comments`, commentData),
  addFollowUp: (id, followUpData) => api.post(`/parties/${id}/follow-ups`, followUpData),
  completeFollowUp: (id, followUpId, completionData) => 
    api.put(`/parties/${id}/follow-ups/${followUpId}/complete`, completionData),
  getTodaysFollowUps: () => api.get('/parties/follow-ups/today'),
  getOverdueFollowUps: () => api.get('/parties/follow-ups/overdue'),
  search: (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return api.get(`/parties?${queryString}`);
  }
};

// Quotation API methods
export const quotationService = {
  getAll: () => api.get('/quotations'),
  getById: (id) => api.get(`/quotations/${id}`),
  getByParty: (partyId) => api.get(`/quotations/party/${partyId}`),
  create: (quotationData) => api.post('/quotations', quotationData),
  update: (id, quotationData) => api.put(`/quotations/${id}`, quotationData),
  delete: (id) => api.delete(`/quotations/${id}`),
  revise: (id, revisionData) => api.post(`/quotations/${id}/revise`, revisionData),
  updateStatus: (id, status, note) => api.put(`/quotations/${id}/status`, { status, note }),
  getStats: () => api.get('/quotations/stats')
};

// Component API methods (Google Sheets backend)
export const componentService = {
  getAll: () => api.get('/components'),
  getById: (id) => api.get(`/components/${id}`),
  create: (componentData) => api.post('/components', componentData),
  update: (id, componentData) => api.put(`/components/${id}`, componentData),
  delete: (id) => api.delete(`/components/${id}`),
  search: (query) => api.get(`/components/search?q=${encodeURIComponent(query)}`),
  getByCategory: (category) => api.get(`/components?category=${category}`),
  getByBrand: (brand) => api.get(`/components?brand=${brand}`)
};

// Model API methods (Google Sheets backend)
export const modelService = {
  getAll: () => api.get('/models'),
  getById: (id) => api.get(`/models/${id}`),
  create: (modelData) => api.post('/models', modelData),
  update: (id, modelData) => api.put(`/models/${id}`, modelData),
  delete: (id) => api.delete(`/models/${id}`),
  search: (query) => api.get(`/models/search?q=${encodeURIComponent(query)}`),
  getByCategory: (categoryId) => api.get(`/models/category/${categoryId}`),
  getByBrand: (brandId) => api.get(`/models/brand/${brandId}`)
};

// Brand API methods (Google Sheets backend)
export const brandService = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (brandData) => api.post('/brands', brandData),
  update: (id, brandData) => api.put(`/brands/${id}`, brandData),
  delete: (id) => api.delete(`/brands/${id}`),
  search: (query) => api.get(`/brands/search?q=${encodeURIComponent(query)}`)
};

// Category API methods (Google Sheets backend)
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Authentication API methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// Dashboard API methods
export const dashboardService = {
  getOverview: () => api.get('/dashboard/overview'),
  getRecentActivity: () => api.get('/dashboard/recent-activity')
};

// NEW: Daily Report API methods
export const dailyReportService = {
  getDailyReport: (date) => api.get(`/daily-report/${date}`),
  getDailySummary: () => api.get('/daily-report/summary'),
  getWeeklyComparison: (date) => api.get(`/daily-report/weekly/${date}`)
};

// Health check
export const healthCheck = () => api.get('/health');

// Export all services
export default {
  partyService,
  quotationService,
  componentService,
  modelService,
  brandService,
  categoryService,
  authService,
  dashboardService,
  dailyReportService,
  healthCheck
};