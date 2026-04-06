import { PromptWords } from "./interface";
import request from "./request";
type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;
type Number1To50 = Exclude<Enumerate<51>, 0>;
export const getKeywords = (date?: string) => {
  return request({
    url: "/v1/keywords/today",
    method: "GET",
    params: {
      date: date,
    },
  });
};
export const getoffcialHome = (date?: string) => {
  return request({
    url: "/v1/official/home",
    method: "GET",
    params: {
      date: date,
    },
  });
};
export const drawOfficialPrompt = (keyword_id: string, kind: PromptWords) => {
  return request({
    url: `/v1/official/keywords/${keyword_id}/prompts/draw`,
    method: "POST",
    data: {
      kind: kind,
    },
  });
};
//获取官方关键词作品列表
export const listOfficialDateUploads = (
  biz_date: string,
  sort?: "random" | "latest",
  limit?: Number1To50,
  seed?: number,
  include_reaction_counts?: boolean,
) => {
  return request({
    url: `/v1/official/dates/${biz_date}/uploads`,
    method: "GET",
    params: {
      sort: sort,
      limit: limit,
      seed: seed,
      include_reaction_counts: include_reaction_counts,
    },
  });
};
//作品详情页
export const getOfficialUploadDetail = (upload_id: string) => {
  return request({
    url: `/v1/official/uploads/${upload_id}`,
    method: "GET",
  });
};
