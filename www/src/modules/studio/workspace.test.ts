import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { snapshotId } from "@/lib/snapshots/snapshot"
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

async function edited() {
  const ws = await load()
  const { id, state } = ws.openDoc(ws.getWorkspace())
  ws.setState(id, parseState({ ...state, radiusPx: 3 }))
  ws.flush()
  return { ws, id }
}

describe("workspace", () => {
  it("starts on an untouched Origin without writing", async () => {
    const ws = await load()
    const workspace = ws.getWorkspace()
    expect(workspace.systems.map((s) => s.name)).toEqual(["Origin"])
    expect(ws.isUntouched(ws.openDoc(workspace))).toBe(true)
    expect(win.read(KEY)).toBeNull()
  })

  it("replaces an untouched system when a preset is picked", async () => {
    const ws = await load()
    ws.createFromPreset("linear")
    const workspace = ws.getWorkspace()
    expect(workspace.systems.map((s) => s.name)).toEqual(["Linear"])
    expect(ws.openDoc(workspace).state).toEqual(linear.state)
    expect(stored().openId).toBe(workspace.openId)
  })

  it("keeps edited work and names new systems uniquely", async () => {
    const { ws } = await edited()
    ws.createFromPreset("linear")
    ws.rename(ws.getWorkspace().openId, "Mine")
    ws.createFromPreset("linear")
    ws.setState(ws.getWorkspace().openId, parseState({ radiusPx: 5 }))
    ws.createFromPreset("linear")
    expect(ws.getWorkspace().systems.map((s) => s.name)).toEqual([
      "Origin",
      "Mine",
      "Linear",
      "Linear 2",
    ])
  })

  it("does not recreate the untouched preset that is already open", async () => {
    const ws = await load()
    ws.createFromPreset("linear")
    const { openId } = ws.getWorkspace()
    ws.createFromPreset("linear")
    expect(ws.getWorkspace().openId).toBe(openId)
    expect(ws.getWorkspace().systems).toHaveLength(1)
  })

  it("counts a renamed or published system as touched", async () => {
    const ws = await load()
    const doc = ws.openDoc(ws.getWorkspace())
    ws.rename(doc.id, "Acme")
    expect(ws.isUntouched(ws.openDoc(ws.getWorkspace()))).toBe(false)
    ws.rename(doc.id, "Origin 3")
    expect(ws.isUntouched(ws.openDoc(ws.getWorkspace()))).toBe(true)
    await ws.publish(doc.id, async () => "abcdefghij")
    expect(ws.isUntouched(ws.openDoc(ws.getWorkspace()))).toBe(false)
  })

  it("keeps edits in memory and writes them at most every 200 ms", async () => {
    vi.useFakeTimers()
    const ws = await load()
    const { id } = ws.openDoc(ws.getWorkspace())
    ws.setState(id, parseState({ radiusPx: 2 }))
    ws.setState(id, parseState({ radiusPx: 3 }))
    expect(ws.openDoc(ws.getWorkspace()).state.radiusPx).toBe(3)
    expect(win.localStorage.setItem).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(win.localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(stored().systems[0].state.radiusPx).toBe(3)
  })

  it("duplicates into an opened copy", async () => {
    const { ws, id } = await edited()
    ws.duplicate(id)
    ws.duplicate(id)
    const workspace = ws.getWorkspace()
    const copy = ws.openDoc(workspace)
    expect(workspace.systems.map((s) => s.name)).toEqual([
      "Origin",
      "Origin copy",
      "Origin copy 2",
    ])
    expect(copy.origin).toEqual({ kind: "copy", of: id })
    expect(copy.initial.radiusPx).toBe(3)
  })

  it("deletes with an undo that restores position and focus", async () => {
    const { ws, id } = await edited()
    ws.duplicate(id)
    const copy = ws.getWorkspace().openId
    const undo = ws.remove(copy)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([id])
    expect(ws.getWorkspace().openId).toBe(id)
    undo()
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([id, copy])
    expect(ws.getWorkspace().openId).toBe(copy)
    undo()
    expect(ws.getWorkspace().systems).toHaveLength(2)
  })

  it("opens a fresh Origin after deleting the last system, dropped by undo", async () => {
    const { ws, id } = await edited()
    const undo = ws.remove(id)
    const [fresh] = ws.getWorkspace().systems
    expect(fresh!.name).toBe("Origin")
    expect(fresh!.id).not.toBe(id)
    undo()
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([id])
  })

  it("resets to the initial state", async () => {
    const { ws, id } = await edited()
    ws.reset(id)
    const doc = ws.openDoc(ws.getWorkspace())
    expect(doc.state).toEqual(doc.initial)
  })

  it("publishes once per content", async () => {
    const { ws, id } = await edited()
    const post = vi.fn(async (body: { name: string; base: string }) =>
      snapshotId({
        schema: 1,
        ...body,
        state: ws.getWorkspace().systems[0]!.state,
      }),
    )
    const first = await ws.publish(id, post)
    expect(await ws.publish(id, post)).toBe(first)
    expect(post).toHaveBeenCalledTimes(1)
    expect(ws.openDoc(ws.getWorkspace()).published.map((p) => p.id)).toEqual([
      first,
    ])
    expect(await ws.hasUnpublishedChanges(ws.openDoc(ws.getWorkspace()))).toBe(
      false,
    )
    ws.rename(id, "Renamed")
    expect(await ws.hasUnpublishedChanges(ws.openDoc(ws.getWorkspace()))).toBe(
      true,
    )
  })

  it("keeps generated names readable at the length limit", async () => {
    const { ws, id } = await edited()
    const long = "x".repeat(64)
    ws.rename(id, long)
    ws.duplicate(id)
    ws.duplicate(id)
    const snapshot = {
      schema: 1 as const,
      name: long,
      base: "origin",
      state: linear.state,
      createdAt: 1,
    }
    ws.importSnapshot("L0ngN4me01", snapshot)
    ws.importSnapshot("Bl4nkN4me1", { ...snapshot, name: "  " })
    const workspace = ws.getWorkspace()
    expect(workspace.systems.map((s) => s.name)).toEqual([
      long,
      `${"x".repeat(59)} copy`,
      `${"x".repeat(57)} copy 2`,
      `${"x".repeat(62)} 2`,
      "Untitled",
    ])
    expect(ws.parseWorkspace(win.read(KEY)!)).toEqual(workspace)
  })

  it("imports a snapshot once and reopens it after", async () => {
    const { ws, id } = await edited()
    const snapshot = {
      schema: 1 as const,
      name: "Origin",
      base: "linear",
      state: linear.state,
      createdAt: 1,
    }
    ws.importSnapshot("Sh4r3dL1nk", snapshot)
    const imported = ws.openDoc(ws.getWorkspace())
    expect(imported.name).toBe("Origin 2")
    expect(imported.origin).toEqual({ kind: "snapshot", id: "Sh4r3dL1nk" })
    expect(imported.published).toEqual([{ id: "Sh4r3dL1nk", at: 1 }])
    ws.open(id)
    ws.importSnapshot("Sh4r3dL1nk", snapshot)
    expect(ws.getWorkspace().openId).toBe(imported.id)
    expect(ws.getWorkspace().systems).toHaveLength(2)
  })

  it("drops invalid records and reopens a surviving one", async () => {
    const good = {
      id: "a",
      name: "Acme",
      origin: { kind: "preset", id: "linear" },
      initial: {},
      state: { radiusPx: 4 },
      published: [],
      createdAt: 1,
      updatedAt: 1,
    }
    win.seed(
      KEY,
      JSON.stringify({
        schema: 1,
        openId: "gone",
        systems: [
          good,
          { ...good, id: "b", state: { radiusPx: -1000 } },
          { ...good, id: "c", state: { cursorControls: "url(evil)" } },
          { ...good, id: "d", name: "" },
          { ...good, id: "e", published: [{ id: "../x", at: 1 }] },
          { ...good, id: "f", origin: { kind: "nope" } },
          null,
        ],
      }),
    )
    const ws = await load()
    const workspace = ws.getWorkspace()
    expect(workspace.systems.map((s) => s.id)).toEqual(["a"])
    expect(workspace.openId).toBe("a")
    expect(workspace.systems[0]!.state.radiusPx).toBe(4)
  })

  it("starts over when nothing valid is stored", async () => {
    win.seed(KEY, JSON.stringify({ schema: 1, openId: "x", systems: [{}] }))
    const ws = await load()
    expect(ws.getWorkspace().systems.map((s) => s.name)).toEqual(["Origin"])
    win.seed(KEY, "not json")
    expect(ws.getWorkspace().systems.map((s) => s.name)).toEqual(["Origin"])
  })
})
