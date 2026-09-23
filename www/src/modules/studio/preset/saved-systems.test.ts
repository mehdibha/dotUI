import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

import { storedDesign } from "../doc"
import HISTORICAL from "./historical-presets.json"
import type { SavedSystem } from "./saved-systems"

const KEY = "dotui:systems"
const LEGACY = "dotui:my-presets"
const NAME_KEY = "dotui:design-system-name"
const ACTIVE_KEY = "dotui:active-saved-preset"

const blob = (id: string) =>
  (HISTORICAL.find((h) => h.id === id) as { encoded: string }).encoded

let win: ReturnType<typeof installFakeWindow>

// Module state is per test: a fresh import stands in for a freshly loaded tab.
async function load() {
  vi.resetModules()
  return import("./saved-systems")
}

function record(id: string, name = id): SavedSystem {
  return { id, name, preset: "origin", updatedAt: 1 }
}

const store = (systems: unknown[]) => JSON.stringify({ v: 1, systems })

function stored(): SavedSystem[] {
  const raw = win.read(KEY)
  if (raw === null) return []
  const parsed = JSON.parse(raw) as { v: number; systems: SavedSystem[] }
  expect(parsed.v).toBe(1)
  return parsed.systems
}

const names = () => stored().map((s) => s.name)

beforeEach(() => {
  win = installFakeWindow()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("saved systems", () => {
  it("keeps a system another tab saved when this tab saves", async () => {
    const { saveSystem } = await load()
    saveSystem("Acme", { preset: "origin" })
    win.otherTab(KEY, store([...stored(), record("beta", "Beta")]))

    saveSystem("Gamma", { preset: "linear" })

    expect(names()).toEqual(["Acme", "Beta", "Gamma"])
  })

  it("merges other-tab writes into update, rename, duplicate and remove", async () => {
    win.seed(KEY, store([record("acme", "Acme")]))
    const { duplicateSystem, removeSystem, renameSystem, updateSystem } =
      await load()

    win.otherTab(KEY, store([record("acme", "Acme"), record("beta", "Beta")]))
    updateSystem("acme", { preset: "linear", name: "Ignored", system: "x" })
    expect(stored().map((s) => [s.id, s.name, s.preset])).toEqual([
      ["acme", "Acme", "linear"],
      ["beta", "Beta", "origin"],
    ])

    win.otherTab(KEY, store([...stored(), record("c", "C")]))
    renameSystem("acme", "  Acme   2 ")
    expect(names()).toEqual(["Acme 2", "Beta", "C"])

    win.otherTab(KEY, store([...stored(), record("d", "D")]))
    duplicateSystem("beta")
    expect(names()).toEqual(["Acme 2", "Beta", "C", "D", "Beta copy"])

    win.otherTab(KEY, store([...stored(), record("e", "E")]))
    removeSystem("c")
    expect(names()).toEqual(["Acme 2", "Beta", "D", "Beta copy", "E"])
  })

  it("stores only the design, never the tab's name or system", async () => {
    const { saveSystem } = await load()
    const id = saveSystem("Acme", {
      preset: "linear@1",
      d: "v5.q1YqUbI",
      name: "Shared",
      system: "other",
    })
    expect(stored()).toEqual([
      {
        id,
        name: "Acme",
        preset: "linear@1",
        d: "v5.q1YqUbI",
        updatedAt: expect.any(Number),
      },
    ])
  })

  it("drops invalid records instead of crashing", async () => {
    win.seed(
      KEY,
      store([
        null,
        "x",
        { ...record("bad-id"), id: "has space" },
        { ...record("no-name"), name: "   " },
        { ...record("blob"), preset: blob("v4-origin") },
        { ...record("bad-code"), d: "not a code" },
        { ...record("no-date"), updatedAt: "1" },
        record("ok", "Ok"),
        record("ok", "Duplicate id"),
      ]),
    )
    const { saveSystem } = await load()

    saveSystem("New", { preset: "origin" })

    expect(names()).toEqual(["Ok", "New"])
  })

  it("treats an unversioned or unparseable store as empty", async () => {
    for (const raw of [
      "{broken",
      "[]",
      JSON.stringify({ v: 2, systems: [] }),
    ]) {
      win.seed(KEY, raw)
      const { saveSystem } = await load()
      saveSystem("New", { preset: "origin" })
      expect(names()).toEqual(["New"])
    }
  })

  it("puts a deleted system back where it was on undo", async () => {
    win.seed(KEY, store([record("a"), record("b"), record("c")]))
    const { removeSystem } = await load()

    const undo = removeSystem("b")
    expect(names()).toEqual(["a", "c"])
    undo?.()
    expect(names()).toEqual(["a", "b", "c"])
    undo?.()
    expect(names()).toEqual(["a", "b", "c"])
    expect(removeSystem("missing")).toBeUndefined()
  })

  it("generates ids without crypto.randomUUID (insecure contexts)", async () => {
    vi.stubGlobal("crypto", {})
    const { saveSystem } = await load()

    const returned = [
      saveSystem("A", { preset: "origin" }),
      saveSystem("B", { preset: "origin" }),
    ]

    const ids = stored().map((s) => s.id)
    expect(ids).toEqual(returned)
    expect(new Set(ids).size).toBe(2)
  })
})

describe("migrating the old keys", () => {
  const legacy = (id: string, name: string, state: string) => ({
    id,
    name,
    state,
    createdAt: 1,
    updatedAt: 5,
  })

  it("moves old records through the legacy chain and deletes the old keys", async () => {
    win.seed(
      LEGACY,
      JSON.stringify([
        legacy("v3", "From v3", blob("v3-linear")),
        legacy("v4", "From v4", blob("v4-claude")),
        legacy("query", "From a query", "preset=linear"),
        legacy("broken", "Broken", "preset=nope"),
        { id: "shapeless" },
      ]),
    )
    win.seed(NAME_KEY, "From v3")
    win.seed(ACTIVE_KEY, "v3")
    const { saveSystem } = await load()
    saveSystem("New", { preset: "origin" })

    const design = (state: string) => storedDesign(state)
    expect(stored()).toEqual([
      { id: "v3", name: "From v3", ...design(blob("v3-linear")), updatedAt: 5 },
      { id: "v4", name: "From v4", ...design(blob("v4-claude")), updatedAt: 5 },
      { id: "query", name: "From a query", preset: "linear", updatedAt: 5 },
      expect.objectContaining({ name: "New" }),
    ])
    expect(stored()[0]?.preset).toMatch(/^[a-z0-9-]+(@\d+)?$/)
    expect([LEGACY, NAME_KEY, ACTIVE_KEY].map(win.read)).toEqual([
      null,
      null,
      null,
    ])
  })

  it("merges old records another tab wrote after the store existed", async () => {
    win.seed(KEY, store([record("a", "A")]))
    win.seed(
      LEGACY,
      JSON.stringify([
        legacy("a", "A again", "preset=linear"),
        legacy("b", "B", "preset=linear"),
      ]),
    )
    const { exportSystems } = await load()
    exportSystems()

    expect(stored().map((s) => [s.id, s.name])).toEqual([
      ["a", "A"],
      ["b", "B"],
    ])
    expect(win.read(LEGACY)).toBeNull()
  })

  it("keeps the old key when the store can't be written", async () => {
    const records = JSON.stringify([legacy("a", "A", "preset=linear")])
    win.seed(LEGACY, records)
    win.localStorage.setItem.mockImplementation(() => {
      throw new Error("quota")
    })
    const { exportSystems } = await load()

    exportSystems()

    expect(win.read(LEGACY)).toBe(records)
  })

  it("deletes the stray name and active keys with no records to move", async () => {
    win.seed(NAME_KEY, "Acme")
    win.seed(ACTIVE_KEY, "k3f9")
    const { exportSystems } = await load()

    exportSystems()

    expect([NAME_KEY, ACTIVE_KEY].map(win.read)).toEqual([null, null])
  })
})

describe("export and import", () => {
  it("round-trips every record", async () => {
    win.seed(KEY, store([record("a", "A"), record("b", "B")]))
    const { exportSystems, importSystems } = await load()
    const file = exportSystems()

    win.otherTab(KEY, null)
    expect(importSystems(file)).toBe(2)

    expect(stored()).toEqual([record("a", "A"), record("b", "B")])
  })

  it("skips records it already holds and renumbers clashing ids", async () => {
    win.seed(KEY, store([record("a", "A"), record("b", "B")]))
    const { importSystems } = await load()

    const added = importSystems(
      store([record("a", "A"), record("b", "Other B"), record("c", "C")]),
    )

    expect(added).toBe(2)
    const systems = stored()
    expect(systems.map((s) => s.name)).toEqual(["A", "B", "Other B", "C"])
    expect(systems[2]?.id).not.toBe("b")
    expect(systems[3]?.id).toBe("c")
  })

  it("rejects files that aren't an export", async () => {
    const { importSystems } = await load()

    expect(importSystems("{broken")).toBeUndefined()
    expect(importSystems(JSON.stringify([record("a")]))).toBeUndefined()
    expect(importSystems(store([null, { id: "x" }]))).toBe(0)
    expect(win.read(KEY)).toBeNull()
  })
})
