import { api } from "@/lib/axios";
import { User } from "@/lib/types";

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>("/auth/login/", { username, password }).then((r) => r.data),

  logout: () => api.post("/auth/logout/"),

  me: () => api.get<User>("/auth/user/").then((r) => r.data),
};
