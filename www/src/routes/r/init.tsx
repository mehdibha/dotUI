/**
 * GET /r/init[?preset=…]
 *
 * Returns the `registry:base` item that `npx shadcn init <this-url>` consumes.
 * The preset query param (compressed base64url) bakes into the consumer's
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
        const encodedPreset = url.searchParams.get("preset") ?? undefined
        const resolved = await resolveRequestPreset(encodedPreset)
        if (!resolved.ok) return invalidPreset(resolved.reason)

        return registryJson(
          emitInitItem({
            baseRegistryCss,
            preset: resolved.preset,
            encodedPreset,
            registryRoot: `${url.protocol}//${url.host}`,
          }),
        )
      }),
    },
  },
})
