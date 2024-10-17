import axios from "axios";
import { getToken } from "../storage/token";
const isDev = false;
const baseURL = isDev
  ? "https://sandbox.api.sgroup.qq.com"
  : `https://api.sgroup.qq.com`;
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
    return Promise.reject(error);
  }
);
