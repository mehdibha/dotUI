import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"

const KEY = "dotui:design-systems"

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
    origin: { kind: "preset", id: "linear" },
    initial: linear.state,
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

  it("names created systems uniquely, except drafts", async () => {
    const { ws } = await created("Untitled")
    const second = ws.create({
      name: "Untitled",
      origin: { kind: "preset", id: "origin" },
      initial: linear.state,
      state: linear.state,
    })!
    const draft = ws.create({
      draft: true,
      name: "Untitled",
      origin: { kind: "preset", id: "origin" },
      initial: linear.state,
      state: linear.state,
    })!
    expect([second.name, draft.name]).toEqual(["Untitled 2", "Untitled"])
    expect(stored().systems.map((s: { draft: boolean }) => s.draft)).toEqual([
      false,
      false,
      true,
    ])
  })

  it("lists the draft first, then newest first", async () => {
    const { ws, doc } = await created()
    const draft = ws.create({
      draft: true,
      name: "Linear",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })!
    const later = ws.create({
      name: "Later",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })!
    expect(ws.listed(ws.getWorkspace()).map((s) => s.id)).toEqual([
      draft.id,
      later.id,
      doc.id,
    ])
  })

  it("lists the latest edited first", async () => {
    vi.useFakeTimers({ now: 1000 })
    const { ws, doc } = await created("Alpha")
    vi.setSystemTime(2000)
    const bravo = ws.create({
      name: "Bravo",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })!
    vi.setSystemTime(3000)
    ws.setState(doc.id, parseState({ ...linear.state, radiusPx: 5 }))
    ws.flush()
    expect(ws.listed(ws.getWorkspace()).map((s) => s.name)).toEqual([
      "Alpha",
      bravo.name,
    ])
  })

  it("keeps a draft on rename, but not on the same name", async () => {
    const ws = await load()
    const draft = ws.create({
      draft: true,
      name: "Linear",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: parseState({ ...linear.state, radiusPx: 3 }),
    })!
    expect(ws.isChangedDraft(draft)).toBe(true)
    expect(ws.keptName(draft)).toBe("My Linear")
    ws.rename(draft.id, "  Linear ")
    expect(ws.findSystem(draft.id)!.draft).toBe(true)
    ws.rename(draft.id, "Brand​\u0007 ")
    expect(ws.findSystem(draft.id)).toMatchObject({
      name: "Brand",
      draft: false,
    })
  })

  it("suggests unique kept names", async () => {
    const { ws } = await created("My Linear")
    const draft = ws.create({
      draft: true,
      name: "Linear",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })!
    expect(ws.keptName(draft)).toBe("My Linear 2")
    const origin = ws.create({
      draft: true,
      name: "Origin",
      origin: { kind: "preset", id: "origin" },
      initial: linear.state,
      state: linear.state,
    })!
    expect(ws.keptName(origin)).toBe("Untitled")
    ws.keep(draft.id, "Linear")
    expect(ws.findSystem(draft.id)).toMatchObject({
      name: "Linear",
      draft: false,
    })
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

  it("removes and inserts back in place, with its checkpoints", async () => {
    const { ws, doc } = await created()
    const other = ws.create({
      name: "Other",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })!
    win.seed(ws.checkpointsKey(doc.id), "[]")
    const removed = ws.remove(doc.id)!
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([other.id])
    expect(win.read(ws.checkpointsKey(doc.id))).toBeNull()
    ws.insert(removed.doc, removed.index, removed.checkpoints)
    ws.insert(removed.doc, removed.index)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([
      doc.id,
      other.id,
    ])
    expect(win.read(ws.checkpointsKey(doc.id))).toBe("[]")
  })

  it("resets to the initial state", async () => {
    const { ws, doc } = await created()
    ws.reset(doc.id)
    const reset = ws.findSystem(doc.id)!
    expect(reset.state).toEqual(reset.initial)
  })

  it("keeps generated names within 64 UTF-16 units", async () => {
    const long = "x".repeat(64)
    const { ws } = await created(long)
    const next = () =>
      ws.create({
        name: long,
        origin: { kind: "preset", id: "linear" },
        initial: linear.state,
        state: linear.state,
      })!.name
    expect(next()).toBe(`${"x".repeat(62)} 2`)
    // A surrogate pair is never split.
    expect(ws.uniqueName(`${"x".repeat(58)}😀😀`, [], " copy")).toBe(
      `${"x".repeat(58)} copy`,
    )
    expect(ws.cleanName("😀".repeat(40))).toBe("😀".repeat(32))
    expect(ws.cleanName(" a\u0007\u200b👩\u200d👧\u200f ")).toBe(
      "a👩\u200d👧\u200f",
    )
    expect(ws.parseWorkspace(win.read(KEY)!)).toEqual(ws.getWorkspace())
  })

  it("reads records leniently, field by field", async () => {
    const good = {
      id: "a",
      name: "Acme",
      draft: false,
      origin: { kind: "preset", id: "linear" },
      initial: {},
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
          { ...good, id: "c", name: "", origin: { kind: "nope" } },
          { ...good, id: "" },
          null,
        ],
      }),
    )
    const ws = await load()
    const [a, b, c, ...rest] = ws.getWorkspace().systems
    expect(rest).toEqual([])
    expect(a).toMatchObject({ id: "a", name: "Acme" })
    expect(a).not.toHaveProperty("retiredField")
    expect(a!.state.radiusPx).toBe(4)
    expect(b!.state).toEqual(parseState({}))
    expect(c).toMatchObject({
      name: "Untitled",
      origin: { kind: "preset", id: "origin" },
    })
  })

  it("writes a deleted system to the trash before removing it", async () => {
    const { ws, doc } = await created()
    win.localStorage.setItem.mockClear()
    ws.trash(doc.id)
    expect(win.localStorage.setItem.mock.calls.map(([key]) => key)).toEqual([
      "dotui:trash",
      KEY,
    ])
    expect(ws.getWorkspace().systems).toEqual([])
    expect(ws.recover(doc.id)?.id).toBe(doc.id)
    expect(win.read("dotui:trash")).toBeNull()
  })

  it("drops invalid trash entries", async () => {
    const { ws, doc } = await created()
    win.seed(
      "dotui:trash",
      JSON.stringify({
        schema: 1,
        items: [
          { doc, index: 0, deletedAt: 1 },
          { doc: { ...doc, id: "y" }, index: "0", deletedAt: 1 },
          { doc: { ...doc, id: "z" }, index: 0 },
        ],
      }),
    )
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([doc.id])
  })

  it("reads an unknown format as empty and never writes over it", async () => {
    const future = JSON.stringify({ schema: 3, systems: [] })
    win.seed(KEY, future)
    const ws = await load()
    expect(ws.getWorkspace().systems).toEqual([])
    ws.create({
      name: "Acme",
      origin: { kind: "preset", id: "linear" },
      initial: linear.state,
      state: linear.state,
    })
    expect(win.read(KEY)).toBe(future)
    win.seed(KEY, "not json")
    expect(ws.getWorkspace().systems).toEqual([])
  })
})
