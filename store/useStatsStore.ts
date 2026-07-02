import { create } from "zustand";
import { DashboardStats, PlatformStats } from "@/lib/types";
import { statsApi } from "@/lib/api/stats";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface StatsState {
  dashboard: DashboardStats | null;
  platforms: PlatformStats[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
  fetchPlatforms: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  dashboard: null,
  platforms: [],
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await statsApi.dashboard();
      set({ dashboard: data });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load dashboard stats"));
    } finally {
      set({ loading: false });
    }
  },

  fetchPlatforms: async () => {
    try {
      const data = await statsApi.platforms();
      set({ platforms: data });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load platform stats"));
    }
  },
}));
