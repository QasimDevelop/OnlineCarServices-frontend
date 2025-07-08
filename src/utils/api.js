import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const fetchNearbyStations = async (lat, lng, radius, token) => {
  const res = await axios.get(
    "http://localhost:8000/api/accounts/service-stations/nearby/",
    { params: { lat, lng, radius }, headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default api; 