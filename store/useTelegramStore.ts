// store/useTelegramStore.ts

import { create } from "zustand";
import { TelegramChannel } from "@/lib/types";
import { telegramApi } from "@/lib/api/telegram";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface TelegramState {
  items: TelegramChannel[];
  loading: boolean;
  busyId: number | null; // channel currently being verified/tested
  syncingId: number | null; // channel currently being synced
  fetchAll: () => Promise<void>;
  create: (data: Partial<TelegramChannel>) => Promise<TelegramChannel | null>;
  update: (id: number, data: Partial<TelegramChannel>) => Promise<void>;
  partialUpdate: (id: number, data: Partial<TelegramChannel>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  verify: (id: number) => Promise<void>;
  testPost: (id: number) => Promise<void>;
  syncInfo: (id: number) => Promise<void>;
}

export const useTelegramStore = create<TelegramState>((set, get) => ({
  items: [],
  loading: false,
  busyId: null,
  syncingId: null,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await telegramApi.list();
      set({ items: data.results });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load Telegram channels"));
    } finally {
      set({ loading: false });
    }
  },

  create: async (data) => {
    try {
      const created = await telegramApi.create(data);
      set({ items: [created, ...get().items] });
      toast.success(`Channel "${created.name}" added — verify it to start posting`);
      return created;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to add channel"));
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const updated = await telegramApi.update(id, data);
      set({ items: get().items.map((c) => (c.id === id ? updated : c)) });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update channel"));
    }
  },

  partialUpdate: async (id, data) => {
    try {
      const updated = await telegramApi.partialUpdate(id, data);
      set({ items: get().items.map((c) => (c.id === id ? updated : c)) });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update channel"));
    }
  },

  remove: async (id) => {
    try {
      await telegramApi.remove(id);
      set({ items: get().items.filter((c) => c.id !== id) });
      toast.success("Channel removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove channel"));
    }
  },

  verify: async (id) => {
    set({ busyId: id });
    try {
      const res = await telegramApi.verify(id);
      if (res.success) {
        toast.success(res.message || "Channel verified");
        get().fetchAll();
      } else {
        toast.error(res.error || "Verification failed");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Verification failed"));
    } finally {
      set({ busyId: null });
    }
  },

  testPost: async (id) => {
    set({ busyId: id });
    try {
      const res = await telegramApi.testPost(id);
      if (res.success) {
        toast.success("Test post sent");
      } else {
        toast.error(res.error || "Test post failed");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Test post failed"));
    } finally {
      set({ busyId: null });
    }
  },

  syncInfo: async (id) => {
    set({ syncingId: id });
    try {
      const res = await telegramApi.syncInfo(id);
      if (res.success) {
        toast.success("Channel info synced");
        get().fetchAll();
      } else {
        toast.error(res.error || "Sync failed");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Sync failed"));
    } finally {
      set({ syncingId: null });
    }
  },
}));
