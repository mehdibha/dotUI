import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
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

/** A pointer event, as the window's capture phase sees it. */
const pointer = (
  type: "pointerdown" | "pointerup" | "lostpointercapture",
  pointerId = 1,
) => window.dispatchEvent(Object.assign(new Event(type), { pointerId }))

async function load() {
  const live = await import("./live")
  const selection = await import("./selection")
  selection.select({ kind: "preset", id: "stripe" })
  const committed = selection.getCurrent().state
  const radius = (px: number) => parseState({ ...committed, radiusPx: px })
  /** What a control's onChange does: commit through edit(). */
  const onChange = (px: number) => () => selection.edit(radius(px))
  const shown = () => live.getLive()?.radiusPx ?? null
  const listener = vi.fn<() => void>()
  live.subscribeLive(listener)
  pointer("pointerdown")
  return { live, selection, committed, radius, onChange, shown, listener }
}

describe("capture", () => {
  it("shows what the edit would commit, and commits nothing", async () => {
    const { live, selection, committed, onChange, shown } = await load()
    live.previewNow(onChange(7))
    expect(shown()).toBe(7)
    expect(selection.getCurrent()).toMatchObject({
      key: "preset:stripe",
      state: committed,
    })
    expect(win.read("dotui:design-systems")).toBeNull()
  })

  it("clears when the edit lands back on the committed state", async () => {
    const { live, committed, onChange, shown } = await load()
    live.previewNow(onChange(7))
    live.previewNow(onChange(committed.radiusPx))
    expect(shown()).toBeNull()
  })

  it("does nothing when the run doesn't edit", async () => {
    const { live, listener, shown } = await load()
    live.previewNow(() => {})
    live.previewSettled(() => {})
    vi.runAllTimers()
    expect(shown()).toBeNull()
    expect(listener).not.toHaveBeenCalled()
  })

  it("notifies once per change: an equal state is a repeat", async () => {
    const { live, listener, onChange } = await load()
    live.previewNow(onChange(7))
    live.previewNow(onChange(7))
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe("settle", () => {
  it("shows after the settle, and the newest preview wins", async () => {
    const { live, onChange, shown } = await load()
    live.previewSettled(onChange(5))
    vi.advanceTimersByTime(49)
    expect(shown()).toBeNull()
    live.previewSettled(onChange(6))
    vi.advanceTimersByTime(49)
    expect(shown()).toBeNull()
    vi.advanceTimersByTime(1)
    expect(shown()).toBe(6)
  })

  it("is cancelled by clearLive and replaced by an immediate show", async () => {
    const { live, radius, onChange, shown } = await load()
    live.previewSettled(onChange(5))
    live.clearLive()
    vi.runAllTimers()
    expect(shown()).toBeNull()
    live.showLive(radius(4), { settle: true })
    live.showLive(radius(3))
    vi.runAllTimers()
    expect(shown()).toBe(3)
  })
})

describe("commit", () => {
  it("clears the preview", async () => {
    const { live, selection, onChange, shown } = await load()
    live.previewNow(onChange(7))
    onChange(7)()
    expect(shown()).toBeNull()
    expect(selection.getCurrent().state.radiusPx).toBe(7)
  })

  it("clears it on release at the committed value, committing nothing", async () => {
    const { live, selection, committed, onChange, shown } = await load()
    live.previewNow(onChange(7))
    onChange(committed.radiusPx)()
    expect(shown()).toBeNull()
    expect(selection.getCurrent().key).toBe("preset:stripe")
  })

  it("is cleared by a selection, even of the current one", async () => {
    const { live, selection, radius, shown } = await load()
    live.showLive(radius(7))
    selection.select({ kind: "preset", id: "stripe" })
    expect(shown()).toBeNull()
    live.showLive(radius(7))
    selection.select({ kind: "preset", id: "linear" })
    expect(shown()).toBeNull()
  })
})

describe("drag", () => {
  it("holds the preview against settled ones until it ends", async () => {
    const { live, onChange, shown } = await load()
    live.previewNow(onChange(7))
    live.previewSettled(onChange(5))
    live.showLive(null, { settle: true })
    vi.runAllTimers()
    expect(shown()).toBe(7)
    onChange(7)()
    live.previewSettled(onChange(5))
    vi.runAllTimers()
    expect(shown()).toBe(5)
  })

  it("drops when the pointer lifts without a commit", async () => {
    const { live, onChange, shown } = await load()
    live.previewNow(onChange(7))
    pointer("pointerup")
    expect(shown()).toBe(7)
    vi.runAllTimers()
    expect(shown()).toBeNull()
    live.previewSettled(onChange(5))
    vi.runAllTimers()
    expect(shown()).toBe(5)
  })

  it("holds while another pointer lifts", async () => {
    const { live, onChange, shown } = await load()
    live.previewNow(onChange(7))
    pointer("pointerdown", 2)
    pointer("pointerup", 2)
    vi.runAllTimers()
    expect(shown()).toBe(7)
    pointer("pointerup")
    vi.runAllTimers()
    expect(shown()).toBeNull()
  })

  it("commits a step made without a pointer: keys, assistive tech", async () => {
    const { live, selection, onChange, shown } = await load()
    pointer("pointerup")
    live.previewNow(onChange(7))
    expect(shown()).toBeNull()
    expect(selection.getCurrent().state.radiusPx).toBe(7)
    live.previewSettled(onChange(5))
    vi.runAllTimers()
    expect(shown()).toBe(5)
  })

  it.each(["contextmenu", "blur", "visibilitychange"])(
    "forgets the pressed pointers on %s, whose release can go missing",
    async (type) => {
      const { live, selection, onChange, shown } = await load()
      live.previewNow(onChange(7))
      window.dispatchEvent(new Event(type))
      vi.runAllTimers()
      expect(shown()).toBeNull()
      live.previewNow(onChange(5))
      expect(shown()).toBeNull()
      expect(selection.getCurrent().state.radiusPx).toBe(5)
    },
  )

  it("forgets a pointer whose capture is lost", async () => {
    const { live, selection, onChange } = await load()
    pointer("lostpointercapture")
    live.previewNow(onChange(5))
    expect(selection.getCurrent().state.radiusPx).toBe(5)
  })

  it("tells a drag's preview, and the commit ending it, from the rest", async () => {
    const { live, onChange } = await load()
    live.previewNow(onChange(7))
    expect(live.isDragPreview()).toBe(true)
    onChange(7)()
    expect(live.isDragPreview()).toBe(true)
    live.previewSettled(onChange(5))
    vi.runAllTimers()
    expect(live.getLive()?.radiusPx).toBe(5)
    expect(live.isDragPreview()).toBe(false)
    live.previewNow(onChange(6))
    pointer("pointerup")
    vi.runAllTimers()
    expect(live.getLive()).toBeNull()
    expect(live.isDragPreview()).toBe(true)
    onChange(4)()
    expect(live.isDragPreview()).toBe(false)
  })

  it("keeps its preview when the committed design changes elsewhere", async () => {
    const { live, onChange, shown } = await load()
    live.previewNow(onChange(7))
    live.clearSettled()
    expect(shown()).toBe(7)
    onChange(7)()
    live.previewSettled(onChange(5))
    vi.runAllTimers()
    live.clearSettled()
    expect(shown()).toBeNull()
  })
})

describe("picker", () => {
  it("previews the row pointed at once it settles; null drops it", async () => {
    const { live, selection } = await load()
    const { getWorkspace } = await import("./workspace")
    const linear = selection.describe(
      { kind: "preset", id: "linear" },
      getWorkspace(),
    ).state
    selection.previewSelection("preset:linear")
    expect(live.getLive()).toBeNull()
    vi.runAllTimers()
    expect(live.getLive()).toEqual(linear)
    expect(selection.getCurrent().key).toBe("preset:stripe")
    selection.previewSelection(null)
    expect(live.getLive()).toBeNull()
  })

  it("previews nothing for the design already on screen", async () => {
    const { live, selection, radius } = await load()
    live.showLive(radius(7))
    selection.previewSelection("preset:stripe")
    vi.runAllTimers()
    expect(live.getLive()).toBeNull()
  })
})
