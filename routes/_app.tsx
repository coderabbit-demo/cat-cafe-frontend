import type { AppProps } from "$fresh/server.ts";
import { Layout } from "../components/Layout.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cat Cafe</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body>
        <Layout>
          <Component />
        </Layout>
      </body>
    </html>
  );
}
