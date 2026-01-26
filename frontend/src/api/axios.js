import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_NEST_APP_URL || 'http://localhost:4000',

});

export default api;
