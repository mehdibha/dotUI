import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { extractStylesConfig } from "@/publisher/build-time/extract-config"

/* createStyles' `styles` export is composed once at the param defaults: it
   never follows the design system. A consumer may read it only for a slot no
   param of its owner touches; anything a param dresses goes through the
   owner's live `useStyles` hook. */

const UI = path.resolve(__dirname, "../registry/ui")
const items = readdirSync(UI, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

/** Slots any param value of `item` writes. */
function paramSlots(item: string): Set<string> {
  const config = extractStylesConfig(path.join(UI, item, "styles.ts"))
  const slots = new Set<string>()
  const visit = (layer: unknown) => {
    if (!layer || typeof layer !== "object") return
    const { slots: own, variants, density } = layer as Record<string, unknown>
    for (const slot of Object.keys((own as object) ?? {})) slots.add(slot)
    for (const byValue of Object.values((variants as object) ?? {}))
      for (const value of Object.values((byValue as object) ?? {}))
        if (value && typeof value === "object")
          for (const slot of Object.keys(value)) slots.add(slot)
    for (const tier of Object.values((density as object) ?? {})) visit(tier)
  }
  for (const values of Object.values(config.params ?? {}))
    for (const layer of Object.values(values)) visit(layer)
  return slots
}

describe("static styles", () => {
  const sources = items.flatMap((item) =>
    readdirSync(path.join(UI, item))
      .filter((file) => /^(base.*\.tsx|styles\.ts)$/.test(file))
      .map((file) => ({
        file: `${item}/${file}`,
        text: readFileSync(path.join(UI, item, file), "utf8"),
      })),
  )

  it("base files never import another item's frozen styles", () => {
    const frozen = sources
      .filter(({ file }) => file.includes("/base"))
      .filter(({ text }) =>
        /import \{[^}]*\b(?!use)[a-z]\w*Styles\b[^}]*\} from "@\/registry\/ui\//.test(
          text,
        ),
      )
      .map(({ file }) => file)
    expect(frozen).toEqual([])
  })

  it("static compositions read only slots no param touches", () => {
    const misuse: string[] = []
    for (const { file, text } of sources) {
      for (const [, owner, slot] of text.matchAll(
        /\b([a-z]\w*)Styles\(\)\.(\w+)\(/g,
      )) {
        const item = items.find(
          (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase()) === owner,
        )
        if (!item) continue
        if (paramSlots(item).has(slot!))
          misuse.push(`${file}: ${owner}.${slot}`)
      }
    }
    expect(misuse).toEqual([])
  })
})
