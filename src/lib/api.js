import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchControls = async () => {
  const response = await api.get('/controls');
  return response.data;
};

export const createControl = async (controlData) => {
  const response = await api.post('/controls', controlData);
  return response.data;
};

export const updateControl = async (controlId, controlData) => {
  const response = await api.put(`/controls/${controlId}`, controlData);
  return response.data;
};

export const deleteControl = async (controlId) => {
  const response = await api.delete(`/controls/${controlId}`);
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export default api;