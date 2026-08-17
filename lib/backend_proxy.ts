const backendUrl = Deno.env.get("CAT_CAFE_API_URL") ?? "http://localhost:8444";

export async function proxyBackend(
  req: Request,
  path: string,
): Promise<Response> {
  const method = req.method.toUpperCase();
  const origin = req.headers.get("origin");
  if (
    !["GET", "HEAD"].includes(method) && origin &&
    origin !== new URL(req.url).origin
  ) {
    return new Response("Cross-origin request rejected", { status: 403 });
  }

  const headers = new Headers();
  for (const name of ["content-type", "cookie"]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  const upstream = await fetch(`${backendUrl}${path}`, {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method)
      ? undefined
      : await req.arrayBuffer(),
    redirect: "manual",
  });
  const responseHeaders = new Headers();
  for (const name of ["content-type", "location", "set-cookie"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
