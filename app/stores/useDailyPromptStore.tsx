import { create } from 'zustand';
import {
  DailyPromptState,
  DrawPromptResponse,
  PromptWords,
  SelectedPrompt,
} from '../api/interface';
import { drawOfficialPrompt, getdailyPrompt } from '../api/keywords';

/**
 * 每日提示状态 Store（仅内存，不持久化）
 *
 * 职责：
 * - 管理 biz_date / resets_at / keyword_id / selection 与界面状态机
 * - 缓存有效性判定（同账号会话、同业务日期、未到重置时间、无待确认领取）
 * - 请求版本协调：领取开始后使在途 GET 失效；已选后迟到的空查询不覆盖
 * - 账号会话隔离：bumpSession 清空状态并使旧请求返回值失效
 */

export type PromptUiState =
  | 'idle' // 初始，无任何查询结果
  | 'loading' // 查询中，无有效内存状态
  | 'unselected' // 未领取，有关键词
  | 'selecting' // 领取进行中
  | 'selected' // 已领取
  | 'error'; // 查询失败或暂不可用

interface DailyPromptStore {
  biz_date: string | null;
  resets_at: string | null;
  keyword_id: string | null;
  selection: SelectedPrompt | null;

  // 界面与协调
  uiState: PromptUiState;
  errorMessage: string | null;
  sessionVersion: number; // 账号会话版本
  requestVersion: number; // 请求协调版本
  hasValidCache: boolean; // 数据是否来自成功 GET/POST

  // 同步操作
  setDailyState: (state: DailyPromptState) => void;
  setSelecting: () => void;
  setSelected: (response: DrawPromptResponse) => void;
  setError: (message: string) => void;
  setLoading: () => void;
  invalidateCache: () => void;
  bumpSession: () => void;
  isCacheValid: () => boolean;
  getRequestToken: () => number;
  isRequestStale: (token: number) => boolean;

  // 异步操作
  fetchDailyPrompt: (options?: { silent?: boolean }) => Promise<void>;
  claimPrompt: (kind: PromptWords) => Promise<void>;
}

const useDailyPromptStore = create<DailyPromptStore>((set, get) => ({
  biz_date: null,
  resets_at: null,
  keyword_id: null,
  selection: null,
  uiState: 'idle',
  errorMessage: null,
  sessionVersion: 0,
  requestVersion: 0,
  hasValidCache: false,

  /** 应用 GET /v1/me/daily-prompt 结果 */
  setDailyState: (state) => {
    set((s) => {
      // 领取进行中：不更新，等 POST 结果（避免 GET 返回空解除按钮锁）
      if (s.uiState === 'selecting') return {};

      // 已选状态下，迟到的空查询不覆盖已选结果
      if (s.uiState === 'selected' && state.selection === null) return {};

      const hasSelection = state.selection !== null;
      const hasKeyword = state.keyword_id !== null;

      const nextUiState: PromptUiState = hasSelection
        ? 'selected'
        : hasKeyword
          ? 'unselected'
          : 'error';

      return {
        biz_date: state.biz_date,
        resets_at: state.resets_at,
        keyword_id: state.keyword_id,
        selection: state.selection,
        uiState: nextUiState,
        errorMessage: hasSelection || hasKeyword ? null : '今日暂不可用',
        hasValidCache: true,
      };
    });
  },

  /** 开始领取：禁用所有类型入口，使此前在途 GET 失效 */
  setSelecting: () => {
    set((s) => ({
      uiState: 'selecting',
      requestVersion: s.requestVersion + 1,
    }));
  },

  /** 领取成功：以后端实际返回的类型和内容为准 */
  setSelected: (response) => {
    set((s) => ({
      biz_date: response.biz_date,
      resets_at: response.resets_at,
      keyword_id: response.keyword_id,
      selection: {
        id: response.id,
        kind: response.kind,
        content: response.content,
        selected_at: response.selected_at,
      },
      uiState: 'selected',
      errorMessage: null,
      hasValidCache: true,
      requestVersion: s.requestVersion + 1, // 使在途 GET 失效
    }));
  },

  setError: (message) => {
    set({ uiState: 'error', errorMessage: message });
  },

  setLoading: () => {
    set({ uiState: 'loading', errorMessage: null });
  },

  /** 使缓存失效（跨天、日期不一致、401 等） */
  invalidateCache: () => {
    set({
      hasValidCache: false,
      uiState: 'idle',
      errorMessage: null,
    });
  },

  /** 登录 / 登出 / 切换账号：清空状态并使旧请求返回值失效 */
  bumpSession: () => {
    set((s) => ({
      biz_date: null,
      resets_at: null,
      keyword_id: null,
      selection: null,
      uiState: 'idle',
      errorMessage: null,
      hasValidCache: false,
      sessionVersion: s.sessionVersion + 1,
      requestVersion: s.requestVersion + 1,
    }));
  },

  /** 有效内存状态判定：有成功结果、未到重置时间、无待确认领取 */
  isCacheValid: () => {
    const s = get();
    if (!s.hasValidCache) return false;
    if (s.uiState === 'selecting' || s.uiState === 'error' || s.uiState === 'idle') return false;
    if (!s.biz_date || !s.resets_at) return false;
    if (new Date(s.resets_at).getTime() <= Date.now()) return false;
    return true;
  },

  getRequestToken: () => get().requestVersion,

  isRequestStale: (token) => token !== get().requestVersion,

  /** 查询今日提示状态。silent=true 时不切 loading，失败保留有效缓存 */
  fetchDailyPrompt: async (options) => {
    const token = get().getRequestToken();
    const silent = options?.silent ?? false;

    if (!silent) {
      set({ uiState: 'loading', errorMessage: null });
    }

    try {
      const res = await getdailyPrompt();
      console.log('今日领取提示状态' + res.data.keyword_id);

      if (get().isRequestStale(token)) return;
      get().setDailyState(res.data);
    } catch {
      if (get().isRequestStale(token)) return;
      // 401 由全局会话清理处理；其他错误
      if (silent) {
        // 静默失败：有有效缓存则保留展示，否则显示错误
        if (!get().isCacheValid()) {
          set({ uiState: 'error', errorMessage: '加载失败，请重试' });
        }
      } else {
        set({ uiState: 'error', errorMessage: '加载失败，请重试' });
      }
    }
  },

  /** 领取今日提示。前置条件：uiState === 'unselected' 且有关键词和日期 */
  claimPrompt: async (kind) => {
    const s = get();
    if (s.uiState !== 'unselected' || !s.keyword_id || !s.biz_date) return;

    const token = s.getRequestToken();
    s.setSelecting();

    try {
      const res = await drawOfficialPrompt(s.keyword_id, kind, s.biz_date);
      console.log('ying取关键词具体', res.data.content);

      if (get().isRequestStale(token)) return;
      get().setSelected(res.data);
    } catch (err: any) {
      if (get().isRequestStale(token)) return;
      const status: number | undefined = err?.status;
      const reason: string | undefined = err?.reason;

      if (
        status === 409 &&
        (reason === 'official.prompt_date_changed' || reason === 'official.keyword_mismatch')
      ) {
        // 日期或关键词变化：失效缓存并重新查询
        get().invalidateCache();
        void get().fetchDailyPrompt();
      } else if (status === 404) {
        set({ uiState: 'error', errorMessage: '今日暂无可用提示' });
      } else {
        set({ uiState: 'error', errorMessage: '领取失败，请重试' });
      }
    }
  },
}));

export default useDailyPromptStore;
