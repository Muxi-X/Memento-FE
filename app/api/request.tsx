import { create, isCancel, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// 缓存 token，避免重复读取
let cachedToken: string | null = null;

// 构建环境 base URL：测试构建通过 EXPO_PUBLIC_API_BASE_URL 覆盖，默认生产
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://test.memento.muxixyz.com';

// 埋点接口路径（用于自动静默处理）
const ANALYTICS_PATH = '/v1/analytics/events/batch';

// 扩展 axios config，支持静默标记（埋点请求不弹错、不阻塞、401 不触发登出副作用）
interface SilentRequestConfig extends AxiosRequestConfig {
  silent?: boolean;
}

const service = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

service.interceptors.request.use(
  async (config) => {
    try {
      // 优先使用缓存的 token
      let token = cachedToken;
      if (!token) {
        token = await SecureStore.getItemAsync('access_token');
        cachedToken = token;
      }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token.trim()}`;
      }
    } catch (error) {
      console.error('获取token失败：', error);
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

// 401 全局处理回调（避免 request → store 循环依赖，由应用入口注册）
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const config = (error.config || {}) as SilentRequestConfig;
    const isSilent = !!config.silent || config.url?.includes(ANALYTICS_PATH);

    let errorMessage = '请求失败，请稍后重试';

    if (isCancel(error)) {
      console.log('请求被取消：', error.message);
      errorMessage = '请求已取消';
    } else if (error.code === 'ECONNABORTED') {
      console.error('请求超时：', error);
      errorMessage = '请求超时，请检查网络或稍后重试';
    } else if (error.response) {
      const { status, data } = error.response;
      console.error('接口错误：', status, data);

      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误';
          break;
        case 401:
          errorMessage = '登录已过期，请重新登录';
          // 非静默请求触发全局会话清理（埋点等静默请求不触发）
          if (!isSilent) {
            unauthorizedHandler?.();
          }
          break;
        case 403:
          errorMessage = '没有权限进行此操作';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 409:
          // 携带后端 reason 供业务层区分 prompt_date_changed / keyword_mismatch
          errorMessage = data?.message || '数据已更新，请刷新';
          break;
        case 413:
          errorMessage = '请求体过大';
          break;
        case 422:
          errorMessage = data?.message || '数据验证失败';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后再试';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后重试';
          break;
        case 502:
          errorMessage = '网关错误，请稍后再试';
          break;
        case 503:
          errorMessage = '服务暂不可用，请稍后重试';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      console.error('网络错误：', error.request);
      errorMessage = '网络异常，请检查网络连接';
    } else {
      console.error('请求配置错误：', error.message);
      errorMessage = error.message || '请求失败，请稍后重试';
    }

    // 增强错误对象，携带详细信息与后端业务语义
    error.userMessage = errorMessage;
    error.status = error.response?.status;
    error.data = error.response?.data;
    error.code = error.response?.data?.code;
    error.reason = error.response?.data?.reason;
    // 标记是否为静默请求（埋点等），调用方可据此决定是否弹错
    error.silent = isSilent;

    return Promise.reject(error);
  },
);

export default service;
