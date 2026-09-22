import { beforeEach, describe, expect, it, vi } from "vitest"

let name = "Origin"
let activeId: string | undefined
vi.mock("./preset/storage", () => ({
  loadDesignSystemName: () => name,
  saveDesignSystemName: (next: string) => (name = next),
}))
vi.mock("./preset/my-presets", () => ({
  loadActivePresetId: () => activeId,
  saveActivePresetId: (next: string | undefined) => (activeId = next),
}))

let { record, redo, undo } = await import("./history")

describe("history", () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    vi.resetModules()
    ;({ record, redo, undo } = await import("./history"))
    name = "Origin"
    activeId = undefined
  })

  it("steps back and forward through edits", () => {
    record("a")
    vi.advanceTimersByTime(1000)
    record("b")
    expect(undo("c")).toBe("b")
    expect(undo("b")).toBe("a")
    expect(undo("a")).toBeNull()
    expect(redo("a")).toBe("b")
    expect(redo("b")).toBe("c")
  })

  it("merges edits inside the window into one step", () => {
    record("a")
    record("b")
    record("c")
    expect(undo("d")).toBe("a")
    expect(undo("a")).toBeNull()
  })

  it("a new edit drops the redo branch", () => {
    record("a")
    undo("b")
    vi.advanceTimersByTime(1000)
    record("a")
    expect(redo("x")).toBeNull()
  })

  it("restores the name the state was shown under", () => {
    record("custom")
    name = "Linear"
    expect(undo("linear")).toBe("custom")
    expect(name).toBe("Origin")
    expect(redo("custom")).toBe("linear")
    expect(name).toBe("Linear")
  })
})
