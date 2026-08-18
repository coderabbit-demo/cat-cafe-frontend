import type { ComponentChildren } from "preact";
import SessionControls from "../islands/SessionControls.tsx";

export function Layout({ children }: { children: ComponentChildren }) {
  return (
    <>
      <header class="site-header">
        <a class="brand" href="/">🐈 Cat Cafe</a>
        <nav>
          <a href="/reservations">My reservations</a>
          <SessionControls />
        </nav>
      </header>
      <main>{children}</main>
      <footer>Quiet company, kind cats, and complimentary herbal tea.</footer>
    </>
  );
}
