// frontend/src/services/api.js (Fixed with proper exports)
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Add this new function to api.js
export const getSimpleMatches = async (userId, options = {}) => {
  try {
    const { limit = 10, minScore = 0.4 } = options;
    const response = await API.get(`/matches/${userId}/simple?limit=${limit}&minScore=${minScore}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch simple matches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch simple matches');
  }
};
// Add this function
export const getLocationMatches = async (userId, options = {}) => {
  try {
    const { limit = 20 } = options;
    const response = await API.get(`/matches/${userId}/location?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch location matches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch location matches');
  }
};

// ✅ API functions with consistent naming
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ Make sure this function name matches exactly what you're importing
export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, formData) => {
  try {
    const response = await API.post(`/users/${userId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
// ✅ Add this enhanced version to your api.js
export const getPotentialMatches = async (userId, options = {}) => {
  try {
    const { limit = 10, minScore = 0.3 } = options;
    const response = await API.get(`/matches/${userId}/potential?limit=${limit}&minScore=${minScore}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch potential matches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch potential matches');
  }
};


// Match-related API functions
export const getMatches = async (userId) => {
  try {
    const response = await API.get(`/matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch matches');
  }
};

export const getMatchStats = async (userId) => {
  try {
    const response = await API.get(`/matches/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch match stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch match statistics');
  }
};

// ✅ Default export (optional, for flexibility)
export default {
  registerUser,
  loginUser,
  getUserProfile,
  uploadProfileImage,
  getMatches,
  getMatchStats
};
