export default interface Post {
  id: string;
  biz_date: string;
  keyword_id: string;
  cover_image: coverImage;
  display_text: string;
  cover_has_audio: boolean;
  cover_audio_duration_ms: number;    
  image_count: number;
  reaction_counts: ReactionCounts|null;
  my_reactions:Array<"inspired" | "resonated"> | null
  created_at: string;
}
export interface detaildataItem {
  post: Post;
  images: Array<ImageObject>;
}
export interface ImageObject {
  id: string;
  image:{
    id: string;
    variants: {
      original: {
        url: string;
        width: number;
        height: number;
      };
    }
  }
  display_order: number;
  title: string;
  note: string;
  has_audio: boolean;
  audio_duration_ms: number|null;
  audio_play_url: string|null;
  created_at: string;
}
interface ReactionCounts {
    inspired:number;
    resonated:number;
}

export interface PhotoObject {
  id: number;
  uri: string;
  width: number;
  height: number;
  fileName: string | null | undefined;
}
export enum PromptWords {
  intuition = "intuition",
  structure = "structure",
  concept = "concept",
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
export interface mydataItem{
  nickname: string;
  avatar_url: string;
  official_image_count: number;
  custom_image_count: number;
  unread_notification_count: number;
  custom_keywords: customKeywords[]
}
export interface customKeywords{

  id: string;
  text: string;
  target_image_count: number;
  total_image_count: number;
  my_image_count: number;
  cover_image: coverImage|null;
}
export interface coverImage{
  id: string;
  variants: {
    card_4x3: {
      url: string;
      width: number;
      height: number;
    };
  }
}
 export interface notfiItem{
  id: string;
  actor_user_id: string;
  actor_avatar_url: string;
  type: string;
  upload_id: string;
  cover_image: coverImage|null;
  reaction_type: string;
  created_at: string;
  read_at: string;
}

