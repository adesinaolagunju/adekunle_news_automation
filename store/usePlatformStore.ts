// stores/platformStore.ts
import { create } from "zustand";
import { 
  SocialPlatform, 
  PlatformConnectionStatus 
} from "@/lib/types";
import { platformApi } from "@/lib/api/platforms";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface PlatformState {
  // ============ State ============
  items: SocialPlatform[];
  loading: boolean;
  connectionStatus: Record<number, PlatformConnectionStatus | null>;
  
  // ============ CRUD Operations ============
  fetchAll: () => Promise<void>;
  fetchEnabled: () => Promise<SocialPlatform[]>;
  fetchOne: (id: number) => Promise<SocialPlatform | null>;
  create: (data: Partial<SocialPlatform>) => Promise<SocialPlatform | null>;
  update: (id: number, data: Partial<SocialPlatform>) => Promise<SocialPlatform | null>;
  remove: (id: number) => Promise<boolean>;
  
  // ============ Platform Management ============
  toggle: (id: number) => Promise<void>;
  
  // ============ Status ============
  fetchConnectionStatus: (id: number) => Promise<PlatformConnectionStatus | null>;
  
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  // ============ Initial State ============
  items: [],
  loading: false,
  connectionStatus: {},

  // ============ CRUD Operations ============

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await platformApi.list();
      set({ items: data.results });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load platforms"));
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchEnabled: async () => {
    try {
      const platforms = await platformApi.enabled();
      return platforms;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load enabled platforms"));
      throw err;
    }
  },

  fetchOne: async (id: number) => {
    try {
      const platform = await platformApi.get(id);
      // Update in store if exists
      const currentItems = get().items;
      const index = currentItems.findIndex((p) => p.id === id);
      if (index !== -1) {
        const newItems = [...currentItems];
        newItems[index] = platform;
        set({ items: newItems });
      }
      return platform;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load platform"));
      throw err;
    }
  },

  create: async (data: Partial<SocialPlatform>) => {
    try {
      const platform = await platformApi.create(data);
      set({ items: [platform, ...get().items] });
      toast.success(`Platform "${platform.name}" created successfully`);
      return platform;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to create platform"));
      throw err;
    }
  },

  update: async (id: number, data: Partial<SocialPlatform>) => {
    try {
      const platform = await platformApi.partialUpdate(id, data);
      set({
        items: get().items.map((p) => (p.id === id ? platform : p)),
      });
      toast.success(`Platform "${platform.name}" updated successfully`);
      return platform;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update platform"));
      throw err;
    }
  },

  remove: async (id: number) => {
    try {
      await platformApi.remove(id);
      set({
        items: get().items.filter((p) => p.id !== id),
      });
      toast.success("Platform removed successfully");
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove platform"));
      throw err;
    }
  },

  // ============ Platform Management ============

  toggle: async (id: number) => {
    try {
      const { message, platform } = await platformApi.toggle(id);
      set({
        items: get().items.map((p) => (p.id === id ? platform : p)),
      });
      toast.success(message || `${platform.name} ${platform.enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to toggle platform"));
      throw err;
    }
  },

  // ============ Status ============

  fetchConnectionStatus: async (id: number) => {
    try {
      const status = await platformApi.connectionStatus(id);
      set({
        connectionStatus: {
          ...get().connectionStatus,
          [id]: status,
        },
      });
      return status;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to fetch connection status"));
      throw err;
    }
  },

}));