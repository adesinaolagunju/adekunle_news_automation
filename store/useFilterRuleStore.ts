import { create } from "zustand";
import { NewsFilterRule } from "@/lib/types";
import { filterRuleApi } from "@/lib/api/filterRules";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface FilterRuleState {
  items: NewsFilterRule[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  create: (data: Partial<NewsFilterRule>) => Promise<void>;
  toggle: (rule: NewsFilterRule) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useFilterRuleStore = create<FilterRuleState>((set, get) => ({
  items: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await filterRuleApi.list();
      set({ items: data.results });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load filter rules"));
    } finally {
      set({ loading: false });
    }
  },

  create: async (data) => {
    try {
      const created = await filterRuleApi.create({ ...data, enabled: true });
      set({ items: [...get().items, created] });
      toast.success("Filter rule added");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to add filter rule"));
    }
  },

  toggle: async (rule) => {
    const updated = await filterRuleApi.update(rule.id, { enabled: !rule.enabled });
    set({ items: get().items.map((r) => (r.id === rule.id ? updated : r)) });
  },

  remove: async (id) => {
    try {
      await filterRuleApi.remove(id);
      set({ items: get().items.filter((r) => r.id !== id) });
      toast.success("Filter rule removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove filter rule"));
    }
  },
}));
