import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { DEFAULT_EFFECTIVE, RULES } from "./axes"
import { COMPONENTS, isSingle, keysOf } from "./sections/components"
import { FOUNDATION_PAGES, MAIN_ROWS, PAGE_ROWS } from "./sections/foundations"
import { ALL_ROWS, linkTarget, placeOf, SECTION_ROWS } from "./state"
import { valueLabel } from "./use-axis"

const SECTIONS = path.join(__dirname, "sections")
const sources = readdirSync(SECTIONS)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => readFileSync(path.join(SECTIONS, file), "utf8"))

const where = (key: string) => {
  const place = placeOf(key)
  return place && (place.page?.id ?? place.chapter.id)
}

describe("rows", () => {
  it("merges every section's ROWS, and a key has one row", () => {
    const exporting = sources.filter((s) => s.includes("export const ROWS"))
    expect(Object.keys(SECTION_ROWS)).toHaveLength(exporting.length)
    const owner = new Map<string, string>()
    for (const [section, rows] of Object.entries(SECTION_ROWS))
      for (const key of Object.keys(rows)) {
        expect(owner.get(key), `${key} in ${section}`).toBeUndefined()
        owner.set(key, section)
      }
  })
})

describe("homes", () => {
  const rows: Record<string, unknown> = ALL_ROWS
  const pageRows = (id: string) => PAGE_ROWS[id]?.flat() ?? []
  // Every key a place's rows edit: a row that holds several keys homes them all.
  const rendered = (place: typeof MAIN_ROWS) => {
    const shown = new Set(
      place.flatMap(([row]) => (typeof row === "string" ? [rows[row]] : [])),
    )
    return Object.keys(rows).filter((key) => shown.has(rows[key]))
  }

  const scanned: [string, string[]][] = [
    ["foundations", rendered(MAIN_ROWS)],
    ...FOUNDATION_PAGES.map((page): [string, string[]] => [
      page.id,
      rendered(pageRows(page.id)),
    ]),
    ...COMPONENTS.map((component): [string, string[]] => [
      isSingle(component) ? component.chapter : component.id,
      keysOf(component).filter((key) => !component.hosts?.includes(key)),
    ]),
  ]

  it("gives every key with a row exactly one home, where reveals land", () => {
    for (const key of Object.keys(rows)) {
      const homes = scanned.flatMap(([id, keys]) =>
        keys.includes(key) ? [id] : [],
      )
      expect(where(key), `${key} has no place`).toBeDefined()
      expect([...new Set([where(key), ...homes])], key).toHaveLength(1)
    }
  })

  it("hosts the popover's Motion on Menu, the checkbox's on Radio", () => {
    const hosted = COMPONENTS.flatMap((c) =>
      (c.hosts ?? []).map((key) => `${c.id}:${key}`),
    )
    expect(hosted).toEqual(["radio:checkboxMotion", "menu:popoverMotion"])
    expect(where("popoverMotion")).toBe("popover")
    expect(where("checkboxMotion")).toBe("checkbox")
  })

  it("keeps a page to eight rows; Button holds nine", () => {
    const pages = [
      ...FOUNDATION_PAGES.map(
        (page) => [page.id, pageRows(page.id).length] as const,
      ),
      ...COMPONENTS.map((c) => [c.id, c.rows.length] as const),
    ]
    for (const [id, count] of pages)
      expect(count, id).toBeLessThanOrEqual(id === "button" ? 9 : 8)
  })

  it("names each component row's value by its lead option", () => {
    const unnamed = COMPONENTS.filter(({ rows }) => {
      const [lead] = rows[0] ?? []
      const value = lead && DEFAULT_EFFECTIVE[lead]
      return !lead || valueLabel(lead, value) === String(value)
    })
    expect(unnamed.map((c) => c.id)).toEqual([])
  })

  // A hidden row vanishes without a chip: only its own page may explain it.
  it("hides a row only for a cause on its page", () => {
    for (const rule of RULES.filter((r) => r.effect.kind === "hide"))
      expect(where(rule.target), rule.id).toBe(where(rule.cause))
  })
})

describe("deep links", () => {
  it("opens pages and lands one-row components on their row", () => {
    expect(linkTarget("checkbox")).toEqual({ page: "checkbox" })
    expect(linkTarget("typography")).toEqual({ page: "typography" })
    expect(linkTarget("kbd")).toEqual({ key: "kbdTreatment" })
    expect(linkTarget("nope")).toBeUndefined()
  })

  it("sends the old family hashes to the nearest page", () => {
    const old = {
      buttons: { page: "button" },
      "buttons/segmented": { page: "segmented-control" },
      "buttons/pagination": { key: "paginationCurrent" },
      inputs: { page: "field" },
      "inputs/select": { page: "select" },
      "inputs/otp": { key: "otpStyle" },
      selection: { page: "checkbox" },
      "selection/radio": { page: "radio" },
      menus: { page: "menu" },
      "menus/tooltip": { page: "tooltip" },
      dialogs: { page: "dialog" },
      "dialogs/drawer": { page: "sheet" },
      nav: { page: "tabs" },
      "nav/link": { page: "link" },
      dates: { page: "calendar" },
      display: { page: "table" },
      "display/kbd": { key: "kbdTreatment" },
      feedback: { page: "toast" },
      "feedback/loading": { page: "progress" },
      charts: { page: "chart" },
      states: { page: "interaction" },
      motion: { key: "motion" },
    }
    for (const [hash, target] of Object.entries(old))
      expect(linkTarget(hash), hash).toEqual(target)
  })
})
