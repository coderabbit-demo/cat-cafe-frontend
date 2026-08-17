export const SESSION_CHANGED_EVENT = "cat-cafe:session-changed";

export function publishSessionChanged() {
  globalThis.window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}
