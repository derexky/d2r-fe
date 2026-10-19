import axios from 'axios';
import { auth } from '../auth';

const client = axios.create({
  baseURL: '/api',
});

// waits for the saved session so the first request after a reload is already signed in
client.interceptors.request.use(async (config) => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
