import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { ColorConfig } from "@/registry/theme"

const { themeCss } = vi.hoisted(() => ({
  themeCss: vi.fn((color: ColorConfig) => `css:${color.seeds.accent}`),
}))
vi.mock("@/lib/theme-css", () => ({ themeCss }))

class FakeWorker extends EventTarget {
  static instances: FakeWorker[] = []
  posted: ColorConfig[] = []
  terminate = vi.fn()
  constructor() {
    super()
    FakeWorker.instances.push(this)
  }
  postMessage(color: ColorConfig) {
    this.posted.push(color)
  }
  /** Answers the computation in flight, as the real worker would. */
  reply() {
    const color = this.posted.at(-1)!
    const data = `worker:${color.seeds.accent}`
    this.dispatchEvent(Object.assign(new Event("message"), { data }))
  }
  fail() {
    this.dispatchEvent(new Event("error"))
  }
}

const color = (accent: string): ColorConfig => ({ v: 2, seeds: { accent } })

async function load() {
  vi.resetModules()
  return import("./theme-css-worker")
}

beforeEach(() => {
  FakeWorker.instances = []
  vi.stubGlobal("Worker", FakeWorker)
  themeCss.mockClear()
})

afterEach(() => vi.unstubAllGlobals())

describe("themeCssLater", () => {
  it("computes in a worker, once, and caches the result", async () => {
    const { themeCssLater, themeCssNow } = await load()
    const done = vi.fn()
    themeCssLater(color("#111111"), done)
    expect(done).not.toHaveBeenCalled()
    const [worker] = FakeWorker.instances
    worker!.reply()
    expect(done).toHaveBeenCalledWith("worker:#111111")

    const again = vi.fn()
    themeCssLater(color("#111111"), again)
    expect(again).toHaveBeenCalledWith("worker:#111111")
    expect(themeCssNow(color("#111111"))).toBe("worker:#111111")
    expect(worker!.posted).toHaveLength(1)
    expect(FakeWorker.instances).toHaveLength(1)
    expect(themeCss).not.toHaveBeenCalled()
  })

  it("computes one at a time, the newest waiting request next", async () => {
    const { themeCssLater } = await load()
    const [a, b, c] = [vi.fn(), vi.fn(), vi.fn()]
    themeCssLater(color("#aaaaaa"), a)
    themeCssLater(color("#bbbbbb"), b)
    themeCssLater(color("#cccccc"), c)
    const [worker] = FakeWorker.instances
    expect(worker!.posted.map((x) => x.seeds.accent)).toEqual(["#aaaaaa"])

    worker!.reply()
    expect(a).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(worker!.posted.map((x) => x.seeds.accent)).toEqual([
      "#aaaaaa",
      "#cccccc",
    ])
    worker!.reply()
    expect(c).toHaveBeenCalledWith("worker:#cccccc")
    expect(b).not.toHaveBeenCalled()
  })

  it("shares a computation already on its way", async () => {
    const { themeCssLater } = await load()
    const [first, second, third] = [vi.fn(), vi.fn(), vi.fn()]
    themeCssLater(color("#aaaaaa"), first)
    themeCssLater(color("#bbbbbb"), vi.fn())
    themeCssLater(color("#aaaaaa"), second)
    themeCssLater(color("#bbbbbb"), third)
    const [worker] = FakeWorker.instances
    worker!.reply()
    worker!.reply()
    expect(first).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(second).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(third).toHaveBeenCalledWith("worker:#bbbbbb")
    expect(worker!.posted).toHaveLength(2)
  })

  it("computes on the main thread once the worker fails", async () => {
    const { themeCssLater } = await load()
    const [a, b, c] = [vi.fn(), vi.fn(), vi.fn()]
    themeCssLater(color("#aaaaaa"), a)
    themeCssLater(color("#bbbbbb"), b)
    const [worker] = FakeWorker.instances
    worker!.fail()
    expect(worker!.terminate).toHaveBeenCalled()
    expect(a).toHaveBeenCalledWith("css:#aaaaaa")
    expect(b).toHaveBeenCalledWith("css:#bbbbbb")

    themeCssLater(color("#cccccc"), c)
    expect(c).toHaveBeenCalledWith("css:#cccccc")
    expect(FakeWorker.instances).toHaveLength(1)
  })

  it("computes at once where workers don't exist", async () => {
    vi.stubGlobal("Worker", undefined)
    const { themeCssLater } = await load()
    const done = vi.fn()
    themeCssLater(color("#aaaaaa"), done)
    expect(done).toHaveBeenCalledWith("css:#aaaaaa")
  })
})

describe("themeCssNow", () => {
  it("keeps the 16 most recent", async () => {
    const { themeCssNow } = await load()
    const accent = (i: number) => `#${String(i).padStart(6, "0")}`
    for (let i = 0; i < 17; i++) themeCssNow(color(accent(i)))
    themeCssNow(color(accent(16)))
    expect(themeCss).toHaveBeenCalledTimes(17)
    themeCssNow(color(accent(0)))
    expect(themeCss).toHaveBeenCalledTimes(18)
  })
})
