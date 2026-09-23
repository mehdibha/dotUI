import { deflateRaw } from "pako"
import { describe, expect, it, vi } from "vitest"

import { publishItem } from "@/publisher/serve"
import fixtures from "@/modules/studio/preset/historical-presets.json"

import { Route as ItemRoute } from "./$name"
import { Route as InitRoute } from "./init"
import { Route as IndexRoute } from "./registry[.]json"
import { Route as V0Route } from "./v0"

vi.mock("@/publisher/serve", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/publisher/serve")>()
  return { ...actual, publishItem: vi.fn(actual.publishItem) }
})

const CACHED = "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"

const fixture = (id: string) => {
  const found = fixtures.find((f) => f.id === id)
  if (!found) throw new Error(`no fixture ${id}`)
  return found.encoded
}

const encodeRaw = (payload: unknown) =>
  btoa(String.fromCharCode(...deflateRaw(JSON.stringify(payload))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

const PRESETS = {
  corrupt: fixture("crafted-truncated"),
  invalid: encodeRaw({ v: 4, s: "not-a-diff" }),
  "newer-version": fixture("crafted-newer-version"),
}

type Handler = (context: {
  request: Request
  params: Record<string, string>
}) => Promise<Response>

function get(route: { options: unknown }, path: string, name = "") {
  const { GET } = (route.options as { server: { handlers: { GET: Handler } } })
    .server.handlers
  return GET({
    request: new Request(`https://dotui.org${path}`),
    params: { name },
  })
}

async function expectCached(response: Response) {
  expect(response.status).toBe(200)
  expect(response.headers.get("Cache-Control")).toBe(CACHED)
  return response.json()
}

async function expectError(response: Response, status: number) {
  expect(response.status).toBe(status)
  expect(response.headers.get("Cache-Control")).toBe("no-store")
  expect(response.headers.get("Content-Type")).toContain("application/json")
  const body = await response.json()
  expect(body).toEqual({
    error: expect.any(String),
    message: expect.any(String),
  })
  return body
}

describe("/r/init", () => {
  it("serves the default preset without a param", async () => {
    const item = await expectCached(await get(InitRoute, "/r/init"))
    expect(item.config.registries["@dotui"]).toBe(
      "https://dotui.org/r/{name}?preset=",
    )
  })

  it("serves Origin without a param", async () => {
    const bare = await expectCached(await get(InitRoute, "/r/init"))
    const origin = await expectCached(
      await get(InitRoute, `/r/init?preset=${fixture("v4-origin")}`),
    )
    expect(bare.cssVars).toEqual(origin.cssVars)
    expect(bare.css).toEqual(origin.css)
  })

  it("treats an empty param as absent", async () => {
    await expectCached(await get(InitRoute, "/r/init?preset="))
  })

  it("carries a valid preset into components.json", async () => {
    const preset = fixture("v4-github")
    const item = await expectCached(
      await get(InitRoute, `/r/init?preset=${preset}`),
    )
    expect(item.config.registries["@dotui"]).toBe(
      `https://dotui.org/r/{name}?preset=${preset}`,
    )
  })

  it.each([
    ["corrupt", 400],
    ["invalid", 422],
    ["newer-version", 422],
  ] as const)("rejects a %s preset with %i", async (reason, status) => {
    const body = await expectError(
      await get(InitRoute, `/r/init?preset=${PRESETS[reason]}`),
      status,
    )
    expect(body.error).toBe("Invalid preset")
  })

  it("serves a preset whose invalid values were dropped", async () => {
    await expectCached(
      await get(InitRoute, `/r/init?preset=${fixture("crafted-bad-seed")}`),
    )
  })

  it("keeps raw CSS out of the exported theme", async () => {
    const response = await get(
      InitRoute,
      `/r/init?preset=${fixture("crafted-css-injection")}`,
    )
    const item = JSON.stringify(await expectCached(response))
    expect(item).not.toContain("display")
    expect(item).not.toContain("pointer;")
  })
})

describe("/r/$name", () => {
  it("serves a component without a preset", async () => {
    const item = await expectCached(await get(ItemRoute, "/r/button", "button"))
    expect(item.registryDependencies).toEqual(["https://dotui.org/r/loader"])
  })

  it("carries a valid preset onto dependency URLs", async () => {
    const preset = fixture("v4-github")
    const item = await expectCached(
      await get(ItemRoute, `/r/button?preset=${preset}`, "button"),
    )
    expect(item.registryDependencies).toEqual([
      `https://dotui.org/r/loader?preset=${preset}`,
    ])
  })

  it.each([
    ["corrupt", 400],
    ["invalid", 422],
    ["newer-version", 422],
  ] as const)("rejects a %s preset with %i", async (reason, status) => {
    await expectError(
      await get(ItemRoute, `/r/button?preset=${PRESETS[reason]}`, "button"),
      status,
    )
  })

  it("404s an unknown item without caching", async () => {
    await expectError(await get(ItemRoute, "/r/nope", "nope"), 404)
  })

  it("serves font items regardless of the preset", async () => {
    const item = await expectCached(
      await get(
        ItemRoute,
        `/r/font-inter?preset=${PRESETS.corrupt}`,
        "font-inter",
      ),
    )
    expect(item.type).toBe("registry:font")
    await expectError(await get(ItemRoute, "/r/font-nope", "font-nope"), 404)
  })

  it("answers a failure with an uncached 500", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.mocked(publishItem).mockRejectedValueOnce(new Error("chunk failed"))
    await expectError(await get(ItemRoute, "/r/button", "button"), 500)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})

describe("/r/v0", () => {
  it("serves the project without a preset", async () => {
    const item = await expectCached(await get(V0Route, "/r/v0"))
    expect(item.files.length).toBeGreaterThan(0)
  })

  it.each([
    ["corrupt", 400],
    ["invalid", 422],
    ["newer-version", 422],
  ] as const)("rejects a %s preset with %i", async (reason, status) => {
    await expectError(
      await get(V0Route, `/r/v0?preset=${PRESETS[reason]}`),
      status,
    )
  })
})

describe("/r/registry.json", () => {
  it("serves the cached index", async () => {
    const index = await expectCached(await get(IndexRoute, "/r/registry.json"))
    expect(index.items.length).toBeGreaterThan(0)
  })
})
