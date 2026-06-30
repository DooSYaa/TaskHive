import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:5292/api/' });

api.interceptors.request.use(config => {
  const user = localStorage.getItem('user');
  if (user?.token) {
    config.headers.set('Authorization', `Bearer ${user.token}`);
  }
  return config;
});
