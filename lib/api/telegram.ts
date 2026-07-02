// lib/api/telegram.ts
import { api } from "@/lib/axios";
import {
  Paginated,
  TelegramChannel,
  TelegramTestPayload,
  TelegramTestResult,
} from "@/lib/types";

export const telegramApi = {
  // ============ CRUD Operations ============

  /**
   * List all Telegram channels with pagination
   */
  list: () => 
    api.get<Paginated<TelegramChannel>>("/telegram-channels/").then((r) => r.data),

  /**
   * Get Telegram channel by ID
   */
  get: (id: number) => 
    api.get<TelegramChannel>(`/telegram-channels/${id}/`).then((r) => r.data),

  /**
   * Create a new Telegram channel
   */
  create: (data: Partial<TelegramChannel>) => 
    api.post<TelegramChannel>("/telegram-channels/", data).then((r) => r.data),

  /**
   * Update Telegram channel (full update)
   */
  update: (id: number, data: Partial<TelegramChannel>) => 
    api.put<TelegramChannel>(`/telegram-channels/${id}/`, data).then((r) => r.data),

  /**
   * Partial update Telegram channel (PATCH)
   */
  partialUpdate: (id: number, data: Partial<TelegramChannel>) => 
    api.patch<TelegramChannel>(`/telegram-channels/${id}/`, data).then((r) => r.data),

  /**
   * Delete Telegram channel
   */
  remove: (id: number) => 
    api.delete(`/telegram-channels/${id}/`).then((r) => r.data),

  // ============ Specialized Endpoints ============

  /**
   * Test a Telegram connection (bot token and channel)
   */
  test: (payload: TelegramTestPayload) =>
    api.post<TelegramTestResult>("/telegram-channels/test/", payload).then((r) => r.data),

  /**
   * Verify a Telegram channel
   */
  verify: (id: number) =>
    api
      .post<{ 
        success: boolean; 
        message?: string; 
        error?: string;
        channel_info?: Record<string, unknown>;
      }>(`/telegram-channels/${id}/verify/`)
      .then((r) => r.data),

  /**
   * Send a test post to the channel
   */
  testPost: (id: number) =>
    api
      .post<{ 
        success: boolean; 
        message?: string; 
        message_id?: string; 
        error?: string;
      }>(`/telegram-channels/${id}/test_post/`)
      .then((r) => r.data),

  /**
   * Sync channel information (subscriber count, etc.)
   */
  syncInfo: (id: number) =>
    api
      .post<{ 
        success: boolean; 
        channel_info?: Record<string, unknown>; 
        error?: string;
      }>(`/telegram-channels/${id}/sync_info/`)
      .then((r) => r.data),
};