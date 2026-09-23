/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch
   ⇄ Choice cards). Fill is per control, a leaf of Color's Primary: on the
   selection tokens' source (the three controls' majority) it paints with
   them, off it it forks — Geist runs near-black checkboxes beside a blue
   toggle. Corner is checkbox-only geometry.

   Engine: a fork re-declares the selection tokens under `[data-checkbox]`
   (the recipe's `scopes`), so the component's classes never change. Corner
   rides on the `--studio-checkbox-radius` surface var, resolved to a plain
   `rounded-*` utility on export. */

import { fillScope, PRIMARY_LEAF_LABELS, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const CHECKBOX_DEFAULTS = {
  checkboxColor: "neutral",
  checkCorner: "rounded",
}

export const CORNER_OPTIONS = [
  {
    value: "rounded",
    label: "Rounded",
    description:
      "The sm rung — half the base radius, 5px at the default 10px base.",
    seenIn: ["shadcn/ui", "Radix Themes", "Ant Design"],
  },
  {
    value: "square",
    label: "Square",
    description:
      "The xs rung — a quarter of the base radius, 2.5px at the default " +
      "base; reads as a square with softened corners.",
    seenIn: ["Material 3", "Carbon"],
  },
  {
    value: "circle",
    label: "Circle",
    description: "A round box, like a task-list check.",
    seenIn: ["Fluent 2"],
  },
]

const SEEN_IN: Record<string, string[]> = {
  neutral: ["shadcn/ui", "Geist", "Carbon", "Spectrum 2"],
  accent: ["Radix Themes", "Material 3", "Primer", "Fluent 2"],
}

const CORNER_TOKENS: Record<string, string> = {
  square: "var(--radius-xs)",
  circle: "var(--radius-full)",
}

export function resolveCheckbox(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const corner = CORNER_TOKENS[state.checkCorner]
  if (corner) tokens["--studio-checkbox-radius"] = corner
  return { tokens, color: fillScope(state, "checkbox", state.checkboxColor) }
}

export const CHECKBOX_SPEC = {
  label: "Checkbox",
  description: "The checked fill and the corner shape of the checkbox box.",
  axes: {
    checkboxColor: {
      label: PRIMARY_LEAF_LABELS.checkboxColor,
      description:
        "What fills a checked or indeterminate box. A leaf of Color's " +
        "Primary: when Radio or Switch shares its value it paints with the " +
        "selection tokens; alone against both it forks to its own source.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          seenIn: SEEN_IN[option.value],
        })),
      },
      guidance:
        "Systems split evenly: of 8 checked, shadcn/ui, Geist, Carbon and " +
        "Spectrum 2 check in near-black; Radix Themes, Material 3, Primer " +
        "and Fluent 2 in the brand. Keep it on the same source as Radio: " +
        "shadcn/ui, Radix Themes, Material 3, Primer and Carbon all fill " +
        "the two alike.",
    },
    checkCorner: {
      label: "Checkbox",
      description:
        "The box's corner radius, as a rung of the Shape ladder so it scales " +
        "with the base radius. Radio stays a circle and Switch a pill.",
      value: { type: "enum", options: CORNER_OPTIONS },
      guidance:
        "Most systems round the box slightly: shadcn/ui and Ant Design 4px, " +
        "Radix Themes about 3px. Material 3 and Carbon keep it at 2px. " +
        "Fluent 2 offers a circular checkbox but reserves it for task " +
        "lists, where it can't be mistaken for a radio.",
    },
  },
} satisfies ChapterSpec<typeof CHECKBOX_DEFAULTS>
