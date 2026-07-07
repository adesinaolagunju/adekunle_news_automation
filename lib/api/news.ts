import { api } from "@/lib/axios";
import { FetchRecentResponse, News, NewsDetail, Paginated, PostAllResponse } from "@/lib/types";

export interface NewsFilters {
  category?: string;
  country?: string;
  source?: string;
  search?: string;
  processed?: boolean;
  date_from?: string;
  date_to?: string;
  page?: number;
}

export const newsApi = {
  list: (filters: NewsFilters = {}) =>
    api.get<Paginated<News>>("/news/", { params: filters }).then((r) => r.data),

  get: (id: number) => api.get<NewsDetail>(`/news/${id}/`).then((r) => r.data),

  categories: () =>
    api.get<{ category: string; count: number }[]>("/news/categories/").then((r) => r.data),

  countries: () =>
    api.get<{ country: string; count: number }[]>("/news/countries/").then((r) => r.data),

  sources: () =>
    api.get<{ source: string; count: number }[]>("/news/sources/").then((r) => r.data),

  fetchNow: () =>
    api.post<{ task_id: string; message: string }>("/news/fetch/").then((r) => r.data),

  fetchRecent: () =>
    api.post<FetchRecentResponse>("/news/fetch_recent/").then((r) => r.data),

  postAll: () =>
    api.post<PostAllResponse>("/news/post_all/").then((r) => r.data),

  repost: (id: number) =>
    api
      .post<{ message: string; job_ids: number[] }>(`/news/${id}/repost/`)
      .then((r) => r.data),

  create: (data: Partial<News>) =>
    api.post<News>("/news/", data).then((r) => r.data),

  update: (id: number, data: Partial<News>) =>
    api.patch<News>(`/news/${id}/`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete<{ message: string }>(`/news/${id}/`).then((r) => r.data),
};
