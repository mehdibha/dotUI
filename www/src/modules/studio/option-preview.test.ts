import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { parseState } from "@/modules/studio/axes"

beforeEach(() => {
  installFakeWindow()
  vi.resetModules()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function load() {
  const modality =
    await import("react-aria/private/interactions/useFocusVisible")
  const preview = await import("./option-preview")
  const live = await import("./live")
  const selection = await import("./selection")
  selection.select({ kind: "preset", id: "stripe" })
  const committed = selection.getCurrent().state
  const run = (px: number) => () =>
    selection.edit(parseState({ ...committed, radiusPx: px }))
  const shown = () => live.getLive()?.radiusPx ?? null
  const props = (px: number) => preview.optionPreviewProps(true, run(px))
  /** A pointer moving over the option for `px`. */
  const move = (
    px: number,
    init: { pointerType?: string; buttons?: number } = {},
  ) =>
    props(px).onPointerMove?.({
      pointerType: "mouse",
      buttons: 0,
      ...init,
    } as never)
  const focus = (px: number) => props(px).onFocus?.()
  return {
    modality,
    preview,
    live,
    selection,
    committed,
    run,
    shown,
    move,
    focus,
  }
}

it("gives inline rows nothing: they stay click-only", async () => {
  const { preview, run } = await load()
  expect(preview.optionPreviewProps(false, run(7))).toEqual({})
})

describe("hover", () => {
  it("previews once the moving pointer settles, committing nothing", async () => {
    const { selection, committed, shown, move } = await load()
    move(7)
    vi.advanceTimersByTime(49)
    move(7)
    vi.advanceTimersByTime(49)
    expect(shown()).toBeNull()
    vi.advanceTimersByTime(1)
    expect(shown()).toBe(7)
    expect(selection.getCurrent().state).toEqual(committed)
  })

  it("follows a pen, and the newest option wins", async () => {
    const { shown, move } = await load()
    move(7, { pointerType: "pen" })
    move(6, { pointerType: "pen" })
    vi.runAllTimers()
    expect(shown()).toBe(6)
  })

  it("ignores touch, and a pressed pointer dragging over it", async () => {
    const { shown, move } = await load()
    move(7, { pointerType: "touch" })
    move(7, { buttons: 1 })
    vi.runAllTimers()
    expect(shown()).toBeNull()
  })
})

describe("keyboard", () => {
  it("previews keyboard focus once it settles, never pointer focus", async () => {
    const { modality, shown, focus } = await load()
    modality.setInteractionModality("pointer")
    focus(6)
    vi.runAllTimers()
    expect(shown()).toBeNull()
    modality.setInteractionModality("keyboard")
    focus(7)
    expect(shown()).toBeNull()
    vi.runAllTimers()
    expect(shown()).toBe(7)
  })
})

describe("popover", () => {
  it("drops the preview at once as the pointer leaves, and any about to show", async () => {
    const { preview, shown, move } = await load()
    move(7)
    vi.runAllTimers()
    preview.popoverPreviewProps.onPointerLeave()
    expect(shown()).toBeNull()
    move(6)
    preview.popoverPreviewProps.onPointerLeave()
    vi.runAllTimers()
    expect(shown()).toBeNull()
  })

  it("drops the preview as it closes", async () => {
    const { preview, shown, move } = await load()
    const close = preview.popoverPreviewProps.ref()
    move(7)
    vi.runAllTimers()
    close()
    expect(shown()).toBeNull()
  })

  it("keeps a drag's preview the pointer carries out of it", async () => {
    const { preview, live, run, shown } = await load()
    live.previewNow(run(7))
    preview.popoverPreviewProps.onPointerLeave()
    expect(shown()).toBe(7)
  })
})
