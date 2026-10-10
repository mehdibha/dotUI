import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { cleanName } from "@/lib/snapshots/snapshot"
import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"
import main from "@/modules/studio/axes/__fixtures__/main-states.json"
import { STATE_VERSION } from "@/modules/studio/axes/version"

const KEY = "dotui:design-systems"
const CURRENT = "dotui:current"

const MAIN_DEFAULTS = Object.fromEntries(
  Object.entries(main.schema).map(([key, { default: value }]) => [key, value]),
)

/** A state as main stored it: every one of main's keys. */
const mainState = (diff: Record<string, unknown>) => ({
  ...MAIN_DEFAULTS,
  ...diff,
})

let win: ReturnType<typeof installFakeWindow>

beforeEach(() => {
  win = installFakeWindow()
  vi.resetModules()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const load = () => import("./workspace")
const stored = () => JSON.parse(win.read(KEY)!)
const linear = getPreset("linear")!

async function created(name = "Acme") {
  const ws = await load()
  const doc = ws.create({
    name,
    from: "linear",
    state: parseState({ ...linear.state, radiusPx: 3 }),
  })!
  return { ws, doc }
}

describe("workspace", () => {
  it("starts empty without writing", async () => {
    const ws = await load()
    expect(ws.getWorkspace()).toEqual({ schema: 2, systems: [] })
    expect(win.read(KEY)).toBeNull()
  })

  it("names created systems uniquely", async () => {
    const { ws } = await created("Untitled")
    const second = ws.create({ name: "Untitled", state: linear.state })!
    expect(second.name).toBe("Untitled 2")
  })

  it("shows its preset's swatch until the brand changes", async () => {
    const { ws, doc } = await created()
    const { describe } = await import("./selection")
    const swatch = () =>
      describe({ kind: "system", id: doc.id }, ws.getWorkspace()).swatch
    expect(swatch()).toBe(linear.swatch)
    const branded = parseState({ ...doc.state, brand: "#ff0000" })
    ws.setState(doc.id, branded)
    expect(swatch()).toBe(branded.brand)
  })

  it("lists the latest edited first", async () => {
    vi.useFakeTimers({ now: 1000 })
    const { ws, doc } = await created("Alpha")
    vi.setSystemTime(2000)
    const bravo = ws.create({ name: "Bravo", state: linear.state })!
    vi.setSystemTime(3000)
    ws.setState(doc.id, parseState({ ...linear.state, radiusPx: 5 }))
    ws.flush()
    expect(ws.listed(ws.getWorkspace()).map((s) => s.name)).toEqual([
      "Alpha",
      bravo.name,
    ])
  })

  it("renames to a clean name, ignoring an empty one", async () => {
    const { ws, doc } = await created()
    ws.rename(doc.id, "Brand​\u0007 ")
    expect(ws.findSystem(doc.id)!.name).toBe("Brand")
    ws.rename(doc.id, " \u200b")
    expect(ws.findSystem(doc.id)!.name).toBe("Brand")
  })

  it("renames without moving the system in the list", async () => {
    const { ws, doc } = await created("One")
    const two = ws.create({ name: "Two", state: doc.state })!
    ws.rename(doc.id, "One renamed")
    expect(ws.listed(ws.getWorkspace()).map((s) => s.id)).toEqual([
      two.id,
      doc.id,
    ])
  })

  it("keeps edits in memory and writes them at most every 200 ms", async () => {
    const { ws, doc } = await created()
    vi.useFakeTimers()
    win.localStorage.setItem.mockClear()
    ws.setState(doc.id, parseState({ radiusPx: 2 }))
    ws.setState(doc.id, parseState({ radiusPx: 3 }))
    expect(ws.findSystem(doc.id)!.state.radiusPx).toBe(3)
    expect(win.localStorage.setItem).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(win.localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(stored().systems[0].state.radiusPx).toBe(3)
  })

  it("removes", async () => {
    const { ws, doc } = await created()
    const other = ws.create({ name: "Other", state: linear.state })!
    ws.remove(doc.id)
    ws.remove(doc.id)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([other.id])
  })

  it("suggests <name> copy for a duplicate, never copy copy", async () => {
    const { ws } = await created()
    expect(ws.copyName("Acme")).toBe("Acme copy")
    ws.create({ name: "Acme copy", state: linear.state })
    expect(ws.copyName("Acme copy")).toBe("Acme copy 2")
  })

  it("writes slot edits at most every 200 ms too", async () => {
    const ws = await load()
    vi.useFakeTimers()
    const from = { kind: "preset", id: "linear" } as const
    ws.setUnsaved({ from, state: parseState({ radiusPx: 2 }) })
    ws.setUnsaved({ from, state: parseState({ radiusPx: 3 }) })
    expect(ws.getWorkspace().unsaved?.state.radiusPx).toBe(3)
    expect(win.localStorage.setItem).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(stored().unsaved.state.radiusPx).toBe(3)
    ws.setUnsaved(undefined)
    ws.flush()
    // Empty again: nothing is stored.
    expect(win.read(KEY)).toBeNull()
  })

  it("keeps generated names within 64 UTF-16 units", async () => {
    const long = "x".repeat(64)
    const { ws } = await created(long)
    const next = () => ws.create({ name: long, state: linear.state })!.name
    expect(next()).toBe(`${"x".repeat(62)} 2`)
    // A surrogate pair is never split.
    expect(ws.uniqueName(`${"x".repeat(58)}😀😀`, [], " copy")).toBe(
      `${"x".repeat(58)} copy`,
    )
    expect(cleanName("😀".repeat(40))).toBe("😀".repeat(32))
    expect(cleanName(" a\u0007\u200b👩\u200d👧\u200f ")).toBe(
      "a👩\u200d👧\u200f",
    )
    expect(ws.parseWorkspace(win.read(KEY)!)).toEqual(ws.getWorkspace())
  })

  it("reads records leniently, field by field", async () => {
    const good = {
      id: "a",
      name: "Acme",
      from: "linear",
      state: { radiusPx: 4 },
      updatedAt: 1,
      retiredField: true,
    }
    win.seed(
      KEY,
      JSON.stringify({
        schema: 2,
        systems: [
          good,
          { ...good, id: "b", state: { radiusPx: -1000, retired: 1 } },
          { ...good, id: "c", name: "", from: "nope" },
          { ...good, id: "" },
          null,
        ],
      }),
    )
    const ws = await load()
    const [a, b, c, ...rest] = ws.getWorkspace().systems
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    expect(rest).toEqual([])
    expect(a).toMatchObject({ id: "a", name: "Acme", from: "linear" })
    expect(a).not.toHaveProperty("retiredField")
    expect(a!.state.radiusPx).toBe(4)
    expect(b!.state).toEqual(parseState({}))
    expect(c).toMatchObject({ name: "Untitled", from: undefined })
  })

  it("reads the slot leniently, dropping one without a view", async () => {
    const slot = (from: unknown) =>
      JSON.stringify({
        schema: 2,
        systems: [],
        unsaved: { from, state: { radiusPx: -1000 } },
      })
    win.seed(KEY, slot({ kind: "preset", id: "linear" }))
    const ws = await load()
    expect(ws.getWorkspace().unsaved).toEqual({
      from: { kind: "preset", id: "linear" },
      state: parseState({}),
    })
    for (const from of [
      { kind: "preset", id: "nope" },
      { kind: "link", id: "short", name: "Acme" },
      null,
    ]) {
      win.seed(KEY, slot(from))
      expect(ws.getWorkspace().unsaved).toBeUndefined()
    }
  })

  it("migrates main's states and writes them back stamped", async () => {
    win.seed(
      KEY,
      JSON.stringify({
        schema: 2,
        systems: [
          {
            id: "a",
            name: "Acme",
            state: mainState({ inputStyle: "line" }),
            updatedAt: 1,
          },
        ],
        unsaved: {
          from: {
            kind: "link",
            id: "0123456789",
            name: "Shared",
            state: mainState({ inputHover: "border" }),
          },
          state: mainState({ buttonStyle: "bevel" }),
        },
      }),
    )
    const link = {
      kind: "link",
      id: "9876543210",
      name: "Link",
      state: mainState({ segmentedSelected: "inverse" }),
    }
    win.seed(CURRENT, JSON.stringify(link))
    const ws = await load()
    const { getCurrent } = await import("./selection")
    ws.getWorkspace()
    getCurrent()
    await ws.upgradeStored()
    const { systems, unsaved } = ws.getWorkspace()
    expect(systems[0]!.state).toEqual(
      parseState({ inputStyle: "underline", inputHover: "none" }),
    )
    expect(unsaved!.from).toMatchObject({
      state: parseState({ inputHover: "edge" }),
    })
    expect(unsaved!.state.style).toBe("tactile")
    expect(getCurrent().state).toEqual(
      parseState({ segmentedSelected: "inverse" }),
    )
    const raw = stored()
    expect(raw.systems[0].state.version).toBe(STATE_VERSION)
    expect(raw.unsaved.state.version).toBe(STATE_VERSION)
    expect(raw.unsaved.from.state.version).toBe(STATE_VERSION)
    expect(JSON.parse(win.read(CURRENT)!).state.version).toBe(STATE_VERSION)
    vi.resetModules()
    expect((await load()).getWorkspace()).toEqual(ws.getWorkspace())
  })

  it("writes a state back as stored until it is migrated", async () => {
    const state = mainState({ inputStyle: "line" })
    win.seed(
      KEY,
      JSON.stringify({
        schema: 2,
        systems: [{ id: "a", name: "Acme", state, updatedAt: 1 }],
      }),
    )
    const ws = await load()
    ws.rename("a", "Acme 2")
    expect(stored().systems[0]).toMatchObject({ name: "Acme 2", state })
    await ws.upgradeStored()
    expect(stored().systems[0].state).toEqual({
      version: STATE_VERSION,
      ...ws.findSystem("a")!.state,
    })
  })

  describe("an edit before migrate lands", () => {
    const seedMain = () => {
      win.seed(
        KEY,
        JSON.stringify({
          schema: 2,
          systems: [
            {
              id: "a",
              name: "Acme",
              state: mainState({ inputStyle: "line" }),
              updatedAt: 1,
            },
          ],
        }),
      )
      win.seed(CURRENT, JSON.stringify({ kind: "system", id: "a" }))
    }
    const radius = async (px: number) => {
      const selection = await import("./selection")
      selection.edit(
        parseState({ ...selection.getCurrent().state, radiusPx: px }),
      )
    }
    const migratedLine = parseState({
      inputStyle: "underline",
      inputHover: "none",
    })

    afterEach(() => {
      vi.doUnmock("@/modules/studio/axes/migrate")
    })

    it("lands on the migrated state", async () => {
      seedMain()
      const ws = await load()
      await radius(7)
      expect(ws.findSystem("a")!.state.radiusPx).not.toBe(7)
      await ws.upgradeStored()
      ws.flush()
      expect(ws.findSystem("a")!.state).toEqual({
        ...migratedLine,
        radiusPx: 7,
      })
      expect(stored().systems[0].state).toEqual({
        version: STATE_VERSION,
        ...migratedLine,
        radiusPx: 7,
      })
    })

    it("is dropped if migrate can't load, and the next one retries", async () => {
      seedMain()
      vi.doMock("@/modules/studio/axes/migrate", () => {
        throw new Error("offline")
      })
      const ws = await load()
      await radius(7)
      await ws.upgradeStored()
      ws.flush()
      expect(stored().systems[0].state).toEqual(
        mainState({ inputStyle: "line" }),
      )
      vi.doUnmock("@/modules/studio/axes/migrate")
      await radius(8)
      await ws.upgradeStored()
      ws.flush()
      expect(stored().systems[0].state).toEqual({
        version: STATE_VERSION,
        ...migratedLine,
        radiusPx: 8,
      })
    })

    it("saves a copy that migrates like its source", async () => {
      seedMain()
      const ws = await load()
      const { createFrom } = await import("./selection")
      const copy = createFrom("Copy", { kind: "system", id: "a" })!
      expect(stored().systems[1].state).toEqual(
        mainState({ inputStyle: "line" }),
      )
      await ws.upgradeStored()
      expect(ws.findSystem(copy.id)!.state).toEqual(migratedLine)
    })
  })

  it("reads an unknown format as empty and never writes over it", async () => {
    const future = JSON.stringify({ schema: 3, systems: [] })
    win.seed(KEY, future)
    const ws = await load()
    expect(ws.getWorkspace().systems).toEqual([])
    expect(ws.isUnreadable()).toBe(true)
    expect(ws.create({ name: "Acme", state: linear.state })).toBeUndefined()
    expect(ws.getWorkspace().systems).toEqual([])
    expect(win.read(KEY)).toBe(future)
    win.seed(KEY, "not json")
    expect(ws.getWorkspace().systems).toEqual([])
    expect(ws.isUnreadable()).toBe(true)
    win.seed(KEY, JSON.stringify({ schema: 2, systems: [] }))
    expect(ws.isUnreadable()).toBe(false)
  })
})
