import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import type { User } from "../lib/types.ts";

const LOAD_RETRY_MS = 50;
const MAX_LOAD_ATTEMPTS = 100;

interface CredentialResponse {
  credential: string;
}

interface GoogleAccounts {
  id: {
    initialize(config: {
      client_id: string;
      callback(response: CredentialResponse): void;
    }): void;
    renderButton(element: HTMLElement, config: Record<string, unknown>): void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

export default function GoogleSignIn({
  clientId,
  onSuccess,
}: {
  clientId: string;
  onSuccess(user: User): void;
}) {
  const button = useRef<HTMLDivElement>(null);
  const error = useSignal("");

  useEffect(() => {
    if (!clientId) {
      error.value = "Google sign-in is not configured.";
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const render = () => {
      if (!globalThis.window.google || !button.current) {
        if (attempts >= MAX_LOAD_ATTEMPTS) {
          error.value =
            "Google sign-in could not be loaded. Please refresh and try again.";
          return;
        }
        attempts += 1;
        timer = setTimeout(render, LOAD_RETRY_MS);
        return;
      }
      globalThis.window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }: CredentialResponse) => {
          error.value = "";
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ credential }),
          }).catch(() => null);
          if (!response?.ok) {
            error.value = "Google sign-in failed. Please try again.";
            return;
          }
          onSuccess(await response.json() as User);
        },
      });
      button.current.replaceChildren();
      globalThis.window.google.accounts.id.renderButton(button.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
      });
    };
    render();
    return () => timer !== undefined && clearTimeout(timer);
  }, [clientId]);

  return (
    <div id="sign-in" class="sign-in">
      <div ref={button} />
      {error.value && <p class="error">{error}</p>}
    </div>
  );
}
