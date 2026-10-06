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

/** Just enough of an element: a parent, and keydown listeners to fire. */
function element(parentElement: Element | null = null) {
  const keydown = new Set<() => void>()
  return {
    parentElement,
    addEventListener: (_: string, fn: () => void) => keydown.add(fn),
    removeEventListener: (_: string, fn: () => void) => keydown.delete(fn),
    pressKey: () => keydown.forEach((fn) => fn()),
  }
}

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
  const shown = () => {
    vi.runAllTimers()
    return live.getLive()?.radiusPx ?? null
  }
  const popover = element()
  const option = element(popover as unknown as Element)
  const focus = (props: ReturnType<typeof preview.optionPreviewProps>) =>
    props.onFocus?.({ currentTarget: option } as never)
  return { modality, preview, live, selection, run, shown, popover, focus }
}

describe("option preview", () => {
  it("gives inline rows nothing: they stay click-only", async () => {
    const { preview, run } = await load()
    expect(preview.optionPreviewProps(false, run(7))).toEqual({})
    expect(preview.optionPreviewProps(true, undefined)).toEqual({})
  })

  it("previews on hover once it settles, committing nothing", async () => {
    const { preview, selection, run, shown } = await load()
    preview.optionPreviewProps(true, run(7)).onHoverStart?.()
    expect(shown()).toBe(7)
    expect(selection.getCurrent().key).toBe("preset:stripe")
  })

  it("skips the focus a popover opens on, until a key goes down in it", async () => {
    const { modality, preview, run, shown, popover, focus } = await load()
    const stop = preview.watchPopover(popover as unknown as HTMLElement)
    modality.setInteractionModality("keyboard")
    focus(preview.optionPreviewProps(true, run(7)))
    expect(shown()).toBeNull()
    popover.pressKey()
    focus(preview.optionPreviewProps(true, run(7)))
    expect(shown()).toBe(7)
    stop?.()
  })

  it("previews no focus that came from the pointer", async () => {
    const { modality, preview, run, shown, popover, focus } = await load()
    preview.watchPopover(popover as unknown as HTMLElement)
    popover.pressKey()
    modality.setInteractionModality("pointer")
    focus(preview.optionPreviewProps(true, run(7)))
    expect(shown()).toBeNull()
  })

  it("drops the preview on close, and disarms the keyboard", async () => {
    const { modality, preview, run, shown, popover, focus } = await load()
    const stop = preview.watchPopover(popover as unknown as HTMLElement)
    popover.pressKey()
    modality.setInteractionModality("keyboard")
    focus(preview.optionPreviewProps(true, run(7)))
    expect(shown()).toBe(7)
    stop?.()
    expect(shown()).toBeNull()
    preview.watchPopover(popover as unknown as HTMLElement)
    focus(preview.optionPreviewProps(true, run(6)))
    expect(shown()).toBeNull()
  })
})
