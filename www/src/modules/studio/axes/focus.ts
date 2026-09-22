/* Focus — the ring recipe: one color (a leaf of Color's Primary), then the
   ring controls wear and the layer fields wear. Engine: the `--focus-ring-*` / `--focus-input-*` tokens
   in base.css that every `focus-ring` / `focus-input` consumer draws from,
   plus a semantic re-point of `--color-border-focus` for the neutral ink. */

import type { TokenOverrides } from "@/registry/theme"

import { SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { AxisOption, ChapterSpec } from "./spec"

/* Defaults mirror base.css: a 2px accent ring over a 2px bg gap; fields wear
   a 2px muted halo. */
export const FOCUS_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "ring",
  focusWidth: 2,
  focusOffset: "gap",
  focusGap: 2,
  focusHaloStrength: 45,
  focusInputStyle: "halo",
  focusInputWidth: 2,
  focusInputStrength: 30,
  focusInputBorderWidth: 1,
}

export const FOCUS_STYLE_OPTIONS = [
  {
    value: "ring",
    label: "Ring",
    description:
      "A solid stroke of the focus color around the control, placed by " +
      "Offset — by default 2px wide, outside a 2px gap in the page color.",
    seenIn: [
      "Radix Themes",
      "Spectrum 2",
      "Material 3",
      "Geist",
      "Primer",
      "Atlassian",
      "Polaris",
      "Mantine",
      "HeroUI",
      "Chakra UI",
      "Supabase",
      "coss ui",
      "Ant Design",
    ],
  },
  {
    value: "halo",
    label: "Halo",
    description:
      "The same ring in a translucent mix of the focus color — 45% by " +
      "default (Strength) — so it reads as a tint around the control.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "duo",
    label: "Duo",
    description:
      "Two strokes: a 1px page-color hairline just inside the edge and a " +
      "flush focus-color ring outside it, so the ring reads on any fill. " +
      "Offset is ignored.",
    seenIn: ["Fluent 2", "Carbon"],
  },
]

/** How a field wears the focus: every style also swaps the field's border
 *  to the focus color. */
export const FOCUS_INPUT_STYLE_OPTIONS = [
  {
    value: "halo",
    label: "Halo",
    description:
      "The border turns the focus color and a soft 2px halo of its muted " +
      "step spreads flush outside it.",
    seenIn: ["shadcn/ui", "Geist", "coss ui", "Ant Design"],
  },
  {
    value: "ring",
    label: "Ring",
    description:
      "The field wears the control ring exactly — same width, offset and " +
      "style — on top of the border swap.",
    seenIn: ["Supabase", "Spectrum 2", "Carbon"],
  },
  {
    value: "border",
    label: "Border",
    description:
      "No outer layer: the border turns the focus color and can thicken " +
      "inward (Width), so the box never shifts.",
    seenIn: ["Radix Themes", "Primer", "Material 3", "Mantine", "Chakra UI"],
  },
]

export const FOCUS_OFFSET_OPTIONS = [
  {
    value: "inset",
    label: "Inset",
    description:
      "The ring draws inside the control's border, over its fill; nothing " +
      "spills outside the box.",
    seenIn: ["Primer", "Carbon"],
  },
  {
    value: "flush",
    label: "Flush",
    description: "The ring hugs the outer edge with no gap.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "gap",
    label: "Gap",
    description:
      "A band of page color (Gap) separates the edge from the ring, so it " +
      "reads against any fill.",
    seenIn: [
      "Radix Themes",
      "Spectrum 2",
      "Material 3",
      "Geist",
      "Atlassian",
      "Mantine",
      "HeroUI",
      "Chakra UI",
      "Supabase",
      "Polaris",
      "Ant Design",
      "coss ui",
    ],
  },
]

/* The panel's slider ranges; the spec reads the same bounds. */
export const FOCUS_WIDTH_RANGE = { min: 1, max: 6, step: 1 }
export const FOCUS_GAP_RANGE = { min: 1, max: 6, step: 1 }
export const FOCUS_STRENGTH_RANGE = { min: 10, max: 100, step: 5 }
export const FOCUS_INPUT_WIDTH_RANGE = { min: 1, max: 8, step: 1 }
export const FOCUS_INPUT_BORDER_RANGE = { min: 1, max: 4, step: 1 }

export const mixFocus = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

const px = (n: number) => `${n}px`

/* The neutral ink re-points the focus pair to the neutral ramp at the steps
   the accent pair sits on (solid = 700, ui-active = 300). */
const NEUTRAL_FOCUS: TokenOverrides = {
  "color-border-focus": { palette: "neutral", job: "solid" },
  "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
}

export function resolveFocus(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const d = FOCUS_DEFAULTS

  if (state.focusWidth !== d.focusWidth)
    tokens["--focus-ring-width"] = px(state.focusWidth)
  if (state.focusStyle === "halo")
    tokens["--focus-ring-color"] = mixFocus(
      "var(--color-border-focus)",
      state.focusHaloStrength,
    )
  if (state.focusStyle === "duo") {
    tokens["--focus-ring-inner"] = "1px"
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusOffset === "inset") {
    tokens["--focus-ring-inset"] = "inset"
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusOffset === "flush") {
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusGap !== d.focusGap) {
    tokens["--focus-ring-offset"] = px(state.focusGap)
  }

  switch (state.focusInputStyle) {
    case "halo":
      if (state.focusInputWidth !== d.focusInputWidth)
        tokens["--focus-input-width"] = px(state.focusInputWidth)
      if (state.focusInputStrength !== d.focusInputStrength)
        tokens["--focus-input-color"] = mixFocus(
          "var(--color-border-focus)",
          state.focusInputStrength,
        )
      break
    case "ring":
      tokens["--focus-input-width"] = "var(--focus-ring-width)"
      tokens["--focus-input-offset"] = "var(--focus-ring-offset)"
      tokens["--focus-input-inner"] = "var(--focus-ring-inner)"
      tokens["--focus-input-color"] = "var(--focus-ring-color)"
      if (tokens["--focus-ring-inset"]) tokens["--focus-input-inset"] = "inset"
      break
    case "border":
      // The field's own 1px border swaps color; the rest of the width is an
      // inset stroke, so the box never shifts.
      tokens["--focus-input-inset"] = "inset"
      tokens["--focus-input-offset"] = "0px"
      tokens["--focus-input-width"] = px(state.focusInputBorderWidth - 1)
      tokens["--focus-input-color"] = "var(--color-border-focus)"
      break
  }

  return state.focusColor === "neutral"
    ? { tokens, color: { overrides: NEUTRAL_FOCUS } }
    : { tokens }
}

const FOCUS_INKS: Record<string, Pick<AxisOption, "description" | "seenIn">> = {
  neutral: {
    description:
      "A gray ring from the neutral ramp (step 700); the field halo takes " +
      "its light step (300).",
    seenIn: ["shadcn/ui", "Fluent 2"],
  },
  accent: {
    description:
      "The ring in the accent's solid step (700), or the selection seed's " +
      "when one is set; the field halo takes its light step (300).",
    seenIn: [
      "Radix Themes",
      "Spectrum 2",
      "Material 3",
      "Primer",
      "Atlassian",
      "Mantine",
      "HeroUI",
      "Geist",
      "Polaris",
    ],
  },
}

export const FOCUS_SPEC = {
  label: "Focus",
  description:
    "The keyboard focus indicator: the ring controls wear (buttons, " +
    "toggles, checks, tabs…) and the layer text fields wear, both drawn in " +
    "one focus color.",
  axes: {
    focusColor: {
      label: "Focus ring",
      description:
        "Which ink the ring and the focused field border draw from. A leaf " +
        "of Color's Primary.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          ...FOCUS_INKS[option.value],
        })),
      },
      guidance:
        "9 of 11 checked tie focus to a blue or brand accent, even when " +
        "their primary buttons are black (Geist, Polaris); shadcn's gray " +
        "ring and Fluent's black one are the neutral school. Pick neutral " +
        "for a monochrome system, accent otherwise.",
    },
    focusStyle: {
      label: "Control focus",
      description:
        "What the ring around a focused control looks like. Shows on " +
        "keyboard focus only.",
      value: { type: "enum", options: FOCUS_STYLE_OPTIONS },
      guidance:
        "Ring is the norm: 13 of 16 checked. Halo is shadcn's signature " +
        "(3px, 50%, flush); Fluent 2 and Carbon's primary buttons pair the " +
        "ink with a page-color hairline — pick Duo when controls are dark " +
        "or saturated fills.",
    },
    focusWidth: {
      label: "Width",
      description: "The control ring's thickness.",
      value: { type: "number", unit: "px", ...FOCUS_WIDTH_RANGE },
      guidance:
        "2px in 13 of 16 checked; Material 3, shadcn and Ant Design use 3px.",
    },
    focusOffset: {
      label: "Offset",
      description:
        "Where the control ring sits relative to the edge. Duo ignores it.",
      value: { type: "enum", options: FOCUS_OFFSET_OPTIONS },
      guidance:
        "Gap in 12 of 16 checked. Inset (Primer, Carbon) suits dense " +
        "toolbars and tables where an outer ring would clip or overlap; " +
        "Flush pairs with Halo for the shadcn look.",
    },
    focusGap: {
      label: "Gap",
      description:
        "Width of the page-color band between control and ring. Read only " +
        "when Offset is Gap.",
      value: { type: "number", unit: "px", ...FOCUS_GAP_RANGE },
      guidance:
        "2px in 9 of the 12 gap systems checked; Polaris, Ant Design and " +
        "coss ui use 1px.",
    },
    focusHaloStrength: {
      label: "Strength",
      description:
        "Opacity of the Halo ring, as the percent of focus color mixed " +
        "with transparent. Read only by Halo.",
      value: { type: "number", unit: "%", ...FOCUS_STRENGTH_RANGE },
      guidance: "shadcn uses 50% on a neutral ring.",
    },
    focusInputStyle: {
      label: "Field focus",
      description:
        "How a focused text field (input, textarea, combobox, token field) " +
        "shows focus. Shows on any focus, pointer included, since the " +
        "caret lands there. Applies to the Outline and Filled field " +
        "styles (Inputs); Line and Filled line fields only turn their " +
        "underline the focus color.",
      value: { type: "enum", options: FOCUS_INPUT_STYLE_OPTIONS },
      guidance:
        "Of 12 checked: 5 swap and thicken the border (Radix Themes, " +
        "Primer, Material 3, Mantine, Chakra), 4 add a halo (shadcn, " +
        "Geist, coss ui, Ant Design), 3 reuse the control ring (Supabase, " +
        "Spectrum 2, Carbon).",
    },
    focusInputWidth: {
      label: "Width",
      description:
        "The field halo's spread. Read only by the Halo field style.",
      value: { type: "number", unit: "px", ...FOCUS_INPUT_WIDTH_RANGE },
      guidance:
        "Geist spreads 3px beyond its border, shadcn and coss ui 3px, Ant " +
        "Design 2px.",
    },
    focusInputStrength: {
      label: "Strength",
      description:
        "The field halo's opacity. At 30 it is the focus color's muted " +
        "step; any other value mixes the focus color at that percent with " +
        "transparent. Read only by the Halo field style.",
      value: { type: "number", unit: "%", ...FOCUS_STRENGTH_RANGE },
    },
    focusInputBorderWidth: {
      label: "Width",
      description:
        "The focused border's total thickness: the 1px border swaps color " +
        "and the rest is an inset stroke. Read only by the Border field " +
        "style.",
      value: { type: "number", unit: "px", ...FOCUS_INPUT_BORDER_RANGE },
      guidance:
        "2px is the common choice (Radix Themes, Primer, Material 3); 1px " +
        "is a pure color swap (Mantine).",
    },
  },
} satisfies ChapterSpec<typeof FOCUS_DEFAULTS>
