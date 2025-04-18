import { showError } from './utils';
import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL ? import.meta.env.VITE_SERVER_URL : '',
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
  },
);

