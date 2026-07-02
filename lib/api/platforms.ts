// lib/api/platforms.ts
import { api } from "@/lib/axios";
import { Paginated, SocialPlatform, PlatformTestPayload, PlatformTestResult, PlatformBulkConfig } from "@/lib/types";

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

  // ============ Dedicated Connection Endpoints ============

  /**
   * Connect a new platform with configuration
   */
  connect: (data: {
    platform: string;
    config: Record<string, unknown>;
    enabled?: boolean;
  }) => 
    api.post<{
      message: string;
      platform: SocialPlatform;
    }>("/platforms/connect/", data).then((r) => r.data),

  /**
   * Update platform connection configuration
   */
  updateConnection: (platformName: string, data: {
    config?: Record<string, unknown>;
    enabled?: boolean;
  }) => 
    api.put<{
      message: string;
      platform: SocialPlatform;
    }>(`/platforms/connect/${platformName}/`, data).then((r) => r.data),

  /**
   * Disconnect/delete a platform by name
   */
  disconnect: (platformName: string) => 
    api.delete<{
      message: string;
    }>(`/platforms/connect/${platformName}/`).then((r) => r.data),

  // ============ Testing Endpoints ============

  /**
   * Test a platform connection
   */
  test: (payload: PlatformTestPayload) => 
    api.post<PlatformTestResult>("/platforms/test/", payload).then((r) => r.data),

  // ============ Bulk Operations ============

  /**
   * Get all platform configurations (with sensitive data masked)
   */
  getBulkConfig: () => 
    api.get<Record<string, {
      enabled: boolean;
      config: Record<string, string>;
    }>>("/platforms/bulk-config/").then((r) => r.data),

  /**
   * Bulk update platform configurations
   */
  bulkUpdate: (config: PlatformBulkConfig) => 
    api.post<{
      message: string;
      results: Record<string, string>;
    }>("/platforms/bulk-config/", config).then((r) => r.data),
};