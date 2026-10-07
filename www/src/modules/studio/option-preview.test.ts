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

interface FakeElement {
  parentElement: FakeElement | null
  contains: (node: unknown) => boolean
  addEventListener: (type: string, fn: (e: unknown) => void) => void
  removeEventListener: (type: string, fn: (e: unknown) => void) => void
  fire: (type: string, e: unknown) => void
}

/** Just enough of an element: a parent, containment and listeners. */
function element(parentElement: FakeElement | null = null): FakeElement {
  const listeners = new Map<string, Set<(e: unknown) => void>>()
  const el: FakeElement = {
    parentElement,
    contains: (node) => {
      for (let n = node as FakeElement | null; n; n = n.parentElement)
        if (n === el) return true
      return false
    },
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)?.add(fn)
    },
    removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
    fire: (type, e) => listeners.get(type)?.forEach((fn) => fn(e)),
  }
  return el
}

/** A keydown as the window's capture phase sees it. */
function press(key: string, target: unknown) {
  const e = Object.assign(new Event("keydown"), { key })
  Object.defineProperty(e, "target", { value: target })
  window.dispatchEvent(e)
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
  const option = element(popover)
  const other = element(popover)
  const stop = preview.watchPopover(popover as unknown as HTMLElement)
  const props = (px: number) => preview.optionPreviewProps(true, run(px))
  /** `props` from a render that committed on `target`. */
  const rendered = (target: FakeElement, px: number) => {
    const next = props(px)
    next.ref?.(target as unknown as Element)
    return next
  }
  const on = (target: FakeElement) =>
    ({ target, currentTarget: target }) as never
  const move = (pointerType = "mouse") =>
    popover.fire("pointermove", { pointerType })
  modality.setInteractionModality("keyboard")
  return {
    modality,
    preview,
    run,
    shown,
    popover,
    option,
    other,
    stop,
    props,
    rendered,
    on,
    move,
  }
}

describe("option preview", () => {
  it("gives inline rows nothing: they stay click-only", async () => {
    const { preview, run } = await load()
    expect(preview.optionPreviewProps(false, run(7))).toEqual({})
    expect(preview.optionPreviewProps(true, undefined)).toEqual({})
  })

  it("drops the preview on close", async () => {
    const { shown, option, stop, props, on, move } = await load()
    move()
    props(7).onHoverStart?.(on(option))
    expect(shown()).toBe(7)
    stop?.()
    expect(shown()).toBeNull()
  })
})

describe("hover", () => {
  it("previews once it settles, committing nothing", async () => {
    const { shown, option, props, on, move } = await load()
    move()
    props(7).onHoverStart?.(on(option))
    expect(shown()).toBe(7)
  })

  it("waits for the pointer to move: a popover opens under a still one", async () => {
    const { shown, option, rendered, on, move } = await load()
    rendered(option, 7).onHoverStart?.(on(option))
    expect(shown()).toBeNull()
    move("touch")
    expect(shown()).toBeNull()
    move()
    expect(shown()).toBe(7)
  })

  it("replays what the option commits now, not what it did when hovered", async () => {
    const { shown, option, rendered, on, move } = await load()
    rendered(option, 7).onHoverStart?.(on(option))
    rendered(option, 9)
    move()
    expect(shown()).toBe(9)
  })

  it("forgets the option the pointer left before moving", async () => {
    const { shown, option, props, on, move } = await load()
    props(7).onHoverStart?.(on(option))
    props(7).onHoverEnd?.(on(option))
    move()
    expect(shown()).toBeNull()
  })
})

describe("keyboard", () => {
  it("skips the focus a popover opens on, until a key navigates in it", async () => {
    const { shown, option, other, props, on } = await load()
    props(7).onFocus?.(on(option))
    expect(shown()).toBeNull()
    press("Shift", option)
    press("ArrowDown", element())
    props(6).onFocus?.(on(other))
    expect(shown()).toBeNull()
    press("ArrowDown", option)
    props(6).onFocus?.(on(other))
    expect(shown()).toBe(6)
  })

  it("arms on typeahead too", async () => {
    const { shown, option, props, on } = await load()
    press("f", option)
    props(7).onFocus?.(on(option))
    expect(shown()).toBe(7)
  })

  it("previews no focus that Tab or the pointer moved", async () => {
    const { modality, shown, option, other, props, on } = await load()
    press("ArrowDown", option)
    press("Tab", option)
    props(7).onFocus?.(on(other))
    expect(shown()).toBeNull()
    press("ArrowDown", option)
    modality.setInteractionModality("pointer")
    props(7).onFocus?.(on(other))
    expect(shown()).toBeNull()
  })

  it("withdraws a focus preview as focus leaves, unless the next replaces it", async () => {
    const { shown, option, other, props, on } = await load()
    press("ArrowDown", option)
    props(7).onFocus?.(on(option))
    expect(shown()).toBe(7)
    props(7).onBlur?.(on(option))
    props(6).onFocus?.(on(other))
    expect(shown()).toBe(6)
    press("Tab", other)
    props(6).onBlur?.(on(other))
    expect(shown()).toBeNull()
  })

  it("leaves a hover's preview alone when focus leaves", async () => {
    const { shown, option, other, props, on, move } = await load()
    press("ArrowDown", option)
    props(7).onFocus?.(on(option))
    move()
    props(6).onHoverStart?.(on(other))
    props(7).onBlur?.(on(option))
    expect(shown()).toBe(6)
  })

  it("previews a virtual highlight only once a key navigates", async () => {
    const { preview, run, shown, option } = await load()
    const target = option as unknown as Element
    expect(preview.highlightPreview(target, run(7))).toBeUndefined()
    expect(shown()).toBeNull()
    press("ArrowDown", option)
    const leave = preview.highlightPreview(target, run(7))
    expect(shown()).toBe(7)
    leave?.()
    expect(shown()).toBeNull()
  })
})
