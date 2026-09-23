/* Responses for the `/r/*` routes. Only successes are cached; errors carry
   `{ error, message }`, the body shape shadcn's registry fetcher parses. */

import type { PresetFailure } from "./registry-preset"

const CACHED = "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"

export function registryJson(body: unknown): Response {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": CACHED,
    },
  })
}

export function registryError(
  status: number,
  error: string,
  message: string,
): Response {
  return Response.json(
    { error, message },
    { status, headers: { "Cache-Control": "no-store" } },
  )
}

export const notFound = (name: string) =>
  registryError(404, "Not found", `No registry item named "${name}".`)

const PRESET_ERRORS: Record<PresetFailure, [number, string]> = {
  corrupt: [
    400,
    "The ?preset= value is not a preset code; it may have been cut off. Copy the command from dotui.org/studio again.",
  ],
  invalid: [
    422,
    "The ?preset= value decodes, but not to a dotUI design system. Copy the command from dotui.org/studio again.",
  ],
  "newer-version": [
    422,
    "The ?preset= value comes from a newer version of dotUI than this registry serves.",
  ],
}

export function invalidPreset(reason: PresetFailure): Response {
  const [status, message] = PRESET_ERRORS[reason]
  return registryError(status, "Invalid preset", message)
}

interface RegistryRequest<Params> {
  request: Request
  params: Params
}

/** Thrown errors become an uncached 500 instead of the server's default. */
export function registryHandler<Params extends object = object>(
  handler: (context: RegistryRequest<Params>) => Response | Promise<Response>,
): (context: RegistryRequest<Params>) => Promise<Response> {
  return async (context) => {
    try {
      return await handler(context)
    } catch (error) {
      console.error(error)
      return registryError(
        500,
        "Internal error",
        "The registry failed to build this item. Try again.",
      )
    }
  }
}
