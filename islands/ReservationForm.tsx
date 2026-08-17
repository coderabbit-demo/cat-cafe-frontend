import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Tea, User } from "../lib/types.ts";
import GoogleSignIn from "./GoogleSignIn.tsx";

export default function ReservationForm({
  teas,
  googleClientId,
}: {
  teas: Tea[];
  googleClientId: string;
}) {
  const date = useSignal("");
  const slots = useSignal<string[]>([]);
  const message = useSignal("");
  const user = useSignal<User | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      user.value = response.ok ? await response.json() as User : null;
    }).catch(() => user.value = null);
  }, []);

  async function loadSlots(nextDate: string) {
    date.value = nextDate;
    slots.value = nextDate
      ? await fetch(`/api/availability?date=${nextDate}`).then((r) => r.json())
        .then((x) => x.slots)
      : [];
  }

  async function submit(event: Event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        reservation_date: form.get("date"),
        start_time: form.get("start_time"),
        guest_count: Number(form.get("guest_count")),
        tea_id: form.get("tea_id") || null,
        notes: form.get("notes") || null,
      }),
    }).catch(() => null);
    if (response?.status === 401) {
      user.value = null;
      message.value = "Please sign in before booking.";
    } else if (response?.status === 409) {
      message.value =
        "That time is no longer available. Please choose another.";
    } else if (!response?.ok) {
      message.value = "Booking failed. Please check the form and try again.";
    } else {
      message.value = "Your visit is booked. See it under My reservations.";
      (event.currentTarget as HTMLFormElement).reset();
      date.value = "";
      slots.value = [];
    }
  }

  if (user.value === undefined) return <p>Checking sign-in…</p>;
  if (user.value === null) {
    return (
      <div>
        <p>Sign in with Google to reserve your visit.</p>
        <GoogleSignIn
          clientId={googleClientId}
          onSuccess={(value) => user.value = value}
        />
        {message.value && <p class="notice">{message}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label>
        Date<input
          type="date"
          name="date"
          required
          value={date}
          onInput={(e) => loadSlots(e.currentTarget.value)}
        />
      </label>
      <label>
        Time<select name="start_time" required>
          <option value="">Choose a time</option>
          {slots.value.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </label>
      <label>
        Guests<select name="guest_count">
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}
          </option>)}
        </select>
      </label>
      <label>
        Complimentary herbal tea<select name="tea_id">
          <option value="">No tea</option>
          {teas.map((tea) => (
            <option key={tea.id} value={tea.id}>{tea.name}</option>
          ))}
        </select>
      </label>
      <label>
        Notes<textarea
          name="notes"
          maxLength={500}
          placeholder="Window seat if possible."
        />
      </label>
      <button type="submit">Book visit</button>
      {message.value && <p class="notice">{message}</p>}
    </form>
  );
}
