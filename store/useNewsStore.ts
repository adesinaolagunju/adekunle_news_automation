import { create } from "zustand";
import { FetchRecentResponse, News, Paginated, PostAllResponse } from "@/lib/types";
import { newsApi, NewsFilters } from "@/lib/api/news";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface NewsState {
  items: News[];
  count: number;
  page: number;
  filters: NewsFilters;
  loading: boolean;
  fetching: boolean;
  fetchingRecent: boolean;
  postingAll: boolean;
  reposting: Record<number, boolean>;
  creating: boolean;
  setFilters: (f: Partial<NewsFilters>) => void;
  setPage: (p: number) => void;
  fetchList: () => Promise<void>;
  fetchNow: () => Promise<void>;
  fetchRecent: () => Promise<FetchRecentResponse | null>;
  postAll: () => Promise<PostAllResponse | null>;
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
  fetchingRecent: false,
  postingAll: false,
  reposting: {},
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

  fetchRecent: async () => {
    set({ fetchingRecent: true });
    try {
      const res = await newsApi.fetchRecent();
      const parts: string[] = [];
      if (res.accounts_processed > 0) parts.push(`${res.accounts_processed} account(s)`);
      if (res.fetched > 0) parts.push(`${res.fetched} fetched`);
      if (res.new > 0) parts.push(`${res.new} new`);
      if (res.duplicates > 0) parts.push(`${res.duplicates} duplicates`);
      if (res.queued > 0) parts.push(`${res.queued} queued`);
      if (res.pages_fetched > 0) parts.push(`${res.pages_fetched} page(s)`);
      const msg = parts.length > 0 ? parts.join(", ") : "No recent news found";

      // An upstream 404/timeout is reported per account inside a 200 response.
      // Surface it instead of showing a misleading success toast.
      const errored = (res.errors ?? res.accounts ?? []).filter((a) => a.error);
      if (errored.length > 0) {
        const detail = errored
          .map((a) => `${a.account_name || `Account ${a.account_id}`}: ${a.error}`)
          .join("; ");
        toast.error(`Fetch issue — ${detail}`);
      } else {
        toast.success(msg);
      }
      get().fetchList();
      return res;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to fetch recent news"));
      return null;
    } finally {
      set({ fetchingRecent: false });
    }
  },

  postAll: async () => {
    set({ postingAll: true });
    try {
      const accountId = get().filters.buffer_account;
      const res = await newsApi.postAll(accountId);
      const parts: string[] = [];
      if (res.posted > 0) parts.push(`${res.posted} posted`);
      if (res.failed > 0) parts.push(`${res.failed} failed`);
      if (res.skipped_no_account > 0) parts.push(`${res.skipped_no_account} skipped (no account)`);
      const msg = parts.length > 0 ? parts.join(", ") : "No news to post";
      if (res.failed > 0 && res.errors?.length > 0) {
        const firstError = res.errors[0].error;
        toast.error(`${msg} — ${firstError}`);
      } else {
        toast.success(msg);
      }
      get().fetchList();
      return res;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to post unposted news"));
      return null;
    } finally {
      set({ postingAll: false });
    }
  },

  repost: async (id) => {
    set((s) => ({ reposting: { ...s.reposting, [id]: true } }));
    try {
      const res = await newsApi.repost(id);
      toast.success(res.message);
      get().fetchList();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Repost failed"));
    } finally {
      set((s) => {
        const next = { ...s.reposting };
        delete next[id];
        return { reposting: next };
      });
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
