import { create } from "zustand";
interface PromptStore {
  keyword_id:string|null;
  biz_date:string;
  date:string|null;
  todayKeyword:string;
  yesterdaysKeyword:string;
  yesterdaysdate:string|null;
  setTodayKeyword: (todayKeyword:string) => void;
  setYesterdaysKeyword: (yesterdaysKeyword:string) => void;
  setKeywordId: (keyword_id:string|null) => void;
  setBiz_date: (biz_date:string) => void;
  setYesterdaydate: (yesterdaydate:string|null) => void;
  setdate: (date:string|null) => void;  
}
interface Find{
  sort:"random"|"lastest"
  setsort: (sort: "random"|"lastest") => void;
}
 export const useFindStore = create<Find>((set) => ({
  sort: "random",
  setsort: (sort) => set(() => ({ sort }))
}));
const usePromptStore = create<PromptStore>((set) => ({
  keyword_id: null,
  biz_date: "9999",
  date:null,
  todayKeyword: "关键词",
  yesterdaysKeyword: "关键词",
  yesterdaysdate: null,
  setTodayKeyword: (todayKeyword) => set(() => ({ todayKeyword })),
  setKeywordId: (keyword_id) => set(() => ({ keyword_id })),
  setBiz_date:(biz_date) => set(() => ({ biz_date })),
  setYesterdaysKeyword: (yesterdaysKeyword) => set(() => ({ yesterdaysKeyword })),
  setYesterdaydate: (yesterdaydate) => set(() => ({ yesterdaysdate: yesterdaydate })),
  setdate: (date) => set(() => ({ date }))
}));
export default usePromptStore;