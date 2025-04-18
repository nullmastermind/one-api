import axios from 'axios';

import { showError } from './utils';

export const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL ? import.meta.env.VITE_SERVER_URL : '',
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
  },
);
