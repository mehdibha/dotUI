import { describe, expect, it } from "vitest"

import { registryUi } from "@/registry/ui/registry"

import { searchEntries } from "./search"
import { CHAPTERS } from "./state"

const contains = (text: string, needle: string) =>
  text.toLowerCase().includes(needle.toLowerCase())
const search = (query: string) =>
  searchEntries(CHAPTERS, query, contains).map((entry) =>
    entry.axis ? `${entry.category} › ${entry.axis}` : entry.category,
  )

/* Items no family page styles. */
const UNSTYLED = new Set([
  "attachment",
  "bubble",
  "color-area",
  "color-editor",
  "color-field",
  "color-picker",
  "color-slider",
  "color-swatch",
  "color-swatch-picker",
  "color-thumb",
  "drop-zone",
  "form",
  "group",
  "heading",
  "marker",
  "message",
  "message-scroller",
  "qr-code",
  "questionnaire",
  "react-hook-form",
  "separator",
  "tanstack-form",
  "text",
])

describe("panel search", () => {
  it("lists matching chapters, then matching rows", () => {
    const results = search("Menu")
    expect(results[0]).toBe("Typography")
    expect(results).toContain("Components › Menus & popovers")
    expect(results).toContain("Components › Menus & popovers › Highlight")
  })

  it("reaches every styled component by name", () => {
    const missing = registryUi
      .map((item) => item.name)
      .filter((name) => !UNSTYLED.has(name) && !name.startsWith("chart-"))
      .filter((name) => search(name.replace(/-/g, " ")).length === 0)
    expect(missing).toEqual([])
  })
})
