import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Reservation, User } from "../lib/types.ts";
import GoogleSignIn from "./GoogleSignIn.tsx";

export default function ReservationsManager(
  { googleClientId }: { googleClientId: string },
) {
  const user = useSignal<User | null | undefined>(undefined);
  const reservations = useSignal<Reservation[]>([]);
  const error = useSignal("");

  async function load() {
    const me = await fetch("/api/auth/me").catch(() => null);
    if (!me?.ok) {
      user.value = null;
      reservations.value = [];
      return;
    }
    user.value = await me.json() as User;
    const response = await fetch("/api/reservations").catch(() => null);
    if (!response?.ok) {
      error.value = "Reservations could not be loaded.";
      return;
    }
    reservations.value = await response.json() as Reservation[];
  }

  useEffect(() => void load(), []);

  async function cancel(id: string) {
    if (!globalThis.confirm("Cancel this reservation?")) return;
    const response = await fetch(
      `/api/reservations/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ).catch(() => null);
    if (!response?.ok) {
      error.value = "The reservation could not be cancelled.";
      return;
    }
    reservations.value = reservations.value.filter((item) => item.id !== id);
  }

  if (user.value === undefined) return <p>Loading reservations…</p>;
  if (user.value === null) {
    return (
      <>
        <p>Sign in with Google to see your reservations.</p>
        <GoogleSignIn clientId={googleClientId} onSuccess={() => void load()} />
      </>
    );
  }
  return (
    <>
      {error.value && <p class="error">{error}</p>}
      {reservations.value.length === 0
        ? <p>You do not have any reservations yet.</p>
        : (
          <ul class="reservation-list">
            {reservations.value.map((reservation) => (
              <li key={reservation.id}>
                <div>
                  <strong>{reservation.reservation_date}</strong>
                  <span>
                    {reservation.start_time.slice(0, 5)} ·{" "}
                    {reservation.guest_count}{" "}
                    guest{reservation.guest_count === 1 ? "" : "s"}
                  </span>
                </div>
                <button type="button" onClick={() => cancel(reservation.id)}>
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      <a class="button" href="/">Book another visit</a>
    </>
  );
}
