import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { KEY_OWNER, RULES } from "./axes"
import { PRIMARY_LEAVES } from "./axes/color"
import { FAMILY_MOTION_KEYS } from "./axes/motion"
import { ALL_ROWS, CHAPTERS, placeOf, SECTION_ROWS } from "./state"

const SECTIONS = path.join(__dirname, "sections")
const sources = readdirSync(SECTIONS)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => readFileSync(path.join(SECTIONS, file), "utf8"))

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

// One page shows a row once: the main page is every chapter, a family page its own body.
describe("hosting", () => {
  const fileOf = (name: string) =>
    sources.find((s) => s.includes(`export function ${name}(`)) ?? ""
  const rows: Record<string, unknown> = ALL_ROWS
  const byName = (name: string) =>
    Object.values(rows).filter(
      (row) => typeof row === "function" && row.name === name,
    )
  // `<Row axis="key" />`, and a row rendered directly (`<SurfacesRow />`).
  const hosted = (text: string): [string, unknown][] =>
    [...text.matchAll(/<Row\s+axis="(\w+)"|<(\w+Row)\b/g)].flatMap(
      ([, key, name = ""]): [string, unknown][] => {
        if (key) return [[key, rows[key]]]
        const found = byName(name)
        return found.length === 1 ? [[name, found[0]]] : []
      },
    )
  const once = (placed: [string, unknown][], page: string) => {
    const seen = new Map<unknown, string>()
    for (const [name, row] of placed) {
      expect(row, `${name} has no row`).toBeDefined()
      expect(seen.get(row), `${name} twice on ${page}`).toBeUndefined()
      seen.set(row, name)
    }
  }

  it("renders a row once on the main page", () => {
    const names = CHAPTERS.flatMap((c) =>
      c.pages ? [] : [c.Body.name, c.Primary?.name ?? ""],
    )
    once([...new Set(names.map(fileOf))].flatMap(hosted), "the main page")
  })

  it("renders a row once on each family page", () => {
    for (const page of CHAPTERS.flatMap((c) => c.pages ?? []))
      once(hosted(fileOf(page.Body.name)), page.id)
  })
})

describe("placeOf", () => {
  it("places every key", () => {
    for (const key of Object.keys(KEY_OWNER))
      expect(placeOf(key), key).toBeDefined()
  })

  it("sends the Primary leaves to Color and motion to Motion", () => {
    for (const key of PRIMARY_LEAVES)
      expect(placeOf(key)?.chapter.id, key).toBe("color")
    for (const key of ["motion", "motionEntrance"])
      expect(placeOf(key)?.chapter.id, key).toBe("motion")
    expect(placeOf("dialogEntrance")?.page?.id).toBe("dialogs")
    expect(placeOf("chartMotion")?.page?.id).toBe("charts")
  })

  it("sends each family's own Motion to its family page", () => {
    const pages = FAMILY_MOTION_KEYS.map((key) => placeOf(key)?.page?.id)
    expect(pages).toEqual([
      "buttons",
      "inputs",
      "selection",
      "menus",
      "dialogs",
      "nav",
      "display",
      "dates",
      "feedback",
    ])
  })

  // A hidden row vanishes without a chip: only its own page may explain it.
  it("hides a row only for a cause on its page", () => {
    const where = (key: string) => {
      const place = placeOf(key)
      return `${place?.chapter.id}/${place?.page?.id ?? ""}`
    }
    for (const rule of RULES.filter((r) => r.effect.kind === "hide"))
      expect(where(rule.target), rule.id).toBe(where(rule.cause))
  })
})
