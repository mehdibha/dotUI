import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

import type { SavedPreset } from "./my-presets"

const PRESETS_KEY = "dotui:my-presets"
const ACTIVE_KEY = "dotui:active-saved-preset"

let win: ReturnType<typeof installFakeWindow>

// Module state is per test: a fresh import stands in for a freshly loaded tab.
async function load() {
  vi.resetModules()
  return import("./my-presets")
}

function record(id: string, name = id): SavedPreset {
  return { id, name, state: `state-${id}`, createdAt: 1, updatedAt: 1 }
}

function stored(): SavedPreset[] {
  const raw = win.read(PRESETS_KEY)
  return raw === null ? [] : (JSON.parse(raw) as SavedPreset[])
}

const names = () => stored().map((p) => p.name)

beforeEach(() => {
  win = installFakeWindow()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("saved presets", () => {
  it("keeps a system another tab saved when this tab saves", async () => {
    const { savePreset } = await load()
    savePreset("Acme", "a")
    win.otherTab(
      PRESETS_KEY,
      JSON.stringify([...stored(), record("beta", "Beta")]),
    )

    savePreset("Gamma", "g")

    expect(names()).toEqual(["Acme", "Beta", "Gamma"])
  })

  it("merges other-tab writes into update, rename, duplicate and remove", async () => {
    win.seed(PRESETS_KEY, JSON.stringify([record("acme", "Acme")]))
    const { duplicatePreset, removePreset, renamePreset, updatePreset } =
      await load()
    const beta = record("beta", "Beta")

    win.otherTab(PRESETS_KEY, JSON.stringify([record("acme", "Acme"), beta]))
    updatePreset("acme", "next")
    expect(stored().map((p) => [p.id, p.state])).toEqual([
      ["acme", "next"],
      ["beta", "state-beta"],
    ])

    win.otherTab(PRESETS_KEY, JSON.stringify([...stored(), record("c", "C")]))
    renamePreset("acme", "Acme 2")
    expect(names()).toEqual(["Acme 2", "Beta", "C"])

    win.otherTab(PRESETS_KEY, JSON.stringify([...stored(), record("d", "D")]))
    duplicatePreset("beta")
    expect(names()).toEqual(["Acme 2", "Beta", "C", "D", "Beta copy"])

    win.otherTab(PRESETS_KEY, JSON.stringify([...stored(), record("e", "E")]))
    removePreset("c")
    expect(names()).toEqual(["Acme 2", "Beta", "D", "Beta copy", "E"])
  })

  it("drops corrupt records instead of crashing", async () => {
    win.seed(
      PRESETS_KEY,
      JSON.stringify([
        null,
        "x",
        { id: 1, name: "Bad", state: "s", createdAt: 1, updatedAt: 1 },
        { id: "no-dates", name: "Bad", state: "s" },
        record("ok", "Ok"),
      ]),
    )
    const { savePreset } = await load()

    savePreset("New", "n")

    expect(names()).toEqual(["Ok", "New"])
  })

  it("treats a non-array or unparseable value as empty", async () => {
    win.seed(PRESETS_KEY, "{broken")
    const { savePreset } = await load()

    savePreset("New", "n")

    expect(names()).toEqual(["New"])
  })

  it("clears the active id only when removing the active preset", async () => {
    win.seed(PRESETS_KEY, JSON.stringify([record("a"), record("b")]))
    const { removePreset } = await load()
    win.otherTab(ACTIVE_KEY, "b")

    removePreset("a")
    expect(win.read(ACTIVE_KEY)).toBe("b")

    removePreset("b")
    expect(win.read(ACTIVE_KEY)).toBeNull()
  })

  it("generates ids without crypto.randomUUID (insecure contexts)", async () => {
    vi.stubGlobal("crypto", {})
    const { savePreset } = await load()

    savePreset("A", "a")
    savePreset("B", "b")

    const ids = stored().map((p) => p.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    expect(win.read(ACTIVE_KEY)).toBe(ids[1])
  })
})
