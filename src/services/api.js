import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (e.g., for auth tokens)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gemini AI request
export const askGemini = async (prompt) => {
  try {
    const response = await api.post('/api/ai/ask', { prompt });
    return response.data.response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Health check (optional)
export const checkBackendHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};