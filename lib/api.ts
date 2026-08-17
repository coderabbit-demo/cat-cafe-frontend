import type { Tea } from "./types.ts";

const baseUrl = Deno.env.get("CAT_CAFE_API_URL") ?? "http://localhost:8444";
const serviceToken = Deno.env.get("CAT_CAFE_API_TOKEN") ??
  "development-service-token";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`Cat Cafe API returned ${response.status}`);
  return await response.json() as T;
}

export const api = {
  teas: () => request<Tea[]>("/api/v1/teas"),
  register: (email: string) =>
    request<{ id: string; email: string }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  linkSlack: (
    input: { email: string; slack_user_id: string; slack_team_id: string },
  ) =>
    request<{ linked: boolean }>("/api/v1/integrations/slack/users", {
      method: "POST",
      headers: { authorization: `Bearer ${serviceToken}` },
      body: JSON.stringify(input),
    }),
};
