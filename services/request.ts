import axios from "axios";
import { getToken } from "../storage/token";
const isDev = false;
export const sandBoxBaseUrl = 'https://sandbox.api.sgroup.qq.com'
export const prodBaseUrl = `https://api.sgroup.qq.com`
const baseURL = isDev
  ? sandBoxBaseUrl
  : prodBaseUrl;
export const httpClient = axios.create({
  baseURL: baseURL,
});

// 添加请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    const { access_token } = getToken(); // 动态获取 access_token
    config.headers["Authorization"] = `QQBot ${access_token}`;
    return config;
  },
  (error) => {
    console.log('请求失败:', error.message, '请求路径:', error.config.url);
    return Promise.reject(error);
  }
);
