import { Handlers, PageProps } from "$fresh/server.ts";
import ReservationForm from "../islands/ReservationForm.tsx";
import { api } from "../lib/api.ts";
import type { Tea } from "../lib/types.ts";

interface Data {
  teas: Tea[];
  googleClientId: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const teas = await api.teas().catch(() => []);
    return ctx.render({
      teas,
      googleClientId: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <section class="hero">
        <p class="eyebrow">Reservations now open</p>
        <h1>Meet your new favorite reading companion.</h1>
        <p>Reserve a calm hour with our adoptable cats. Herbal tea is on us.</p>
      </section>
      <section class="card booking">
        <h2>Book a Cat Cafe visit</h2>
        <ReservationForm
          teas={data.teas}
          googleClientId={data.googleClientId}
        />
      </section>
    </>
  );
}
