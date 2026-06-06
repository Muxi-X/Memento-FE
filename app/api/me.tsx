import request from "./request";
export const getMedata = () => {
  return request({
    url: "/v1/me/home",
    method: "GET",
  });
};
export const updateMeNickname = (nickname: string) => {
  return request({
    url: "/v1/me/profile/nickname",
    method: "patch",
    data: {
      nickname: nickname,
    },
  });
};
export const getMeSetting = () => {
  return request({
    url: "/v1/me/settings",
    method: "GET",
  });
};
export const updatePublicable = (public_pool_enabled: boolean) => {
  return request({
    url: "/v1/me/settings/privacy",
    method: "PATCH",
    data: {
      public_pool_enabled: public_pool_enabled,
    },
  });
};
export const updateMeNotificationSettings = (
  reaction_enabled: boolean,
  creation_reminder_enabled: boolean,
) => {
  return request({
    url: "/v1/me/settings/notifications",
    method: "patch",
    data: {
      reaction_enabled: reaction_enabled,
      creation_reminder_enabled: creation_reminder_enabled,
    },
  });
};
export const getNotificationslist = () => {
  return request({
    url: "/v1/me/notifications",
    method: "GET",
  });
};
export const markNotificationsRead = () => {
  return request({
    url: "/v1/me/notifications/read",
    method: "patch",
  });
};
export const getCustomKeywordList = () => {
  return request({
    url: "/v1/custom-keywords",
    method: "GET",
  });
};
export const addCustomKeyword = (keyword: string, target: number | null) => {
  return request({
    url: "/v1/custom-keywords",
    method: "POST",
    data: {
      text: keyword,
      target: target,
    },
  });
};
//头像上传
export interface AvatarPresignItem{
  image_content_type: string;
  image_content_length: number;
  image_sha256?: string
}
export interface AvatarCompleteItem{
  image_etag: string;
  image_width: number;
  image_height: number;
}
export const createAvatarUploadSession = () => {
  return request({
    url: "/v1/me/avatar-upload-sessions",
    method: "POST",
  });
};
export const presignAvatarUpload = (session_id: string,data:AvatarPresignItem) => {
  return request({
    url: `/v1/me/avatar-upload-sessions/${session_id}/image/presign`,
    method: "POST",
    data: data,
  });
};
export const completeAvatarUpload = (session_id: string, data: AvatarCompleteItem) => {
  return request({
    url: `/v1/me/avatar-upload-sessions/${session_id}/complete`,
    method: "POST",
    data: data,
  });
};