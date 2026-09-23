/* Typography — the three font roles. Heading, body and mono are what shipped
   systems expose and what the registry consumes (`--font-*` tokens, loaded
   from Google Fonts, shipped as registry:font items). Heading weight and
   tracking were cut (Sept 2026): only base.css's h1–h6 rule read them, every
   component title pins its own weight, so the axis never showed. */

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  fontStack,
} from "@/lib/fonts"

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const TYPE_DEFAULTS = {
  // heading mirrors --font-heading: '' = Auto, follows body.
  headingFont: "",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
}

export function resolveType(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.bodyFont !== DEFAULT_BODY_FAMILY)
    tokens["--font-sans"] = fontStack(state.bodyFont)
  // Auto ('') follows the body through the theme's own fallback; a heading
  // pinned to the body family is the same thing and encodes as nothing.
  if (state.headingFont && state.headingFont !== state.bodyFont)
    tokens["--font-heading"] = fontStack(state.headingFont)
  if (state.monoFont !== DEFAULT_MONO_FAMILY)
    tokens["--font-mono"] = fontStack(state.monoFont)
  return { tokens }
}

export const TYPE_SPEC = {
  label: "Typography",
  description:
    "The three font roles — heading, body and mono — shipped as " +
    "`--font-heading`, `--font-sans` and `--font-mono`. Each takes a " +
    "family from a curated catalog: the Google Fonts families with a " +
    "variable weight axis (about 540). Static-only families, such as IBM " +
    "Plex Mono, aren't in it. Text sizes are fixed by density, not here.",
  axes: {
    headingFont: {
      label: "Heading",
      description:
        "The face for h1–h6 and the titles of Card, Dialog and Empty. " +
        "Weights and sizes stay with each component.",
      value: { type: "font" },
      auto: "Follows Body — `--font-heading` falls back to `--font-sans`.",
      guidance:
        "Material 3 splits a brand face (display, headline, large titles) " +
        "from a plain face (body, labels); shadcn/ui's builder (heading " +
        "'inherit' by default) and Radix Themes (`--heading-font-family` " +
        "defaults to the body family) make the split optional, as here. " +
        "Leave it on Auto for product UIs; pick a serif or display face " +
        "only when the brand is editorial or expressive — headings are few " +
        "in an app, so the face carries less than in marketing.",
    },
    bodyFont: {
      label: "Body",
      description:
        "The face of all UI and running text — every control, label and " +
        "paragraph inherits it.",
      value: { type: "font" },
      guidance:
        "Material 3 defaults to Roboto, shadcn/ui's builder to Inter, " +
        "dotUI to Geist. " +
        "Pick a sans with a large x-height for dense UIs; a serif body " +
        "suits reading-first products, not dashboards. The font's figures " +
        "don't align columns on their own: tabular-nums is only set on a " +
        "few readouts (slider and progress values, OTP and time-picker " +
        "digits), not on tables, number fields or body text.",
    },
    monoFont: {
      label: "Mono",
      description: "The monospace face — code, Kbd keys and OTP field digits.",
      value: { type: "font", category: "mono" },
      guidance:
        "Radix Themes (`--code-font-family`) and shadcn/ui (`--font-mono`) " +
        "expose it as its own token; Material 3 has no mono role. A mono " +
        "from the body's own superfamily (Geist Mono with Geist, Roboto " +
        "Mono with Roboto, Red Hat Mono with Red Hat Text) reads most " +
        "coherent.",
    },
  },
} satisfies ChapterSpec<typeof TYPE_DEFAULTS>
