/* ----------------------------------------------------------------------------
 * The Studio AI engine — a *simulated*, fully local intent parser.
 *
 * This is the "do only the UI" stand-in for a real model: it turns a natural
 * language prompt ("make it warmer and rounder", "feel like Linear", "teal
 * brand, more contrast") into concrete mutations of the SAME live design-system
 * state the manual controls edit. No network, no keys — but the live preview
 * genuinely reacts, so the experience of an AI-native builder is real to the
 * touch. A production version swaps `interpret()` for a model call that returns
 * the same `Action[]` shape.
 * -------------------------------------------------------------------------- */

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../../layout'
import type { DesignSystem } from '../../preset'
import {
  HUE_WORDS,
  hexToHsl,
  rotationToward,
  scaleSaturation,
  seedForHue,
  shiftHue,
} from './color-utils'

/** A single, human-readable change the engine wants to make. */
export interface Action {
  /** Short past-tense clause for the activity log, e.g. "warmed the brand hue 22°". */
  label: string
  /** Pure transform on the design system. */
  apply: (ds: DesignSystem) => DesignSystem
}

export interface Interpretation {
  /** Conversational reply shown in the copilot thread. */
  reply: string
  /** The concrete changes (already composed into one apply by the caller). */
  actions: Action[]
  /** True when nothing matched and we only offered guidance. */
  noop?: boolean
}

/* ------------------------------- DS helpers ------------------------------- */

function accentOf(ds: DesignSystem): string {
  return (ds.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#438cd6'
}

function setAccent(ds: DesignSystem, accent: string): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return { ...ds, color: { ...base, seeds: { ...base.seeds, accent } } }
}

function setNeutral(ds: DesignSystem, neutral: string): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return { ...ds, color: { ...base, seeds: { ...base.seeds, neutral } } }
}

function setAlgorithm(ds: DesignSystem, algorithm: AlgorithmId): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  return { ...ds, color: { ...base, algorithm } }
}

function setChromaMult(ds: DesignSystem, mult: number): DesignSystem {
  const base = ds.color ?? DEFAULT_COLOR_CONFIG
  const current = base.knobs?.chromaMult ?? 1
  return {
    ...ds,
    color: {
      ...base,
      knobs: {
        ...base.knobs,
        chromaMult:
          Math.round(Math.min(1.8, Math.max(0.2, current * mult)) * 100) / 100,
      },
    },
  }
}

function setRadius(ds: DesignSystem, factor: number): DesignSystem {
  return {
    ...ds,
    tokens: { ...ds.tokens, [RADIUS_FACTOR_VAR]: String(factor) },
  }
}

function radiusOf(ds: DesignSystem): number {
  return Number.parseFloat(ds.tokens[RADIUS_FACTOR_VAR] ?? '1') || 1
}

/* ------------------------------ Named looks ------------------------------ */

interface NamedLook {
  keys: string[]
  reply: string
  build: (ds: DesignSystem) => DesignSystem
}

const NAMED_LOOKS: NamedLook[] = [
  {
    keys: ['linear'],
    reply:
      'Channeling Linear — indigo brand, tight corners, compact density, perceptual ramps.',
    build: (ds) => ({
      ...setRadius(setAlgorithm(setAccent(ds, '#5e6ad2'), 'oklch'), 0.5),
      density: 'compact',
    }),
  },
  {
    keys: ['vercel', 'geist'],
    reply:
      'Geist/Vercel mode — near-black brand, crisp square corners, compact.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#171717'), 0.35),
      density: 'compact',
    }),
  },
  {
    keys: ['stripe'],
    reply:
      'Stripe-leaning — that signature indigo-violet, soft-but-tidy corners.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#635bff'), 0.85),
      density: 'default',
    }),
  },
  {
    keys: ['supabase'],
    reply: 'Supabase vibe — emerald brand on a neutral backbone.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#3ecf8e'), 0.5),
      density: 'default',
    }),
  },
  {
    keys: ['material', 'google'],
    reply:
      'Material 3 — tonal generation algorithm, purple brand, generous radius.',
    build: (ds) => ({
      ...setRadius(setAlgorithm(setAccent(ds, '#6750a4'), 'material'), 1.2),
      density: 'comfortable',
    }),
  },
  {
    keys: ['notion'],
    reply: 'Notion-like — restrained near-black accent, gentle corners, roomy.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#2f2f2f'), 0.4),
      density: 'comfortable',
    }),
  },
  {
    keys: ['editorial', 'magazine', 'classic'],
    reply: 'Editorial — deep teal, near-square corners, comfortable rhythm.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#0f766e'), 0.25),
      density: 'comfortable',
    }),
  },
  {
    keys: ['playful', 'fun', 'friendly', 'candy'],
    reply: 'Playful — punchy rose, big pill radius, cozy spacing.',
    build: (ds) => ({
      ...setRadius(setChromaMult(setAccent(ds, '#f43f5e'), 1.2), 1.8),
      density: 'comfortable',
    }),
  },
  {
    keys: ['minimal', 'monochrome', 'brutal', 'swiss'],
    reply: 'Minimal — monochrome brand, hard square corners, compact.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#111111'), 0),
      density: 'compact',
    }),
  },
  {
    keys: ['enterprise', 'corporate', 'b2b'],
    reply: 'Enterprise — trustworthy blue, modest radius, default density.',
    build: (ds) => ({
      ...setRadius(setAccent(ds, '#2563eb'), 0.6),
      density: 'default',
    }),
  },
]

/* ----------------------------- Adjective rules ---------------------------- */

interface AdjRule {
  test: RegExp
  run: (ds: DesignSystem) => Action | null
}

// "Warmer" must always read as a move toward red. Routing along the shorter arc
// to orange fails for blues (it passes through cyan, which reads *cooler*), so we
// move toward the red point (0/360) splitting at hue 180 — blues go up through
// magenta, greens/yellows go down toward orange.
function warmStep(hex: string, step = 28): number {
  return hexToHsl(hex).h <= 180 ? -step : step
}
// "Cooler" toward the azure pole (210) along the shorter arc reads correctly from
// every starting hue, so a bounded step toward 210 is enough.
function coolStep(hex: string, max = 28): number {
  return Math.round(Math.max(-max, Math.min(max, rotationToward(hex, 210))))
}

const ADJECTIVES: AdjRule[] = [
  {
    test: /\b(warm(er)?|cozier|sunset|earthy)\b/,
    run: (ds) => {
      const deg = warmStep(accentOf(ds))
      return {
        label: `warmed the brand hue ${Math.abs(deg)}°`,
        apply: (d) =>
          setAccent(d, shiftHue(accentOf(d), warmStep(accentOf(d)))),
      }
    },
  },
  {
    test: /\b(cool(er)?|icy|colder|fresh)\b/,
    run: (ds) => {
      const deg = coolStep(accentOf(ds))
      if (deg === 0) return null
      return {
        label: `cooled the brand hue ${Math.abs(deg)}°`,
        apply: (d) =>
          setAccent(d, shiftHue(accentOf(d), coolStep(accentOf(d)))),
      }
    },
  },
  {
    test: /\b(vibrant|bold(er)?|punch(y|ier)?|saturated|vivid|pop)\b/,
    run: () => ({
      label: 'boosted brand saturation',
      apply: (d) =>
        setChromaMult(setAccent(d, scaleSaturation(accentOf(d), 1.25)), 1.2),
    }),
  },
  {
    test: /\b(muted|subtle|calm(er)?|desaturated|understated|quiet)\b/,
    run: () => ({
      label: 'softened brand saturation',
      apply: (d) =>
        setChromaMult(setAccent(d, scaleSaturation(accentOf(d), 0.72)), 0.8),
    }),
  },
  {
    test: /\b(round(er)?|soft(er)?|pill|bubbly|friendl(y|ier))\b/,
    run: (ds) => {
      const next = Math.min(2, radiusOf(ds) + 0.6)
      return {
        label: `rounded corners to ${next.toFixed(2)}×`,
        apply: (d) => setRadius(d, Math.min(2, radiusOf(d) + 0.6)),
      }
    },
  },
  {
    test: /\b(sharp(er)?|square|boxy|crisp|tight(er)? corners|angular|technical)\b/,
    run: (ds) => {
      const next = Math.max(0, radiusOf(ds) - 0.6)
      return {
        label: `sharpened corners to ${next.toFixed(2)}×`,
        apply: (d) => setRadius(d, Math.max(0, radiusOf(d) - 0.6)),
      }
    },
  },
  {
    test: /\b(dense(r)?|compact|tight(er)?|condensed)\b/,
    run: () => ({
      label: 'set density to compact',
      apply: (d) => ({ ...d, density: 'compact' }),
    }),
  },
  {
    test: /\b(airy|spacious|roomy|breath|relaxed|comfortable|cozy)\b/,
    run: () => ({
      label: 'set density to comfortable',
      apply: (d) => ({ ...d, density: 'comfortable' }),
    }),
  },
  {
    test: /\b(accessible|contrast|legible|readable|wcag|a11y)\b/,
    run: () => ({
      label: 'switched to the contrast-locked algorithm',
      apply: (d) => setAlgorithm(d, 'contrast'),
    }),
  },
  {
    test: /\b(tinted|brand[- ]?tint|warm gray|colou?red gray)\b/,
    run: () => ({
      label: 'tinted the grays toward the brand',
      apply: (d) => setNeutral(d, accentOf(d)),
    }),
  },
]

/* ------------------------------- Interpret -------------------------------- */

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

const RANDOM_HUES = [220, 246, 268, 282, 330, 345, 28, 142, 175, 190]
const RANDOM_RADII = [0, 0.5, 1, 1.5]

export function interpret(prompt: string, ds: DesignSystem): Interpretation {
  const text = prompt.toLowerCase().trim()
  if (!text)
    return { reply: 'Tell me how it should feel.', actions: [], noop: true }

  // Reroll / surprise — one decisive shuffle.
  if (
    /\b(surprise|random|inspire|shuffle|reroll|re-roll|something new)\b/.test(
      text,
    )
  ) {
    const hue = pick(RANDOM_HUES)
    const radius = pick(RANDOM_RADII)
    const density = pick(['compact', 'default', 'comfortable'] as const)
    return {
      reply: 'Rolled a fresh direction for you — keep it or roll again.',
      actions: [
        {
          label: 'rolled a new look',
          apply: (d) => ({
            ...setRadius(setAccent(d, seedForHue(hue)), radius),
            density,
          }),
        },
      ],
    }
  }

  // Named look — exclusive, wins over adjectives.
  const look = NAMED_LOOKS.find((l) => l.keys.some((k) => text.includes(k)))
  if (look) {
    return {
      reply: look.reply,
      actions: [{ label: look.reply, apply: look.build }],
    }
  }

  // Explicit color word → set the brand seed to that hue.
  const colorActions: Action[] = []
  for (const [word, hue] of Object.entries(HUE_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(text)) {
      colorActions.push({
        label: `set the brand to ${word}`,
        apply: (d) => setAccent(d, seedForHue(hue)),
      })
      break // one brand hue
    }
  }

  // Adjectives — compose every match so "warmer and rounder" does both.
  const adjActions = ADJECTIVES.map((r) =>
    r.test.test(text) ? r.run(ds) : null,
  ).filter((a): a is Action => a != null)

  const actions = [...colorActions, ...adjActions]

  if (actions.length === 0) {
    return {
      reply:
        "I didn't catch a direction in that. Try a vibe (“warmer”, “more playful”), a brand color (“teal”), a reference (“like Linear”), or “surprise me”.",
      actions: [],
      noop: true,
    }
  }

  const clause = actions.map((a) => a.label).join(', ')
  return {
    reply: `Done — ${clause}.`,
    actions,
  }
}

/** Curated one-tap prompts surfaced as chips in the copilot. */
export const QUICK_PROMPTS: { label: string; prompt: string }[] = [
  { label: 'Warmer', prompt: 'make it warmer' },
  { label: 'More contrast', prompt: 'more accessible contrast' },
  { label: 'Rounder', prompt: 'rounder, friendlier corners' },
  { label: 'Like Linear', prompt: 'feel like Linear' },
  { label: 'Editorial', prompt: 'editorial look' },
  { label: 'More vibrant', prompt: 'bolder and more vibrant' },
  { label: 'Calmer', prompt: 'muted and calmer' },
  { label: 'Surprise me', prompt: 'surprise me' },
]
