// stores/platformStore.ts
import { create } from "zustand";
import { 
  SocialPlatform, 
  PlatformConnectPayload, 
  PlatformTestPayload,
  PlatformBulkConfig,
  PlatformConnectionStatus 
} from "@/lib/types";
import { platformApi } from "@/lib/api/platforms";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface PlatformState {
  // ============ State ============
  items: SocialPlatform[];
  loading: boolean;
  connecting: boolean;
  testing: boolean;
  bulkUpdating: boolean;
  connectionStatus: Record<number, PlatformConnectionStatus | null>;
  
  // ============ CRUD Operations ============
  fetchAll: () => Promise<void>;
  fetchEnabled: () => Promise<SocialPlatform[]>;
  fetchOne: (id: number) => Promise<SocialPlatform | null>;
  create: (data: Partial<SocialPlatform>) => Promise<SocialPlatform | null>;
  update: (id: number, data: Partial<SocialPlatform>) => Promise<SocialPlatform | null>;
  remove: (id: number) => Promise<boolean>;
  
  // ============ Platform Management ============
  connect: (data: PlatformConnectPayload) => Promise<SocialPlatform | null>;
  updateConnection: (platformName: string, data: { config?: Record<string, unknown>; enabled?: boolean }) => Promise<SocialPlatform | null>;
  disconnect: (platformName: string) => Promise<boolean>;
  toggle: (id: number) => Promise<void>;
  
  // ============ Testing ============
  testConnection: (payload: PlatformTestPayload) => Promise<boolean>;
  fetchConnectionStatus: (id: number) => Promise<PlatformConnectionStatus | null>;
  
  // ============ Bulk Operations ============
  bulkUpdate: (config: PlatformBulkConfig) => Promise<Record<string, string>>;
  
  // ============ Helpers ============
  getPlatformByName: (name: string) => SocialPlatform | undefined;
  getEnabledPlatforms: () => SocialPlatform[];
  getPlatformStatus: (id: number) => string;
  
  // ============ Reset ============
  reset: () => void;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  // ============ Initial State ============
  items: [],
  loading: false,
  connecting: false,
  testing: false,
  bulkUpdating: false,
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

  connect: async (data: PlatformConnectPayload) => {
    set({ connecting: true });
    try {
      const response = await platformApi.connect(data);
      const platform = response.platform;
      set({ 
        items: [platform, ...get().items],
        connecting: false,
      });
      toast.success(response.message || `Platform "${platform.name}" connected successfully`);
      return platform;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to connect platform"));
      set({ connecting: false });
      throw err;
    }
  },

  updateConnection: async (platformName: string, data: { config?: Record<string, unknown>; enabled?: boolean }) => {
    try {
      const response = await platformApi.updateConnection(platformName, data);
      const platform = response.platform;
      set({
        items: get().items.map((p) => (p.id === platform.id ? platform : p)),
      });
      toast.success(response.message || `Platform "${platformName}" updated successfully`);
      return platform;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update platform connection"));
      throw err;
    }
  },

  disconnect: async (platformName: string) => {
    try {
      const response = await platformApi.disconnect(platformName);
      set({
        items: get().items.filter((p) => p.name !== platformName),
      });
      toast.success(response.message || `Platform "${platformName}" disconnected successfully`);
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to disconnect platform"));
      throw err;
    }
  },

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

  // ============ Testing ============

  testConnection: async (payload: PlatformTestPayload) => {
    set({ testing: true });
    try {
      const result = await platformApi.test(payload);
      if (result.success) {
        toast.success(result.message || "Connection test successful");
      } else {
        toast.error(result.message || "Connection test failed");
      }
      set({ testing: false });
      return result.success;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to test connection"));
      set({ testing: false });
      throw err;
    }
  },

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

  // ============ Bulk Operations ============

  bulkUpdate: async (config: PlatformBulkConfig) => {
    set({ bulkUpdating: true });
    try {
      const response = await platformApi.bulkUpdate(config);
      // Refresh the list to get updated data
      await get().fetchAll();
      set({ bulkUpdating: false });
      toast.success(response.message || "Bulk update completed successfully");
      return response.results;
    } catch (err) {
      toast.error(apiErrorMessage(err, "Bulk update failed"));
      set({ bulkUpdating: false });
      throw err;
    }
  },

  // ============ Helpers ============

  getPlatformByName: (name: string) => {
    return get().items.find((p) => p.name === name);
  },

  getEnabledPlatforms: () => {
    return get().items.filter((p) => p.enabled);
  },

  getPlatformStatus: (id: number) => {
    const platform = get().items.find((p) => p.id === id);
    if (!platform) return "unknown";
    if (!platform.enabled) return "disabled";
    return platform.status || "unknown";
  },

  // ============ Reset ============

  reset: () => {
    set({
      items: [],
      loading: false,
      connecting: false,
      testing: false,
      bulkUpdating: false,
      connectionStatus: {},
    });
  },
}));