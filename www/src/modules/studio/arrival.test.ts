import { deflateRaw } from "pako"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

const WORKING_KEY = "dotui:preset"

function encodeRaw(payload: unknown): string {
  const binary = String.fromCharCode(
    ...deflateRaw(JSON.stringify(payload), { level: 9 }),
  )
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

let win: ReturnType<typeof installFakeWindow>

async function load() {
  vi.resetModules()
  return import("./arrival")
}

beforeEach(() => {
  win = installFakeWindow()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("studio arrival", () => {
  it("opens Origin on a first visit without storing anything", async () => {
    const { settle } = await load()
    expect(settle({}, false)).toEqual({ preset: "origin" })
    expect(win.read(WORKING_KEY)).toBeNull()
  })

  it("reopens the working document, stored in its canonical form", async () => {
    win.seed(WORKING_KEY, encodeRaw({ v: 4, s: { radiusPx: 4 } }))
    const { settle } = await load()
    const target = settle({}, false)
    expect(target?.preset).toBe("origin@1")
    expect(win.read(WORKING_KEY)).toBe(`preset=origin@1&d=${target?.d}`)
  })

  it("stores the working document rev-pinned", async () => {
    win.seed(WORKING_KEY, "preset=linear")
    expect((await load()).settle({}, false)).toEqual({ preset: "linear@1" })
    expect(win.read(WORKING_KEY)).toBe("preset=linear@1")

    win.seed(WORKING_KEY, "preset=linear@2")
    expect((await load()).settle({}, false)).toEqual({ preset: "linear" })
    expect(win.read(WORKING_KEY)).toBe("preset=linear@2")
  })

  it("hands the page a redirect's notice once", async () => {
    const { settle, takeNotice } = await load()
    settle({ preset: encodeRaw({ v: 4, s: { nope: 1 } }) }, false)
    expect(takeNotice()).toEqual({ kind: "dropped", settings: ["nope"] })
    expect(takeNotice()).toBeUndefined()
  })

  it("leaves storage and notices alone while preloading", async () => {
    win.seed(WORKING_KEY, encodeRaw({ v: 4, s: { radiusPx: 4 } }))
    const { settle, takeNotice } = await load()
    expect(settle({}, true)).toBeDefined()
    settle({ preset: "nope" }, true)
    expect(win.read(WORKING_KEY)).toMatch(/^[\w-]+$/)
    expect(takeNotice()).toBeUndefined()
  })
})
