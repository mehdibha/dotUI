import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { listenDesignSystemMessages } from "./iframe-sync"
import type { DesignSystemMessage } from "./iframe-sync"
import type { DesignSystem } from "./types"

const ORIGIN = "https://dotui.test"
const attributes = new Set<string>()

beforeEach(() => {
  attributes.clear()
  vi.useFakeTimers()
  vi.stubGlobal(
    "window",
    Object.assign(new EventTarget(), { location: { origin: ORIGIN } }),
  )
  vi.stubGlobal("document", {
    documentElement: {
      offsetHeight: 0,
      setAttribute: (name: string) => attributes.add(name),
      removeAttribute: (name: string) => attributes.delete(name),
      hasAttribute: (name: string) => attributes.has(name),
    },
  })
  vi.stubGlobal("requestAnimationFrame", (fn: () => void) => setTimeout(fn, 16))
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const system = (radius: string): DesignSystem => ({
  componentParams: {},
  tokens: { "--radius": radius },
  density: "default",
})

function post(radius: string, live = true) {
  window.dispatchEvent(
    Object.assign(new Event("message"), {
      origin: ORIGIN,
      data: { type: "design-system", data: system(radius), live },
    }),
  )
}

/** Each message's preparation, held until the test resolves it. */
function deferred() {
  const held = new Map<string, () => void>()
  const prepare = (
    { data }: DesignSystemMessage,
    ready: (prepared: string) => void,
  ) => {
    const radius = data.tokens["--radius"]!
    held.set(radius, () => ready(`prepared ${radius}`))
  }
  return { prepare, resolve: (radius: string) => held.get(radius)!() }
}

const applied = (apply: ReturnType<typeof vi.fn>) =>
  apply.mock.calls.map(([data, prepared]) => [
    (data as DesignSystem).tokens["--radius"],
    prepared,
  ])

describe("listenDesignSystemMessages", () => {
  it("applies only the newest message, in the next frame", () => {
    const apply = vi.fn()
    listenDesignSystemMessages((_, ready) => ready("now"), apply)
    post("1px")
    post("2px")
    post("3px")
    expect(apply).not.toHaveBeenCalled()
    vi.advanceTimersByTime(16)
    expect(applied(apply)).toEqual([["3px", "now"]])
  })

  it("never lets an older message's late preparation replace a newer one", () => {
    const apply = vi.fn()
    const { prepare, resolve } = deferred()
    listenDesignSystemMessages(prepare, apply)
    post("1px")
    post("2px")
    resolve("2px")
    vi.advanceTimersByTime(16)
    resolve("1px")
    vi.advanceTimersByTime(100)
    expect(applied(apply)).toEqual([["2px", "prepared 2px"]])
  })

  it("applies a late preparation while a newer one is still on its way", () => {
    const apply = vi.fn()
    const { prepare, resolve } = deferred()
    listenDesignSystemMessages(prepare, apply)
    post("1px")
    post("2px")
    resolve("1px")
    vi.advanceTimersByTime(16)
    resolve("2px")
    vi.advanceTimersByTime(16)
    expect(applied(apply)).toEqual([
      ["1px", "prepared 1px"],
      ["2px", "prepared 2px"],
    ])
  })

  it("turns transitions off while live, and back on a frame after the commit", () => {
    listenDesignSystemMessages((_, ready) => ready(null), vi.fn())
    post("1px", true)
    vi.advanceTimersByTime(16)
    expect(attributes.has("data-studio-live")).toBe(true)
    post("1px", false)
    vi.advanceTimersByTime(16)
    expect(attributes.has("data-studio-live")).toBe(true)
    vi.advanceTimersByTime(16)
    expect(attributes.has("data-studio-live")).toBe(false)
  })

  it("ignores preparations that finish after the listener stops", () => {
    const apply = vi.fn()
    const { prepare, resolve } = deferred()
    const stop = listenDesignSystemMessages(prepare, apply)
    post("1px")
    stop()
    resolve("1px")
    vi.advanceTimersByTime(100)
    expect(apply).not.toHaveBeenCalled()
  })

  it("ignores other origins", () => {
    const apply = vi.fn()
    listenDesignSystemMessages((_, ready) => ready(null), apply)
    window.dispatchEvent(
      Object.assign(new Event("message"), {
        origin: "https://elsewhere.test",
        data: { type: "design-system", data: system("1px"), live: true },
      }),
    )
    vi.advanceTimersByTime(100)
    expect(apply).not.toHaveBeenCalled()
  })
})
