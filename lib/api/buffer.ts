import { api } from "@/lib/axios";
import type {
  BufferConnectPayload,
  BufferConnectResponse,
  BufferStatusResponse,
  BufferProfilesResponse,
  BufferTestPayload,
  BufferTestResponse,
  BufferDisconnectResponse,
} from "@/lib/types";

export const bufferApi = {
  connect: (data: BufferConnectPayload) =>
    api.post<BufferConnectResponse>("/buffer/connect/", data).then((r) => r.data),

  status: () =>
    api.get<BufferStatusResponse>("/buffer/status/").then((r) => r.data),

  profiles: () =>
    api.get<BufferProfilesResponse>("/buffer/profiles/").then((r) => r.data),

  disconnect: () =>
    api.post<BufferDisconnectResponse>("/buffer/disconnect/").then((r) => r.data),

  test: (data?: BufferTestPayload) =>
    api.post<BufferTestResponse>("/buffer/test/", data ?? {}).then((r) => r.data),
};
