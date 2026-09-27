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
  /** One of the user's systems, current. */
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

  it("drops the stack instead of undoing over another tab's edit", async () => {
    const { history, ws, open, radius, edit, system } = await load()
    const id = system()
    edit(4)
    ws.setState(id, radius(9))
    history.undo()
    expect(open().state.radiusPx).toBe(9)
    history.undo()
    expect(open().state.radiusPx).toBe(9)
  })
})

describe("views and forks", () => {
  it("writes nothing until a view is edited", async () => {
    const { selection, current } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    expect(current().tag).toBe("Preset")
    expect(win.read("dotui:design-systems")).toBeNull()
  })

  it("forks the first edit of a view into My <name>, one step with its drag", async () => {
    const { history, ws, selection, current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    selection.select({ kind: "preset", id: "stripe" })
    history.setPressed(true)
    edit(3)
    vi.advanceTimersByTime(2000)
    edit(4)
    history.setPressed(false)
    const fork = current().doc!
    expect(fork).toMatchObject({ name: "My Stripe", from: "stripe" })
    expect(fork.state.radiusPx).toBe(4)
    expect(add).toHaveBeenCalledWith({
      title: `Saved as "My Stripe" in this browser.`,
    })

    history.undo()
    expect(current().doc?.id).toBe(fork.id)
    expect(current().state).toEqual(getPreset("stripe")!.state)
    history.redo()
    expect(current().state.radiusPx).toBe(4)
    expect(ws.getWorkspace().systems).toHaveLength(1)
  })

  it("names forks uniquely: Untitled from Origin, never My My", async () => {
    const { selection, current, radius, edit } = await load()
    edit(3)
    expect(current().name).toBe("Untitled")
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    selection.select({ kind: "preset", id: "stripe" })
    edit(5)
    expect(current().name).toBe("My Stripe 2")
    selection.select({
      kind: "shared",
      id: "abc",
      name: "My Brand",
      state: radius(2),
    })
    edit(6)
    expect(current().doc).toMatchObject({ name: "My Brand", from: undefined })
  })

  it("removes a fork left unrenamed and unchanged", async () => {
    const { history, ws, selection, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    history.undo()
    selection.select({ kind: "preset", id: "linear" })
    expect(ws.getWorkspace().systems).toEqual([])
  })

  it("keeps a fork left changed or renamed", async () => {
    const { history, ws, selection, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    const changed = current().doc!.id
    selection.select({ kind: "preset", id: "linear" })
    edit(3)
    const renamed = current().doc!.id
    ws.rename(renamed, "Acme")
    history.undo()
    selection.select({ kind: "preset", id: "origin" })
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([
      changed,
      renamed,
    ])
  })

  it("creates Untitled from any selection; undo never removes it", async () => {
    const { history, ws, selection, current, edit } = await load()
    selection.select({ kind: "preset", id: "linear" })
    const id = history.newSystem()!
    expect(current().doc).toMatchObject({ id, name: "Untitled" })
    ws.rename(id, "Acme")
    edit(3)
    vi.advanceTimersByTime(600)
    edit(4)
    for (let i = 0; i < 5; i++) history.undo()
    expect(current().doc).toMatchObject({ id, name: "Acme" })
    expect(current().state.radiusPx).toBe(ORIGIN_RADIUS)
    expect(ws.getTrash()).toEqual([])
    history.redo()
    history.redo()
    expect(current().state.radiusPx).toBe(4)
  })

  it("leaves the next system alone on undo right after a delete", async () => {
    const { history, ws, selection, current, edit, system } = await load()
    const first = system()
    const second = system()
    selection.select({ kind: "system", id: second })
    edit(9)
    history.remove(second)
    expect(current().doc?.id).toBe(first)
    history.undo()
    history.undo()
    expect(ws.findSystem(first)!.state.radiusPx).toBe(3)
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([second])
  })

  it("leaves the current system alone on undo right after deleting another", async () => {
    const { history, ws, selection, edit, system } = await load()
    const first = system()
    const second = system()
    selection.select({ kind: "system", id: first })
    edit(9)
    history.remove(second)
    history.undo()
    expect(ws.findSystem(first)!.state.radiusPx).toBe(9)
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([second])
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
  it("copies a system as <name> copy, never chaining", async () => {
    const { history, ws, current, system } = await load()
    const id = system()
    ws.rename(id, "Acme")
    const copy = history.duplicate(id)!
    expect(current().doc).toMatchObject({
      name: "Acme copy",
      from: "origin",
    })
    expect(current().state.radiusPx).toBe(3)
    history.duplicate(copy)
    expect(current().name).toBe("Acme copy 2")
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

  it("closes a deleted system's toast once it is restored or purged", async () => {
    const { history, system } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    const close = vi.spyOn(toastManager, "close")
    const first = system()
    const second = system()
    history.remove(first)
    history.recover(first)
    expect(close).toHaveBeenCalledWith(add.mock.results[0]!.value)
    history.remove(second)
    history.purge(second)
    expect(close).toHaveBeenCalledWith(add.mock.results[1]!.value)
  })

  it("purges what was deleted over 30 days ago", async () => {
    const { history, ws, system } = await load()
    const old = system()
    history.remove(old)
    vi.advanceTimersByTime(29 * 86_400_000)
    const recent = system()
    history.remove(recent)
    vi.advanceTimersByTime(2 * 86_400_000)
    ws.purgeExpired()
    expect(ws.getTrash().map((i) => i.doc.id)).toEqual([recent])
  })
})
