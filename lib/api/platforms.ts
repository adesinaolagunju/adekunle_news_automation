// lib/api/platforms.ts
import { api } from "@/lib/axios";
import { Paginated, SocialPlatform } from "@/lib/types";

export const platformApi = {
  // ============ CRUD Operations ============
  
  /**
   * List all platforms with pagination
   */
  list: () => 
    api.get<Paginated<SocialPlatform>>("/platforms/").then((r) => r.data),

  /**
   * Get platform details by ID
   */
  get: (id: number) => 
    api.get<SocialPlatform>(`/platforms/${id}/`).then((r) => r.data),

  /**
   * Create a new platform
   */
  create: (data: Partial<SocialPlatform>) => 
    api.post<SocialPlatform>("/platforms/", data).then((r) => r.data),

  /**
   * Update platform (full update)
   */
  update: (id: number, data: Partial<SocialPlatform>) => 
    api.put<SocialPlatform>(`/platforms/${id}/`, data).then((r) => r.data),

  /**
   * Partial update platform (PATCH)
   */
  partialUpdate: (id: number, data: Partial<SocialPlatform>) => 
    api.patch<SocialPlatform>(`/platforms/${id}/`, data).then((r) => r.data),

  /**
   * Delete platform
   */
  remove: (id: number) => 
    api.delete(`/platforms/${id}/`).then((r) => r.data),

  // ============ Specialized Endpoints ============

  /**
   * Get only enabled platforms
   */
  enabled: () => 
    api.get<SocialPlatform[]>("/platforms/enabled/").then((r) => r.data),

  /**
   * Toggle platform enabled/disabled
   */
  toggle: (id: number) => 
    api.post<{ message: string; platform: SocialPlatform }>(`/platforms/${id}/toggle/`).then((r) => r.data),

  /**
   * Get platform connection status
   */
  connectionStatus: (id: number) => 
    api.get<{
      platform: string;
      enabled: boolean;
      is_connected: boolean;
      details: Record<string, unknown> | null;
    }>(`/platforms/${id}/connection_status/`).then((r) => r.data),

};