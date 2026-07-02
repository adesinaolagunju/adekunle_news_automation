import { api } from "@/lib/axios";
import { SystemSettings } from "@/lib/types";

export const settingsApi = {
  get: () => api.get<SystemSettings>("/settings/").then((r) => r.data),
  update: (data: Partial<SystemSettings>) =>
    api.post<{ message: string; settings: SystemSettings }>("/settings/", data).then((r) => r.data),
};
