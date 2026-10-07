import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { listenDesignSystemMessages } from "./iframe-sync"
import type { ApplyDesignSystem, DesignSystemMessage } from "./iframe-sync"
import type { DesignSystem } from "./types"

const { lanes } = vi.hoisted(() => ({ lanes: [] as string[] }))
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>()
  return {
    ...actual,
    startTransition: (fn: () => void) => {
      lanes.push("transition")
      fn()
    },
  }
})
vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>()
  return {
    ...actual,
    flushSync: (fn: () => void) => {
      lanes.push("sync")
      fn()
    },
  }
})

const ORIGIN = "https://dotui.test"
const attributes = new Set<string>()

beforeEach(() => {
  attributes.clear()
  lanes.length = 0
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

function post(radius: string, { live = true, drag = false } = {}) {
  window.dispatchEvent(
    Object.assign(new Event("message"), {
      origin: ORIGIN,
      data: { type: "design-system", data: system(radius), live, drag },
    }),
  )
}

/** An apply whose render commits at once. */
const commits = () =>
  vi.fn<ApplyDesignSystem<unknown>>((_, __, committed) => committed())

/** An apply whose render commits only when the test says so. */
function rendering() {
  const inFlight: Array<() => void> = []
  const apply = vi.fn<ApplyDesignSystem<unknown>>(
    (_, __, committed) => void inFlight.push(committed),
  )
  return { apply, commit: () => inFlight.shift()?.() }
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

const applied = (apply: { mock: { calls: unknown[][] } }) =>
  apply.mock.calls.map(([data, prepared]) => [
    (data as DesignSystem).tokens["--radius"],
    prepared,
  ])

describe("listenDesignSystemMessages", () => {
  it("applies only the newest message, in the next frame", () => {
    const apply = commits()
    listenDesignSystemMessages((_, ready) => ready("now"), apply)
    post("1px")
    post("2px")
    post("3px")
    expect(apply).not.toHaveBeenCalled()
    vi.advanceTimersByTime(16)
    expect(applied(apply)).toEqual([["3px", "now"]])
  })

  it("never lets an older message's late preparation replace a newer one", () => {
    const apply = commits()
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
    const apply = commits()
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

  it("drops the previews still on their way once a commit arrives", () => {
    const apply = commits()
    const { prepare, resolve } = deferred()
    listenDesignSystemMessages(prepare, apply)
    post("1px")
    post("2px")
    resolve("1px")
    post("3px", { live: false })
    resolve("2px")
    vi.advanceTimersByTime(100)
    expect(apply).not.toHaveBeenCalled()
    resolve("3px")
    vi.advanceTimersByTime(16)
    expect(applied(apply)).toEqual([["3px", "prepared 3px"]])
  })

  it("turns transitions off while live, and back on a frame after the commit", () => {
    const { apply, commit } = rendering()
    listenDesignSystemMessages((_, ready) => ready(null), apply)
    post("1px")
    vi.advanceTimersByTime(16)
    expect(attributes.has("data-studio-live")).toBe(true)
    commit()
    post("1px", { live: false })
    vi.advanceTimersByTime(16)
    vi.advanceTimersByTime(100)
    expect(attributes.has("data-studio-live")).toBe(true)
    commit()
    expect(attributes.has("data-studio-live")).toBe(true)
    vi.advanceTimersByTime(16)
    expect(attributes.has("data-studio-live")).toBe(false)
  })

  it("paints a drag tick synchronously, anything else as a transition", () => {
    listenDesignSystemMessages((_, ready) => ready(null), commits())
    post("1px", { drag: true })
    vi.advanceTimersByTime(16)
    post("2px")
    vi.advanceTimersByTime(16)
    post("3px", { live: false })
    vi.advanceTimersByTime(16)
    expect(lanes).toEqual(["sync", "transition", "transition"])
  })

  it("holds newer messages until the render in flight commits", () => {
    const { apply, commit } = rendering()
    listenDesignSystemMessages((_, ready) => ready(null), apply)
    post("1px")
    vi.advanceTimersByTime(16)
    post("2px")
    post("3px", { drag: true })
    vi.advanceTimersByTime(100)
    expect(applied(apply)).toEqual([["1px", null]])
    commit()
    vi.advanceTimersByTime(100 + 16)
    expect(applied(apply)).toEqual([
      ["1px", null],
      ["3px", null],
    ])
  })

  it("rests as long as a render over budget took, measured to its commit", () => {
    const { apply, commit } = rendering()
    listenDesignSystemMessages((_, ready) => ready(null), apply)
    post("1px")
    vi.advanceTimersByTime(16)
    vi.advanceTimersByTime(40)
    commit()
    post("2px")
    vi.advanceTimersByTime(39)
    expect(apply).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1 + 16)
    expect(apply).toHaveBeenCalledTimes(2)
  })

  it("ignores preparations that finish after the listener stops", () => {
    const apply = commits()
    const { prepare, resolve } = deferred()
    const stop = listenDesignSystemMessages(prepare, apply)
    post("1px")
    stop()
    resolve("1px")
    vi.advanceTimersByTime(100)
    expect(apply).not.toHaveBeenCalled()
  })

  it("ignores other origins", () => {
    const apply = commits()
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
