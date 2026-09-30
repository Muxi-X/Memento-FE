import * as Crypto from 'expo-crypto';
import { postPromptevents } from './keywords';
import { AnalyticsEvent, PromptWords, SelectionState } from './interface';

/**
 * 入口点击埋点封装（尽力上报）
 *
 * 策略：
 * - 有界内存队列：最多 100 条，单条存活 ≤ 24h，每批 ≤ 20 条
 * - event_id 去重：同一点击重试保留原 ID，后端按 (user_id, event_id) 去重
 * - 退避重试：网络错误 / 429 / 5xx 重试，每条最多 3 次；永久 4xx 丢弃
 * - 账号会话隔离：登录/登出/切换账号时 bumpSession，丢弃旧账号待发事件
 * - 静默：埋点失败不阻塞弹窗、领取、导航，不弹业务错误提示
 */

const MAX_QUEUE_SIZE = 100;
const BATCH_SIZE = 20;
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_RETRY = 3;
const RETRY_BASE_MS = 1000;
const RETRY_CAP_MS = 30000;
const SOURCE = 'today';
const SCHEMA_VERSION = 1;

interface QueuedEvent extends AnalyticsEvent {
  sessionId: string;
  retryCount: number;
  createdAt: number;
}

export interface EventContext {
  biz_date?: string | null;
  keyword_id?: string | null;
}

let queue: QueuedEvent[] = [];
let currentSessionId = Crypto.randomUUID();
let isFlushing = false;
let scheduledFlush: ReturnType<typeof setTimeout> | null = null;

const nowRfc3339 = () => new Date().toISOString();

/** 入队（满则丢弃最旧），并触发异步发送 */
const enqueue = (event: AnalyticsEvent) => {
  if (queue.length >= MAX_QUEUE_SIZE) {
    queue.shift();
    console.warn('[analytics] 队列已满，丢弃最旧事件');
  }
  queue.push({
    ...event,
    sessionId: currentSessionId,
    retryCount: 0,
    createdAt: Date.now(),
  });
  scheduleFlush(0);
};

const scheduleFlush = (delayMs: number) => {
  if (scheduledFlush) return;
  scheduledFlush = setTimeout(() => {
    scheduledFlush = null;
    void flush();
  }, delayMs);
};

/** 取出当前会话、未过期、可重试的一批事件 */
const pickBatch = (): QueuedEvent[] => {
  const now = Date.now();
  const batch: QueuedEvent[] = [];
  for (const evt of queue) {
    if (evt.sessionId !== currentSessionId) continue;
    if (now - evt.createdAt > EVENT_TTL_MS) continue;
    if (evt.retryCount >= MAX_RETRY) continue;
    if (batch.length < BATCH_SIZE) batch.push(evt);
  }
  return batch;
};

/** 清理已失效的事件（跨会话 / 过期 / 超重试上限） */
const pruneInvalid = () => {
  const now = Date.now();
  queue = queue.filter(
    (e) =>
      e.sessionId === currentSessionId &&
      now - e.createdAt <= EVENT_TTL_MS &&
      e.retryCount < MAX_RETRY,
  );
};

const removeByIds = (ids: string[]) => {
  const idSet = new Set(ids);
  queue = queue.filter((e) => !idSet.has(e.event_id));
};

const clearQueue = () => {
  queue = [];
};

const backoffMs = (retryCount: number) =>
  Math.min(RETRY_BASE_MS * Math.pow(2, retryCount), RETRY_CAP_MS);

const flush = async () => {
  if (isFlushing) return;
  isFlushing = true;
  try {
    const batch = pickBatch();
    if (batch.length === 0) {
      pruneInvalid();
      return;
    }

    try {
      // 发送前剥离内部协调字段，只保留 AnalyticsEvent 纯净结构
      const payload: AnalyticsEvent[] = batch.map(
        ({ sessionId, retryCount, createdAt, ...rest }) => rest,
      );
      const res = await postPromptevents({ events: payload });
      const acknowledged: string[] = res.data?.acknowledged_event_ids ?? [];
      removeByIds(acknowledged);
    } catch (err: any) {
      const status: number | undefined = err?.status;
      const reason: string | undefined = err?.reason;

      if (status === 400) {
        // 整批校验失败：永久丢弃，记开发诊断
        console.warn(
          '[analytics] 整批事件校验失败，丢弃:',
          reason,
          batch.map((e) => e.event_id),
        );
        removeByIds(batch.map((e) => e.event_id));
      } else if (status === 401) {
        // 会话失效：清空队列
        console.warn('[analytics] 401，清空埋点队列');
        clearQueue();
      } else if (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        status === undefined
      ) {
        // 可重试：增加计数，退避后重发（保留原 event_id）
        for (const evt of batch) evt.retryCount += 1;
        scheduleFlush(backoffMs(batch[0].retryCount));
      } else {
        // 其他 4xx：永久丢弃
        console.warn('[analytics] 不可重试错误', status, reason, '丢弃本批');
        removeByIds(batch.map((e) => e.event_id));
      }
    }
  } finally {
    isFlushing = false;
    // 队列还有可发事件则继续
    if (queue.some((e) => e.sessionId === currentSessionId && e.retryCount < MAX_RETRY)) {
      scheduleFlush(0);
    }
  }
};

/** 上报提示系统总入口点击（含当天回看） */
export const trackPromptEntryClick = (
  selectionState: SelectionState,
  context?: EventContext,
): void => {
  const event: AnalyticsEvent = {
    event_id: Crypto.randomUUID(),
    event_name: 'prompt_entry_click',
    kind: null,
    source: SOURCE,
    schema_version: SCHEMA_VERSION,
    occurred_at: nowRfc3339(),
    context_biz_date: context?.biz_date ?? null,
    keyword_id: context?.keyword_id ?? null,
    selection_state: selectionState,
  };
  enqueue(event);
};

/** 上报类型入口点击（仅在 unselected 且点击被接受时调用） */
export const trackPromptKindClick = (kind: PromptWords, context?: EventContext): void => {
  const event: AnalyticsEvent = {
    event_id: Crypto.randomUUID(),
    event_name: 'prompt_kind_entry_click',
    kind,
    source: SOURCE,
    schema_version: SCHEMA_VERSION,
    occurred_at: nowRfc3339(),
    context_biz_date: context?.biz_date ?? null,
    keyword_id: context?.keyword_id ?? null,
    selection_state: 'unselected',
  };
  enqueue(event);
};

/** 登录 / 登出 / 切换账号时调用：开启新会话，丢弃旧账号待发事件 */
export const bumpAnalyticsSession = (): void => {
  currentSessionId = Crypto.randomUUID();
  queue = [];
  if (scheduledFlush) {
    clearTimeout(scheduledFlush);
    scheduledFlush = null;
  }
};
