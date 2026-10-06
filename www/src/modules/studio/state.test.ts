import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { KEY_OWNER } from "./axes"
import { PRIMARY_LEAVES } from "./axes/color"
import { MOTION_KEYS } from "./axes/motion-presets"
import { placeOf } from "./state"

const SECTIONS = path.join(__dirname, "sections")
const sources = readdirSync(SECTIONS)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => readFileSync(path.join(SECTIONS, file), "utf8"))

describe("placeOf", () => {
  it("places every key", () => {
    for (const key of Object.keys(KEY_OWNER))
      expect(placeOf(key), key).toBeDefined()
  })

  it("sends the Primary leaves to Color and motion keys to Motion", () => {
    for (const key of PRIMARY_LEAVES)
      expect(placeOf(key)?.chapter.id, key).toBe("color")
    for (const key of MOTION_KEYS)
      expect(placeOf(key)?.chapter.id, key).toBe("motion")
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
})
