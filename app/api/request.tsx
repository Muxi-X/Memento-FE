import axios from "axios";
import * as SecureStore from "expo-secure-store";
const service = axios.create({
  baseURL:"http://47.104.25.166:8080",
  timeout: 10000,
});
service.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
        console.log("拦截器读取 token:", token);
         if (token) {
        config.headers["Authorization"] = `Bearer ${token.trim()}`;
      } else {
        console.log("token 为空");
      }
    } catch (error) {
      console.error("获取token失败：", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("请求被取消：", error.message);
    } else if (error.code === "ECONNABORTED") {
      alert("请求超时，请检查网络或稍后重试");
      console.error("请求超时：", error);
    } else if (error.response) {
      console.error("接口错误：", error.response.status, error.response.data);
      alert(`接口请求失败：${error.response.status}`);
    } else if (error.request) {
      console.error("网络错误：", error.request);
      alert("网络异常，请检查网络连接");
    } else {
      console.error("请求配置错误：", error.message);
      alert("请求失败，请稍后重试");
    }
    return Promise.reject(error);
  },
);

export default service;
