import type { Handlers, PageProps } from "$fresh/server.ts";
import ReservationsManager from "../../islands/ReservationsManager.tsx";

interface Data {
  googleClientId: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({
      googleClientId: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
    });
  },
};

export default function Reservations({ data }: PageProps<Data>) {
  return (
    <section class="card narrow">
      <p class="eyebrow">Your visits</p>
      <h1>My reservations</h1>
      <ReservationsManager googleClientId={data.googleClientId} />
    </section>
  );
}
