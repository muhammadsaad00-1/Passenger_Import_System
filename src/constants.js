export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001'  // Local backend
  : 'https://your-live-api.com'; // Production backend