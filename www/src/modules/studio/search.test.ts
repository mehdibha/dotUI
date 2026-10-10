import { describe, expect, it } from "vitest"

import { registryUi } from "@/registry/ui/registry"

import { searchEntries } from "./search"
import { COMPONENTS, isSingle } from "./sections/components"
import { FOUNDATION_PAGES, MAIN_ROWS, PAGE_ROWS } from "./sections/foundations"
import { CHAPTERS } from "./state"

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
    const results = search("Navigation")
    expect(results[0]).toBe("Navigation")
    expect(search("Corner")).toContain("Forms › Checkbox › Corner")
  })

  it("reads every component row as Page › Row", () => {
    const categoryOf = (id: string) =>
      CHAPTERS.find((chapter) => chapter.id === id)?.label
    for (const { label, chapter } of COMPONENTS)
      expect(search(label), label).toContain(
        `${categoryOf(chapter)} › ${label}`,
      )
    for (const { label, chapter, rows } of COMPONENTS.filter(
      (component) => !isSingle(component),
    ))
      for (const [, row] of rows)
        expect(search(row), `${label} › ${row}`).toContain(
          `${categoryOf(chapter)} › ${label} › ${row}`,
        )
  })

  it("reads every foundation row as Page › Row", () => {
    for (const [, row] of MAIN_ROWS)
      expect(search(row), row).toContain(`Foundations › ${row}`)
    for (const { id, label } of FOUNDATION_PAGES)
      for (const [, row] of PAGE_ROWS[id]?.flat() ?? [])
        expect(search(row), row).toContain(`Foundations › ${label} › ${row}`)
  })

  it("finds a one-row component by its row's name", () => {
    expect(search("Steppers")).toContain("Forms › Number field")
  })

  it("reaches every styled component by name", () => {
    const missing = registryUi
      .map((item) => item.name)
      .filter((name) => !UNSTYLED.has(name) && !name.startsWith("chart-"))
      .filter((name) => search(name.replace(/-/g, " ")).length === 0)
    expect(missing).toEqual([])
  })
})
