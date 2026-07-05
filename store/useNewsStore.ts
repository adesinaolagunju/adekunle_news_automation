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
  creating: boolean;
  setFilters: (f: Partial<NewsFilters>) => void;
  setPage: (p: number) => void;
  fetchList: () => Promise<void>;
  fetchNow: () => Promise<void>;
  repost: (id: number) => Promise<void>;
  create: (data: Partial<News>) => Promise<News | null>;
  update: (id: number, data: Partial<News>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  items: [],
  count: 0,
  page: 1,
  filters: {},
  loading: false,
  fetching: false,
  creating: false,

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

  create: async (data) => {
    set({ creating: true });
    try {
      const created = await newsApi.create(data);
      set({ items: [created, ...get().items] });
      toast.success("News article created");
      return created;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to create news"));
      return null;
    } finally {
      set({ creating: false });
    }
  },

  update: async (id, data) => {
    try {
      const updated = await newsApi.update(id, data);
      set({ items: get().items.map((n) => (n.id === id ? updated : n)) });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update news"));
    }
  },

  remove: async (id) => {
    try {
      await newsApi.remove(id);
      set({ items: get().items.filter((n) => n.id !== id) });
      toast.success("News article removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove news"));
    }
  },
}));
