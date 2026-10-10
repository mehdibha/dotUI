/* Typography: fonts, titles, text sizes, label weight, section labels. */

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  fontStack,
} from "@/lib/fonts"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { FONT, oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TYPE_DEFAULTS = {
  // Same as body until pinned; --font-heading falls back to the body face.
  headingFont: "same",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  // Same as body until pinned; incoming chat messages read in it.
  readingFont: "same",
  titleStyle: "quiet",
  uiTextSize: "auto",
  fieldTextSize: "same",
  labelWeight: "medium",
  sectionLabels: "sentence",
}

/* Size, weight, tracking and case move together; each is a copied recipe. */
export const TITLE_VALUES = [
  "quiet",
  "compact",
  "tight",
  "bold",
  "display",
  "caps",
] as const

/* Auto is density's text step (shadcn nova/vega 14px, mira 12px, Touch 16px). */
export const UI_TEXT_VALUES = ["auto", "13", "14"] as const

/* Large: field values one rung above control text. */
export const FIELD_TEXT_VALUES = ["same", "large"] as const

export const LABEL_WEIGHT_VALUES = [
  "normal",
  "medium",
  "semibold",
  "bold",
] as const

export const SECTION_LABEL_VALUES = ["sentence", "caps", "mono-caps"] as const

export const TYPE_SCHEMA: ChapterSchema<typeof TYPE_DEFAULTS> = {
  headingFont: FONT,
  bodyFont: FONT,
  monoFont: FONT,
  readingFont: FONT,
  titleStyle: oneOf(TITLE_VALUES),
  uiTextSize: oneOf(UI_TEXT_VALUES),
  fieldTextSize: oneOf(FIELD_TEXT_VALUES),
  labelWeight: oneOf(LABEL_WEIGHT_VALUES),
  sectionLabels: oneOf(SECTION_LABEL_VALUES),
}

/** What a non-Quiet title recipe hands base h1–h6. */
export const TITLE_VOICE: Record<
  string,
  { weight: string; tracking?: string }
> = {
  compact: { weight: "semibold" },
  tight: { weight: "semibold", tracking: "tight" },
  bold: { weight: "bold" },
  display: { weight: "normal" },
  caps: { weight: "semibold", tracking: "wider" },
}

export const LABEL_WEIGHT_VAR = "--studio-font-weight-label"

/* The density's control text rung and its line box; sm 20 elsewhere. */
const TEXT_RUNG: Record<string, [string, number]> = {
  compact: ["xs", 16],
  touch: ["base", 24],
}

export function resolveType(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  if (state.bodyFont !== DEFAULT_BODY_FAMILY)
    tokens["--font-sans"] = fontStack(state.bodyFont)
  // The theme's own fallbacks follow the body: a heading or reading face on
  // the body family encodes as nothing.
  if (state.headingFont !== state.bodyFont)
    tokens["--font-heading"] = fontStack(state.headingFont)
  if (state.readingFont !== state.bodyFont)
    tokens["--font-reading"] = fontStack(state.readingFont)
  if (state.monoFont !== DEFAULT_MONO_FAMILY)
    tokens["--font-mono"] = fontStack(state.monoFont)

  const voice = TITLE_VOICE[state.titleStyle]
  if (voice) {
    tokens["--font-weight-heading"] = `var(--font-weight-${voice.weight})`
    if (voice.tracking)
      tokens["--tracking-heading"] = `var(--tracking-${voice.tracking})`
  }

  if (state.labelWeight !== TYPE_DEFAULTS.labelWeight)
    tokens[LABEL_WEIGHT_VAR] = `var(--font-weight-${state.labelWeight})`

  // A px size replaces the density's own text rung, keeping its line box.
  if (state.uiTextSize !== "auto") {
    const px = Number(state.uiTextSize)
    const [rung, lineBox] = TEXT_RUNG[state.density] ?? ["sm", 20]
    tokens[`--text-${rung}`] = `${px / 16}rem`
    tokens[`--text-${rung}--line-height`] = `calc(${lineBox} / ${px})`
  }

  const titles = { titles: state.titleStyle }
  const labels = { labels: state.sectionLabels }
  return {
    tokens,
    params: {
      card: titles,
      dialog: titles,
      empty: titles,
      questionnaire: titles,
      menu: labels,
      "list-box": labels,
      sidebar: labels,
      input: { text: state.fieldTextSize },
    },
  }
}

export const chapter = defineChapter({
  id: "type",
  defaults: TYPE_DEFAULTS,
  schema: TYPE_SCHEMA,
  resolve: resolveType,
  follows: {
    headingFont: [{ kind: "same", id: "same", from: "bodyFont" }],
    readingFont: [{ kind: "same", id: "same", from: "bodyFont" }],
  },
  rules: [
    {
      // 14px is already the text between compact and touch.
      id: "type/14-is-native",
      target: "uiTextSize",
      when: { key: "density", notIn: ["compact", "touch"] },
      effect: { kind: "exclude", options: ["14"], fallback: "auto" },
      cause: "density",
    },
    {
      // Touch controls already set 16px, Large's size.
      id: "type/field-text-native",
      target: "fieldTextSize",
      when: { key: "density", in: ["touch"] },
      effect: { kind: "pin", value: "same" },
      cause: "density",
    },
  ],
})
