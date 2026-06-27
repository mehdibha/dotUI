import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import {
  DEFAULT_RADIUS_FACTOR,
  RADIUS_FACTOR_VAR,
} from '@/modules/create/layout'
import type { Density, DesignSystem } from '@/modules/create/preset'

/* ----------------------------------------------------------------------------
 * The builder's AI layer is UI-only: no model is called here. Every assistant
 * action — compose a system from a prompt, refine it, extract from an image, or
 * audit it — is expressed as the SAME reviewable primitive: a `DesignSystemDiff`,
 * a list of typed per-axis operations the user can toggle row by row, apply, and
 * undo. Wiring a real model later means replacing the canned builders below with
 * a server function that returns this exact shape — the UI doesn't change.
 * -------------------------------------------------------------------------- */

/** Namespaced tokens for the new axes. Visual-only today (no component reads them
 *  yet), but they round-trip through the preset so the builder UI is complete. */
export const NEXT_TOKENS = {
  headingFont: '--next-heading-font',
  typeScale: '--next-type-scale',
  headingWeight: '--next-heading-weight',
  tracking: '--next-tracking',
  spacingUnit: '--next-spacing-unit',
  spacingScale: '--next-spacing-scale',
  elevation: '--next-elevation',
  elevationTint: '--next-elevation-tint',
  motion: '--next-motion',
  easing: '--next-easing',
  borders: '--next-borders',
  focus: '--next-focus',
  surfaces: '--next-surfaces',
} as const

export const NEXT_DEFAULTS = {
  headingFont: 'Geist',
  typeScale: '1.25',
  headingWeight: '600',
  tracking: '0',
  spacingUnit: '4',
  spacingScale: 'geometric',
  elevation: 'subtle',
  elevationTint: 'neutral',
  motion: 'smooth',
  easing: 'standard',
  borders: 'default',
  focus: 'default',
  surfaces: 'opaque',
} as const

const ACCENT_DEFAULT = DEFAULT_COLOR_CONFIG.seeds.accent ?? '#6366f1'
const NEUTRAL_DEFAULT = DEFAULT_COLOR_CONFIG.seeds.neutral ?? '#737373'

/* ------------------------------ Axis read/write ------------------------------ */

export function readAccent(ds: DesignSystem): string {
  return (ds.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? ACCENT_DEFAULT
}
export function readNeutral(ds: DesignSystem): string {
  return (ds.color ?? DEFAULT_COLOR_CONFIG).seeds.neutral ?? NEUTRAL_DEFAULT
}
function writeSeed(
  ds: DesignSystem,
  seed: 'accent' | 'neutral',
  value: string,
): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return { ...ds, color: { ...base, seeds: { ...base.seeds, [seed]: value } } }
}
export function readToken(
  ds: DesignSystem,
  name: string,
  fallback: string,
): string {
  return ds.tokens[name] ?? fallback
}
export function writeToken(
  ds: DesignSystem,
  name: string,
  value: string,
): DesignSystem {
  return { ...ds, tokens: { ...ds.tokens, [name]: value } }
}

/* --------------------------------- Diff types -------------------------------- */

export type DiffKind = 'color' | 'text' | 'value'

export interface DiffRow {
  id: string
  /** Axis label, e.g. "Accent", "Radius", "Elevation". */
  axis: string
  kind: DiffKind
  fromLabel: string
  toLabel: string
  fromColor?: string
  toColor?: string
  included: boolean
  /** Pure op — the only thing Apply runs. */
  apply: (ds: DesignSystem) => DesignSystem
}

/** What the assistant is allowed to change in one turn. */
export interface ThemeTarget {
  accent?: string
  neutral?: string
  headingFont?: string
  typeScale?: string
  radius?: string
  density?: Density
  elevation?: string
  motion?: string
  borders?: string
}

const radiusLabel = (v: string) => `${Number.parseFloat(v).toFixed(2)}×`
const titleCase = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)

/** Diff the current system against a target, emitting one row per changed axis. */
export function diffFromTarget(
  ds: DesignSystem,
  target: ThemeTarget,
): DiffRow[] {
  const rows: DiffRow[] = []
  let n = 0
  const id = () => `r${n++}`

  if (target.accent && !sameColor(target.accent, readAccent(ds))) {
    const to = target.accent
    rows.push({
      id: id(),
      axis: 'Accent',
      kind: 'color',
      fromColor: readAccent(ds),
      toColor: to,
      fromLabel: readAccent(ds).toUpperCase(),
      toLabel: to.toUpperCase(),
      included: true,
      apply: (d) => writeSeed(d, 'accent', to),
    })
  }
  if (target.neutral && !sameColor(target.neutral, readNeutral(ds))) {
    const to = target.neutral
    rows.push({
      id: id(),
      axis: 'Neutral',
      kind: 'color',
      fromColor: readNeutral(ds),
      toColor: to,
      fromLabel: readNeutral(ds).toUpperCase(),
      toLabel: to.toUpperCase(),
      included: true,
      apply: (d) => writeSeed(d, 'neutral', to),
    })
  }
  pushToken(
    rows,
    id,
    target.headingFont,
    ds,
    NEXT_TOKENS.headingFont,
    NEXT_DEFAULTS.headingFont,
    'Heading',
    'text',
  )
  pushToken(
    rows,
    id,
    target.typeScale,
    ds,
    NEXT_TOKENS.typeScale,
    NEXT_DEFAULTS.typeScale,
    'Type scale',
    'value',
  )
  if (target.radius) {
    const from = readToken(ds, RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
    if (Number.parseFloat(from) !== Number.parseFloat(target.radius)) {
      const to = target.radius
      rows.push({
        id: id(),
        axis: 'Radius',
        kind: 'value',
        fromLabel: radiusLabel(from),
        toLabel: radiusLabel(to),
        included: true,
        apply: (d) => writeToken(d, RADIUS_FACTOR_VAR, to),
      })
    }
  }
  if (target.density && target.density !== ds.density) {
    const to = target.density
    rows.push({
      id: id(),
      axis: 'Density',
      kind: 'text',
      fromLabel: titleCase(ds.density),
      toLabel: titleCase(to),
      included: true,
      apply: (d) => ({ ...d, density: to }),
    })
  }
  pushToken(
    rows,
    id,
    target.elevation,
    ds,
    NEXT_TOKENS.elevation,
    NEXT_DEFAULTS.elevation,
    'Elevation',
    'text',
    titleCase,
  )
  pushToken(
    rows,
    id,
    target.motion,
    ds,
    NEXT_TOKENS.motion,
    NEXT_DEFAULTS.motion,
    'Motion',
    'text',
    titleCase,
  )
  pushToken(
    rows,
    id,
    target.borders,
    ds,
    NEXT_TOKENS.borders,
    NEXT_DEFAULTS.borders,
    'Borders',
    'text',
    titleCase,
  )
  return rows
}

function pushToken(
  rows: DiffRow[],
  id: () => string,
  target: string | undefined,
  ds: DesignSystem,
  token: string,
  fallback: string,
  axis: string,
  kind: DiffKind,
  format: (v: string) => string = (v) => v,
) {
  if (!target) return
  const from = readToken(ds, token, fallback)
  if (from === target) return
  rows.push({
    id: id(),
    axis,
    kind,
    fromLabel: format(from),
    toLabel: format(target),
    included: true,
    apply: (d) => writeToken(d, token, target),
  })
}

function sameColor(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

/** Apply only the rows the user kept selected. */
export function applyRows(ds: DesignSystem, rows: DiffRow[]): DesignSystem {
  return rows.filter((r) => r.included).reduce((acc, r) => r.apply(acc), ds)
}

/* --------------------------------- Compose ----------------------------------- */

export interface ComposePreset {
  prompt: string
  intro: string
  target: ThemeTarget
}

export const COMPOSE_PRESETS = {
  linear: {
    prompt: 'Make it feel like Linear, but a touch warmer',
    intro:
      'A calm, dense system — indigo accent, flat surfaces, hairline borders, snappy motion.',
    target: {
      accent: '#5e6ad2',
      headingFont: 'Inter',
      typeScale: '1.2',
      radius: '0.45',
      density: 'compact',
      elevation: 'flat',
      borders: 'hairline',
      motion: 'snappy',
    },
  },
  editorial: {
    prompt: 'A warm editorial system with a serif display',
    intro:
      'Generous, calm, and literary — a teal accent, a serif heading, and roomy spacing.',
    target: {
      accent: '#0f766e',
      headingFont: 'Source Serif 4',
      typeScale: '1.333',
      radius: '0.25',
      density: 'comfortable',
      elevation: 'flat',
      motion: 'smooth',
    },
  },
  playful: {
    prompt: 'More playful and rounder',
    intro:
      'Friendly and bouncy — a coral accent, big radii, and expressive motion.',
    target: {
      accent: '#f43f5e',
      headingFont: 'Geist',
      typeScale: '1.25',
      radius: '1.6',
      density: 'comfortable',
      elevation: 'lifted',
      motion: 'expressive',
    },
  },
  stripe: {
    prompt: 'Match the look of stripe.com',
    intro:
      'Crisp and trustworthy — an indigo-violet accent with soft, lifted surfaces.',
    target: {
      accent: '#635bff',
      headingFont: 'Inter',
      typeScale: '1.25',
      radius: '0.8',
      density: 'default',
      elevation: 'lifted',
      motion: 'smooth',
    },
  },
  minimal: {
    prompt: 'Minimal and monochrome',
    intro:
      'Quiet and precise — near-black accent, tight corners, flat surfaces.',
    target: {
      accent: '#171717',
      headingFont: 'Geist',
      typeScale: '1.2',
      radius: '0.4',
      density: 'compact',
      elevation: 'flat',
      borders: 'default',
      motion: 'snappy',
    },
  },
} satisfies Record<string, ComposePreset>

/** Map a free-text prompt to a compose preset (keyword match — a stand-in for a model). */
export function matchPrompt(prompt: string): ComposePreset {
  const p = prompt.toLowerCase()
  if (/linear|calm|dense/.test(p)) return COMPOSE_PRESETS.linear
  if (/editorial|serif|warm|magazine/.test(p)) return COMPOSE_PRESETS.editorial
  if (/playful|round|fun|bouncy/.test(p)) return COMPOSE_PRESETS.playful
  if (/stripe|trust|fintech/.test(p)) return COMPOSE_PRESETS.stripe
  if (/minimal|mono|quiet/.test(p)) return COMPOSE_PRESETS.minimal
  return COMPOSE_PRESETS.linear
}

/* ---------------------------------- Refine ----------------------------------- */

export interface RefineAction {
  id: string
  label: string
  prompt: string
  intro: string
  target: ThemeTarget
}

export const REFINE_ACTIONS: RefineAction[] = [
  {
    id: 'rounder',
    label: 'Rounder',
    prompt: 'Rounder',
    intro: 'Softening the corners and letting surfaces lift a little.',
    target: { radius: '1.1', elevation: 'lifted' },
  },
  {
    id: 'contrast',
    label: 'More contrast',
    prompt: 'More contrast',
    intro: 'Deepening neutrals and firming up the borders for legibility.',
    target: { neutral: '#171717', borders: 'default' },
  },
  {
    id: 'calm',
    label: 'Calmer motion',
    prompt: 'Calmer motion',
    intro: 'Easing the transition speed across the system.',
    target: { motion: 'smooth' },
  },
]

/* ----------------------------------- Audit ----------------------------------- */

export interface AuditIssue {
  id: string
  severity: 'high' | 'med'
  title: string
  detail: string
  fix: { label: string; apply: (ds: DesignSystem) => DesignSystem }
}

export function auditSystem(): AuditIssue[] {
  return [
    {
      id: 'a1',
      severity: 'high',
      title: 'Danger text fails AA on solid',
      detail:
        'Contrast is ~3.1:1 on the danger button. Darken the danger seed to pass AA.',
      fix: {
        label: 'Darken seed',
        apply: (d) => writeSeed(d, 'accent', readAccent(d)),
      },
    },
    {
      id: 'a2',
      severity: 'med',
      title: 'Heading scale jumps two steps',
      detail: 'h1 is 2.4× h2 — tighten the type scale for smoother rhythm.',
      fix: {
        label: 'Set 1.2',
        apply: (d) => writeToken(d, NEXT_TOKENS.typeScale, '1.2'),
      },
    },
    {
      id: 'a3',
      severity: 'med',
      title: 'Focus ring blends into accent',
      detail:
        'The focus ring sits on the accent fill with no offset. Add a bolder ring.',
      fix: {
        label: 'Bolder ring',
        apply: (d) => writeToken(d, NEXT_TOKENS.focus, 'bold'),
      },
    },
  ]
}

/* ---------------------------------- Extract ---------------------------------- */

export interface ExtractResult {
  fileName: string
  palette: string[]
  intro: string
  rows: DiffRow[]
}

export function extractFromImage(ds: DesignSystem): ExtractResult {
  return {
    fileName: 'brand-screenshot.png',
    palette: ['#0a2540', '#635bff', '#00d4ff', '#f6f9fc'],
    intro:
      'Pulled a dominant palette and a likely heading font from the image.',
    rows: diffFromTarget(ds, {
      accent: '#635bff',
      headingFont: 'Inter',
      radius: '0.8',
    }),
  }
}
