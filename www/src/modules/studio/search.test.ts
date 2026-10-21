import { describe, expect, it } from "vitest"

import { registryUi } from "@/registry/ui/registry"

import { CHAPTERS } from "./chapters"
import { searchEntries } from "./search"
import { COMPONENTS, isSingle } from "./sections/components"
import { FOUNDATION_PAGES, MAIN_ROWS, PAGE_ROWS } from "./sections/foundations"

const contains = (text: string, needle: string) =>
  text.toLowerCase().includes(needle.toLowerCase())
const search = (query: string) =>
  searchEntries(CHAPTERS, query, contains).map((entry) =>
    entry.axis ? `${entry.category} › ${entry.axis}` : entry.category,
  )

/* Items no component row styles. */
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
    const results = search("Components")
    expect(results[0]).toBe("Components")
    expect(search("Corner")).toContain("Components › Checkbox › Corner")
  })

  it("reads every component row as Page › Row", () => {
    for (const component of COMPONENTS)
      expect(search(component.label), component.label).toContain(
        isSingle(component)
          ? `Components › All components › ${component.label}`
          : `Components › ${component.label}`,
      )
    for (const { label, rows } of COMPONENTS.filter(
      (component) => !isSingle(component),
    ))
      for (const [, row] of rows)
        expect(search(row), `${label} › ${row}`).toContain(
          `Components › ${label} › ${row}`,
        )
  })

  it("reads every foundation row as Page › Row", () => {
    for (const [, row] of MAIN_ROWS)
      expect(search(row), row).toContain(`Foundations › ${row}`)
    for (const { id, label } of FOUNDATION_PAGES)
      for (const [, row] of PAGE_ROWS[id]?.flat() ?? [])
        expect(search(row), row).toContain(`Foundations › ${label} › ${row}`)
  })

  it("reaches rows a popover holds, through the row that opens it", () => {
    expect(search("Vividness")).toContain("Foundations › Brand › Vividness")
    expect(search("Keep exact")).toContain("Foundations › Brand › Keep exact")
    expect(search("stroke")).toContain("Foundations › Icons › Stroke")
    expect(search("glass")).toContain("Foundations › Surfaces › Overlays")
    expect(search("Frost")).toContain("Components › Dialog › Backdrop › Frost")
    expect(search("Strength")).toContain(
      "Foundations › Focus › Focus ring › Strength",
    )
  })

  it("finds a one-row component by its row's name", () => {
    expect(search("Steppers")).toContain(
      "Components › All components › Number field",
    )
  })

  it("reaches every styled component by name", () => {
    const missing = registryUi
      .map((item) => item.name)
      .filter((name) => !UNSTYLED.has(name) && !name.startsWith("chart-"))
      .filter((name) => search(name.replace(/-/g, " ")).length === 0)
    expect(missing).toEqual([])
  })
})
