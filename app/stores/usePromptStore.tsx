import { create } from 'zustand';
interface PromptStore {
  keyword_id: string;
  biz_date: string;
  date: string;
  todayKeyword: string;
  yesterdaysKeyword: string;
  yesterdaysdate: string;
  setTodayKeyword: (todayKeyword: string) => void;
  setYesterdaysKeyword: (yesterdaysKeyword: string) => void;
  setKeywordId: (keyword_id: string) => void;
  setBiz_date: (biz_date: string) => void;
  setYesterdaydate: (yesterdaydate: string) => void;
  setdate: (date: string) => void;
}
interface Find {
  sort: 'random' | 'latest';
  sort2: 'me' | 'all';
  setsort2: (sort2: 'me' | 'all') => void;
  setsort: (sort: 'random' | 'latest') => void;
}
export const useFindStore = create<Find>((set) => ({
  sort: 'random',
  sort2: 'all',
  setsort2: (sort2) => set(() => ({ sort2 })),
  setsort: (sort) => set(() => ({ sort })),
}));
const usePromptStore = create<PromptStore>((set) => ({
  keyword_id: '1',
  biz_date: '9999',
  date: '1111',
  todayKeyword: '关键词',
  yesterdaysKeyword: '关键词',
  yesterdaysdate: '1111',
  setTodayKeyword: (todayKeyword) => set(() => ({ todayKeyword })),
  setKeywordId: (keyword_id) => set(() => ({ keyword_id })),
  setBiz_date: (biz_date) => set(() => ({ biz_date })),
  setYesterdaysKeyword: (yesterdaysKeyword) => set(() => ({ yesterdaysKeyword })),
  setYesterdaydate: (yesterdaydate) => set(() => ({ yesterdaysdate: yesterdaydate })),
  setdate: (date) => set(() => ({ date })),
}));
export default usePromptStore;
