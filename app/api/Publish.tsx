import request from './request';
export interface Createtype {
  context: {
    type: string;
    official_keyword_id?: string;
    biz_date?: string;
    custom_keyword_id?: string;
  };
  expected_image_count?: number;
}
export interface PresignItem {
  client_image_id: string;
  image_content_type: string;
  image_content_length: number;
  image_sha256?: string | null;
  audio_content_type?: string | null;
  audio_content_length?: number | null;
  audio_sha256?: string | null;
}
export interface CompleteItem {
  item_id: string;
  image_etag: string;
  image_width: number;
  image_height: number;
  display_order: number;
  is_cover?: boolean;
  title: string | null;
  note: string | null;
  audio_etag?: string | null;
  audio_duration_ms?: number | null;
}
export const CreateSession = (data: Createtype) => {
  return request({
    url: '/v1/uploads/publish-sessions',
    method: 'POST',
    data: data,
  });
};
export const presignUpload = (session_id: string, data: PresignItem[]) => {
  return request({
    url: `/v1/uploads/publish-sessions/${session_id}/assets/presign-batch`,
    method: 'POST',
    data: {
      items: data,
    },
  });
};

export const completeUpload = (session_id: string, data: CompleteItem[]) => {
  return request({
    url: `/v1/uploads/publish-sessions/${session_id}/assets/complete-batch`,
    method: 'POST',
    data: {
      items: data,
    },
  });
};
export const commitUpload = (session_id: string) => {
  return request({
    url: `/v1/uploads/publish-sessions/${session_id}/commit`,
    method: 'POST',
  });
};
export const concelSession = (session_id: string) => {
  return request({
    url: `/v1/uploads/publish-sessions/${session_id}`,
    method: 'DELETE',
  });
};
