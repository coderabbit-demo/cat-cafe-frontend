import type { Handlers } from "$fresh/server.ts";
import { proxyBackend } from "../../../lib/backend_proxy.ts";

export const handler: Handlers = {
  GET: (req) => proxyBackend(req, "/api/v1/auth/me"),
};
