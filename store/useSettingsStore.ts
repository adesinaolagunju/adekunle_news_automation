import { create } from "zustand";
import { SystemSettings } from "@/lib/types";
import { settingsApi } from "@/lib/api/settings";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface SettingsState {
  settings: SystemSettings | null;
  loading: boolean;
  saving: boolean;
  fetch: () => Promise<void>;
  save: (data: Partial<SystemSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  saving: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const data = await settingsApi.get();
      set({ settings: data });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load settings"));
    } finally {
      set({ loading: false });
    }
  },

  save: async (data) => {
    set({ saving: true });
    try {
      const res = await settingsApi.update({ ...get().settings, ...data });
      set({ settings: res.settings });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to save settings"));
    } finally {
      set({ saving: false });
    }
  },
}));
