import axios from "axios";
import * as SecureStore from "expo-secure-store";

// 缓存 token，避免重复读取
let cachedToken: string | null = null;

const service = axios.create({
  baseURL: "https://test.memento.muxixyz.com",
  timeout: 10000,
});

service.interceptors.request.use(
  async (config) => {
    try {
      // 优先使用缓存的 token
      let token = cachedToken;
      if (!token) {
        token = await SecureStore.getItemAsync("access_token");
        cachedToken = token;
      }
      
      if (token) {
        config.headers["Authorization"] = `Bearer ${token.trim()}`;
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

// 提供一个方法来清除缓存的 token（登录/登出时使用）
export const clearCachedToken = () => {
  cachedToken = null;
};
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "请求失败，请稍后重试";
    
    if (axios.isCancel(error)) {
      console.log("请求被取消：", error.message);
      errorMessage = "请求已取消";
    } else if (error.code === "ECONNABORTED") {
      console.error("请求超时：", error);
      errorMessage = "请求超时，请检查网络或稍后重试";
    } else if (error.response) {
      console.error("接口错误：", error.response.status, error.response.data);
      
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || "请求参数错误";
          break;
        case 401:
          errorMessage = "登录已过期，请重新登录";
          break;
        case 403:
          errorMessage = "没有权限进行此操作";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 422:
          errorMessage = data?.message || "数据验证失败";
          break;
        case 429:
          errorMessage = "请求过于频繁，请稍后再试";
          break;
        case 500:
          errorMessage = "服务器内部错误，请稍后重试";
          break;
        case 502:
          errorMessage = "网关错误，请稍后重试";
          break;
        case 503:
          errorMessage = "服务暂不可用，请稍后重试";
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      console.error("网络错误：", error.request);
      errorMessage = "网络异常，请检查网络连接";
    } else {
      console.error("请求配置错误：", error.message);
      errorMessage = error.message || "请求失败，请稍后重试";
    }
    
    // 增强错误对象，携带详细信息
    error.userMessage = errorMessage;
    error.status = error.response?.status;
    error.data = error.response?.data;
    
    return Promise.reject(error);
  },
);

export default service;
