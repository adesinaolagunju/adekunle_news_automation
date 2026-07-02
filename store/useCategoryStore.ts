import { create } from "zustand";
import { Category } from "@/lib/types";
import { categoryApi } from "@/lib/api/categories";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface CategoryState {
  items: Category[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  create: (name: string) => Promise<void>;
  toggle: (cat: Category) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  items: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await categoryApi.list();
      set({ items: data.results });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load categories"));
    } finally {
      set({ loading: false });
    }
  },

  create: async (name) => {
    try {
      const created = await categoryApi.create({ name, enabled: true });
      set({ items: [...get().items, created] });
      toast.success(`Category "${name}" added`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to add category"));
    }
  },

  toggle: async (cat) => {
    const updated = await categoryApi.update(cat.id, { enabled: !cat.enabled });
    set({ items: get().items.map((c) => (c.id === cat.id ? updated : c)) });
  },

  remove: async (id) => {
    try {
      await categoryApi.remove(id);
      set({ items: get().items.filter((c) => c.id !== id) });
      toast.success("Category removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove category"));
    }
  },
}));
