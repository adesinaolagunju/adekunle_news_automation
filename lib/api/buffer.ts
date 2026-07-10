import { api } from "@/lib/axios";
import type {
  BufferAccountStatus,
  BufferConnectPayload,
  BufferConnectResponse,
  BufferStatusResponse,
  BufferProfilesResponse,
  BufferTestPayload,
  BufferTestResponse,
  BufferDisconnectResponse,
} from "@/lib/types";

export const bufferApi = {
  connect: (data: BufferConnectPayload & { name?: string; api_url: string }) =>
    api.post<BufferConnectResponse>("/buffer/connect/", data).then((r) => r.data),

  status: () =>
    api.get<BufferStatusResponse>("/buffer/status/").then((r) => r.data),

  profiles: () =>
    api.get<BufferProfilesResponse>("/buffer/profiles/").then((r) => r.data),

  disconnect: () =>
    api.post<BufferDisconnectResponse>("/buffer/disconnect/").then((r) => r.data),

  test: (data?: BufferTestPayload) =>
    api.post<BufferTestResponse>("/buffer/test/", data ?? {}).then((r) => r.data),

  listAccounts: () =>
    api.get<BufferAccountStatus[]>("/buffer/accounts/").then((r) => r.data),

  updateAccount: (id: number, data: { name?: string; api_url?: string }) =>
    api.patch<BufferAccountStatus>(`/buffer/accounts/${id}/`, data).then((r) => r.data),
};
