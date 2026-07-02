import { create } from "zustand";
import { PostJob } from "@/lib/types";
import { postJobApi, PostJobFilters } from "@/lib/api/posts";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface PostJobState {
  items: PostJob[];
  count: number;
  page: number;
  filters: PostJobFilters;
  loading: boolean;
  retryingId: number | null;
  setFilters: (f: Partial<PostJobFilters>) => void;
  setPage: (p: number) => void;
  fetchList: () => Promise<void>;
  retry: (id: number) => Promise<void>;
}

export const usePostJobStore = create<PostJobState>((set, get) => ({
  items: [],
  count: 0,
  page: 1,
  filters: {},
  loading: false,
  retryingId: null,

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
      const data = await postJobApi.list({ ...get().filters, page: get().page });
      set({ items: data.results, count: data.count });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load post history"));
    } finally {
      set({ loading: false });
    }
  },

  retry: async (id) => {
    set({ retryingId: id });
    try {
      const res = await postJobApi.retry(id);
      toast.success(res.message);
      get().fetchList();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Retry failed"));
    } finally {
      set({ retryingId: null });
    }
  },
}));
