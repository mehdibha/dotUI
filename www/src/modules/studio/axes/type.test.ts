import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import {
  familyFromStack,
  fontFamiliesFromTokens,
  fontStack,
  isSystemFamily,
} from "@/lib/fonts"
import { publishables } from "@/registry/__generated__/publishables"
import type { Density } from "@/registry/types"
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

const DENSITIES: Density[] = ["compact", "default", "comfortable"]
const TITLE_SLOTS = ["card", "dialog", "empty", "questionnaire"]

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

  it("Quiet titles flatten to the classes they shipped before", async () => {
    const gap =
      "text-pretty [&:not(:has(~[data-questionnaire-description]))]:mb-(--questionnaire-title-gap)"
    const before: Record<string, Record<Density, string>> = {
      card: {
        compact: "font-heading text-sm font-medium",
        default: "font-heading text-base leading-snug font-medium",
        comfortable:
          "font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
      },
      dialog: {
        compact: "font-heading text-sm font-medium",
        default:
          "font-heading font-medium in-data-modal:text-base in-data-modal:leading-none",
        comfortable:
          "font-heading text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium",
      },
      empty: {
        compact: "font-heading text-sm font-medium tracking-tight",
        default: "font-heading text-base font-medium tracking-tight",
        comfortable: "font-heading text-lg font-medium tracking-tight",
      },
      questionnaire: {
        compact: `${gap} text-sm font-semibold`,
        default: `${gap} text-base leading-snug font-medium`,
        comfortable: `${gap} text-base leading-snug font-medium`,
      },
    }
    for (const name of TITLE_SLOTS)
      for (const density of DENSITIES)
        expect(
          await slot(name, "title", density, { titles: "quiet" }),
          `${name}/${density}`,
        ).toBe(before[name]?.[density])
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

  it("14px re-points the compact rung and is Auto elsewhere", () => {
    expect(
      designSystemOf(parseState({ uiTextSize: "14", density: "compact" }))
        .tokens,
    ).toEqual({
      "--text-xs": "0.875rem",
      "--text-xs--line-height": "calc(16 / 14)",
    })
    for (const density of ["default", "comfortable"])
      expect(
        designSystemOf(parseState({ uiTextSize: "14", density })).tokens,
        `${density}`,
      ).toEqual({})
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

  it("menu and list-box share one section-label recipe", async () => {
    for (const { value: labels } of SECTION_LABEL_OPTIONS)
      for (const density of DENSITIES)
        expect(await slot("menu", "sectionTitle", density, { labels })).toBe(
          await slot("list-box", "sectionTitle", density, { labels }),
        )
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

  it("incoming message text reads it; your own and the metadata stay body", async () => {
    for (const density of DENSITIES) {
      expect(await slot("message", "content", density, {})).toContain(
        "group-data-[align=start]/message:font-reading",
      )
      for (const meta of ["header", "footer"])
        expect(await slot("message", meta, density, {})).toMatch(
          /\bfont-sans\b/,
        )
    }
  })
})

describe("field text size", () => {
  const FIELD_SLOTS = ["inputGroup", "input", "textArea", "trigger"]
  const SAME: Record<Density, string> = {
    compact: "text-base sm:text-xs/relaxed",
    default: "text-base sm:text-sm",
    comfortable: "text-base sm:text-sm",
  }
  const LARGE: Record<Density, string> = {
    compact: "text-base sm:text-sm",
    default: "text-base",
    comfortable: "text-base",
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
            where,
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
