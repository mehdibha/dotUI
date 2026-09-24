/* Kbd — how a keyboard shortcut wears its chrome: plain muted text, a flat
   muted chip, or a raised keycap. Type is baked per treatment (sans for text
   and chip, mono for keycap).

   Engine: `treatment` is an enum param on `kbd`; the chip and keycap
   corners ride on the `--studio-kbd-radius` surface var. Menu and list-box items
   strip the chrome (`*:[kbd]:border-0 bg-transparent`), so list hints read
   as text in every treatment. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const KBD_DEFAULTS = {
  kbdTreatment: "chip",
}

export const TREATMENT_OPTIONS = [
  {
    value: "text",
    label: "Text",
    description:
      "Muted xs sans text with wide letter-spacing — no box around the keys.",
    seenIn: ["Chakra UI"],
  },
  {
    value: "chip",
    label: "Chip",
    description:
      "A 20px-tall flat muted box with sm corners and medium-weight xs sans " +
      "text.",
    seenIn: ["shadcn/ui", "Polaris"],
  },
  {
    value: "keycap",
    label: "Keycap",
    description:
      "A 20px-tall key on the card color with a 1px border thickened to 2px " +
      "at the bottom, sm corners, and 11px mono text.",
    seenIn: ["Radix Themes", "Mantine", "Chakra UI"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveKbd(state: StudioState): Resolved {
  return {
    params: {
      kbd: { treatment: pick(TREATMENT_OPTIONS, state.kbdTreatment, "chip") },
    },
  }
}

export const KBD_SPEC = {
  label: "Kbd",
  description:
    "How keyboard shortcuts are drawn. Inside menus and list boxes the " +
    "chrome is always stripped, so shortcut hints there read as text.",
  axes: {
    kbdTreatment: {
      label: "Kbd",
      description: "The chrome, if any, around a key in running UI.",
      value: { type: "enum", options: TREATMENT_OPTIONS },
      guidance:
        "Of 5 systems checked, shadcn and Polaris draw a flat chip; Radix " +
        "Themes, Mantine and Chakra (its default `raised`) draw a keycap " +
        "with a heavier bottom edge. Chakra also ships a `plain` text " +
        "variant. Chip blends into dense app chrome; keycap reads as " +
        "documentation.",
    },
  },
} satisfies ChapterSpec<typeof KBD_DEFAULTS>
