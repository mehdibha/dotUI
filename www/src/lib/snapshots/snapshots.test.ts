import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"
import main from "@/modules/studio/axes/__fixtures__/main-states.json"
import { STATE_VERSION, stamp } from "@/modules/studio/axes/version"

import {
  createSnapshot,
  loadSnapshot,
  MAX_BODY_BYTES,
  readSnapshot,
} from "./handlers"
import { parseSnapshot } from "./parse"
import { canonicalJson, snapshotId } from "./snapshot"
import type { Snapshot } from "./snapshot"
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

const valid = { name: "Acme", state: { radiusPx: 4 } }

const MAIN_DEFAULTS = Object.fromEntries(
  Object.entries(main.schema).map(([key, { default: value }]) => [key, value]),
)

/** A state as main stored it: every one of main's keys. */
const mainState = (diff: Record<string, unknown>) => ({
  ...MAIN_DEFAULTS,
  ...diff,
})

async function save(store: SnapshotStore, body: unknown = valid) {
  const response = await post(store, body)
  expect(response.status).toBe(200)
  return ((await response.json()) as { id: string }).id
}

describe("snapshot id", () => {
  const content: Snapshot = { schema: 1, name: "Acme", state: DEFAULT_STATE }

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
    expect(await snapshotId({ state: reversed, name: "Acme", schema: 1 })).toBe(
      id,
    )
  })

  it("changes with the name or any axis", async () => {
    const id = await snapshotId(content)
    expect(await snapshotId({ ...content, name: "Acme 2" })).not.toBe(id)
    expect(
      await snapshotId({
        ...content,
        state: { ...DEFAULT_STATE, radiusPx: DEFAULT_STATE.radiusPx + 1 },
      }),
    ).not.toBe(id)
  })
})

describe("POST /api/snapshots", () => {
  it("stores the validated state, defaults filled in and name trimmed", async () => {
    const store = memoryStore()
    const id = await save(store, { ...valid, name: "  Acme  " })
    const stored = parseSnapshot(JSON.parse((await store.get(id))!))
    expect(stored).toEqual({
      schema: 1,
      name: "Acme",
      state: { ...DEFAULT_STATE, radiusPx: 4 },
    })
    expect(
      await save(store, {
        ...valid,
        state: stamp(parseState({ radiusPx: 4 })),
      }),
    ).toBe(id)
  })

  it("stores the state stamped with its version", async () => {
    const store = memoryStore()
    const id = await save(store)
    expect(JSON.parse((await store.get(id))!).state.version).toBe(STATE_VERSION)
  })

  it("migrates an unversioned state from main", async () => {
    const store = memoryStore()
    const id = await save(store, {
      name: "Acme",
      state: mainState({ buttonStyle: "bevel", inputStyle: "line" }),
    })
    expect(parseSnapshot(JSON.parse((await store.get(id))!))?.state).toEqual(
      parseState({
        style: "tactile",
        surfaceEdge: "line",
        menuSelectedRow: "none",
        segmentedSelected: "tone",
        inputStyle: "underline",
        inputHover: "none",
      }),
    )
  })

  it("keeps an unversioned current state as it is", async () => {
    const store = memoryStore()
    for (const state of [
      { surfaceLayers: "tonal" },
      { dialogMotion: "none" },
    ]) {
      const id = await save(store, { name: "Acme", state })
      expect(parseSnapshot(JSON.parse((await store.get(id))!))?.state).toEqual(
        parseState(state),
      )
    }
  })

  it("refuses a bad current state rather than reading it as main's", async () => {
    const store = memoryStore()
    const response = await post(store, {
      name: "Acme",
      state: { style: "tactile", radiusPx: {} },
    })
    expect(response.status).toBe(400)
  })

  it("answers any version without hanging", async () => {
    const store = memoryStore()
    for (const version of [-1e300, 1.5, 1e300]) {
      const id = await save(store, {
        name: "Acme",
        state: { version, radiusPx: 4 },
      })
      expect(parseSnapshot(JSON.parse((await store.get(id))!))?.state).toEqual(
        parseState({ radiusPx: 4 }),
      )
    }
  })

  it("keeps a current state as it is", async () => {
    const store = memoryStore()
    const state = parseState({ style: "soft", surfaceShadow: "flat" })
    const id = await save(store, { name: "Acme", state: stamp(state) })
    expect(parseSnapshot(JSON.parse((await store.get(id))!))?.state).toEqual(
      state,
    )
  })

  it("never overwrites an existing id", async () => {
    const store = memoryStore()
    const id = await save(store)
    await store.put(id, "other")
    expect(await save(store)).toBe(id)
    expect(JSON.parse((await store.get(id))!).name).toBe("Acme")
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
    ["missing fields", { name: "Acme" }, ["state"]],
    ["unknown fields", { ...valid, id: "abc" }, ["id"]],
    ["an empty name", { ...valid, name: "   " }, ["name"]],
    ["a long name", { ...valid, name: "x".repeat(65) }, ["name"]],
    ["a non-string name", { ...valid, name: 1 }, ["name"]],
    ["a retired field", { ...valid, base: "origin" }, ["base"]],
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
    const id = await save(store)
    const response = await readSnapshot(id, store)
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    )
    expect(await response.json()).toEqual({
      schema: 1,
      name: "Acme",
      state: { version: STATE_VERSION, ...DEFAULT_STATE, radiusPx: 4 },
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

  it("serves what was stored, byte for byte, for the reader to parse", async () => {
    const store = memoryStore()
    const json = JSON.stringify({ schema: 1, name: "A", retiredKey: 1 })
    await store.put("0123456789", json)
    const response = await readSnapshot("0123456789", store)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe("application/json")
    expect(await response.text()).toBe(json)
  })
})

describe("loadSnapshot", () => {
  it("reads a stored snapshot leniently", async () => {
    const store = memoryStore()
    await store.put(
      "0123456789",
      JSON.stringify({
        schema: 1,
        name: "A",
        base: "retired",
        state: { radiusPx: 4, brand: "zzz", retiredAxis: 1 },
        createdAt: 1,
      }),
    )
    expect(await loadSnapshot("0123456789", store)).toMatchObject({
      name: "A",
      state: { ...DEFAULT_STATE, radiusPx: 4 },
    })
  })

  it("migrates a snapshot stored by main", async () => {
    const store = memoryStore()
    await store.put(
      "0123456789",
      JSON.stringify({
        schema: 1,
        name: "A",
        state: mainState({ inputStyle: "line", toggleSelected: "fill" }),
      }),
    )
    expect((await loadSnapshot("0123456789", store))?.state).toEqual(
      parseState({ inputStyle: "underline", inputHover: "none" }),
    )
  })

  it.each([
    ["not JSON", "{"],
    ["an unknown schema", JSON.stringify({ schema: 2, name: "A", state: {} })],
  ])("throws when the stored data is %s", async (_, json) => {
    const store = memoryStore()
    await store.put("0123456789", json)
    await expect(loadSnapshot("0123456789", store)).rejects.toThrow(
      "unreadable",
    )
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
