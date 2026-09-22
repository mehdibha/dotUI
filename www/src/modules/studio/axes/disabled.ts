/* Disabled — how the system says "not now", everywhere at once: solid grey,
   fade, or ink alphas.

   Engine: the `--disabled-*` tokens declared in base.css. Every disabled
   recolor in the registry reads one of them with the control's own color as
   the fallback (`disabled:bg-(--disabled-bg,var(--color-danger))`), so fade
   unsets them (`initial`) and dims through `--disabled-opacity`, while the
   recolor treatments re-point them. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const DISABLED_DEFAULTS = {
  disabledTreatment: "solid",
}

export const TREATMENT_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description:
      "Opaque grey: fills become the neutral disabled step, text and icons " +
      "the disabled gray, selected checks and switches grey too — every " +
      "variant collapses to the same grey control.",
    seenIn: ["Spectrum 2", "Geist", "Fluent 2", "Carbon", "Mantine"],
  },
  {
    value: "fade",
    label: "Fade",
    description:
      "The control keeps its own colors and the whole thing drops to 50% " +
      "opacity, so a disabled primary still reads as primary.",
    seenIn: ["shadcn/ui", "HeroUI", "Chakra UI", "coss ui", "Supabase"],
  },
  {
    value: "alpha",
    label: "Alpha",
    description:
      "No opacity: fills become the text color at 12% and text at 38%; " +
      "selected fills take 38% with page-color marks. Neutral like Solid, " +
      "but translucent over any surface.",
    seenIn: ["Material 3", "Radix Themes", "Ant Design"],
  },
]

const DISABLED_TOKENS = [
  "--disabled-bg",
  "--disabled-fg",
  "--disabled-border",
  "--disabled-selected-bg",
  "--disabled-selected-fg",
  "--disabled-unselected-bg",
  "--color-primary-disabled",
]

const ink = (pct: number) =>
  `color-mix(in oklab, var(--color-fg) ${pct}%, transparent)`

const TREATMENT_TOKENS: Record<string, Record<string, string>> = {
  fade: {
    ...Object.fromEntries(DISABLED_TOKENS.map((name) => [name, "initial"])),
    "--disabled-opacity": "0.5",
  },
  alpha: {
    "--disabled-bg": ink(12),
    "--disabled-fg": ink(38),
    "--disabled-border": ink(12),
    "--disabled-selected-bg": ink(38),
    "--disabled-selected-fg": "var(--color-bg)",
    "--disabled-unselected-bg": ink(12),
    "--color-primary-disabled": ink(12),
  },
}

export function resolveDisabled(state: StudioState): Resolved {
  const tokens = TREATMENT_TOKENS[state.disabledTreatment]
  return tokens ? { tokens: { ...tokens } } : {}
}

export const DISABLED_SPEC = {
  label: "Disabled",
  description:
    "How every control looks when it can't be used — buttons, fields, " +
    "checks, switches, sliders, menu items.",
  axes: {
    disabledTreatment: {
      label: "Disabled",
      description:
        "The disabled treatment. Recolor treatments replace each control's " +
        "fill, text and border; Fade dims the outermost disabled element " +
        "instead.",
      value: { type: "enum", options: TREATMENT_OPTIONS },
      guidance:
        "Of 14 checked: 5 go solid grey (Spectrum 2, Geist, Fluent 2, " +
        "Carbon, Mantine), 5 fade to 50–64% (shadcn, HeroUI, Chakra, " +
        "coss ui, Supabase), 3 use ink alphas (Material 3 at 12/38%, " +
        "Radix Themes, Ant Design), and Primer keeps a disabled primary " +
        "in its own hue, lightened. Fade keeps variants " +
        "recognizable; Solid and Alpha give every variant one neutral " +
        "disabled look, and Alpha stays translucent over tinted or image " +
        "surfaces.",
    },
  },
} satisfies ChapterSpec<typeof DISABLED_DEFAULTS>
