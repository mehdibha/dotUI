import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createPersistedStore } from "./persisted-store"
import { installFakeWindow } from "./test-fake-window"

const KEY = "test:list"

const listCodec = {
  decode: (raw: string) => JSON.parse(raw) as string[],
  encode: (list: string[]) => (list.length > 0 ? JSON.stringify(list) : null),
}

let win: ReturnType<typeof installFakeWindow>

beforeEach(() => {
  win = installFakeWindow()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("createPersistedStore", () => {
  it("merges another tab's write made while nothing was subscribed", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    store.set(["Acme"])
    win.otherTab(KEY, JSON.stringify(["Acme", "Beta"]), false)

    store.update((list) => [...list, "Gamma"])

    expect(JSON.parse(win.read(KEY)!)).toEqual(["Acme", "Beta", "Gamma"])
  })

  it("re-reads storage in update even before the storage event arrives", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    const onChange = vi.fn()
    store.set(["Acme"])
    const unsubscribe = store.subscribe(onChange)
    win.otherTab(KEY, JSON.stringify(["Acme", "Beta"]), false)

    store.update((list) => [...list, "Gamma"])

    expect(store.get()).toEqual(["Acme", "Beta", "Gamma"])
    expect(JSON.parse(win.read(KEY)!)).toEqual(["Acme", "Beta", "Gamma"])
    expect(onChange).toHaveBeenCalled()
    unsubscribe()
  })

  it("notifies every subscriber of a storage event", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    const a = vi.fn()
    const b = vi.fn()
    const offA = store.subscribe(a)
    const offB = store.subscribe(b)

    win.otherTab(KEY, JSON.stringify(["Beta"]))

    expect(store.get()).toEqual(["Beta"])
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
    offA()
    offB()
  })

  it("re-reads storage on subscribe after missing events while unsubscribed", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    const off = store.subscribe(vi.fn())
    expect(store.get()).toEqual([])
    off()

    win.otherTab(KEY, JSON.stringify(["Beta"]))
    store.subscribe(vi.fn())

    expect(store.get()).toEqual(["Beta"])
  })

  it("ignores storage events for other keys", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    const onChange = vi.fn()
    store.subscribe(onChange)

    win.otherTab("other:key", "x")

    expect(onChange).not.toHaveBeenCalled()
  })

  it("keeps an unpersisted write in memory until storage changes", () => {
    const store = createPersistedStore<string[]>(KEY, [], listCodec)
    win.localStorage.setItem.mockImplementationOnce(() => {
      throw new Error("QuotaExceededError")
    })

    store.set(["Acme"])

    expect(win.read(KEY)).toBeNull()
    expect(store.get()).toEqual(["Acme"])
  })

  it("decodes to the fallback when the codec throws", () => {
    win.seed(KEY, "{not json")
    const store = createPersistedStore<string[]>(KEY, [], listCodec)

    expect(store.get()).toEqual([])
  })

  it("skips the write when update returns the current value", () => {
    win.seed(KEY, JSON.stringify(["Acme"]))
    const store = createPersistedStore<string[]>(KEY, [], listCodec)

    store.update((list) => list)

    expect(win.localStorage.setItem).not.toHaveBeenCalled()
  })

  it("clears the key when encode returns null", () => {
    win.seed(KEY, JSON.stringify(["Acme"]))
    const store = createPersistedStore<string[]>(KEY, [], listCodec)

    store.update(() => [])

    expect(win.read(KEY)).toBeNull()
  })
})
