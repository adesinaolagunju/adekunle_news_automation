// store/useBufferStore.ts

import { create } from "zustand";
import type { BufferAccountStatus, BufferProfile, BufferConnectPayload } from "@/lib/types";
import { bufferApi } from "@/lib/api/buffer";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface BufferState {
  account: BufferAccountStatus | null;
  profiles: BufferProfile[];
  loading: boolean;
  connecting: boolean;
  disconnecting: boolean;
  testing: boolean;
  connect: (data: BufferConnectPayload) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  testConnection: (accessToken?: string) => Promise<boolean>;
  fetchStatus: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  reset: () => void;
}

export const useBufferStore = create<BufferState>((set, get) => ({
  account: null,
  profiles: [],
  loading: false,
  connecting: false,
  disconnecting: false,
  testing: false,

  connect: async (data) => {
    set({ connecting: true });
    try {
      const res = await bufferApi.connect(data);
      set({ account: res.account });
      toast.success("Buffer connected successfully");
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to connect Buffer"));
      return false;
    } finally {
      set({ connecting: false });
    }
  },

  disconnect: async () => {
    set({ disconnecting: true });
    try {
      await bufferApi.disconnect();
      set({ account: null, profiles: [] });
      toast.success("Buffer disconnected");
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to disconnect Buffer"));
      return false;
    } finally {
      set({ disconnecting: false });
    }
  },

  testConnection: async (accessToken) => {
    set({ testing: true });
    try {
      const res = await bufferApi.test(accessToken ? { access_token: accessToken } : undefined);
      if (res.success) {
        toast.success(res.message || "Buffer connection successful");
      } else {
        toast.error(res.message || "Buffer connection test failed");
      }
      return res.success;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Buffer connection test failed"));
      return false;
    } finally {
      set({ testing: false });
    }
  },

  fetchStatus: async () => {
    set({ loading: true });
    try {
      const status = await bufferApi.status();
      if ("id" in status) {
        set({ account: status });
      } else {
        set({ account: null });
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load Buffer status"));
    } finally {
      set({ loading: false });
    }
  },

  fetchProfiles: async () => {
    set({ loading: true });
    try {
      const res = await bufferApi.profiles();
      set({ profiles: res.profiles });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load Buffer profiles"));
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      account: null,
      profiles: [],
      loading: false,
      connecting: false,
      disconnecting: false,
      testing: false,
    });
  },
}));
