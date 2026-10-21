import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const clientAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

clientAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
clientAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }

    if (error.response?.status === 429) {
      const message =
        error.response.data?.message
        || 'Trop de tentatives. Merci de patienter quelques instants avant de réessayer.';

      toast.error(message);
      error.message = message;
    }

    return Promise.reject(error);
  }
);
export default clientAxios;


