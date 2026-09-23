/**
 * GET /r/init[?preset=<id>@<rev>&d=…&code=…]
 *
 * Returns the `registry:base` item that `npx shadcn init <this-url>` consumes.
 * The preset's canonical, rev-pinned query bakes into the consumer's
 * `components.json` so `shadcn add @dotui/<name>` requests hit the matching
 * /r/$name endpoint with the same preset attached.
 */

import { createFileRoute } from "@tanstack/react-router"

import { resolveRequestPreset } from "@/lib/registry-preset"
import {
  invalidPreset,
  registryHandler,
  registryJson,
} from "@/lib/registry-response"
import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { emitInitItem } from "@/publisher/emit-theme"

export const Route = createFileRoute("/r/init")({
  server: {
    handlers: {
      GET: registryHandler(async ({ request }) => {
        const url = new URL(request.url)
        const resolved = await resolveRequestPreset(url.searchParams)
        if (!resolved.ok) return invalidPreset(resolved.reason)

        return registryJson(
          emitInitItem({
            baseRegistryCss,
            preset: resolved.preset,
            query: resolved.query,
            registryRoot: `${url.protocol}//${url.host}`,
          }),
        )
      }),
    },
  },
})
