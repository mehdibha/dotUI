import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

import { setCodeOption } from "./code-options-store"

const KEY = "dotui:code-options"

let win: ReturnType<typeof installFakeWindow>

beforeEach(() => {
  win = installFakeWindow()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("code options store", () => {
  it("stores the flags and clears the key back at the defaults", () => {
    setCodeOption("classArrays", true)
    expect(win.read(KEY)).toBe("arrays")
    setCodeOption("classArrays", false)
    expect(win.read(KEY)).toBeNull()
  })

  it("merges into what another tab stored", () => {
    win.seed(KEY, "arrays")
    setCodeOption("sectionComments", false)
    expect(win.read(KEY)).toBe("arrays,no-sections")
  })

  it("reads an unknown value as the defaults", () => {
    win.seed(KEY, "tabs")
    setCodeOption("sectionComments", false)
    expect(win.read(KEY)).toBe("no-sections")
  })
})
