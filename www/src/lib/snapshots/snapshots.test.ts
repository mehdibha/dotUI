import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"

import { getPreset } from "@/modules/presets"
import { DEFAULT_STATE } from "@/modules/studio/axes"

import { createSnapshot, MAX_BODY_BYTES, readSnapshot } from "./handlers"
import { canonicalJson, parseSnapshot, snapshotId } from "./snapshot"
import type { SnapshotContent } from "./snapshot"
import { fileStore, memoryStore } from "./store"
import type { SnapshotStore } from "./store"

const post = (store: SnapshotStore, body: unknown) =>
  createSnapshot(
    new Request("http://test/api/snapshots", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    store,
  )

const valid = { name: "Acme", base: "origin", state: { radiusPx: 4 } }

async function publish(store: SnapshotStore, body: unknown = valid) {
  const response = await post(store, body)
  expect(response.status).toBe(200)
  return ((await response.json()) as { id: string }).id
}

describe("snapshot id", () => {
  const content: SnapshotContent = {
    schema: 1,
    name: "Acme",
    base: "origin",
    state: DEFAULT_STATE,
  }

  it("sorts keys at every depth", () => {
    expect(canonicalJson({ b: [{ d: 1, c: 2 }], a: null })).toBe(
      '{"a":null,"b":[{"c":2,"d":1}]}',
    )
  })

  it("is 10 base62 chars, independent of key order", async () => {
    const id = await snapshotId(content)
    expect(id).toMatch(/^[0-9A-Za-z]{10}$/)
    const reversed = Object.fromEntries(
      Object.entries(DEFAULT_STATE).reverse(),
    ) as typeof DEFAULT_STATE
    expect(
      await snapshotId({
        state: reversed,
        base: "origin",
        name: "Acme",
        schema: 1,
      }),
    ).toBe(id)
  })

  it("changes with the name, base or any axis", async () => {
    const id = await snapshotId(content)
    expect(await snapshotId({ ...content, name: "Acme 2" })).not.toBe(id)
    expect(await snapshotId({ ...content, base: "linear" })).not.toBe(id)
    expect(
      await snapshotId({
        ...content,
        state: { ...DEFAULT_STATE, radiusPx: DEFAULT_STATE.radiusPx + 1 },
      }),
    ).not.toBe(id)
  })

  it("ignores the creation time", async () => {
    const store = memoryStore()
    vi.spyOn(Date, "now").mockReturnValueOnce(1).mockReturnValueOnce(2)
    expect(await publish(store)).toBe(await publish(store))
    vi.restoreAllMocks()
  })
})

describe("POST /api/snapshots", () => {
  it("stores the validated state, defaults filled in and name trimmed", async () => {
    const store = memoryStore()
    const id = await publish(store, { ...valid, name: "  Acme  " })
    const stored = parseSnapshot(JSON.parse((await store.get(id))!))
    if (!stored.ok) throw new Error("expected a valid snapshot")
    expect(stored.value).toMatchObject({
      schema: 1,
      name: "Acme",
      base: "origin",
      state: { ...DEFAULT_STATE, radiusPx: 4 },
    })
    expect(
      await publish(store, {
        ...valid,
        state: { ...DEFAULT_STATE, radiusPx: 4 },
      }),
    ).toBe(id)
  })

  it("never overwrites an existing id", async () => {
    const store = memoryStore()
    const now = vi.spyOn(Date, "now").mockReturnValue(1)
    const id = await publish(store)
    now.mockReturnValue(2)
    expect(await publish(store)).toBe(id)
    expect(JSON.parse((await store.get(id))!).createdAt).toBe(1)
    vi.restoreAllMocks()
  })

  it("rejects bodies over 16 KB", async () => {
    const store = memoryStore()
    const padded = { ...valid, name: "x".repeat(MAX_BODY_BYTES) }
    expect((await post(store, padded)).status).toBe(413)
    // A lying content-length does not get past the streamed count.
    const response = await createSnapshot(
      new Request("http://test/api/snapshots", {
        method: "POST",
        headers: { "content-length": "10" },
        body: JSON.stringify(padded),
      }),
      store,
    )
    expect(response.status).toBe(413)
    expect(response.headers.get("cache-control")).toBe("no-store")
  })

  it.each([
    ["not JSON", "{", []],
    ["not an object", [valid], [""]],
    ["missing fields", { name: "Acme" }, ["base", "state"]],
    ["unknown fields", { ...valid, id: "abc" }, ["id"]],
    ["an empty name", { ...valid, name: "   " }, ["name"]],
    ["a long name", { ...valid, name: "x".repeat(65) }, ["name"]],
    ["a non-string name", { ...valid, name: 1 }, ["name"]],
    ["an unknown base", { ...valid, base: "nope" }, ["base"]],
    ["a prototype base", { ...valid, base: "__proto__" }, ["base"]],
    ["a non-object state", { ...valid, state: "x" }, ["state"]],
    [
      "hostile state",
      {
        ...valid,
        state: {
          cursorControls: "pointer; background: red",
          radiusPx: -1000,
          brand: "zzz",
          nope: 1,
        },
      },
      ["state.brand", "state.cursorControls", "state.nope", "state.radiusPx"],
    ],
  ])("400s on %s", async (_, body, keys) => {
    const store = memoryStore()
    const response = await post(store, body)
    expect(response.status).toBe(400)
    expect(response.headers.get("cache-control")).toBe("no-store")
    const { issues = [] } = (await response.json()) as {
      issues?: { key: string }[]
    }
    expect(issues.map(({ key }) => key).sort()).toEqual(keys)
  })

  it("bounds the echoed issues", async () => {
    const state: Record<string, number> = { ["x".repeat(5_000)]: 1 }
    for (let i = 0; i < 300; i++) state[`k${i}`] = 1
    const response = await post(memoryStore(), { ...valid, state })
    const body = (await response.json()) as {
      issues: { key: string }[]
      omitted: number
    }
    expect(body.issues).toHaveLength(20)
    expect(body.issues[0]!.key).toBe(`state.${"x".repeat(58)}…`)
    expect(body.omitted).toBe(281)
  })

  it("500s, uncached, when the store throws", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const store: SnapshotStore = {
      put: () => Promise.reject(new Error("down")),
      get: () => Promise.resolve(null),
    }
    const response = await post(store, valid)
    expect(response.status).toBe(500)
    expect(response.headers.get("cache-control")).toBe("no-store")
    expect(error).toHaveBeenCalled()
    vi.restoreAllMocks()
  })
})

describe("GET /api/snapshots/$id", () => {
  it("returns the snapshot, cached forever", async () => {
    const store = memoryStore()
    const id = await publish(store)
    const response = await readSnapshot(id, store)
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    )
    expect(await response.json()).toMatchObject({
      schema: 1,
      name: "Acme",
      base: "origin",
      state: { ...DEFAULT_STATE, radiusPx: 4 },
      createdAt: expect.any(Number),
    })
  })

  it.each(["short", "abcdefghijk", "abc/../def", "abcdefghi-", ""])(
    "400s on id %j",
    async (id) => {
      const response = await readSnapshot(id, memoryStore())
      expect(response.status).toBe(400)
      expect(response.headers.get("cache-control")).toBe("no-store")
    },
  )

  it("404s, uncached, on a missing id", async () => {
    const response = await readSnapshot("0123456789", memoryStore())
    expect(response.status).toBe(404)
    expect(response.headers.get("cache-control")).toBe("no-store")
    expect(await response.json()).toEqual({ error: "Snapshot not found" })
  })

  it.each([
    ["not JSON", "{"],
    [
      "an invalid state",
      JSON.stringify({
        schema: 1,
        name: "A",
        base: "origin",
        state: { radiusPx: -1 },
        createdAt: 1,
      }),
    ],
    [
      "an unknown schema",
      JSON.stringify({
        schema: 2,
        name: "A",
        base: "origin",
        state: {},
        createdAt: 1,
      }),
    ],
  ])("500s when the stored data is %s", async (_, json) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const store = memoryStore()
    await store.put("0123456789", json)
    const response = await readSnapshot("0123456789", store)
    expect(response.status).toBe(500)
    expect(response.headers.get("cache-control")).toBe("no-store")
    expect(error).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it("keeps serving a snapshot whose base preset is gone", async () => {
    expect(getPreset("retired")).toBeUndefined()
    const store = memoryStore()
    await store.put(
      "0123456789",
      JSON.stringify({
        schema: 1,
        name: "A",
        base: "retired",
        state: {},
        createdAt: 1,
      }),
    )
    expect((await readSnapshot("0123456789", store)).status).toBe(200)
  })
})

describe("file store", () => {
  let dir: string | undefined
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
  })

  it("writes once and reads back", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "dotui-snapshots-"))
    const store = fileStore(path.join(dir, "nested"))
    expect(await store.get("0123456789")).toBeNull()
    await store.put("0123456789", "first")
    await store.put("0123456789", "second")
    expect(await store.get("0123456789")).toBe("first")
    expect(await readdir(path.join(dir, "nested"))).toEqual(["0123456789.json"])
  })
})
