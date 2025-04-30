import { useUserStore } from '@/stores/user';
import axios, { AxiosResponse } from 'axios';

export const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    const token = useUserStore.getState().user?.access_token;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response: AxiosResponse<GlobalApiTypes>) {
    const { msg, code } = response.data;
    if (code === 401) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return Promise.reject(new Error(`身份验证失败，请重新登录`));
    }
    if (code !== 200) {
      return Promise.reject(new Error(msg));
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);
