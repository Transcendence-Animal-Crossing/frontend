import axios, { AxiosInstance } from 'axios';
import { useSession, getSession } from 'next-auth/react';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Authorization: '',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session) {
    config.headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return config;
});

export default axiosInstance;
