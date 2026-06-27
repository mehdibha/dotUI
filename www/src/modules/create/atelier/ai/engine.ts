/* ----------------------------------------------------------------------------
 * The studio's design intelligence — interaction model, run locally.
 *
 * This is the UI-facing brain for the AI surface: it turns a natural-language
 * prompt ("make it feel like Linear", "warmer grays", "fix my contrast") into a
 * structured, *reviewable* ChangeSet against the real DesignSystem state, and it
 * runs honest contrast checks for the audit panel.
 *
 * It is deliberately a deterministic local engine, not a model call: the point
 * of this experiment is the *interaction* — propose → preview → accept/reject —
 * not the inference. A production build swaps `interpret()` for a server call
 * that returns the same ChangeSet shape; every consumer downstream is unchanged.
 * -------------------------------------------------------------------------- */

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'

import type { Density, DesignSystem } from '../../preset'
import {
  BORDER_WIDTH_VAR,
  ELEVATION_STYLE_VAR,
  RADIUS_FACTOR_VAR,
  TRACKING_VAR,
} from '../tokens'

export interface ChangeItem {
  label: string
  from: string
  to: string
}

export interface ChangeSet {
  id: string
  title: string
  rationale: string
  /** Human-readable before/after lines, shown as the reviewable diff. */
  changes: ChangeItem[]
  /** Pure transform applied (as one undo step) when the user accepts. */
  apply: (prev: DesignSystem) => DesignSystem
  /** True when nothing in the prompt was understood — drives the fallback copy. */
  speculative?: boolean
}

/* ------------------------------- Utilities ------------------------------- */

let counter = 0
const uid = (p: string) => `${p}-${(counter += 1)}`

function seedsOf(ds: DesignSystem) {
  return (ds.color ?? DEFAULT_COLOR_CONFIG).seeds
}
function radiusOf(ds: DesignSystem) {
  return ds.tokens[RADIUS_FACTOR_VAR] ?? '1'
}

/** Compose a color-seed + algorithm patch onto the live recipe. */
function patchColor(
  prev: DesignSystem,
  seeds: Partial<Record<string, string>>,
  algorithm?: AlgorithmId,
): DesignSystem {
  const base = prev.color ?? DEFAULT_COLOR_CONFIG
  return {
    ...prev,
    color: {
      ...base,
      ...(algorithm ? { algorithm } : {}),
      seeds: { ...base.seeds, ...seeds },
    },
  }
}

/* --------------------------- Named vocabularies -------------------------- */

// Recognizable system "vibes" — each is a coherent multi-axis move, the kind of
// thing a user means by naming a product they admire.
interface Vibe {
  match: RegExp
  title: string
  rationale: string
  accent: string
  neutral?: string
  radius: string
  density: Density
  algorithm?: AlgorithmId
}

const VIBES: Vibe[] = [
  {
    match: /linear/,
    title: 'Linear-style system',
    rationale: 'Indigo accent, tight radii, brand-tinted grays, dense layout.',
    accent: '#5e6ad2',
    neutral: '#6b6f80',
    radius: '0.6',
    density: 'compact',
  },
  {
    match: /vercel|geist/,
    title: 'Geist-style system',
    rationale: 'Pure black accent, near-square corners, neutral grays, dense.',
    accent: '#171717',
    neutral: '#808080',
    radius: '0.35',
    density: 'compact',
  },
  {
    match: /stripe/,
    title: 'Stripe-style system',
    rationale: 'Blurple accent, rounded corners, default density.',
    accent: '#635bff',
    radius: '1.1',
    density: 'default',
  },
  {
    match: /material|google/,
    title: 'Material-style system',
    rationale: 'Vivid accent, generous radius, comfortable spacing.',
    accent: '#1a73e8',
    radius: '1.4',
    density: 'comfortable',
    algorithm: 'material',
  },
  {
    match: /playful|fun|friendly|bubbl/,
    title: 'Playful refresh',
    rationale: 'Warm vivid accent, pill-round corners, roomy spacing.',
    accent: '#f43f5e',
    radius: '1.7',
    density: 'comfortable',
  },
  {
    match: /minimal|clean|understated|swiss/,
    title: 'Minimal refresh',
    rationale: 'Near-black accent, restrained radius, tight grid.',
    accent: '#18181b',
    neutral: '#808080',
    radius: '0.4',
    density: 'compact',
  },
  {
    match: /editorial|elegant|serif|magazine/,
    title: 'Editorial refresh',
    rationale: 'Deep teal accent, crisp corners, airy reading rhythm.',
    accent: '#0f766e',
    radius: '0.3',
    density: 'comfortable',
  },
  {
    match: /enterprise|corporate|trust|fintech|bank/,
    title: 'Enterprise refresh',
    rationale: 'Confident blue, conservative radius, default density.',
    accent: '#2563eb',
    radius: '0.6',
    density: 'default',
  },
  {
    match: /brutal|bold|loud|punk/,
    title: 'Bold / brutalist refresh',
    rationale: 'High-energy accent, square corners, thick borders.',
    accent: '#facc15',
    neutral: '#808080',
    radius: '0',
    density: 'default',
  },
]

// Single-hue requests → an accent move only.
const HUES: Array<{ match: RegExp; label: string; hex: string }> = [
  { match: /\bindigo\b/, label: 'Indigo', hex: '#6366f1' },
  { match: /\bblue\b/, label: 'Blue', hex: '#3b82f6' },
  { match: /\bteal\b|\bcyan\b/, label: 'Teal', hex: '#14b8a6' },
  { match: /\bgreen\b|\bemerald\b/, label: 'Green', hex: '#22c55e' },
  { match: /\bpurple\b|\bviolet\b/, label: 'Purple', hex: '#8b5cf6' },
  { match: /\bpink\b|\bmagenta\b/, label: 'Pink', hex: '#ec4899' },
  { match: /\bred\b|\bcrimson\b/, label: 'Red', hex: '#ef4444' },
  { match: /\borange\b|\bamber\b/, label: 'Orange', hex: '#f59e0b' },
  { match: /\brose\b/, label: 'Rose', hex: '#f43f5e' },
  { match: /\bblack\b|\bmono(chrome)?\b/, label: 'Black', hex: '#171717' },
]

/* ------------------------------ Interpreter ------------------------------ */

/**
 * Turn a prompt into a reviewable ChangeSet against `current`. Recognized
 * intents stack (a vibe + "rounder" + "denser" all apply); an unrecognized
 * prompt returns a speculative tasteful nudge so the loop never dead-ends.
 */
export function interpret(prompt: string, current: DesignSystem): ChangeSet {
  const p = prompt.toLowerCase()
  const changes: ChangeItem[] = []
  const transforms: Array<(ds: DesignSystem) => DesignSystem> = []
  let title = ''
  let rationale = ''

  const curSeeds = seedsOf(current)
  const curRadius = radiusOf(current)

  // 1) Whole-system vibe.
  const vibe = VIBES.find((v) => v.match.test(p))
  if (vibe) {
    title = vibe.title
    rationale = vibe.rationale
    changes.push({
      label: 'Accent',
      from: curSeeds.accent ?? '—',
      to: vibe.accent,
    })
    if (vibe.neutral && vibe.neutral !== curSeeds.neutral) {
      changes.push({
        label: 'Base / gray',
        from: curSeeds.neutral ?? '#808080',
        to: vibe.neutral,
      })
    }
    changes.push({
      label: 'Radius',
      from: `${curRadius}×`,
      to: `${vibe.radius}×`,
    })
    changes.push({ label: 'Density', from: current.density, to: vibe.density })
    if (vibe.algorithm) {
      changes.push({
        label: 'Algorithm',
        from: (current.color ?? DEFAULT_COLOR_CONFIG).algorithm,
        to: vibe.algorithm,
      })
    }
    transforms.push((ds) => {
      let next = patchColor(
        ds,
        {
          accent: vibe.accent,
          ...(vibe.neutral ? { neutral: vibe.neutral } : {}),
        },
        vibe.algorithm,
      )
      next = {
        ...next,
        density: vibe.density,
        tokens: { ...next.tokens, [RADIUS_FACTOR_VAR]: vibe.radius },
      }
      return next
    })
  }

  // 2) Single hue (skip if a vibe already set the accent).
  if (!vibe) {
    const hue = HUES.find((h) => h.match.test(p))
    if (hue) {
      title ||= `${hue.label} accent`
      rationale ||= `Recolor the system around ${hue.label.toLowerCase()}.`
      changes.push({
        label: 'Accent',
        from: curSeeds.accent ?? '—',
        to: hue.hex,
      })
      transforms.push((ds) => patchColor(ds, { accent: hue.hex }))
    }
  }

  // 3) Gray temperature.
  if (/warm/.test(p)) {
    const warm = '#8b8178'
    title ||= 'Warmer neutrals'
    rationale ||= 'Tint the gray ramp toward a warm stone.'
    changes.push({
      label: 'Base / gray',
      from: curSeeds.neutral ?? '#808080',
      to: warm,
    })
    transforms.push((ds) => patchColor(ds, { neutral: warm }))
  } else if (/cool|cold/.test(p)) {
    const cool = '#78808b'
    title ||= 'Cooler neutrals'
    rationale ||= 'Tint the gray ramp toward a cool slate.'
    changes.push({
      label: 'Base / gray',
      from: curSeeds.neutral ?? '#808080',
      to: cool,
    })
    transforms.push((ds) => patchColor(ds, { neutral: cool }))
  }

  // 4) Radius nudges.
  if (/round|pill|soft corner|friendly/.test(p) && !vibe) {
    const to = '1.6'
    title ||= 'Rounder corners'
    rationale ||= 'Scale the whole radius ramp up.'
    changes.push({ label: 'Radius', from: `${curRadius}×`, to: `${to}×` })
    transforms.push((ds) => ({
      ...ds,
      tokens: { ...ds.tokens, [RADIUS_FACTOR_VAR]: to },
    }))
  } else if (/sharp|square|crisp|angular/.test(p) && !vibe) {
    const to = '0'
    title ||= 'Sharper corners'
    rationale ||= 'Flatten the radius ramp to square.'
    changes.push({ label: 'Radius', from: `${curRadius}×`, to: `${to}×` })
    transforms.push((ds) => ({
      ...ds,
      tokens: { ...ds.tokens, [RADIUS_FACTOR_VAR]: to },
    }))
  }

  // 5) Density nudges.
  if (/dense|compact|tight|cram/.test(p) && !vibe) {
    title ||= 'Denser layout'
    rationale ||= 'Tighten control heights, gaps and padding.'
    changes.push({ label: 'Density', from: current.density, to: 'compact' })
    transforms.push((ds) => ({ ...ds, density: 'compact' as Density }))
  } else if (/airy|spacious|roomy|breath|relax/.test(p) && !vibe) {
    title ||= 'Airier layout'
    rationale ||= 'Loosen spacing for a calmer rhythm.'
    changes.push({ label: 'Density', from: current.density, to: 'comfortable' })
    transforms.push((ds) => ({ ...ds, density: 'comfortable' as Density }))
  }

  // 6) Bolder shells — a stub axis, but a real, previewable border lever.
  if (/bold|strong|heavy|thick/.test(p) && !vibe) {
    title ||= 'Heavier shells'
    rationale ||= 'Thicken borders and lean on flat surfaces.'
    changes.push({ label: 'Border width', from: '1px', to: '2px' })
    transforms.push((ds) => ({
      ...ds,
      tokens: {
        ...ds.tokens,
        [BORDER_WIDTH_VAR]: '2',
        [ELEVATION_STYLE_VAR]: 'flat',
      },
    }))
  }

  // 7) Tighter typography.
  if (/tight(er)? (track|letter|type)|condensed/.test(p)) {
    title ||= 'Tighter tracking'
    rationale ||= 'Pull letter-spacing in on display type.'
    changes.push({ label: 'Tracking', from: '0em', to: '-0.02em' })
    transforms.push((ds) => ({
      ...ds,
      tokens: { ...ds.tokens, [TRACKING_VAR]: '-0.02' },
    }))
  }

  if (transforms.length === 0) {
    // Nothing recognized — propose a tasteful, low-risk refresh and say so.
    return {
      id: uid('cs'),
      title: 'Tasteful refresh',
      rationale:
        'Couldn’t map that to a specific change yet — here’s a safe nudge. A connected model would interpret freeform prompts like this directly.',
      speculative: true,
      changes: [
        { label: 'Radius', from: `${curRadius}×`, to: '1.0×' },
        { label: 'Density', from: current.density, to: 'default' },
      ],
      apply: (ds) => ({
        ...ds,
        density: 'default',
        tokens: { ...ds.tokens, [RADIUS_FACTOR_VAR]: '1' },
      }),
    }
  }

  return {
    id: uid('cs'),
    title: title || 'Refined system',
    rationale: rationale || 'Applied the changes you described.',
    changes,
    apply: (ds) => transforms.reduce((acc, t) => t(acc), ds),
  }
}

/* -------------------------------- Audit ---------------------------------- */

export type AuditLevel = 'pass' | 'warn' | 'fail'

export interface AuditFinding {
  id: string
  level: AuditLevel
  title: string
  detail: string
  /** Optional one-click remediation. */
  fix?: ChangeSet
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = Number.parseInt(full || '000000', 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a))
  const lb = luminance(hexToRgb(b))
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** A few honest checks on the live seeds. Real ratios, not theater. */
export function audit(current: DesignSystem): AuditFinding[] {
  const seeds = seedsOf(current)
  const findings: AuditFinding[] = []
  const white = '#ffffff'

  const checkOnWhite = (
    seed: string,
    name: string,
    hex: string | undefined,
  ): void => {
    if (!hex) return
    const ratio = contrastRatio(hex, white)
    const r = ratio.toFixed(2)
    if (ratio >= 4.5) {
      findings.push({
        id: uid('au'),
        level: 'pass',
        title: `${name} on white — AA`,
        detail: `${r}:1 contrast. Safe for text and icons.`,
      })
    } else if (ratio >= 3) {
      findings.push({
        id: uid('au'),
        level: 'warn',
        title: `${name} on white — large text only`,
        detail: `${r}:1 contrast. Passes AA for ≥24px text, fails for body.`,
      })
    } else {
      findings.push({
        id: uid('au'),
        level: 'fail',
        title: `${name} on white — fails AA`,
        detail: `${r}:1 contrast. Too light for text or icons on white.`,
        fix: {
          id: uid('cs'),
          title: `Darken ${name.toLowerCase()}`,
          rationale: `Deepen ${name.toLowerCase()} to clear 4.5:1 on white.`,
          changes: [{ label: name, from: hex, to: darken(hex) }],
          apply: (ds) => patchColor(ds, { [seed]: darken(hex) }),
        },
      })
    }
  }

  checkOnWhite('accent', 'Accent', seeds.accent)
  checkOnWhite('danger', 'Danger', seeds.danger ?? '#ef4444')
  checkOnWhite('warning', 'Warning', seeds.warning ?? '#f59e0b')
  checkOnWhite('success', 'Success', seeds.success ?? '#22c55e')

  return findings
}

/** Crude darkener for the suggested fix — pulls each channel toward black. */
function darken(hex: string, amount = 0.38): string {
  const [r, g, b] = hexToRgb(hex)
  const f = (v: number) => Math.max(0, Math.round(v * (1 - amount)))
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/* ----------------------------- Quick prompts ----------------------------- */

export const QUICK_PROMPTS: string[] = [
  'Make it feel like Linear',
  'More playful and rounded',
  'Warmer neutrals',
  'Minimal and tight',
  'Make it a fintech system',
]
