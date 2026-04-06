import request from "./request";
import { ReviewDatesResponse } from "./interface";
export const listReviewDates = (limit?:number) => {
  return request<ReviewDatesResponse>({
    url: "/v1/review/dates",
    method: "get",
    params: {
      limit: limit
    },
  });
};
export const listReviewKeywords = () => {
  return request({
    url: "/v1/review/keywords",
    method: "get",
  });
};
export const listReviewdateDetail = (biz_date?: string) => {
  return request({
    url: "/v1/review/dates/uploads/my",
    method: "get",
  });
};
export const listReviewKeywordsDetail= (keyword_id: string) => {
  return request({
    url: `/v1/review/keywords/${keyword_id}/uploads/my`,
    method: "get",
  });
};
