/* The built card files (`pnpm build:mcp-app`): the HTML /mcp hands to hosts
   and the hashed scripts and styles /mcp-app/* serves to their iframes. */

const files = import.meta.glob<string>("./__generated__/*", {
  query: "?raw",
  import: "default",
  eager: true,
})

const file = (name: string) => files[`./__generated__/${name}`]

const NOT_BUILT = `<!doctype html><p style="font:14px system-ui;padding:16px">The dotUI card isn't built. Run <code>pnpm build:mcp-app</code> in www.</p>`

/** The card's HTML, its relative script and style URLs made absolute: a
 *  host iframe has no base URL of ours. */
export function cardHtml(name: string, origin: string): string {
  const html = file(`${name}.html`)
  if (!html) return NOT_BUILT
  return html.replaceAll(/(src|href)="\.\//g, `$1="${origin}/mcp-app/`)
}

const TYPES: Record<string, string> = {
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
}

/** `GET /mcp-app/<file>`: hashed, so cached forever. Any origin may load
 *  it — hosts serve cards from their own sandbox domains. In dev, the
 *  vite.config.ts middleware serves these instead: Vite claims script and
 *  style requests before the app sees them. */
export function serveCardFile(name: string): Response {
  const extension = name.split(".").pop() ?? ""
  const type = Object.hasOwn(TYPES, extension) ? TYPES[extension] : undefined
  const body = type && file(name)
  if (!body) return new Response("Not found", { status: 404 })
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
