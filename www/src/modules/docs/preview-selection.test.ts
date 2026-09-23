import { afterEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { ORIGIN, PRESETS } from "@/modules/presets/catalog"
import { DEFAULTS } from "@/modules/studio/axes"
import { docQuery, docSearch } from "@/modules/studio/doc"
import type { SavedSystem } from "@/modules/studio/preset/saved-systems"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import {
  decodeSelection,
  previewView,
  selectionId,
  type PreviewSelection,
} from "./preview-selection"

vi.mock("@/modules/studio/resolve", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/modules/studio/resolve")>()
  return { ...actual, resolveDesignSystem: vi.fn(actual.resolveDesignSystem) }
})

const LINEAR = PRESETS.find((p) => p.id === "linear") as (typeof PRESETS)[0]
const ORIGIN_REF = { id: "origin", rev: ORIGIN.rev }
const working = (brand: string, extra: { system?: string } = {}) =>
  docQuery(docSearch({ ...DEFAULTS, brand }, ORIGIN_REF, extra))
const saved = (id: string, name: string, brand: string): SavedSystem => ({
  id,
  name,
  preset: `origin@${ORIGIN.rev}`,
  d: docSearch({ ...DEFAULTS, brand }, ORIGIN_REF).d,
  updatedAt: 1,
})

const WORKING: PreviewSelection = { kind: "working" }
const NONE: SavedSystem[] = []

describe("docs preview selection", () => {
  it("reads stored values, the legacy `yours` and unknowns as working", () => {
    expect(decodeSelection("linear")).toEqual({ kind: "builtin", id: "linear" })
    expect(decodeSelection("saved:k3f9")).toEqual({ kind: "saved", id: "k3f9" })
    for (const raw of ["yours", "working", "nope", "saved:", "saved:a b"])
      expect(decodeSelection(raw)).toEqual(WORKING)
    for (const raw of ["linear", "saved:k3f9", "working"])
      expect(selectionId(decodeSelection(raw))).toBe(raw)
  })

  it("persists one key, cleared on the working default", async () => {
    const win = installFakeWindow()
    vi.resetModules()
    const { selectionStore } = await import("./preview-selection")
    selectionStore.set({ kind: "builtin", id: "linear" })
    expect(win.read("dotui:preview-preset")).toBe("linear")
    selectionStore.set({ kind: "saved", id: "k3f9" })
    expect(win.read("dotui:preview-preset")).toBe("saved:k3f9")
    selectionStore.set(WORKING)
    expect(win.read("dotui:preview-preset")).toBeNull()
    win.otherTab("dotui:preview-preset", "yours")
    expect(selectionStore.get()).toEqual(WORKING)
    vi.unstubAllGlobals()
  })
})

describe("docs preview view", () => {
  afterEach(() => vi.mocked(resolveDesignSystem).mockClear())

  it("defaults to the studio's working system, Origin until there is one", () => {
    const view = previewView(WORKING, undefined, NONE)
    expect(view).toMatchObject({ selectedId: "working", name: "Origin" })
    expect(view.designSystem).toBe(ORIGIN.designSystem)
    expect(view.sections.map((s) => s.id)).toEqual(["studio", "featured"])
    expect(view.sections[0]?.items[0]?.name).toBe("Your studio system")
  })

  it("renders the working system's edits and names it", () => {
    const view = previewView(WORKING, working("#ff0000"), NONE)
    expect(view.name).toBe("Origin (modified)")
    expect(view.swatch).toBe("#ff0000")
    expect(view.designSystem).toEqual(
      resolveDesignSystem({ ...DEFAULTS, brand: "#ff0000" }),
    )
    const record = saved("k3f9", "Acme", "#ff0000")
    expect(
      previewView(WORKING, working("#ff0000", { system: "k3f9" }), [record])
        .name,
    ).toBe("Acme")
  })

  it("lists saved systems and renders a picked one or a built-in", () => {
    const records = [saved("k3f9", "Acme", "#00aa00")]
    const view = previewView({ kind: "saved", id: "k3f9" }, undefined, records)
    expect(view.sections.map((s) => s.id)).toEqual([
      "studio",
      "saved",
      "featured",
    ])
    expect(view).toMatchObject({
      selectedId: "saved:k3f9",
      name: "Acme",
      swatch: "#00aa00",
    })
    expect(view.designSystem.color).toEqual(
      resolveDesignSystem({ ...DEFAULTS, brand: "#00aa00" }).color,
    )

    const linear = previewView(
      { kind: "builtin", id: "linear" },
      working("#ff0000"),
      records,
    )
    expect(linear).toMatchObject({ selectedId: "linear", name: "Linear" })
    expect(linear.designSystem).toBe(LINEAR.designSystem)
    const featured = linear.sections.at(-1)?.items ?? []
    expect(featured.find((i) => i.id === "linear")?.inspiredBy).toBe("Linear")
  })

  it("falls back to the working system when a picked record is gone", () => {
    const view = previewView(
      { kind: "saved", id: "gone" },
      working("#ff0000"),
      NONE,
    )
    expect(view).toMatchObject({
      selectedId: "working",
      name: "Origin (modified)",
    })
  })

  it("resolves once per change, however many previews read it", () => {
    const selection: PreviewSelection = { kind: "working" }
    const stored = working("#123456")
    const systems: SavedSystem[] = []
    const views = Array.from({ length: 75 }, () =>
      previewView(selection, stored, systems),
    )
    expect(new Set(views).size).toBe(1)
    expect(resolveDesignSystem).toHaveBeenCalledTimes(1)

    previewView(selection, working("#654321"), systems)
    expect(resolveDesignSystem).toHaveBeenCalledTimes(2)
    // A doc resolved once stays resolved when it comes back.
    previewView(selection, stored, systems)
    expect(resolveDesignSystem).toHaveBeenCalledTimes(2)
  })
})
