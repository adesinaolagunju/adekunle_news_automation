import { api } from "@/lib/axios";
import { NewsFilterRule, Paginated } from "@/lib/types";

export const filterRuleApi = {
  list: () => api.get<Paginated<NewsFilterRule>>("/filter-rules/").then((r) => r.data),
  enabled: () => api.get<NewsFilterRule[]>("/filter-rules/enabled/").then((r) => r.data),
  create: (data: Partial<NewsFilterRule>) =>
    api.post<NewsFilterRule>("/filter-rules/", data).then((r) => r.data),
  update: (id: number, data: Partial<NewsFilterRule>) =>
    api.patch<NewsFilterRule>(`/filter-rules/${id}/`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/filter-rules/${id}/`),
};
