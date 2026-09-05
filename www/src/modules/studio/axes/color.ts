import type { Resolved, StudioState } from "./index"

/**
 * A color mode — one named scheme in the user's set (1..n), not a light/dark
 * boolean. A mode is the same seeds resolved under different conditions:
 * polarity (ramp direction + prefers-color-scheme bucket), background
 * lightness, and a contrast level.
 */
export interface LabMode {
  id: string
  name: string
  polarity: "light" | "dark"
  /** Background L*; 0 on a dark mode = OLED black. */
  bg: number
  contrast: "default" | "high"
}

const DEFAULT_MODES: LabMode[] = [
  {
    id: "light",
    name: "Light",
    polarity: "light",
    bg: 99,
    contrast: "default",
  },
  { id: "dark", name: "Dark", polarity: "dark", bg: 2, contrast: "default" },
]

/* Mirrors ColorConfig: '' on a seed means Auto (absent from the config), 0 on
   a border means unmeasured. Mode edits must replace the array (never mutate)
   so reference-diffing sees them. */
export const COLOR_DEFAULTS = {
  brand: "#635BFF",
  primary: "neutral",
  neutralHue: null as number | null,
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  selectionSeed: "",
  modes: DEFAULT_MODES,
  defaultMode: "light",
  vividness: 1,
  hueShift: 1,
  neutralTint: 1,
  preserveSeed: false,
  guarantees: "default",
  borderContrast: false,
  border400: 0,
  border500: 0,
  border600: 0,
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveColor(_state: StudioState): Resolved {
  return {}
}
