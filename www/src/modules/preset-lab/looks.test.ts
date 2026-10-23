import { readdirSync, readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import {
  type GapsFile,
  ledger,
  LOOKS,
  lookOf,
  PATTERNS,
  patternOf,
} from "./looks"
import { PROPS, SPECIMEN_TARGETS } from "./probe"

const REFS = resolve(import.meta.dirname, "refs")
const packs = Object.fromEntries(
  readdirSync(REFS)
    .filter((id) => existsSync(resolve(REFS, id, "gaps.json")))
    .map((id) => [
      id,
      JSON.parse(
        readFileSync(resolve(REFS, id, "gaps.json"), "utf8"),
      ) as GapsFile,
    ]),
)

describe("looks", () => {
  it("names every look after its pattern", () => {
    for (const id of Object.keys(LOOKS)) expect(patternOf(id), id).toBeDefined()
  })

  it("claims only specimen parts and probe props", () => {
    const parts = Object.keys(SPECIMEN_TARGETS)
    for (const [id, look] of Object.entries(LOOKS))
      for (const measure of ("measures" in look ? look.measures : []) ?? []) {
        const [part = "", prop] = measure.split(" ")
        expect(PROPS, `${id}: ${measure}`).toContain(prop)
        if (part === "*" || part.startsWith("*.")) continue
        const base = part.replace(/\.\*$/, "")
        expect(
          parts.some((p) => p === base || p.startsWith(`${base}.`)),
          `${id}: ${measure}`,
        ).toBe(true)
      }
  })

  it("files an off row under the narrowest look", () => {
    expect(lookOf("switch.off", "height")).toBe("size.switch")
    expect(lookOf("nav.item", "height")).toBe("size.nav-row")
    expect(lookOf("button.icon", "borderRadius")).toBe("radius.button-icon")
    expect(lookOf("button.primary", "borderRadius")).toBe("radius.button")
    expect(lookOf("input.focus", "ring")).toBe("state.focus-color")
    expect(lookOf("badge", "letterSpacing")).toBe("type.tracking")
    expect(lookOf("page", "fontFamily")).toBeUndefined()
  })
})

describe("gaps.json", () => {
  it("exists for every pack the ledger names", () => {
    expect(Object.keys(packs).length).toBeGreaterThanOrEqual(18)
  })

  it("names only known looks, with a title and a source", () => {
    for (const [pack, file] of Object.entries(packs))
      for (const gap of file.gaps) {
        expect(Object.keys(LOOKS), pack).toContain(gap.look)
        expect(gap.title, `${pack} ${gap.look}`).toBeTruthy()
        expect(gap.source, `${pack} ${gap.look}`).toMatch(
          /^(ledger|hand|fit \w+)/,
        )
      }
  })

  it("counts systems per look for the ledger", () => {
    const rows = ledger(packs)
    const switches = rows.find((row) => row.look === "size.switch")
    expect(switches?.systems.length).toBeGreaterThanOrEqual(15)
    expect(switches?.bar).toBe(true)
    expect(
      rows.filter((row) => row.pattern === "color-engine").every((r) => !r.bar),
    ).toBe(true)
    expect(Object.keys(PATTERNS)).toContain(rows[0]?.pattern)
  })
})
