import { api } from "@/lib/axios";
import { Category, Paginated } from "@/lib/types";

export const categoryApi = {
  list: () => api.get<Paginated<Category>>("/categories/").then((r) => r.data),
  enabled: () => api.get<Category[]>("/categories/enabled/").then((r) => r.data),
  create: (data: Partial<Category>) =>
    api.post<Category>("/categories/", data).then((r) => r.data),
  update: (id: number, data: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}/`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/categories/${id}/`),
};
