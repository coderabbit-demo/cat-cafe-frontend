import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { User } from "../lib/types.ts";

export default function SessionControls() {
  const user = useSignal<User | null | undefined>(undefined);
  const error = useSignal("");

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      user.value = response.ok ? await response.json() as User : null;
    }).catch(() => user.value = null);
  }, []);

  async function logout() {
    error.value = "";
    const response = await fetch("/api/auth/logout", { method: "POST" })
      .catch(() => null);
    if (!response?.ok) {
      error.value = "Sign out failed. Please try again.";
      return;
    }
    location.href = "/";
  }

  if (user.value === undefined) return null;
  if (user.value === null) return <a href="/#sign-in">Sign in</a>;
  return (
    <span class="auth-controls">
      <span>{user.value.email}</span>
      <button type="button" class="link-button" onClick={logout}>
        Sign out
      </button>
      {error.value && <span class="error" role="alert">{error}</span>}
    </span>
  );
}
