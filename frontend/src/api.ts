import axios from 'axios';

// This is the brain of your connection
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

export default api;
