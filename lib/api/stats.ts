import { api } from "@/lib/axios";
import { DashboardStats, PlatformStats } from "@/lib/types";

export const statsApi = {
  dashboard: () => api.get<DashboardStats>("/stats/dashboard/").then((r) => r.data),
  platforms: () => api.get<PlatformStats[]>("/stats/platforms/").then((r) => r.data),
};
