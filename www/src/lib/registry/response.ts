/* Responses for the `/r/*` routes. Only successes are cached; errors carry
   `{ error, message }`, the body shape shadcn's registry fetcher parses. */

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

export const notFound = (message: string) =>
  registryError(404, "Not found", message)

/** Thrown errors become a logged, uncached 500. */
export async function guard(
  respond: () => Promise<Response>,
): Promise<Response> {
  try {
    return await respond()
  } catch (error) {
    console.error(error)
    return registryError(
      500,
      "Internal error",
      "The registry failed to build this item. Try again.",
    )
  }
}
