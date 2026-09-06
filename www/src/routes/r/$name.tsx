/**
 * GET /r/$name[?preset=…]
 *
 * Returns the resolved shadcn registry item for one dotui component. The
 * preset query param drives:
 *   - density selection (folded into class lists)
 *   - per-component enum-merge choices
 *   - scalar param values (rewritten inline into Tailwind suffixes)
 *   - enum-with-files choices (e.g. loader.style = "ring" → ship base.ring.tsx)
 *
 * `name` must match a generated publishable, or a `font-*` item name (see
 * publisher/emit-font). Missing names return 404.
 */

import { createFileRoute } from "@tanstack/react-router"

import { resolveRequestPreset } from "@/lib/registry-preset"
import { emitFontItem } from "@/publisher/emit-font"
import { publishItem } from "@/publisher/serve"

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control":
    "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
}

export const Route = createFileRoute("/r/$name")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const name = params.name

        // `font-*` names are `registry:font` items the init item depends on;
        // preset-independent, no publishable behind them.
        if (name.startsWith("font-")) {
          const fontItem = emitFontItem(name)
          if (!fontItem) {
            return Response.json({ error: "Not found" }, { status: 404 })
          }
          return new Response(JSON.stringify(fontItem, null, 2), {
            headers: JSON_HEADERS,
          })
        }

        const url = new URL(request.url)
        const encodedPreset = url.searchParams.get("preset") ?? undefined
        const item = await publishItem({
          name,
          preset: await resolveRequestPreset(encodedPreset),
          origin: `${url.protocol}//${url.host}`,
          encodedPreset,
        })
        if (!item) {
          return Response.json({ error: "Not found" }, { status: 404 })
        }
        return new Response(JSON.stringify(item, null, 2), {
          headers: JSON_HEADERS,
        })
      },
    },
  },
})
