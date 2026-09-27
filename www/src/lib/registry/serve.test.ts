import { describe, expect, it, vi } from "vitest"

import { createSnapshot } from "@/lib/snapshots/handlers"
import { memoryStore } from "@/lib/snapshots/store"
import type { SnapshotStore } from "@/lib/snapshots/store"
import { publishItem } from "@/publisher/serve"
import { getPreset } from "@/modules/presets"
import { Route } from "@/routes/r/$"

import { serveRegistry } from "./serve"

vi.mock("@/publisher/serve", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/publisher/serve")>()
  return { ...actual, publishItem: vi.fn(actual.publishItem) }
})

const CACHED = "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"

const get = (path: string, store: SnapshotStore = memoryStore()) =>
  serveRegistry(new Request(`https://dotui.org${path}`), store)

async function ok(response: Response) {
  expect(response.status).toBe(200)
  expect(response.headers.get("Cache-Control")).toBe(CACHED)
  return response.json()
}

async function fails(response: Response, status: number) {
  expect(response.status).toBe(status)
  expect(response.headers.get("Cache-Control")).toBe("no-store")
  expect(await response.json()).toEqual({
    error: expect.any(String),
    message: expect.any(String),
  })
}

async function publish(store: SnapshotStore, state: unknown) {
  const response = await createSnapshot(
    new Request("https://dotui.org/api/snapshots", {
      method: "POST",
      body: JSON.stringify({ name: "Acme", base: "linear", state }),
    }),
    store,
  )
  return ((await response.json()) as { id: string }).id
}

const registryUrl = (item: {
  config: { registries: Record<string, string> }
}) => item.config.registries["@dotui"]

describe("/r/<name>.json (Origin)", () => {
  it("serves components with dependencies at the same path", async () => {
    const item = await ok(await get("/r/button.json"))
    expect(item.registryDependencies).toEqual([
      "https://dotui.org/r/loader.json",
    ])
  })

  it("serves init, pointing components.json back at /r", async () => {
    const item = await ok(await get("/r/init.json"))
    expect(registryUrl(item)).toBe("https://dotui.org/r/{name}.json")
  })

  it("serves the index and fonts", async () => {
    const index = await ok(await get("/r/registry.json"))
    expect(index.items.length).toBeGreaterThan(0)
    const font = await ok(await get("/r/font-inter.json"))
    expect(font.type).toBe("registry:font")
  })

  it("serves the v0 project", async () => {
    const item = await ok(await get("/r/v0.json"))
    expect(item.files.length).toBeGreaterThan(0)
  })

  it("ignores the retired ?preset= param", async () => {
    const plain = await ok(await get("/r/init.json"))
    expect(await ok(await get("/r/init.json?preset=abc"))).toEqual(plain)
  })
})

describe("/r/p/<preset>/<name>.json", () => {
  it("serves the built-in, keeping the prefix on every URL", async () => {
    const init = await ok(await get("/r/p/linear/init.json"))
    expect(registryUrl(init)).toBe("https://dotui.org/r/p/linear/{name}.json")
    expect(init.cssVars).not.toEqual(
      (await ok(await get("/r/init.json"))).cssVars,
    )
    const button = await ok(await get("/r/p/linear/button.json"))
    expect(button.registryDependencies).toEqual([
      "https://dotui.org/r/p/linear/loader.json",
    ])
  })

  it.each(["nope", "__proto__", "LINEAR", "linear%2F"])(
    "404s on preset %j",
    async (id) => {
      await fails(await get(`/r/p/${id}/button.json`), 404)
      await fails(await get(`/r/p/${id}/font-inter.json`), 404)
    },
  )
})

describe("/r/s/<id>/<name>.json", () => {
  it("serves a snapshot, keeping the prefix on every URL", async () => {
    const store = memoryStore()
    const id = await publish(store, getPreset("linear")!.state)
    const init = await ok(await get(`/r/s/${id}/init.json`, store))
    expect(registryUrl(init)).toBe(`https://dotui.org/r/s/${id}/{name}.json`)
    expect(init.cssVars).toEqual(
      (await ok(await get("/r/p/linear/init.json"))).cssVars,
    )
    const button = await ok(await get(`/r/s/${id}/button.json`, store))
    expect(button.registryDependencies).toEqual([
      `https://dotui.org/r/s/${id}/loader.json`,
    ])
  })

  it.each(["0123456789", "short", "01234567890", "0123456789/.."])(
    "404s on id %j",
    async (id) => {
      await fails(await get(`/r/s/${id}/button.json`), 404)
    },
  )

  it.each([
    ["not JSON", "{"],
    [
      "an invalid state",
      JSON.stringify({
        schema: 1,
        name: "A",
        base: "origin",
        state: { cursor: "url(x)" },
        createdAt: 1,
      }),
    ],
  ])("answers stored data that is %s with a logged 500", async (_, json) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const store = memoryStore()
    await store.put("0123456789", json)
    await fails(await get("/r/s/0123456789/init.json", store), 500)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})

describe("?code=", () => {
  it("styles the code and rides along on every URL, canonicalized", async () => {
    const plain = await ok(await get("/r/p/linear/button.json"))
    const styled = await ok(
      await get("/r/p/linear/button.json?code=no-sections,arrays"),
    )
    expect(styled.files[0].content).not.toBe(plain.files[0].content)
    expect(styled.registryDependencies).toEqual([
      "https://dotui.org/r/p/linear/loader.json?code=arrays,no-sections",
    ])
    const init = await ok(await get("/r/init.json?code=arrays"))
    expect(registryUrl(init)).toBe(
      "https://dotui.org/r/{name}.json?code=arrays",
    )
  })

  it.each(["tabs", "", "arrays,arrays", "arrays&code=arrays", "arrays;x"])(
    "400s on ?code=%s",
    async (code) => {
      await fails(await get(`/r/button.json?code=${code}`), 400)
    },
  )
})

describe("hostile paths", () => {
  it.each([
    "/r/nope.json",
    "/r/constructor.json",
    "/r/__proto__.json",
    "/r/font-nope.json",
    "/r/button",
    "/r/init",
    "/r/button.json.json",
    "/r/x/linear/button.json",
    "/r/p/linear/x/button.json",
    "/r/p/button.json",
    "/r/%2e%2e/button.json",
    `/r/${"a".repeat(5000)}.json`,
  ])("404s on %s", async (path) => {
    await fails(await get(path), 404)
  })

  it("answers a failure with a logged, uncached 500", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.mocked(publishItem).mockRejectedValueOnce(new Error("chunk failed"))
    await fails(await get("/r/button.json"), 500)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})

it("the /r/$ route delegates to the registry", async () => {
  const { GET } = (
    Route.options as unknown as {
      server: {
        handlers: { GET: (ctx: { request: Request }) => Promise<Response> }
      }
    }
  ).server.handlers
  const index = await ok(
    await GET({ request: new Request("https://dotui.org/r/registry.json") }),
  )
  expect(index.homepage).toBe("https://dotui.org")
})
