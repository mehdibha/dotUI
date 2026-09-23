/**
 * GET /r/$name[?preset=<id>@<rev>&d=…&code=…]
 *
 * Returns the resolved shadcn registry item for one dotui component. The
 * preset drives:
 *   - density selection (folded into class lists)
 *   - per-component enum-merge choices
 *   - scalar param values (rewritten inline into Tailwind suffixes)
 *   - enum-with-files choices (e.g. loader.style = "ring" → ship base.ring.tsx)
 *
 * `name` must match a generated publishable, or a `font-*` item name (see
 * publisher/emit-font). Missing names return 404, an undecodable preset 400/422.
 */

import { createFileRoute } from "@tanstack/react-router"

import { resolveRequestPreset } from "@/lib/registry-preset"
import {
  invalidPreset,
  notFound,
  registryHandler,
  registryJson,
} from "@/lib/registry-response"
import { emitFontItem } from "@/publisher/emit-font"
import { publishItem } from "@/publisher/serve"

export const Route = createFileRoute("/r/$name")({
  server: {
    handlers: {
      GET: registryHandler<{ name: string }>(async ({ request, params }) => {
        const name = params.name

        // `font-*` names are `registry:font` items the init item depends on;
        // preset-independent, no publishable behind them.
        if (name.startsWith("font-")) {
          const fontItem = emitFontItem(name)
          return fontItem ? registryJson(fontItem) : notFound(name)
        }

        const url = new URL(request.url)
        const resolved = await resolveRequestPreset(url.searchParams)
        if (!resolved.ok) return invalidPreset(resolved.reason)
        const item = await publishItem({
          name,
          preset: resolved.preset,
          origin: `${url.protocol}//${url.host}`,
          query: resolved.query,
        })
        return item ? registryJson(item) : notFound(name)
      }),
    },
  },
})
