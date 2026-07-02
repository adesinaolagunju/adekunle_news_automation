import { create } from "zustand";
import { News, Paginated } from "@/lib/types";
import { newsApi, NewsFilters } from "@/lib/api/news";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface NewsState {
  items: News[];
  count: number;
  page: number;
  filters: NewsFilters;
  loading: boolean;
  fetching: boolean; // manual "fetch now" in progress
  setFilters: (f: Partial<NewsFilters>) => void;
  setPage: (p: number) => void;
  fetchList: () => Promise<void>;
  fetchNow: () => Promise<void>;
  repost: (id: number) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  items: [],
  count: 0,
  page: 1,
  filters: {},
  loading: false,
  fetching: false,

  setFilters: (f) => {
    set({ filters: { ...get().filters, ...f }, page: 1 });
    get().fetchList();
  },

  setPage: (p) => {
    set({ page: p });
    get().fetchList();
  },

  fetchList: async () => {
    set({ loading: true });
    try {
      const data: Paginated<News> = await newsApi.list({
        ...get().filters,
        page: get().page,
      });
      set({ items: data.results, count: data.count });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load news"));
    } finally {
      set({ loading: false });
    }
  },

  fetchNow: async () => {
    set({ fetching: true });
    try {
      const res = await newsApi.fetchNow();
      toast.success(res.message || "News fetch started");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to trigger fetch"));
    } finally {
      set({ fetching: false });
    }
  },

  repost: async (id) => {
    try {
      const res = await newsApi.repost(id);
      toast.success(res.message);
      get().fetchList();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Repost failed"));
    }
  },
}));
