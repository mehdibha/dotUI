import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { KEY_OWNER, RULES } from "./axes"
import { PRIMARY_LEAVES } from "./axes/color"
import { FAMILY_MOTION_KEYS } from "./axes/motion"
import { placeOf, SECTION_ROWS } from "./state"

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

  // A Uses link names an upstream row: landing on its own page flashes nothing.
  it("leads every Uses link off its page", () => {
    const links = sources.flatMap((source) => {
      const body = source.match(/export function (\w+Section)\(/)?.[1]
      return [...source.matchAll(/<UsesRow\s+axis="(\w+)"/g)].map(
        ([, key = ""]) => ({ key, body }),
      )
    })
    expect(links.length).toBeGreaterThan(0)
    for (const { key, body } of links) {
      const place = placeOf(key)
      expect(place, key).toBeDefined()
      expect(place?.page?.Body.name, key).not.toBe(body)
    }
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
