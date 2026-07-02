import { api } from "@/lib/axios";
import { Country, Paginated } from "@/lib/types";

export const countryApi = {
  list: () => api.get<Paginated<Country>>("/countries/").then((r) => r.data),
  enabled: () => api.get<Country[]>("/countries/enabled/").then((r) => r.data),
  create: (data: Partial<Country>) =>
    api.post<Country>("/countries/", data).then((r) => r.data),
  update: (id: number, data: Partial<Country>) =>
    api.patch<Country>(`/countries/${id}/`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/countries/${id}/`),
};
