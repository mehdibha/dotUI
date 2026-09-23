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
  it("persists a change and clears the key back at the defaults", () => {
    setCodeOption("classArrays", true)
    expect(JSON.parse(win.read(KEY) ?? "")).toEqual({
      classArrays: true,
      sectionComments: true,
    })
    setCodeOption("classArrays", false)
    expect(win.read(KEY)).toBeNull()
  })

  it("merges into what another tab stored", () => {
    win.seed(KEY, JSON.stringify({ classArrays: true, sectionComments: true }))
    setCodeOption("sectionComments", false)
    expect(JSON.parse(win.read(KEY) ?? "")).toEqual({
      classArrays: true,
      sectionComments: false,
    })
  })

  it("reads a garbled value as the defaults", () => {
    win.seed(KEY, JSON.stringify({ classArrays: "yes", tabs: true }))
    setCodeOption("sectionComments", false)
    expect(JSON.parse(win.read(KEY) ?? "")).toEqual({
      classArrays: false,
      sectionComments: false,
    })
  })
})
