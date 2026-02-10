import axios from 'axios';
import loadingState from './loadingState';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
client.interceptors.request.use(
  (config) => {
    loadingState.start();
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('>>> [HEADERS] NO ACCESS_TOKEN FOUND');
    }

    return config;
  },
  (error) => {
    loadingState.stop();
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors (optional: auto-logout on 401)
client.interceptors.response.use(
  (response) => {
    loadingState.stop();
    return response;
  },
  (error) => {
    loadingState.stop();
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
