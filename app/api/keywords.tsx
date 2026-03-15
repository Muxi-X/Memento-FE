import { PromptWords, sortOptions } from "./interface";
import request from "./request";
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
type Number1To50 = Exclude<Enumerate<51>, 0>;
export const getKeywords = (date?:string)=>{
      return request(
        {
            url: "/v1/keywords/today",
            method: "get",
            params:{
                date:date
            }
        }
    )
}
export const getoffcialHome=(date?:string)=>{
    return request(
        {
            url: "/v1/official/home",
            method: "get",
            params:{
                date:date
            }
        }
    )
}
export const drawOfficialPrompt=(keyword_id:string|null,kind:PromptWords)=>{
    return request(
        {
            url: `/v1/official/keywords/${keyword_id}/prompts/draw`,
            method: "post",
            data:{
                kind:kind
            }
        }
    )
}
export const listOfficialDateUploads=( biz_date:string,sort?:sortOptions,
  limit?:Number1To50,seed?:number,include_reaction_counts?:boolean
)=>{
    return request(
        {
            url: `/v1/official/dates/${biz_date}/uploads`,
            method: "get",
            params:{
                sort:sort,
                limit:limit,
                seed:seed,
                include_reaction_counts:include_reaction_counts
            }

        }
    )
}