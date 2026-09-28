import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"

const ORIGIN = getPreset("origin")!
const ORIGIN_RADIUS = ORIGIN.state.radiusPx

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
  /** A new system from Origin, current. */
  const create = (name = "Untitled") => {
    const doc = ws.create({ name, from: ORIGIN.id, state: ORIGIN.state })!
    selection.select({ kind: "system", id: doc.id })
    return doc.id
  }
  /** One of the user's systems, current, edited once. */
  const system = () => {
    const id = create()
    edit(3)
    vi.advanceTimersByTime(600)
    return id
  }
  return { history, ws, selection, current, open, radius, edit, create, system }
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

  it("never undoes past another tab's edit made between two of its own", async () => {
    const { history, ws, open, radius, edit, system } = await load()
    const id = system()
    ws.setState(id, radius(9))
    vi.advanceTimersByTime(600)
    edit(4)
    history.undo()
    expect(open().state.radiusPx).toBe(9)
    history.undo()
    expect(open().state.radiusPx).toBe(9)
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

  it("never removes or renames a system on undo", async () => {
    const { history, ws, current, edit, create } = await load()
    const id = create("Brand")
    ws.rename(id, "Acme")
    edit(3)
    vi.advanceTimersByTime(600)
    edit(4)
    for (let i = 0; i < 5; i++) history.undo()
    expect(current().doc).toMatchObject({ id, name: "Acme" })
    expect(current().state.radiusPx).toBe(ORIGIN_RADIUS)
    history.redo()
    history.redo()
    expect(current().state.radiusPx).toBe(4)
  })
})

describe("unsaved slot", () => {
  const STRIPE = getPreset("stripe")!

  it("writes nothing until a view is edited", async () => {
    const { selection, current } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    expect(current().name).toBe("Stripe")
    expect(win.read("dotui:design-systems")).toBeNull()
  })

  it("fills on a view's first edit, one step with its drag, and no system", async () => {
    const { history, ws, selection, current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    selection.select({ kind: "preset", id: "stripe" })
    history.setPressed(true)
    edit(3)
    vi.advanceTimersByTime(2000)
    edit(4)
    history.setPressed(false)
    expect(current()).toMatchObject({
      key: "unsaved",
      name: "New system (unsaved)",
      swatch: STRIPE.swatch,
      content: { name: "Stripe (edited)" },
    })
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { kind: "preset", id: "stripe" },
      state: { radiusPx: 4 },
    })
    expect(ws.getWorkspace().systems).toEqual([])
    expect(add).not.toHaveBeenCalled()

    history.undo()
    expect(current().key).toBe("preset:stripe")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    history.redo()
    expect(current().key).toBe("unsaved")
    expect(current().state.radiusPx).toBe(4)
  })

  it("empties when an edit lands back on the view", async () => {
    const { history, ws, current, radius, edit } = await load()
    edit(3)
    vi.advanceTimersByTime(600)
    history.edit(radius(ORIGIN_RADIUS))
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    history.undo()
    expect(current().state.radiusPx).toBe(3)
  })

  it("drops a drag that ends where it began", async () => {
    const { history, ws, current, radius, edit } = await load()
    history.setPressed(true)
    edit(3)
    history.edit(radius(ORIGIN_RADIUS))
    history.setPressed(false)
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    history.undo()
    expect(current().key).toBe("preset:origin")
  })

  it("is replaced by another view's edit, with an Undo toast back", async () => {
    const { history, ws, selection, current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    selection.select({ kind: "preset", id: "linear" })
    edit(5)
    vi.advanceTimersByTime(600)
    edit(6)
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { id: "linear" },
      state: { radiusPx: 6 },
    })
    expect(add).toHaveBeenCalledTimes(1)
    const toast = add.mock.calls[0]![0]
    expect(toast.title).toBe("Replaced unsaved changes")
    toast.actionProps!.onClick!({} as never)
    expect(current().key).toBe("preset:linear")
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { id: "stripe" },
      state: { radiusPx: 3 },
    })
    // The later edits too are one Redo away each.
    history.redo()
    history.redo()
    expect(current().key).toBe("unsaved")
    expect(current().state.radiusPx).toBe(6)
  })

  it("comes back when the edits that replaced it are undone", async () => {
    const { history, ws, selection, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    selection.select({ kind: "preset", id: "linear" })
    edit(5)
    history.undo()
    expect(current().key).toBe("preset:linear")
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { id: "stripe" },
      state: { radiusPx: 3 },
    })
    // Redo replaces it again, and undo puts it back again.
    history.redo()
    expect(ws.getWorkspace().unsaved).toMatchObject({ from: { id: "linear" } })
    history.undo()
    expect(ws.getWorkspace().unsaved).toMatchObject({ from: { id: "stripe" } })
    selection.select({ kind: "unsaved" })
    history.undo()
    expect(current().key).toBe("preset:stripe")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("keeps a chain of replaced edits, with one toast for the latest", async () => {
    const { history, ws, selection, current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    selection.select({ kind: "preset", id: "linear" })
    edit(3)
    selection.select({ kind: "preset", id: "stripe" })
    edit(4)
    selection.select({ kind: "preset", id: "notion" })
    edit(5)
    const toasts = add.mock.calls.map(([toast]) => toast)
    expect(toasts.map((toast) => toast.id)).toEqual([
      "replaced-unsaved",
      "replaced-unsaved",
    ])
    toasts[1]!.actionProps!.onClick!({} as never)
    expect(current().key).toBe("preset:notion")
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { id: "stripe" },
      state: { radiusPx: 4 },
    })
    selection.select({ kind: "unsaved" })
    history.undo()
    expect(current().key).toBe("preset:stripe")
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { id: "linear" },
      state: { radiusPx: 3 },
    })
  })

  it("saves as a system, keeping its undo history", async () => {
    const { history, ws, selection, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    const { unsaved, systems } = ws.getWorkspace()
    expect(history.saveName(unsaved!, systems)).toBe("My Stripe")
    const doc = history.createFrom("My Stripe", { kind: "unsaved" })!
    expect(doc).toMatchObject({ name: "My Stripe", from: "stripe" })
    expect(current().doc?.id).toBe(doc.id)
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    history.undo()
    expect(current().doc?.id).toBe(doc.id)
    expect(current().state).toEqual(STRIPE.state)
  })

  it("names an edited link once: never (edited) (edited)", async () => {
    const { history, ws, selection, current, radius } = await load()
    selection.select({
      kind: "link",
      id: "abcdefghij",
      name: "Linear (edited)",
      state: radius(2),
    })
    history.edit(radius(3))
    expect(current().content?.name).toBe("Linear (edited)")
    const { unsaved, systems } = ws.getWorkspace()
    expect(history.saveName(unsaved!, systems)).toBe("My Linear")
  })

  it("suggests unique names: Untitled from Origin, never My My", async () => {
    const { history, ws, radius } = await load()
    const name = (from: Parameters<typeof history.saveName>[0]["from"]) =>
      history.saveName({ from, state: radius(3) }, ws.getWorkspace().systems)
    expect(name({ kind: "preset", id: "origin" })).toBe("Untitled")
    ws.create({ name: "My Linear", state: radius(3) })
    expect(name({ kind: "preset", id: "linear" })).toBe("My Linear 2")
    const link = { kind: "link", id: "abcdefghij", state: radius(2) } as const
    expect(name({ ...link, name: "My Brand" })).toBe("My Brand")
    expect(name({ ...link, name: "Acme" })).toBe("My Acme")
  })

  it("is discarded with an Undo toast back", async () => {
    const { history, ws, selection, current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    history.discard()
    expect(current().key).toBe("preset:stripe")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    const toast = add.mock.calls.at(-1)![0]
    expect(toast.title).toBe("Discarded unsaved changes")
    toast.actionProps!.onClick!({} as never)
    expect(current().key).toBe("unsaved")
    expect(current().state.radiusPx).toBe(3)
  })

  it("stays after a reload", async () => {
    const first = await load()
    first.edit(3)
    vi.advanceTimersByTime(600)
    vi.resetModules()
    const { current } = await load()
    expect(current().key).toBe("unsaved")
    expect(current().state.radiusPx).toBe(3)
  })

  it("follows another tab's slot, and never undoes over it", async () => {
    const { history, ws, current, radius, edit } = await load()
    ws.subscribe(() => {})
    edit(3)
    vi.advanceTimersByTime(600)
    const stored = JSON.parse(win.read("dotui:design-systems")!)
    stored.unsaved.state = radius(7)
    win.otherTab("dotui:design-systems", JSON.stringify(stored))
    expect(current().state.radiusPx).toBe(7)
    history.undo()
    expect(current().state.radiusPx).toBe(7)
    delete stored.unsaved
    win.otherTab("dotui:design-systems", JSON.stringify(stored))
    win.otherTab(
      "dotui:current",
      JSON.stringify({ kind: "preset", id: "origin" }),
    )
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("never writes over stored systems it can't read", async () => {
    win.seed("dotui:design-systems", "not json {{{")
    const { current, edit } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    edit(3)
    expect(current().state.radiusPx).toBe(3)
    expect(add.mock.calls.map(([toast]) => toast.title)).toEqual([
      "Your saved design systems can't be read",
    ])
    expect(win.read("dotui:design-systems")).toBe("not json {{{")
  })
})

describe("start from", () => {
  it("creates a system from a preset, a system or what's on screen", async () => {
    const { history, ws, selection, current, edit } = await load()
    const linear = history.createFrom("A", { kind: "preset", id: "linear" })!
    expect(linear).toMatchObject({ name: "A", from: "linear" })
    expect(linear.state).toEqual(getPreset("linear")!.state)
    expect(current().doc?.id).toBe(linear.id)
    const copy = history.createFrom("B", { kind: "system", id: linear.id })!
    expect(copy).toMatchObject({ from: "linear", state: linear.state })

    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    history.createFrom("C", { kind: "preset", id: "origin" })
    expect(ws.getWorkspace().unsaved).toBeDefined()
    selection.select({ kind: "unsaved" })
    const saved = history.createFrom("D", current().sel)!
    expect(saved.state.radiusPx).toBe(3)
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    expect(ws.getWorkspace().systems.map((s) => s.name)).toEqual([
      "A",
      "B",
      "C",
      "D",
    ])
  })

  it("creates nothing from a source gone meanwhile", async () => {
    const { history, ws } = await load()
    expect(history.createFrom("A", { kind: "system", id: "gone" })).toBe(
      undefined,
    )
    expect(history.createFrom("B", { kind: "unsaved" })).toBeUndefined()
    expect(ws.getWorkspace().systems).toEqual([])
  })
})

describe("delete", () => {
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
  it("puts a system back in place from the toast's Undo", async () => {
    const { history, ws, selection, current, system } = await load()
    const { toastManager } = await import("@/registry/ui/toast")
    const add = vi.spyOn(toastManager, "add")
    const first = system()
    const second = system()
    selection.select({ kind: "system", id: first })
    history.remove(second)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([first])
    const toast = add.mock.calls.at(-1)![0]
    expect(toast).toMatchObject({ title: "Deleted “Untitled 2”" })
    toast.actionProps!.onClick!({} as never)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([first, second])
    expect(current().doc?.id).toBe(first)
  })
})
