import request from "./request";

export const listCustomKeywordImages = (keyword_id: string) => {
  return request({
    url: `/v1/custom-keywords/${keyword_id}/images`,
    method: "get",
  });
};
export const setCustomKeywordCover=(keyword_id:string,image_id:string)=>{
  return request({
    url: `/v1/custom-keywords/${keyword_id}/cover`,
    method: "PATCH",
    data: {
      image_id:image_id
    }
  });
}