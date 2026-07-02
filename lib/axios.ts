import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Plain client (no interceptors) used for the refresh call itself,
// so a failed refresh can't recursively trigger another refresh.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

// ---- Request interceptor: attach access token ----
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: refresh on 401, single-flight ----
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  try {
    // Requires SimpleJWT's TokenRefreshView mounted at /auth/refresh/
    const { data } = await refreshClient.post("/auth/refresh/", {
      refresh: refreshToken,
    });
    const newAccess: string = data.access;
    useAuthStore.getState().setAccessToken(newAccess);
    return newAccess;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // Refresh failed: hard logout
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/** Extracts a human-readable message from a DRF error response. */
export function apiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      if ("error" in data && typeof (data as any).error === "string") {
        return (data as any).error;
      }
      if ("detail" in data && typeof (data as any).detail === "string") {
        return (data as any).detail;
      }
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const val = (data as any)[firstKey];
        const msg = Array.isArray(val) ? val[0] : val;
        return `${firstKey}: ${msg}`;
      }
    }
    if (err.message) return err.message;
  }
  return fallback;
}
