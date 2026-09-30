export default interface Post {
  id: string;
  biz_date: string;
  keyword_id: string;
  cover_image: coverImage;
  display_text: string;
  cover_has_audio: boolean;
  cover_audio_duration_ms: number;
  image_count: number;
  reaction_counts: ReactionCounts | null;
  my_reactions: ('inspired' | 'resonated')[] | null;
  created_at: string;
}
export interface detaildataItem {
  post: Post;
  images: ImageObject[];
}
export interface ImageObject {
  id: string;
  image: {
    id: string;
    variants: {
      detail_large: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  display_order: number;
  title: string;
  note: string;
  has_audio: boolean;
  audio_duration_ms: number | null;
  audio_play_url: string | null;
  created_at: string;
}
interface ReactionCounts {
  inspired: number;
  resonated: number;
}

export interface PhotoObject {
  id: number;
  uri: string;
  width: number;
  height: number;
  fileName: string | null | undefined;
}
export enum PromptWords {
  intuition = 'intuition',
  structure = 'structure',
  concept = 'concept',
}

// 已选提示结果(来自领取记录快照)
export interface SelectedPrompt {
  id: string;
  kind: PromptWords;
  content: string;
  selected_at: string;
}

// 每日提示状态(GET /v1/me/daily-prompt 返回)
export interface DailyPromptState {
  biz_date: string;
  resets_at: string;
  keyword_id: string | null;
  selection: SelectedPrompt | null;
}

// 领取今日提示响应(POST /v1/official/keywords/{keyword_id}/prompts/draw)
export interface DrawPromptResponse {
  id: string;
  kind: PromptWords;
  content: string;
  biz_date: string;
  keyword_id: string;
  selected_at: string;
  resets_at: string;
}

// 埋点事件名称与选择状态枚举
export type PromptEventName = 'prompt_entry_click' | 'prompt_kind_entry_click';
export type SelectionState = 'unknown' | 'unselected' | 'selected';

// 单个入口点击事件
export interface AnalyticsEvent {
  event_id: string;
  event_name: PromptEventName;
  kind: PromptWords | null;
  source: string;
  schema_version: number;
  occurred_at: string;
  context_biz_date: string | null;
  keyword_id: string | null;
  selection_state: SelectionState;
}

// 批量埋点请求与响应(POST /v1/analytics/events/batch)
export interface BatchEventsRequest {
  events: AnalyticsEvent[];
}

export interface BatchEventsResponse {
  acknowledged_event_ids: string[];
}

export interface ReviewDateItem {
  biz_date: string;
  keyword: {
    id: string;
    text: string;
    category: string;
    is_active: boolean;
    display_order: number;
  };
  my_upload_count: number | null;
  my_image_count: number | null;
}
export interface ReviewDatesResponse {
  total_participation_days: number;
  total_image_count: number;
  items: ReviewDateItem[];
}
export interface ReviewkeywordItem {
  keyword: {
    id: string;
    text: string;
    category: string;
    is_active: boolean;
    display_order: number;
  };
  my_upload_count: number | null;
  my_image_count: number | null;
}
export interface mydataItem {
  nickname: string;
  avatar_url: string;
  official_image_count: number;
  custom_image_count: number;
  unread_notification_count: number;
  custom_keywords: customKeywords[];
}
export interface customKeywords {
  id: string;
  text: string;
  target_image_count: number;
  total_image_count: number;
  my_image_count: number;
  cover_image: Notificover | null;
}
export interface coverImage {
  id: string;
  variants: {
    card_4x3: {
      url: string;
      width: number;
      height: number;
    };
  };
}
export interface Notificover {
  id: string;
  variants: {
    square_small: {
      url: string;
      width: number;
      height: number;
    };
  };
}
export interface notfiItem {
  id: string;
  actor_user_id: string;
  actor_avatar_url: string;
  type: string;
  upload_id: string;
  cover_image: {
    square_small: {
      url: string;
      width: number;
      height: number;
    };
  };
  reaction_type: string;
  created_at: string;
  read_at: string;
}
export interface CustomImage {
  cover_source: string;
  cover_image?: cover_image;
  items: CustomImageItem[];
}
export interface cover_image {
  id: string;
  variants: {
    detail_large: {
      url: string;
      width: number;
      height: number;
    };
  };
}
export interface CustomImageItem {
  id: string;
  image: {
    id: string;
    variants: {
      square_medium: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  display_order: number;
  created_at: string;
}
export interface CustomImageDetail {
  id: string;
  custom_keyword_id: string;
  image: {
    id: string;
    variants: {
      detail_large: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  display_order: number;
  title: string | null;
  note: string | null;
  has_audio: boolean;
  audio_duration_ms: number | null;
  audio_play_url: string | null;
  created_at: string;
}
