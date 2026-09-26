import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"

const ORIGIN_RADIUS = getPreset("origin")!.state.radiusPx

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
  const selection = await import("./selection")
  const current = () => selection.getCurrent()
  const open = () => current().doc!
  const radius = (px: number) =>
    parseState({ ...current().state, radiusPx: px })
  const edit = (px: number) => history.edit(radius(px))
  /** A kept system, current. */
  const system = () => {
    const id = history.newSystem()!
    edit(3)
    vi.advanceTimersByTime(600)
    return id
  }
  return { history, ws, selection, current, open, radius, edit, system }
}

describe("undo stack", () => {
  it("merges edits within 500 ms into one step", async () => {
    const { history, open, edit, system } = await load()
    system()
    const start = open().state.radiusPx
    edit(4)
    vi.advanceTimersByTime(300)
    edit(5)
    vi.advanceTimersByTime(300)
    edit(6)
    vi.advanceTimersByTime(600)
    edit(7)
    history.undo()
    expect(open().state.radiusPx).toBe(6)
    history.undo()
    expect(open().state.radiusPx).toBe(start)
    history.redo()
    history.redo()
    expect(open().state.radiusPx).toBe(7)
  })

  it("merges one pointer press however slow the drag", async () => {
    const { history, open, edit, system } = await load()
    system()
    history.setPressed(true)
    edit(4)
    vi.advanceTimersByTime(2000)
    edit(5)
    history.setPressed(false)
    vi.advanceTimersByTime(600)
    history.setPressed(true)
    edit(6)
    history.setPressed(false)
    history.undo()
    expect(open().state.radiusPx).toBe(5)
    history.undo()
    expect(open().state.radiusPx).toBe(3)
  })

  it("drops the redo branch on a new edit", async () => {
    const { history, open, edit, system } = await load()
    system()
    edit(4)
    history.undo()
    edit(5)
    history.redo()
    expect(open().state.radiusPx).toBe(5)
  })

  it("never merges an edit into the step an undo just made", async () => {
    const { history, open, edit, system } = await load()
    system()
    edit(4)
    vi.advanceTimersByTime(600)
    edit(5)
    history.undo()
    edit(6)
    history.undo()
    expect(open().state.radiusPx).toBe(4)
  })

  it("undoes a reset, through its toast only while nothing happened since", async () => {
    const { history, open, edit, system } = await load()
    const id = system()
    const undoReset = history.reset(id)
    expect(open().state).toEqual(open().initial)
    undoReset()
    expect(open().state.radiusPx).toBe(3)
    history.redo()
    expect(open().state).toEqual(open().initial)

    edit(7)
    const stale = history.reset(id)
    edit(8)
    stale()
    expect(open().state.radiusPx).toBe(8)
  })

  it("keeps a separate stack per system", async () => {
    const { history, ws, selection, open, system } = await load()
    const first = system()
    const second = system()
    history.undo()
    expect(open().state.radiusPx).toBe(ORIGIN_RADIUS)
    selection.select({ kind: "system", id: first })
    history.undo()
    expect(ws.findSystem(first)!.state.radiusPx).toBe(ORIGIN_RADIUS)
    expect(ws.findSystem(second)!.state.radiusPx).toBe(ORIGIN_RADIUS)
  })
})

describe("views and drafts", () => {
  it("writes nothing until a view is edited", async () => {
    const { selection, current } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    expect(current().tag).toBe("Preset")
    expect(win.read("dotui:design-systems")).toBeNull()
  })

  it("forks the first edit of a view into a draft, one step with its drag", async () => {
    const { history, ws, selection, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    history.setPressed(true)
    edit(3)
    vi.advanceTimersByTime(2000)
    edit(4)
    history.setPressed(false)
    const draft = current().doc!
    expect(draft).toMatchObject({ name: "Stripe", draft: true })
    expect(draft.origin).toEqual({ kind: "preset", id: "stripe" })
    expect(draft.initial).toEqual(getPreset("stripe")!.state)
    expect(draft.state.radiusPx).toBe(4)

    history.undo()
    expect(current().key).toBe("preset:stripe")
    expect(ws.getWorkspace().systems).toEqual([])
    history.redo()
    expect(current().doc).toMatchObject({ id: draft.id, draft: true })
    expect(current().state.radiusPx).toBe(4)
  })

  it("only reverts a fork that was kept since", async () => {
    const { history, ws, current, edit } = await load()
    edit(3)
    const { id } = current().doc!
    ws.rename(id, "Acme")
    history.undo()
    expect(current().doc).toMatchObject({ id, name: "Acme", draft: false })
    expect(current().state).toEqual(current().doc!.initial)
  })

  it("keeps the old draft when another view is edited", async () => {
    const { ws, selection, current, edit } = await load()
    edit(3)
    const old = current().doc!.id
    selection.select({ kind: "preset", id: "linear" })
    edit(5)
    expect(ws.findSystem(old)).toMatchObject({
      name: "My Origin",
      draft: false,
    })
    expect(current().doc).toMatchObject({ name: "Linear", draft: true })
  })

  it("removes an unchanged draft when it is left", async () => {
    const { ws, selection, edit } = await load()
    edit(3)
    vi.advanceTimersByTime(600)
    edit(ORIGIN_RADIUS)
    selection.select({ kind: "preset", id: "linear" })
    expect(ws.getWorkspace().systems).toEqual([])
  })

  it("creates Untitled from any selection; undo removes it", async () => {
    const { history, ws, selection, current } = await load()
    selection.select({ kind: "preset", id: "linear" })
    const id = history.newSystem()!
    expect(current().doc).toMatchObject({ id, name: "Untitled", draft: false })
    ws.rename(id, "Acme")
    history.undo()
    expect(current().key).toBe("preset:linear")
    expect(ws.getWorkspace().systems).toEqual([])
    history.redo()
    expect(current().doc).toMatchObject({ id, name: "Acme" })
  })

  it("deletes the current system to the next one, else the Origin view", async () => {
    const { history, ws, current, system } = await load()
    const first = system()
    const second = system()
    const undo = history.remove(second)
    expect(current().doc?.id).toBe(first)
    history.remove(first)
    expect(current().key).toBe("preset:origin")
    undo()
    expect(current().doc?.id).toBe(second)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([second])
  })
})

describe("duplicate", () => {
  it("copies a preset as My <preset>, kept", async () => {
    const { history, current } = await load()
    const id = history.duplicate({ kind: "preset", id: "linear" })!
    expect(current().doc).toMatchObject({
      id,
      name: "My Linear",
      draft: false,
      origin: { kind: "preset", id: "linear" },
      state: getPreset("linear")!.state,
    })
    expect(history.duplicate({ kind: "preset", id: "linear" })).toBeDefined()
    expect(current().name).toBe("My Linear 2")
  })

  it("copies a system as <name> copy, never chaining", async () => {
    const { history, ws, current, system } = await load()
    const id = system()
    ws.rename(id, "Acme")
    const copy = history.duplicate({ kind: "system", id })!
    expect(current().doc).toMatchObject({
      name: "Acme copy",
      origin: { kind: "copy", of: id },
    })
    expect(current().state.radiusPx).toBe(3)
    history.duplicate({ kind: "system", id: copy })
    expect(current().name).toBe("Acme copy 2")
  })

  it("copies a shared view under its name; undo removes the copy", async () => {
    const { history, ws, selection, current, radius } = await load()
    const shared = {
      kind: "shared",
      id: "abcdefghij",
      name: "Acme",
      state: radius(9),
    } as const
    selection.select(shared)
    history.duplicate(shared)
    expect(current().doc).toMatchObject({
      name: "Acme",
      origin: { kind: "snapshot", id: "abcdefghij" },
    })
    history.undo()
    expect(current().key).toBe("shared:abcdefghij")
    expect(ws.getWorkspace().systems).toEqual([])
  })
})

describe("recently deleted", () => {
  it("moves a system there; undo brings it back in place", async () => {
    const { history, ws, selection, current, system } = await load()
    const first = system()
    const second = system()
    selection.select({ kind: "system", id: first })
    const undo = history.remove(second)
    expect(current().doc?.id).toBe(first)
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([second])
    undo()
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([first, second])
    expect(ws.getTrash()).toEqual([])
    expect(current().doc?.id).toBe(first)
  })

  it("empties the list to the Origin view, and restores after a reload", async () => {
    const { history, ws, current, system } = await load()
    const id = system()
    history.remove(id)
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().systems).toEqual([])
    vi.resetModules()
    const reloaded = await load()
    reloaded.history.recover(id)
    expect(reloaded.ws.getWorkspace().systems.map((s) => s.id)).toEqual([id])
    expect(reloaded.current().key).toBe("preset:origin")
  })

  it("keeps one draft when a deleted draft comes back", async () => {
    const { history, ws, selection, current, edit } = await load()
    edit(3)
    const old = current().doc!.id
    history.remove(old)
    selection.select({ kind: "preset", id: "linear" })
    edit(5)
    const draft = current().doc!.id
    history.recover(old, true)
    expect(current().doc).toMatchObject({ id: old, draft: true })
    expect(ws.findSystem(draft)).toMatchObject({
      name: "My Linear",
      draft: false,
    })
  })

  it("purges what was deleted over 30 days ago", async () => {
    const { history, ws, system } = await load()
    const old = system()
    history.checkpoint(old)
    history.remove(old)
    vi.advanceTimersByTime(29 * 86_400_000)
    const recent = system()
    history.remove(recent)
    vi.advanceTimersByTime(2 * 86_400_000)
    ws.purgeExpired()
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([recent])
    expect(win.read(`dotui:history:${old}`)).toBeNull()
  })
})

describe("checkpoints", () => {
  const key = (id: string) => `dotui:history:${id}`

  it("skips a state equal to the latest checkpoint or, first, the initial one", async () => {
    const { history, edit } = await load()
    const id = history.newSystem()!
    history.checkpoint(id)
    expect(win.read(key(id))).toBeNull()
    edit(3)
    history.checkpoint(id)
    history.checkpoint(id)
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
  })

  it("keeps the last 20", async () => {
    const { history, edit } = await load()
    const id = history.newSystem()!
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
    history.newSystem()
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
    const { history, radius } = await load()
    const id = history.newSystem()!
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
    const { history, open, radius, system } = await load()
    const id = system()
    history.restore(id, radius(11))
    expect(open().state.radiusPx).toBe(11)
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
    history.undo()
    expect(open().state.radiusPx).toBe(3)
  })

  it("stay with a deleted system and go when it is deleted forever", async () => {
    const { history, ws, system } = await load()
    const id = system()
    history.checkpoint(id)
    history.remove(id)
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
    ws.purge(id)
    expect(win.read(key(id))).toBeNull()
  })

  it("are deleted with a draft left unchanged", async () => {
    const { history, selection, current, edit } = await load()
    edit(3)
    const { id } = current().doc!
    history.checkpoint(id)
    vi.advanceTimersByTime(600)
    edit(ORIGIN_RADIUS)
    selection.select({ kind: "preset", id: "linear" })
    expect(current().key).toBe("preset:linear")
    expect(win.read(key(id))).toBeNull()
  })

  it("leave with an undone fork and come back with its redo", async () => {
    const { history, edit, current } = await load()
    edit(3)
    const { id } = current().doc!
    history.checkpoint(id)
    history.undo()
    expect(win.read(key(id))).toBeNull()
    history.redo()
    expect(history.checkpoints(id).map((c) => c.state.radiusPx)).toEqual([3])
  })
})
