import { afterEach, describe, expect, it, vi } from "vitest"

import { PREVIEW_PENDING_SCRIPT } from "./preview-pending"

/** Runs the head script over `storage`; returns whether it flagged pending. */
function run(storage: Record<string, string>, systemDark = false) {
  const data = new Map(Object.entries(storage))
  const attributes = new Set<string>()
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => data.get(key) ?? null,
    removeItem: (key: string) => void data.delete(key),
  })
  vi.stubGlobal("matchMedia", () => ({ matches: systemDark }))
  vi.stubGlobal("document", {
    documentElement: { setAttribute: (name: string) => attributes.add(name) },
  })
  new Function(PREVIEW_PENDING_SCRIPT)()
  return { pending: attributes.has("data-preview-pending"), data }
}

afterEach(() => vi.unstubAllGlobals())

describe("preview pending script", () => {
  it("leaves previews alone when they already show the right system", () => {
    expect(run({}).pending).toBe(false)
    expect(run({ "dotui:preview-preset": "origin" }).pending).toBe(false)
    expect(run({ "dotui:preset": "preset=origin" }).pending).toBe(false)
    expect(
      run({
        "dotui:preview-preset": "yours",
        "dotui:preset": "preset=origin&system=k3f9",
      }).pending,
    ).toBe(false)
  })

  it("flags a picked or working system other than pristine Origin", () => {
    expect(run({ "dotui:preview-preset": "linear" }).pending).toBe(true)
    expect(run({ "dotui:preview-preset": "saved:k3f9" }).pending).toBe(true)
    expect(run({ "dotui:preset": "preset=linear" }).pending).toBe(true)
    expect(run({ "dotui:preset": "preset=origin@1&d=v5.x" }).pending).toBe(true)
    expect(run({ "dotui:preset": "legacyBlob" }).pending).toBe(true)
    // A picked built-in wins over the working system.
    expect(
      run({ "dotui:preview-preset": "origin", "dotui:preset": "preset=linear" })
        .pending,
    ).toBe(false)
  })

  it("drops a pinned mode equal to the site theme and flags any other", () => {
    const same = run({ "dotui:preview-mode": "dark", theme: "dark" })
    expect(same.pending).toBe(false)
    expect(same.data.has("dotui:preview-mode")).toBe(false)

    const system = run({ "dotui:preview-mode": "dark", theme: "system" }, true)
    expect(system.pending).toBe(false)
    expect(system.data.has("dotui:preview-mode")).toBe(false)

    const other = run({ "dotui:preview-mode": "dark", theme: "light" })
    expect(other.pending).toBe(true)
    expect(other.data.get("dotui:preview-mode")).toBe("dark")
    expect(run({ "dotui:preview-mode": "light" }, true).pending).toBe(true)
  })
})
