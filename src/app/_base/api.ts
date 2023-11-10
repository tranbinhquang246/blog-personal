import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const instance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: 60000,
});

instance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default instance;
