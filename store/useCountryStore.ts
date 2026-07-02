import { create } from "zustand";
import { Country } from "@/lib/types";
import { countryApi } from "@/lib/api/countries";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

interface CountryState {
  items: Country[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  create: (name: string, code: string) => Promise<void>;
  toggle: (country: Country) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  items: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await countryApi.list();
      set({ items: data.results });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to load countries"));
    } finally {
      set({ loading: false });
    }
  },

  create: async (name, code) => {
    try {
      const created = await countryApi.create({ name, code, enabled: true });
      set({ items: [...get().items, created] });
      toast.success(`Country "${name}" added`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to add country"));
    }
  },

  toggle: async (country) => {
    const updated = await countryApi.update(country.id, { enabled: !country.enabled });
    set({ items: get().items.map((c) => (c.id === country.id ? updated : c)) });
  },

  remove: async (id) => {
    try {
      await countryApi.remove(id);
      set({ items: get().items.filter((c) => c.id !== id) });
      toast.success("Country removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove country"));
    }
  },
}));
