import type { Handlers } from "$fresh/server.ts";
import { proxyBackend } from "../../../lib/backend_proxy.ts";

export const handler: Handlers = {
  POST: (req) => proxyBackend(req, "/api/v1/auth/google"),
};
