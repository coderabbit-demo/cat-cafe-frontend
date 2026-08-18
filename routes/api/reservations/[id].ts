import type { Handlers } from "$fresh/server.ts";
import { proxyBackend } from "../../../lib/backend_proxy.ts";

export const handler: Handlers = {
  PATCH: (req, ctx) =>
    proxyBackend(
      req,
      `/api/v1/reservations/${encodeURIComponent(ctx.params.id)}`,
    ),
  DELETE: (req, ctx) =>
    proxyBackend(
      req,
      `/api/v1/reservations/${encodeURIComponent(ctx.params.id)}`,
    ),
};
