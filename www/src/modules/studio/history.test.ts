import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"

let win: ReturnType<typeof installFakeWindow>

beforeEach(() => {
  win = installFakeWindow()
  vi.resetModules()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function load() {
  const history = await import("./history")
  const ws = await import("./workspace")
  const open = () => ws.openDoc(ws.getWorkspace())
  const radius = (px: number) => parseState({ ...open().state, radiusPx: px })
  const edit = (px: number) => history.edit(open().id, radius(px))
  return { history, ws, open, radius, edit }
}

describe("undo stack", () => {
  it("merges edits within 500 ms into one step", async () => {
    const { history, open, edit } = await load()
    const start = open().state.radiusPx
    edit(3)
    vi.advanceTimersByTime(300)
    edit(4)
    vi.advanceTimersByTime(300)
    edit(5)
    vi.advanceTimersByTime(600)
    edit(6)
    history.undo(open().id)
    expect(open().state.radiusPx).toBe(5)
    history.undo(open().id)
    expect(open().state.radiusPx).toBe(start)
    history.redo(open().id)
    history.redo(open().id)
    expect(open().state.radiusPx).toBe(6)
  })

  it("merges one pointer press however slow the drag", async () => {
    const { history, open, edit } = await load()
    const start = open().state.radiusPx
    history.setPressed(true)
    edit(3)
    vi.advanceTimersByTime(2000)
    edit(4)
    history.setPressed(false)
    vi.advanceTimersByTime(600)
    history.setPressed(true)
    edit(5)
    history.setPressed(false)
    history.undo(open().id)
    expect(open().state.radiusPx).toBe(4)
    history.undo(open().id)
    expect(open().state.radiusPx).toBe(start)
  })

  it("drops the redo branch on a new edit", async () => {
    const { history, open, edit } = await load()
    edit(3)
    history.undo(open().id)
    edit(4)
    history.redo(open().id)
    expect(open().state.radiusPx).toBe(4)
  })

  it("never merges an edit into the step an undo just made", async () => {
    const { history, open, edit } = await load()
    edit(3)
    vi.advanceTimersByTime(600)
    edit(4)
    history.undo(open().id)
    edit(5)
    history.undo(open().id)
    expect(open().state.radiusPx).toBe(3)
  })

  it("undoes a reset, through its toast only while nothing happened since", async () => {
    const { history, open, edit } = await load()
    edit(3)
    const undoReset = history.reset(open().id)
    expect(open().state).toEqual(open().initial)
    undoReset()
    expect(open().state.radiusPx).toBe(3)
    history.redo(open().id)
    expect(open().state).toEqual(open().initial)

    edit(7)
    const stale = history.reset(open().id)
    edit(8)
    stale()
    expect(open().state.radiusPx).toBe(8)
  })

  it("brings back the untouched system a preset replaced", async () => {
    const { history, ws, open } = await load()
    const origin = open()
    history.createFromPreset("linear")
    const linear = open()
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([linear.id])
    history.undo(linear.id)
    expect(ws.getWorkspace().systems).toEqual([origin])
    expect(ws.getWorkspace().openId).toBe(origin.id)
    history.redo(origin.id)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([linear.id])
    expect(open().state).toEqual(getPreset("linear")!.state)
  })

  it("keeps a separate stack per system", async () => {
    const { history, ws, open, edit } = await load()
    const first = open().id
    edit(3)
    ws.duplicate(first)
    const copy = open().id
    history.undo(copy)
    expect(open().state.radiusPx).toBe(3)
    history.undo(first)
    expect(ws.getWorkspace().systems[0]!.state.radiusPx).not.toBe(3)
  })
})

describe("checkpoints", () => {
  const key = (id: string) => `dotui:history:${id}`

  it("skips a state equal to the latest checkpoint or, first, the initial one", async () => {
    const { history, open, edit } = await load()
    const { id } = open()
    history.checkpoint(id)
    expect(win.read(key(id))).toBeNull()
    edit(3)
    history.checkpoint(id)
    history.checkpoint(id)
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
  })

  it("keeps the last 20", async () => {
    const { history, open, edit } = await load()
    const { id } = open()
    const times: number[] = []
    for (let i = 0; i < 25; i++) {
      vi.advanceTimersByTime(1000)
      edit(i % 2 ? 4 : 3)
      history.checkpoint(id)
      times.push(Date.now())
    }
    expect(history.checkpoints(id).map((c) => c.at)).toEqual(times.slice(-20))
  })

  it("records one after two idle minutes following edits", async () => {
    const { history, open, edit } = await load()
    edit(3)
    vi.advanceTimersByTime(60_000)
    edit(4)
    vi.advanceTimersByTime(119_000)
    expect(history.checkpoints(open().id)).toEqual([])
    vi.advanceTimersByTime(1000)
    expect(history.checkpoints(open().id).map((c) => c.state.radiusPx)).toEqual(
      [4],
    )
  })

  it("drops invalid entries on read", async () => {
    const { history, open, radius } = await load()
    const { id } = open()
    win.seed(
      key(id),
      JSON.stringify([
        { at: 1, state: radius(4) },
        { at: 2, state: { radiusPx: -1000 } },
        { at: "x", state: radius(5) },
        null,
      ]),
    )
    expect(history.checkpoints(id)).toEqual([{ at: 1, state: radius(4) }])
  })

  it("restores as an undoable step, checkpointing the current state", async () => {
    const { history, open, edit, radius } = await load()
    const { id } = open()
    edit(3)
    history.restore(id, radius(11))
    expect(open().state.radiusPx).toBe(11)
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
    history.undo(id)
    expect(open().state.radiusPx).toBe(3)
  })

  it("are deleted with the system and come back with its undo", async () => {
    const { history, ws, open, edit } = await load()
    const { id } = open()
    edit(3)
    history.checkpoint(id)
    ws.duplicate(id)
    const undo = history.remove(id)
    expect(win.read(key(id))).toBeNull()
    undo()
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
  })
})
