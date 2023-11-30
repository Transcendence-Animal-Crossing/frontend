import axios, { AxiosInstance } from 'axios';
import { useSession, getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log('Unauthorized');
      signOut();
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
