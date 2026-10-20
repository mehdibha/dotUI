import path from "node:path"
import { compile } from "@tailwindcss/node"
import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import {
  familyFromStack,
  fontFamiliesFromTokens,
  fontStack,
  isSystemFamily,
} from "@/lib/fonts"
import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import type { Density } from "@/registry/types"
import { CAPS } from "@/registry/ui/badge/styles"
import { MONO_CAPS } from "@/registry/ui/list-box/styles"
import {
  fontItemNamesForTokens,
  parseFontItemName,
} from "@/publisher/emit-font"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { ClassValue, PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, effective, parseState } from "./index"
import { SECTION_LABEL_OPTIONS, TITLE_OPTIONS } from "./type.meta"

const TITLE_SLOTS = ["card", "dialog", "empty", "questionnaire"]
// Spacious keeps Comfortable's titles; Touch steps up with its 16px text.
const TITLE_TIER: Record<Density, string> = {
  compact: "compact",
  default: "default",
  comfortable: "comfortable",
  spacious: "comfortable",
  touch: "touch",
}

const classes = (value: ClassValue | undefined): string =>
  [value]
    .flat(Infinity as 1)
    .filter(Boolean)
    .join(" ")

async function slot(
  name: string,
  slotName: string,
  density: Density,
  paramSelections: Record<string, string>,
) {
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { stylesConfig, meta } = mod.publishable
  const layer = flatten({ stylesConfig, meta, density, paramSelections })
  return classes(layer.slots?.[slotName])
}

async function shipped(name: string, tokens: Record<string, string> = {}) {
  const preset: PublishPreset = {
    density: "default",
    componentParams: {},
    tokens,
  }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

/** A slot whose classes survive a merge carries no conflicting pair. */
const expectNoConflicts = (value: string, where: string) =>
  expect(cn(value)?.split(" ").sort(), `${where}`).toEqual(
    value.split(" ").sort(),
  )

describe("typography axis", () => {
  it("Origin writes no type token and the default params", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    for (const name of TITLE_SLOTS)
      expect(ds.componentParams[name]?.titles, `${name}`).toBe("quiet")
    for (const name of ["menu", "list-box", "sidebar"])
      expect(ds.componentParams[name]?.labels, `${name}`).toBe("sentence")
  })

  it("Quiet titles flatten to each tier's classes", async () => {
    const gap =
      "text-pretty [&:not(:has(~[data-questionnaire-description]))]:mb-(--questionnaire-title-gap)"
    const before: Record<string, Record<string, string>> = {
      card: {
        compact: "font-heading text-sm font-medium",
        default: "font-heading text-base leading-snug font-medium",
        comfortable:
          "font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
        touch:
          "font-heading text-lg leading-normal font-medium group-data-[size=sm]/card:text-base",
      },
      dialog: {
        compact: "font-heading text-sm font-medium",
        default:
          "font-heading font-medium in-data-modal:text-base in-data-modal:leading-none",
        comfortable:
          "font-heading text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium",
        touch:
          "font-heading text-lg font-semibold in-data-modal:leading-none in-data-popover:text-base in-data-popover:font-medium",
      },
      empty: {
        compact: "font-heading text-sm font-medium tracking-tight",
        default: "font-heading text-base font-medium tracking-tight",
        comfortable: "font-heading text-lg font-medium tracking-tight",
        touch: "font-heading text-lg font-medium tracking-tight",
      },
      questionnaire: {
        compact: `${gap} text-sm font-semibold`,
        default: `${gap} text-base leading-snug font-medium`,
        comfortable: `${gap} text-base leading-snug font-medium`,
        touch: `${gap} text-lg leading-snug font-medium`,
      },
    }
    for (const name of TITLE_SLOTS)
      for (const density of DENSITIES)
        expect(
          await slot(name, "title", density, { titles: "quiet" }),
          `${name}/${density}`,
        ).toBe(before[name]?.[TITLE_TIER[density]])
  })

  it("Compact titles sit on the tier's text rung; Quiet and Tight above it", async () => {
    const rung: Record<Density, string> = {
      compact: "text-xs",
      default: "text-sm",
      comfortable: "text-sm",
      spacious: "text-sm",
      touch: "text-base",
    }
    const size = /\btext-(xs|sm|base|lg|xl|\dxl)\b/
    const steps = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"]
    for (const name of ["card", "empty", "questionnaire"])
      for (const density of DENSITIES) {
        const where = `${name}/${density}`
        const compact = await slot(name, "title", density, {
          titles: "compact",
        })
        expect(compact.match(size)?.[0], `${where}`).toBe(rung[density])
        for (const titles of ["quiet", "tight"]) {
          const title = await slot(name, "title", density, { titles })
          const step = steps.indexOf(title.match(size)?.[0] ?? "")
          expect(step, `${where}/${titles}`).toBeGreaterThan(
            steps.indexOf(rung[density]),
          )
        }
      }
  })

  it("non-title headings opt out of the heading face and tracking", async () => {
    const headings: [string, string, Record<string, string>][] = [
      ["accordion", "heading", {}],
      ["calendar", "heading", {}],
      ["sidebar", "groupLabel", { labels: "sentence" }],
      ["sidebar", "groupLabel", { labels: "caps" }],
      ["sidebar", "groupLabel", { labels: "mono-caps" }],
    ]
    for (const [name, slotName, params] of headings)
      for (const density of DENSITIES) {
        const value = await slot(name, slotName, density, params)
        const where = `${name}.${slotName}/${density}/${params.labels}`
        expect(value, `${where}`).toMatch(
          params.labels === "mono-caps" ? /\bfont-mono\b/ : /\bfont-sans\b/,
        )
        expect(value, `${where}`).toMatch(/\btracking-(normal|wider)\b/)
        expectNoConflicts(value, `${where}`)
      }
  })

  it("every title recipe ships one size, weight, tracking and case", async () => {
    for (const name of TITLE_SLOTS)
      for (const { value } of TITLE_OPTIONS)
        for (const density of DENSITIES) {
          const title = await slot(name, "title", density, { titles: value })
          expectNoConflicts(title, `${name}/${value}/${density}`)
          expect(title, `${name}/${value}/${density}`).toMatch(/\bfont-\w+/)
        }
  })

  it("non-Quiet titles hand base h1–h6 their weight and tracking", () => {
    expect(designSystemOf(parseState({ titleStyle: "tight" })).tokens).toEqual({
      "--font-weight-heading": "var(--font-weight-semibold)",
      "--tracking-heading": "var(--tracking-tight)",
    })
    expect(
      designSystemOf(parseState({ titleStyle: "display" })).tokens,
    ).toEqual({ "--font-weight-heading": "var(--font-weight-normal)" })
  })

  it("label weight reaches actions only, as a plain class", async () => {
    const { tokens } = designSystemOf(parseState({ labelWeight: "semibold" }))
    expect(tokens).toEqual({
      "--studio-font-weight-label": "var(--font-weight-semibold)",
    })
    for (const name of ["button", "toggle-button", "group"]) {
      const origin = await shipped(name)
      const semibold = await shipped(name, tokens)
      expect(origin, `${name}`).toContain("font-medium")
      expect(semibold, `${name}`).toContain("font-semibold")
      expect(semibold, `${name}`).not.toContain("--studio-")
    }
    for (const name of ["tabs", "segmented-control"])
      expect(await shipped(name, tokens), `${name}`).not.toContain(
        "font-semibold",
      )
  })

  it("13px re-points the density's own text rung; Auto writes nothing", () => {
    expect(designSystemOf(parseState({ uiTextSize: "13" })).tokens).toEqual({
      "--text-sm": "0.8125rem",
      "--text-sm--line-height": "calc(20 / 13)",
    })
    expect(
      designSystemOf(parseState({ uiTextSize: "13", density: "compact" }))
        .tokens,
    ).toEqual({
      "--text-xs": "0.8125rem",
      "--text-xs--line-height": "calc(16 / 13)",
    })
  })

  it("Touch's own rung is base, in its 24px line box", () => {
    for (const uiTextSize of ["13", "14"])
      expect(
        designSystemOf(parseState({ uiTextSize, density: "touch" })).tokens,
      ).toEqual({
        "--text-base": `${Number(uiTextSize) / 16}rem`,
        "--text-base--line-height": `calc(24 / ${uiTextSize})`,
      })
  })

  it("14px re-points the compact rung and is Auto elsewhere", () => {
    expect(
      designSystemOf(parseState({ uiTextSize: "14", density: "compact" }))
        .tokens,
    ).toEqual({
      "--text-xs": "0.875rem",
      "--text-xs--line-height": "calc(16 / 14)",
    })
    for (const density of ["default", "comfortable", "spacious"]) {
      const state = parseState({ uiTextSize: "14", density })
      expect(effective(state).values.uiTextSize, `${density}`).toBe("auto")
      expect(designSystemOf(state).tokens, `${density}`).toEqual({})
    }
  })

  it("section labels set the case and face of every section header", async () => {
    for (const labels of SECTION_LABEL_OPTIONS.map((o) => o.value)) {
      const ds = designSystemOf(parseState({ sectionLabels: labels }))
      for (const name of ["menu", "list-box", "sidebar"])
        expect(ds.componentParams[name]?.labels, `${name}`).toBe(labels)
      for (const [name, slotName] of [
        ["sidebar", "groupLabel"],
        ["list-box", "sectionTitle"],
        ["menu", "sectionTitle"],
      ] as const)
        for (const density of DENSITIES) {
          const label = await slot(name, slotName, density, { labels })
          const where = `${name}/${labels}/${density}`
          expectNoConflicts(label, `${where}`)
          expect(label.includes("uppercase"), `${where}`).toBe(
            labels !== "sentence",
          )
          expect(label.includes("font-mono"), `${where}`).toBe(
            labels === "mono-caps",
          )
        }
    }
  })

  it("list-box, menu and sidebar share one section-label recipe", async () => {
    const recipe = (value: string) =>
      value
        .split(" ")
        .filter((c) =>
          /^(uppercase|font-mono|tracking-|text-(xs|sm|\[))/.test(c),
        )
        .filter((c) => c !== "tracking-normal")
        .sort()
    for (const { value: labels } of SECTION_LABEL_OPTIONS) {
      const expected = recipe(
        { sentence: "text-xs", caps: CAPS, "mono-caps": MONO_CAPS }[labels],
      )
      for (const density of DENSITIES)
        for (const [name, slotName] of [
          ["list-box", "sectionTitle"],
          ["menu", "sectionTitle"],
          ["sidebar", "groupLabel"],
        ] as const)
          expect(
            recipe(await slot(name, slotName, density, { labels })),
            `${name}/${labels}/${density}`,
          ).toEqual(expected)
    }
  })
})

describe("reading font", () => {
  it("follows the body and writes nothing until pinned", () => {
    for (const bodyFont of ["Geist", "Inter"]) {
      const state = parseState({ bodyFont })
      expect(effective(state).values.readingFont).toBe(bodyFont)
      expect(designSystemOf(state).tokens["--font-reading"]).toBeUndefined()
    }
  })

  it("a pinned face writes --font-reading and ships its font item", () => {
    const { tokens } = designSystemOf(
      parseState({ bodyFont: "Inter", readingFont: "Source Serif 4" }),
    )
    expect(tokens["--font-reading"]).toBe(fontStack("Source Serif 4"))
    expect(fontFamiliesFromTokens(tokens)).toContain("Source Serif 4")
    expect(fontItemNamesForTokens(tokens)).toContain(
      "font-reading-source-serif-4",
    )
    expect(parseFontItemName("font-reading-source-serif-4")).toEqual({
      variable: "--font-reading",
      family: "Source Serif 4",
    })
  })

  it("incoming prose reads it; controls, your own and the metadata stay body", async () => {
    const tw = await compile(
      `@import "tailwindcss/utilities"; @theme { --font-reading: serif; }`,
      { base: path.resolve(__dirname, "../../.."), onDependency() {} },
    )
    for (const density of DENSITIES) {
      const content = await slot("message", "content", density, {})
      const css = tw.build(content.split(" "))
      const rules = css
        .split(/\n(?=\.)/)
        .filter((r) => r.includes("--font-reading)"))
      expect(rules, `${density}`).toHaveLength(1)
      // Only prose elements of a start-aligned message: a button or badge
      // never takes the reading face.
      expect(rules[0], `${density}`).toContain('[data-align="start"]')
      expect(rules[0], `${density}`).toMatch(
        /& :is\(p,li,blockquote,h1,h2,h3,h4,h5,h6\) \{/,
      )
      for (const meta of ["header", "footer"])
        expect(await slot("message", meta, density, {})).toMatch(
          /\bfont-sans\b/,
        )
    }
    for (const name of ["button", "badge"])
      expect(await shipped(name), `${name}`).not.toContain("font-reading")
  })
})

describe("field text size", () => {
  const FIELD_SLOTS = ["inputGroup", "input", "textArea", "trigger"]
  const SAME: Record<Density, string> = {
    compact: "text-base sm:text-xs/relaxed",
    default: "text-base sm:text-sm",
    comfortable: "text-base sm:text-sm",
    spacious: "text-base sm:text-sm",
    touch: "text-base",
  }
  const LARGE: Record<Density, string> = {
    compact: "text-base sm:text-sm",
    default: "text-base",
    comfortable: "text-base",
    spacious: "text-base",
    touch: "text-base",
  }

  it("Same keeps the density's control text; Large is one rung up", async () => {
    for (const [text, sizes] of [
      ["same", SAME],
      ["large", LARGE],
    ] as const)
      for (const density of DENSITIES)
        for (const slotName of FIELD_SLOTS) {
          const value = await slot("input", slotName, density, { text })
          const where = `${slotName}/${text}/${density}`
          expect(value, `${where}`).toContain(sizes[density])
          expect(
            value.match(/(?:^|\s)text-(?:xs|sm|base)\b/g),
            `${where}`,
          ).toHaveLength(1)
          expectNoConflicts(value, `${where}`)
        }
  })

  it("Origin writes the default; Large reaches the input param", () => {
    expect(designSystemOf(DEFAULT_STATE).componentParams.input?.text).toBe(
      "same",
    )
    expect(
      designSystemOf(parseState({ fieldTextSize: "large" })).componentParams
        .input?.text,
    ).toBe("large")
  })

  it("Touch pins Same: its controls already set 16px", () => {
    const state = parseState({ fieldTextSize: "large", density: "touch" })
    expect(effective(state).values.fieldTextSize).toBe("same")
    expect(effective(state).explain.fieldTextSize?.lock?.kind).toBe("pin")
  })
})

describe("System font", () => {
  it("emits the platform stack and loads nothing", () => {
    for (const family of ["System", "System Mono"]) {
      expect(isSystemFamily(family)).toBe(true)
      expect(familyFromStack(fontStack(family))).toBe(family)
    }
    const { tokens } = designSystemOf(
      parseState({ bodyFont: "System", monoFont: "System Mono" }),
    )
    expect(tokens["--font-sans"]).toMatch(/^-apple-system, /)
    expect(tokens["--font-mono"]).toMatch(/^ui-monospace, /)
    expect(tokens["--font-heading"]).toBeUndefined()
    expect(fontFamiliesFromTokens(tokens)).toEqual([])
    expect(fontItemNamesForTokens(tokens)).toEqual([])
  })
})
