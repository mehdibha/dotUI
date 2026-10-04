import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"

const ORIGIN = getPreset("origin")!
const LINEAR = getPreset("linear")!
const STRIPE = getPreset("stripe")!

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
  const selection = await import("./selection")
  const ws = await import("./workspace")
  const { toastManager } = await import("@/registry/ui/toast")
  const toasts = vi.spyOn(toastManager, "add")
  const current = () => selection.getCurrent()
  const radius = (px: number) =>
    parseState({ ...current().state, radiusPx: px })
  const edit = (px: number) => selection.edit(radius(px))
  /** A new system from Origin, current, edited once. */
  const system = (name = "Untitled") => {
    const doc = ws.create({ name, from: ORIGIN.id, state: ORIGIN.state })!
    selection.select({ kind: "system", id: doc.id })
    edit(3)
    return doc.id
  }
  return { selection, ws, toasts, current, radius, edit, system }
}

describe("current", () => {
  it("is stored only off Origin, so the docs veil nothing for it", async () => {
    const { selection, system } = await load()
    selection.select({ kind: "preset", id: "linear" })
    expect(win.read("dotui:current")).not.toBeNull()
    selection.select({ kind: "preset", id: "origin" })
    expect(win.read("dotui:current")).toBeNull()
    selection.remove(system())
    expect(win.read("dotui:current")).toBeNull()
  })
})

describe("unsaved slot", () => {
  it("writes nothing until a view is edited", async () => {
    const { selection, current } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    expect(current().name).toBe("Stripe")
    expect(win.read("dotui:design-systems")).toBeNull()
  })

  it("fills on a view's first edit, without a system or a toast", async () => {
    const { selection, ws, toasts, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    edit(4)
    expect(current()).toMatchObject({
      key: "unsaved",
      name: "Stripe (unsaved)",
      swatch: STRIPE.swatch,
      content: { name: "Stripe (edited)" },
    })
    expect(ws.getWorkspace().unsaved).toMatchObject({
      from: { kind: "preset", id: "stripe" },
      state: { radiusPx: 4 },
    })
    expect(ws.getWorkspace().systems).toEqual([])
    expect(toasts).not.toHaveBeenCalled()
  })

  it("is named after its view", async () => {
    const { selection, current, radius, edit } = await load()
    edit(3)
    expect(current().name).toBe("Origin (unsaved)")
    selection.select({
      kind: "link",
      id: "abcdefghij",
      name: "Acme",
      state: radius(2),
    })
    edit(4)
    expect(current().name).toBe("Acme (unsaved)")
  })

  it("empties when an edit lands back on the view", async () => {
    const { selection, ws, current, radius, edit } = await load()
    edit(3)
    selection.edit(radius(ORIGIN.state.radiusPx))
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("is discarded silently on leaving, even for its own view", async () => {
    const { selection, ws, toasts, current, radius, edit, system } =
      await load()
    const id = system()
    const leaves = [
      () => selection.select({ kind: "preset", id: "linear" }),
      () => selection.select({ kind: "preset", id: "stripe" }),
      () => selection.select({ kind: "system", id }),
      () =>
        selection.select({
          kind: "link",
          id: "abcdefghij",
          name: "Acme",
          state: radius(2),
        }),
    ]
    for (const leave of leaves) {
      selection.select({ kind: "preset", id: "linear" })
      edit(5)
      expect(current().key).toBe("unsaved")
      leave()
      expect(current().key).not.toBe("unsaved")
      expect(ws.getWorkspace().unsaved).toBeUndefined()
    }
    expect(current().state.radiusPx).toBe(2)
    selection.select({ kind: "preset", id: "linear" })
    expect(current().state).toEqual(LINEAR.state)
    expect(toasts).not.toHaveBeenCalled()
  })

  it("is discarded by creating a system from something else", async () => {
    const { selection, ws, current, edit } = await load()
    selection.select({ kind: "preset", id: "linear" })
    edit(3)
    const doc = selection.createFrom("Mine", { kind: "preset", id: "stripe" })!
    expect(current().doc?.id).toBe(doc.id)
    expect(doc.state).toEqual(STRIPE.state)
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("saves as a system", async () => {
    const { selection, ws, current, edit } = await load()
    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    expect(ws.saveName(ws.getWorkspace().unsaved!.from)).toBe("My Stripe")
    const doc = selection.createFrom("My Stripe", { kind: "unsaved" })!
    expect(doc).toMatchObject({
      name: "My Stripe",
      from: "stripe",
      state: { radiusPx: 3 },
    })
    expect(current().doc?.id).toBe(doc.id)
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    edit(4)
    expect(ws.findSystem(doc.id)!.state.radiusPx).toBe(4)
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("names an edited link once: never (edited) (edited)", async () => {
    const { selection, ws, current, radius } = await load()
    selection.select({
      kind: "link",
      id: "abcdefghij",
      name: "Linear (edited)",
      state: radius(2),
    })
    selection.edit(radius(3))
    expect(current().name).toBe("Linear (unsaved)")
    expect(current().content?.name).toBe("Linear (edited)")
    expect(ws.saveName(ws.getWorkspace().unsaved!.from)).toBe("My Linear")
  })

  it("suggests unique names: Untitled from Origin, never My My", async () => {
    const { ws, radius } = await load()
    expect(ws.saveName({ kind: "preset", id: "origin" })).toBe("Untitled")
    ws.create({ name: "My Linear", state: radius(3) })
    expect(ws.saveName({ kind: "preset", id: "linear" })).toBe("My Linear 2")
    const link = { kind: "link", id: "abcdefghij", state: radius(2) } as const
    expect(ws.saveName({ ...link, name: "My Brand" })).toBe("My Brand")
    expect(ws.saveName({ ...link, name: "Acme" })).toBe("My Acme")
    const long =
      "Northwind Enterprise Platform Design Language Extended Edition"
    expect(ws.saveName({ ...link, name: long })).toBe(
      "My Northwind Enterprise Platform Design Language Extended",
    )
  })

  it("stays after a reload", async () => {
    const first = await load()
    first.selection.select({ kind: "preset", id: "linear" })
    first.edit(3)
    vi.advanceTimersByTime(600)
    vi.resetModules()
    const { current } = await load()
    expect(current()).toMatchObject({
      key: "unsaved",
      name: "Linear (unsaved)",
      state: { radiusPx: 3 },
    })
  })

  it("follows another tab's slot, and its leaving", async () => {
    const { ws, current, radius, edit } = await load()
    ws.subscribe(() => {})
    edit(3)
    vi.advanceTimersByTime(600)
    const stored = JSON.parse(win.read("dotui:design-systems")!)
    stored.unsaved.state = radius(7)
    win.otherTab("dotui:design-systems", JSON.stringify(stored))
    expect(current().state.radiusPx).toBe(7)
    win.otherTab(
      "dotui:current",
      JSON.stringify({ kind: "preset", id: "origin" }),
    )
    delete stored.unsaved
    win.otherTab("dotui:design-systems", JSON.stringify(stored))
    expect(current().key).toBe("preset:origin")
    expect(ws.getWorkspace().unsaved).toBeUndefined()
  })

  it("never leaves another tab on a slot that's gone", async () => {
    const { selection, radius, edit } = await load()
    const dangling: string[] = []
    for (const write of [
      win.localStorage.setItem,
      win.localStorage.removeItem,
    ]) {
      const impl = write.getMockImplementation()!
      write.mockImplementation((...args: [string, string]) => {
        impl(...args)
        const stored = JSON.parse(win.read("dotui:design-systems") ?? "{}")
        if (
          win.read("dotui:current") === '{"kind":"unsaved"}' &&
          !stored.unsaved
        )
          dangling.push(args[0])
      })
    }
    const leaves = [
      () => selection.reset(),
      () => selection.select({ kind: "preset", id: "stripe" }),
      () => selection.createFrom("Mine", { kind: "unsaved" }),
      () => selection.edit(radius(LINEAR.state.radiusPx)),
    ]
    for (const leave of leaves) {
      selection.select({ kind: "preset", id: "linear" })
      edit(3)
      vi.advanceTimersByTime(600)
      leave()
      vi.advanceTimersByTime(600)
    }
    expect(dangling).toEqual([])
  })

  it("never writes over stored systems it can't read", async () => {
    win.seed("dotui:design-systems", "not json {{{")
    const { toasts, current, edit } = await load()
    edit(3)
    expect(current().state.radiusPx).toBe(3)
    expect(toasts.mock.calls.map(([toast]) => toast.title)).toEqual([
      "Your saved design systems can't be read",
    ])
    expect(win.read("dotui:design-systems")).toBe("not json {{{")
  })
})

describe("reset", () => {
  it("returns the slot to its untouched view, silently", async () => {
    const { selection, ws, toasts, current, radius, edit } = await load()
    selection.select({ kind: "preset", id: "linear" })
    edit(3)
    selection.reset()
    expect(current().key).toBe("preset:linear")
    expect(current().state).toEqual(LINEAR.state)
    expect(ws.getWorkspace().unsaved).toBeUndefined()

    const link = {
      kind: "link",
      id: "abcdefghij",
      name: "Acme",
      state: radius(2),
    } as const
    selection.select(link)
    edit(4)
    selection.reset()
    expect(current()).toMatchObject({
      key: "link:abcdefghij",
      state: { radiusPx: 2 },
    })
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    expect(toasts).not.toHaveBeenCalled()
  })

  it("leaves a saved system and an untouched view alone", async () => {
    const { selection, ws, current, system } = await load()
    const id = system()
    selection.reset()
    expect(current().doc?.id).toBe(id)
    expect(ws.findSystem(id)!.state.radiusPx).toBe(3)
    selection.select({ kind: "preset", id: "stripe" })
    selection.reset()
    expect(current().key).toBe("preset:stripe")
  })
})

describe("start from", () => {
  it("creates a system from a preset, a system or what's on screen", async () => {
    const { selection, ws, current, edit } = await load()
    const linear = selection.createFrom("A", { kind: "preset", id: "linear" })!
    expect(linear).toMatchObject({ name: "A", from: "linear" })
    expect(linear.state).toEqual(LINEAR.state)
    expect(current().doc?.id).toBe(linear.id)
    const copy = selection.createFrom("B", { kind: "system", id: linear.id })!
    expect(copy).toMatchObject({ from: "linear", state: linear.state })

    selection.select({ kind: "preset", id: "stripe" })
    edit(3)
    const saved = selection.createFrom("C", current().sel)!
    expect(saved).toMatchObject({ from: "stripe", state: { radiusPx: 3 } })
    expect(ws.getWorkspace().unsaved).toBeUndefined()
    expect(ws.getWorkspace().systems.map((s) => s.name)).toEqual([
      "A",
      "B",
      "C",
    ])
  })

  it("creates nothing from a source gone meanwhile", async () => {
    const { selection, ws } = await load()
    expect(
      selection.createFrom("A", { kind: "system", id: "gone" }),
    ).toBeUndefined()
    expect(selection.createFrom("B", { kind: "unsaved" })).toBeUndefined()
    expect(ws.getWorkspace().systems).toEqual([])
  })
})

describe("delete", () => {
  it("deletes the current system to the next one, else the Origin view", async () => {
    const { selection, ws, toasts, current, system } = await load()
    const first = system()
    const second = system()
    selection.remove(second)
    const undo = toasts.mock.calls.at(-1)![0].actionProps!.onClick!
    expect(current().doc?.id).toBe(first)
    selection.remove(first)
    expect(current().key).toBe("preset:origin")
    undo({} as never)
    expect(current().doc?.id).toBe(second)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([second])
  })

  it("never leaves another tab on a system that's gone", async () => {
    const { selection, system } = await load()
    const first = system()
    const second = system()
    const dangling: string[] = []
    const write = win.localStorage.setItem
    const impl = write.getMockImplementation()!
    write.mockImplementation((...args: [string, string]) => {
      impl(...args)
      const { kind, id } = JSON.parse(win.read("dotui:current") ?? "{}")
      const stored = JSON.parse(win.read("dotui:design-systems") ?? "{}")
      const ids = (stored.systems ?? []).map((s: { id: string }) => s.id)
      if (kind === "system" && !ids.includes(id)) dangling.push(args[0])
    })
    selection.select({ kind: "system", id: second })
    selection.remove(second)
    vi.advanceTimersByTime(600)
    selection.remove(first)
    vi.advanceTimersByTime(600)
    expect(dangling).toEqual([])
  })

  it("puts a system back in place from the toast's Undo", async () => {
    const { selection, ws, toasts, current, system } = await load()
    const first = system()
    const second = system()
    selection.select({ kind: "system", id: first })
    selection.remove(second)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([first])
    const toast = toasts.mock.calls.at(-1)![0]
    expect(toast).toMatchObject({ title: "Deleted “Untitled 2”" })
    toast.actionProps!.onClick!({} as never)
    expect(ws.getWorkspace().systems.map((s) => s.id)).toEqual([first, second])
    expect(current().doc?.id).toBe(first)
  })
})
