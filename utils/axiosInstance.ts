import axios, { AxiosInstance } from 'axios';
import { useSession, getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: process.env.URL,
  baseURL: 'http://10.13.4.2:8080',
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
    const statusCode = error?.response?.status;
    if (statusCode === 401) {
      console.log('Unauthorized');
      signOut();
      return new Promise(() => {});
    }
	if (error?.response) {
		return Promise.reject(error);
	}
    console.log(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
