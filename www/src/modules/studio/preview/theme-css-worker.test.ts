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
const done = () => vi.fn<(css: string) => void>()

async function load() {
  vi.resetModules()
  const module = await import("./theme-css-worker")
  /** A live preview's request. */
  const later = (c: ColorConfig, done: (css: string) => void) =>
    module.requestThemeCss(c, true, done)
  return { ...module, later }
}

beforeEach(() => {
  FakeWorker.instances = []
  vi.stubGlobal("Worker", FakeWorker)
  themeCss.mockClear()
})

afterEach(() => vi.unstubAllGlobals())

describe("requestThemeCss", () => {
  it("computes in a worker, once, and caches the result", async () => {
    const { later, themeCssNow } = await load()
    const done = vi.fn()
    later(color("#111111"), done)
    expect(done).not.toHaveBeenCalled()
    const [worker] = FakeWorker.instances
    worker!.reply()
    expect(done).toHaveBeenCalledWith("worker:#111111")

    const again = vi.fn()
    later(color("#111111"), again)
    expect(again).toHaveBeenCalledWith("worker:#111111")
    expect(themeCssNow(color("#111111"))).toBe("worker:#111111")
    expect(worker!.posted).toHaveLength(1)
    expect(FakeWorker.instances).toHaveLength(1)
    expect(themeCss).not.toHaveBeenCalled()
  })

  it("computes one at a time, the newest waiting request next", async () => {
    const { later } = await load()
    const [a, b, c] = [vi.fn(), vi.fn(), vi.fn()]
    later(color("#aaaaaa"), a)
    later(color("#bbbbbb"), b)
    later(color("#cccccc"), c)
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
    const { later } = await load()
    const [first, second, third] = [vi.fn(), vi.fn(), vi.fn()]
    later(color("#aaaaaa"), first)
    later(color("#bbbbbb"), vi.fn())
    later(color("#aaaaaa"), second)
    later(color("#bbbbbb"), third)
    const [worker] = FakeWorker.instances
    worker!.reply()
    worker!.reply()
    expect(first).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(second).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(third).toHaveBeenCalledWith("worker:#bbbbbb")
    expect(worker!.posted).toHaveLength(2)
  })

  it("computes on the main thread once the worker fails", async () => {
    const { later } = await load()
    const [a, b, c] = [vi.fn(), vi.fn(), vi.fn()]
    later(color("#aaaaaa"), a)
    later(color("#bbbbbb"), b)
    const [worker] = FakeWorker.instances
    worker!.fail()
    expect(worker!.terminate).toHaveBeenCalled()
    expect(a).toHaveBeenCalledWith("css:#aaaaaa")
    expect(b).toHaveBeenCalledWith("css:#bbbbbb")

    later(color("#cccccc"), c)
    expect(c).toHaveBeenCalledWith("css:#cccccc")
    expect(FakeWorker.instances).toHaveLength(1)
  })

  it("has a commit wait for the worker job computing its color", async () => {
    const { requestThemeCss } = await load()
    const [running, queued] = [done(), done()]
    requestThemeCss(color("#aaaaaa"), true, done())
    requestThemeCss(color("#bbbbbb"), true, done())
    requestThemeCss(color("#aaaaaa"), false, running)
    requestThemeCss(color("#bbbbbb"), false, queued)
    expect(themeCss).not.toHaveBeenCalled()
    const [worker] = FakeWorker.instances
    worker?.reply()
    expect(running).toHaveBeenCalledWith("worker:#aaaaaa")
    expect(queued).not.toHaveBeenCalled()
    worker?.reply()
    expect(queued).toHaveBeenCalledWith("worker:#bbbbbb")
    expect(themeCss).not.toHaveBeenCalled()
  })

  it("computes a commit at once when no job has its color", async () => {
    const { requestThemeCss } = await load()
    const [busy, commit] = [done(), done()]
    requestThemeCss(color("#aaaaaa"), true, busy)
    requestThemeCss(color("#cccccc"), false, commit)
    expect(commit).toHaveBeenCalledWith("css:#cccccc")
    const [worker] = FakeWorker.instances
    expect(worker?.posted).toHaveLength(1)
    worker?.reply()
    expect(busy).toHaveBeenCalledWith("worker:#aaaaaa")
  })

  it("computes at once where workers don't exist", async () => {
    vi.stubGlobal("Worker", undefined)
    const { later } = await load()
    const done = vi.fn()
    later(color("#aaaaaa"), done)
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
