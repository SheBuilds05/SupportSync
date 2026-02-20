import axios from 'axios';

// This is the brain of your connection
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://supportsync-ujib.onrender.com",
});

export default api;
