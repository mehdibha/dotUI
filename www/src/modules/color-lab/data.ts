/* Data layer for the color lab. Reference palettes are extracted from each
   system's canonical source into data/<id>.json; the dotUI engine slot stays
   empty until the engine rewrite produces output to judge. */

import {
  apcaContrast,
  parseColor,
  rgbToHex,
  rgbToOklch,
  wcagContrast,
  type Oklch,
  type Rgb,
} from './color'

export type ScaleRole = 'neutral' | 'accent' | 'danger' | 'success' | 'warning'

export const UI_ROLES = [
  'appBg',
  'subtleBg',
  'uiBg',
  'uiBgHover',
  'uiBgActive',
  'borderSubtle',
  'border',
  'borderStrong',
  'solid',
  'solidHover',
  'textSubtle',
  'text',
] as const

export type UiRole = (typeof UI_ROLES)[number]

export interface SystemFile {
  id: string
  name: string
  website: string
  sources: string[]
  description: string
  philosophy: string
  stepCount: number
  stepNames: string[]
  scales: {
    id: string
    name: string
    role: ScaleRole
    steps: { name: string; light: string; dark: string | null }[]
    /** Overrides the system mapping — for systems whose scales differ in
        length or semantics (e.g. Ant's 13-step neutral vs 10-step hues). */
    roleMapping?: Partial<Record<UiRole, number | null>>
  }[]
  roleMapping: Partial<Record<UiRole, number | null>>
  solidForeground: string
  notes: string
}

export interface Step {
  name: string
  /** Verbatim value from the source. */
  raw: string
  hex: string
  rgb: Rgb
  oklch: Oklch
  /** WCAG ratio + APCA Lc of this color against the scale's step-1 background. */
  vsBg: { wcag: number; apca: number }
  /** WCAG ratio + APCA Lc of white/black text over this color, whichever is stronger. */
  asBg: { wcag: number; apca: number; fg: 'white' | 'black' }
}

export interface Scale {
  id: string
  name: string
  role: ScaleRole
  light: Step[]
  dark: Step[] | null
  roleMapping?: Partial<Record<UiRole, number | null>>
}

/** The role mapping that applies to a given scale. */
export function mappingFor(
  system: ColorSystem,
  scale: Scale,
): Partial<Record<UiRole, number | null>> {
  return scale.roleMapping ?? system.roleMapping
}

export interface ColorSystem {
  id: string
  name: string
  website: string
  sources: string[]
  description: string
  philosophy: string
  stepCount: number
  stepNames: string[]
  scales: Scale[]
  roleMapping: Partial<Record<UiRole, number | null>>
  solidForeground: string
  notes: string
  /** True for the dotUI engine slot while the rewrite is pending. */
  empty: boolean
}

const WHITE: Rgb = { r: 1, g: 1, b: 1, alpha: 1 }
const BLACK: Rgb = { r: 0, g: 0, b: 0, alpha: 1 }

function buildStep(name: string, raw: string, bg: Rgb): Step {
  const rgb = parseColor(raw) ?? BLACK
  // Foreground picked by APCA, not WCAG — WCAG's math prefers black text on
  // mid-blues where every shipping system uses white.
  const fg =
    Math.abs(apcaContrast(WHITE, rgb)) >= Math.abs(apcaContrast(BLACK, rgb))
      ? 'white'
      : 'black'
  return {
    name,
    raw,
    hex: rgbToHex(rgb),
    rgb,
    oklch: rgbToOklch(rgb),
    vsBg: { wcag: wcagContrast(rgb, bg), apca: apcaContrast(rgb, bg) },
    asBg: {
      wcag: wcagContrast(fg === 'white' ? WHITE : BLACK, rgb),
      apca: apcaContrast(fg === 'white' ? WHITE : BLACK, rgb),
      fg,
    },
  }
}

function buildSteps(
  steps: { name: string; value: string }[],
  mode: 'light' | 'dark',
): Step[] {
  // Contrast-vs-background uses the scale's own first step (app background);
  // in single-palette systems the darkest/lightest end plays that role.
  const first = steps[0] && parseColor(steps[0].value)
  const bg = first ?? (mode === 'light' ? WHITE : BLACK)
  return steps.map((s) => buildStep(s.name, s.value, bg))
}

function buildSystem(file: SystemFile): ColorSystem {
  return {
    ...file,
    empty: false,
    scales: file.scales.map((scale) => ({
      id: scale.id,
      name: scale.name,
      role: scale.role,
      roleMapping: scale.roleMapping,
      light: buildSteps(
        scale.steps.map((s) => ({ name: s.name, value: s.light })),
        'light',
      ),
      dark: scale.steps.every((s) => s.dark !== null)
        ? buildSteps(
            scale.steps.map((s) => ({ name: s.name, value: s.dark as string })),
            'dark',
          )
        : null,
    })),
  }
}

/** Resolve a system's documented role mapping against one of its scales. */
export function resolveRoles(
  system: ColorSystem,
  scale: Scale,
  mode: 'light' | 'dark',
): Partial<Record<UiRole, Step>> {
  const steps = mode === 'dark' && scale.dark ? scale.dark : scale.light
  const mapping = mappingFor(system, scale)
  const out: Partial<Record<UiRole, Step>> = {}
  for (const role of UI_ROLES) {
    const index = mapping[role]
    if (index === null || index === undefined) continue
    const step = steps[index]
    if (step) out[role] = step
  }
  return out
}

export function scaleByRole(
  system: ColorSystem,
  role: ScaleRole,
): Scale | undefined {
  return system.scales.find((s) => s.role === role)
}

/** The slot the engine rewrite will fill. Kept first so every comparison view
    renders the empty state prominently — the lab exists to receive it. */
export const ENGINE_SLOT: ColorSystem = {
  id: 'dotui',
  name: 'dotUI Engine',
  website: 'https://dotui.org',
  sources: [],
  description:
    'Output of the rewritten dotUI color engine. Not plugged in yet.',
  philosophy:
    'To be written by the rewrite: an OKLCH-native engine generating full semantic scales from a seed color.',
  stepCount: 12,
  stepNames: Array.from({ length: 12 }, (_, index) => String(index + 1)),
  scales: [],
  roleMapping: {},
  solidForeground: '',
  notes: '',
  empty: true,
}

const files = import.meta.glob<SystemFile>('./data/*.json', {
  eager: true,
  import: 'default',
})

export const referenceSystems: ColorSystem[] = Object.values(files)
  .map(buildSystem)
  .sort((a, b) => a.name.localeCompare(b.name))

export const systems: ColorSystem[] = [ENGINE_SLOT, ...referenceSystems]
