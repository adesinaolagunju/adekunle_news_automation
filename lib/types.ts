// lib/types/index.ts

// ============ SHARED ============

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

// ============ NEWS ============

export interface Category {
  id: number;
  name: string;
  enabled: boolean;
  created_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
  created_at: string;
}

export interface News {
  id: number;
  api_news_id: number;
  title: string;
  summary: string;
  link: string;
  image: string | null;
  published: string;
  category: string;
  country: string;
  source: string;
  fetched_at: string;
  is_processed: boolean;
  posted_to: string[];
}

export interface NewsDetail extends News {
  post_jobs: PostJob[];
}

export type FilterRuleType = "keyword" | "category" | "country" | "source" | string;
export type FilterRuleAction = "include" | "exclude" | string;

export interface NewsFilterRule {
  id: number;
  rule_type: FilterRuleType;
  rule_action: FilterRuleAction;
  value: string;
  enabled: boolean;
  created_at: string;
}

// ============ SOCIAL / PLATFORMS ============

export type PlatformName = "telegram" | "twitter" | "facebook" | "instagram" | string;
export type PlatformStatus = "connected" | "disconnected" | "configured" | "disabled" | "pending_verification";

export interface SocialPlatform {
  id: number;
  name: PlatformName;
  display_name?: string;        // Custom display name
  enabled: boolean;
  config: Record<string, unknown>;
  icon?: string;                // FontAwesome icon class
  color?: string;               // Platform color for UI
  total_posts?: number;         // Usage stats
  last_post_at?: string | null; // Last post timestamp
  status: PlatformStatus;
  created_at: string;
  updated_at: string;
}

// ============ PLATFORM CONNECTION ============

export interface PlatformConnectPayload {
  platform: PlatformName;
  config: Record<string, unknown>;
  enabled?: boolean;
}

export interface PlatformConnectionStatus {
  platform: string;
  enabled: boolean;
  is_connected: boolean;
  details: {
    // Telegram specific
    verified_channels?: number;
    total_channels?: number;
    // Twitter specific
    has_api_key?: boolean;
    has_access_token?: boolean;
    // Facebook/Instagram specific
    has_page_id?: boolean;
    has_business_id?: boolean;
    [key: string]: unknown;
  } | null;
}

// ============ PLATFORM TESTING ============

export interface PlatformTestPayload {
  platform: PlatformName;
  config?: Record<string, unknown>;
}

export interface PlatformTestResult {
  platform: string;
  success: boolean;
  message: string;
  details?: {
    bot_username?: string;
    bot_name?: string;
    is_bot?: boolean;
    channel?: {
      title: string;
      username: string;
      member_count: number;
      type: string;
    };
    [key: string]: unknown;
  };
}

// ============ BULK PLATFORM CONFIG ============

export interface PlatformBulkConfigEntry {
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface PlatformBulkConfig {
  [platformName: string]: PlatformBulkConfigEntry;
}

// ============ BUFFER ============

export interface BufferConnectPayload {
  api_key: string;
  token_expires_at?: string;
}

export interface BufferAccountStatus {
  id: number;
  connected: boolean;
  connection_status: string;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BufferProfile {
  id?: string;
  service?: string;
  service_username?: string;
  formatted_username?: string;
  avatar?: string;
  default?: boolean;
  schedules?: unknown[];
}

export interface BufferTestPayload {
  api_key?: string;
}

export interface BufferConnectResponse {
  success: boolean;
  account: BufferAccountStatus;
}

export type BufferStatusResponse = BufferAccountStatus | {
  connected: false;
  connection_status: 'disconnected';
};

export interface BufferProfilesResponse {
  profiles: BufferProfile[];
}

export interface BufferTestResponse {
  success: boolean;
  message: string;
  user?: Record<string, unknown>;
}

export interface BufferDisconnectResponse {
  success: boolean;
  connected: boolean;
  connection_status: string;
  deleted_accounts: number;
}

// ============ TELEGRAM ============

export type TelegramChannelStatus = "connected" | "pending_verification" | "disabled";

export interface TelegramChannel {
  id: number;
  name: string;
  channel_username: string;
  channel_chat_id: string;
  bot_token?: string; // write-only, never present in responses
  bot_username: string;
  enabled: boolean;
  is_verified: boolean;
  default_hashtags: string;
  parse_mode: string;
  subscriber_count: number;
  status: TelegramChannelStatus;
  created_at: string;
  updated_at: string;
}

export interface TelegramTestPayload {
  bot_token: string;
  channel_chat_id?: string;
  channel_username?: string;
}

export interface TelegramTestResult {
  success: boolean;
  error?: string;
  bot_info?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  };
  chat_info?: {
    id: number;
    title: string;
    username: string;
    type: string;
    member_count?: number;
  };
  message?: string;
}

export interface TelegramVerifyResponse {
  success: boolean;
  message?: string;
  error?: string;
  channel_info?: {
    id: number;
    title: string;
    username: string;
    type: string;
    member_count?: number;
  };
}

export interface TelegramTestPostResponse {
  success: boolean;
  message?: string;
  message_id?: string;
  error?: string;
}

export interface TelegramSyncInfoResponse {
  success: boolean;
  channel_info?: {
    id: number;
    title: string;
    username: string;
    type: string;
    member_count?: number;
  };
  error?: string;
}

// ============ POSTS ============

export type PostJobStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "permanent_fail"
  | "skipped"
  | string;

export interface PostJob {
  id: number;
  news: number;
  news_title: string;
  platform: number;
  platform_name: string;
  telegram_channel: number | null;
  channel_name: string | null;
  status: PostJobStatus;
  posted_at: string | null;
  response: Record<string, unknown> | null;
  message_id: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  last_error: string | null;
  time_ago: string;
  created_at: string;
  updated_at: string;
}

export interface PostJobCreatePayload {
  news_id: number;
  platform_id: number;
  telegram_channel_id?: number;
}

export interface PostJobCreateResponse {
  message: string;
  job_id: number;
}

export interface PostJobRetryResponse {
  message: string;
  job_id: number;
}

export interface PostLog {
  id: number;
  job: number;
  job_id: number;
  action: string;
  status: string;
  message: string;
  created_at: string;
}

// ============ STATS ============

export interface PlatformBreakdown {
  total: number;
  success: number;
  failed: number;
  pending: number;
  success_rate: number;
}

export interface DashboardStats {
  total_news: number;
  news_today: number;
  total_posts: number;
  posts_today: number;
  pending_posts: number;
  failed_posts: number;
  success_rate: number;
  last_run: string | null;
  next_run: string | null;
  platforms: Record<string, PlatformBreakdown>;
  categories: Record<string, number>;
}

export interface PlatformStats {
  platform: string;
  total_posts: number;
  success_posts: number;
  failed_posts: number;
  pending: number;
  success_rate: number;
  last_post: string | null;
}

// ============ SETTINGS ============

export interface SystemSettings {
  posting_interval: number;
  max_posts_per_run: number;
  auto_post_enabled: boolean;
  default_hashtags: string;
  post_template: string;
}

export interface SystemSettingsUpdatePayload {
  posting_interval?: number;
  max_posts_per_run?: number;
  auto_post_enabled?: boolean;
  default_hashtags?: string;
  post_template?: string;
}

// ============ AUTH ============

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LogoutResponse {
  message: string;
}

// ============ API RESPONSE HELPERS ============

export interface ApiError {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

