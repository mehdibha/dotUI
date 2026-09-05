/* Kbd — how a keyboard shortcut wears its chrome: plain muted text (macOS
   menus, Material, Spectrum), a flat muted chip (Linear, Raycast, Geist,
   shadcn Kbd — dotUI's current look, hence the default), or a raised keycap
   with border and bottom shadow (Primer, Polaris, Mantine). Mono vs sans is
   baked per treatment: text and chip are sans everywhere surveyed, keycaps
   go mono.

   Engine: `treatment` is an enum param on `kbd`; the chip and keycap
   corners ride on the `--kbd-radius` surface var. */

import type { Resolved, StudioState } from "./index"

export const KBD_DEFAULTS = {
  kbdTreatment: "chip",
}

export const TREATMENT_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "chip", label: "Chip" },
  { value: "keycap", label: "Keycap" },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveKbd(state: StudioState): Resolved {
  return {
    params: {
      kbd: { treatment: pick(TREATMENT_OPTIONS, state.kbdTreatment, "chip") },
    },
  }
}
