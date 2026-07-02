import { api } from "@/lib/axios";
import { Paginated, PostJob, PostLog } from "@/lib/types";

export interface PostJobFilters {
  status?: string;
  platform?: string;
  news_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
}

export const postJobApi = {
  list: (filters: PostJobFilters = {}) =>
    api.get<Paginated<PostJob>>("/posts/", { params: filters }).then((r) => r.data),

  createManual: (payload: {
    news_id: number;
    platform_id: number;
    telegram_channel_id?: number;
  }) =>
    api
      .post<{ message: string; job_id: number }>("/posts/create_manual/", payload)
      .then((r) => r.data),

  retry: (id: number) =>
    api.post<{ message: string; job_id: number }>(`/posts/${id}/retry/`).then((r) => r.data),

  logs: (id: number) => api.get<PostLog[]>(`/posts/${id}/logs/`).then((r) => r.data),
};
