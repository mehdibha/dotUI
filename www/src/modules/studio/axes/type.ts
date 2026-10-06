/* Typography — the three font roles, the component-title recipe, the UI text
   size, the weight of action labels and the case of section labels.

   Engine: faces are `--font-*` tokens (loaded from Google Fonts, shipped as
   registry:font items; System loads nothing). Titles is a `titles` enum param
   on every title slot; non-Quiet recipes also write the base h1–h6 weight and
   tracking. Label weight rides the builder var `--studio-font-weight-label`,
   read by actions only (Button, ToggleButton, GroupText). 13px re-points the
   density's text rung. Section labels is a `labels` param on the menu,
   list-box and sidebar section headers. */

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
  titleStyle: "quiet",
  uiTextSize: "auto",
  labelWeight: "medium",
  sectionLabels: "sentence",
}

/* Size, weight, tracking and case move together; each is a copied recipe. */
export const TITLE_OPTIONS = [
  { value: "quiet", label: "Quiet", description: "shadcn" },
  { value: "compact", label: "Compact", description: "Primer, Polaris" },
  { value: "tight", label: "Tight", description: "Geist, Linear" },
  { value: "bold", label: "Bold", description: "Radix Themes, Atlassian" },
  { value: "display", label: "Display", description: "Material 3, Carbon" },
  { value: "caps", label: "Caps", description: "shadcn sera" },
]

/* Auto is density's text step (shadcn nova/vega 14px, mira 12px). */
export const UI_TEXT_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "13", label: "13px", description: "Linear, Polaris" },
]

export const LABEL_WEIGHT_OPTIONS = [
  { value: "normal", label: "Normal", description: "Carbon, Ant Design" },
  { value: "medium", label: "Medium", description: "shadcn, Geist, Primer" },
  { value: "semibold", label: "Semibold", description: "Untitled UI, Fluent" },
  { value: "bold", label: "Bold", description: "Duolingo" },
]

/* Sentence: Spectrum 2, Atlassian. Caps: shadcn sera, Supabase, Duolingo. */
export const SECTION_LABEL_OPTIONS = [
  { value: "sentence", label: "Sentence" },
  { value: "caps", label: "Caps" },
]

export const TYPE_SCHEMA: ChapterSchema<typeof TYPE_DEFAULTS> = {
  headingFont: FONT,
  bodyFont: FONT,
  monoFont: FONT,
  titleStyle: oneOf(TITLE_OPTIONS),
  uiTextSize: oneOf(UI_TEXT_OPTIONS),
  labelWeight: oneOf(LABEL_WEIGHT_OPTIONS),
  sectionLabels: oneOf(SECTION_LABEL_OPTIONS),
}

/** What a non-Quiet title recipe hands base h1–h6. */
const HEADING_VOICE: Record<string, { weight: string; tracking?: string }> = {
  compact: { weight: "semibold" },
  tight: { weight: "semibold", tracking: "tight" },
  bold: { weight: "bold" },
  display: { weight: "normal" },
  caps: { weight: "semibold", tracking: "wider" },
}

export const LABEL_WEIGHT_VAR = "--studio-font-weight-label"

export function resolveType(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  if (state.bodyFont !== DEFAULT_BODY_FAMILY)
    tokens["--font-sans"] = fontStack(state.bodyFont)
  // The theme's own fallback follows the body: a heading on the body family
  // encodes as nothing.
  if (state.headingFont !== state.bodyFont)
    tokens["--font-heading"] = fontStack(state.headingFont)
  if (state.monoFont !== DEFAULT_MONO_FAMILY)
    tokens["--font-mono"] = fontStack(state.monoFont)

  const voice = HEADING_VOICE[state.titleStyle]
  if (voice) {
    tokens["--font-weight-heading"] = `var(--font-weight-${voice.weight})`
    if (voice.tracking)
      tokens["--tracking-heading"] = `var(--tracking-${voice.tracking})`
  }

  if (state.labelWeight !== TYPE_DEFAULTS.labelWeight)
    tokens[LABEL_WEIGHT_VAR] = `var(--font-weight-${state.labelWeight})`

  // 13px replaces the density's own text rung, keeping its line box.
  if (state.uiTextSize === "13") {
    const [rung, lineBox] =
      state.density === "compact" ? ["xs", 16] : ["sm", 20]
    tokens[`--text-${rung}`] = "0.8125rem"
    tokens[`--text-${rung}--line-height`] = `calc(${lineBox} / 13)`
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
    },
  }
}

export const chapter = defineChapter({
  id: "type",
  defaults: TYPE_DEFAULTS,
  schema: TYPE_SCHEMA,
  resolve: resolveType,
  follows: { headingFont: [{ kind: "same", id: "same", from: "bodyFont" }] },
})
