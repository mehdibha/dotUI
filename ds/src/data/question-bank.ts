// v1, frozen 2026-07-03 after the Radix/Linear pilot. IDs are permanent once
// published; additive changes only — breaking changes need a migration note in
// data/RETRO.md.
import { z } from 'zod'

import type { QuestionMeta } from './schema'

export interface Question extends QuestionMeta {
  answerShape: z.ZodType
}

export const questionBankVersion = 1

export const questionBank: Question[] = [
  {
    id: 'palette.structure',
    dimension: 'color-tokens',
    prompt:
      'What is the structure of the base palette? Stepped ramps, semantic-only, or a hybrid — and if ramps: how many, how many steps, how are steps numbered, and do steps carry defined usage roles?',
    answerShape: z.object({
      organization: z.enum(['stepped-ramps', 'semantic-only', 'hybrid']),
      rampCount: z.number().int().positive().nullable(),
      stepsPerRamp: z.number().int().positive().nullable(),
      stepNumbering: z.string().nullable(),
      stepRoles: z.enum(['defined-per-step', 'loose-guidance', 'none']),
      alphaVariants: z.boolean(),
    }),
    matrixable: true,
    rationale:
      'The ramp-first vs semantic-only split is the deepest architectural divide between systems; step count and role semantics determine everything downstream.',
  },
  {
    id: 'palette.generation',
    dimension: 'color-tokens',
    prompt:
      "How are the palette's colors produced? Algorithmic, hand-authored, or tool-assisted — with what algorithm, what inputs (seed color, contrast level, lightness curve…), and is the implementation open?",
    answerShape: z.object({
      approach: z.enum([
        'algorithmic',
        'hand-authored',
        'tool-assisted',
        'unknown',
      ]),
      algorithm: z.string().nullable(),
      inputs: z.array(z.string()),
      implementation: z.enum([
        'open-source',
        'hosted-tool',
        'closed',
        'unknown',
      ]),
    }),
    matrixable: true,
    rationale:
      'Generation is where systems differ most in substance; whether the algorithm is open decides whether findings can be independently reproduced.',
  },
  {
    id: 'palette.colorspace',
    dimension: 'color-tokens',
    prompt:
      'Which color space(s) does the system work in, and which formats does it ship? Wide-gamut (Display P3) support: none, partial, or full?',
    answerShape: z.object({
      // null = authoring space not published
      workingSpaces: z.array(z.string()).nullable(),
      outputFormats: z.array(z.string()).min(1),
      wideGamut: z.enum(['none', 'partial', 'full', 'unknown']),
    }),
    matrixable: true,
    rationale:
      'Perceptual-space choice (LCH, HCT, HSLuv, OKLCH…) is fragmented across the industry and shapes what uniformity guarantees are even possible.',
  },
  {
    id: 'contrast.strategy',
    dimension: 'color-tokens',
    prompt:
      'What contrast guarantees exist, and how are they enforced — by construction, by tooling, or by convention? Against which standard (WCAG 2.x, APCA), and are specific token pairings guaranteed?',
    answerShape: z.object({
      enforcement: z.enum([
        'by-construction',
        'tooling-checked',
        'convention',
        'none-documented',
        'unknown',
      ]),
      standard: z.enum([
        'wcag2',
        'apca',
        'both',
        'custom',
        'none-documented',
        'unknown',
      ]),
      guaranteedPairings: z.array(z.string()),
    }),
    matrixable: true,
    rationale:
      'Contrast handling separates engineered color systems from curated ones; the enforcement mechanism matters more than the claim.',
  },
  {
    id: 'tokens.layers',
    dimension: 'color-tokens',
    prompt:
      'What token layers exist between raw values and components (primitive → semantic → component)? Name each layer as the system names it, with an example token.',
    answerShape: z.object({
      layers: z
        .array(
          z.object({
            name: z.string(),
            kind: z.enum(['primitive', 'semantic', 'component']),
            example: z.string(),
          }),
        )
        .min(1),
    }),
    matrixable: true,
    rationale:
      'Layering is the token architecture; which layers exist (and which are missing) predicts how a system re-themes and scales.',
  },
  {
    id: 'tokens.scope',
    dimension: 'color-tokens',
    prompt:
      'What is tokenized beyond color? Spacing, radius, typography, elevation, motion, breakpoints, cursors, z-index, opacity — and anything system-specific.',
    answerShape: z.object({
      color: z.boolean(),
      spacing: z.boolean(),
      radius: z.boolean(),
      typography: z.boolean(),
      elevation: z.boolean(),
      motion: z.boolean(),
      breakpoints: z.boolean(),
      cursor: z.boolean(),
      zIndex: z.boolean(),
      opacity: z.boolean(),
      other: z.array(z.string()),
    }),
    matrixable: true,
    rationale:
      'Token scope reveals how far the system treats design decisions as data; the gaps are as telling as the coverage.',
  },
  {
    id: 'tokens.naming',
    dimension: 'color-tokens',
    prompt:
      'What is the token naming grammar (case style, dominant pattern), and through which mechanism are themes applied (CSS custom properties, class switch, data attributes, build-time…)?',
    answerShape: z.object({
      caseStyle: z.string(),
      pattern: z.string(),
      examples: z.array(z.string()).min(1),
      themingMechanisms: z
        .array(
          z.enum([
            'css-custom-properties',
            'class-switch',
            'data-attribute',
            'media-query',
            'build-time',
            'css-in-js',
            'inline-style',
            // Added 2026-07-03 (spectrum-2): native CSS light-dark() driven by
            // the color-scheme property — no custom-property re-pointing.
            'css-light-dark',
          ]),
        )
        .min(1),
    }),
    matrixable: true,
    rationale:
      'Naming encodes the mental model, and the theming mechanism decides whether a system can re-theme at runtime at all.',
  },
  {
    id: 'modes.support',
    dimension: 'color-tokens',
    prompt:
      'Which color modes ship (light, dark, high-contrast, others)? Is dark a separate palette, a transformed palette, or the same tokens re-pointed — and does the system sync with OS preference?',
    answerShape: z.object({
      modes: z.array(z.string()).min(1),
      darkStrategy: z.enum([
        'separate-palette',
        'transformed-palette',
        'token-repointing',
        'single-mode',
        'unknown',
      ]),
      highContrast: z.enum([
        'dedicated-mode',
        'per-component-option',
        'generated',
        'none',
        'unknown',
      ]),
      systemSync: z.enum(['built-in', 'delegated', 'none', 'unknown']),
    }),
    matrixable: true,
    rationale:
      'Mode strategy exposes whether the token architecture actually carries its weight — re-pointing only works if the semantic layer is real.',
  },
  {
    id: 'focus.construction',
    dimension: 'color-tokens',
    prompt:
      'How is the focus highlight built? Outline, box-shadow, or border; what width and offset; where does its color come from (which token); and is it gated on :focus-visible?',
    answerShape: z.object({
      technique: z.enum([
        'outline',
        'box-shadow',
        'border',
        'background',
        'mixed',
        'unknown',
      ]),
      width: z.string().nullable(),
      offset: z.string().nullable(),
      colorSource: z.string().nullable(),
      focusVisibleOnly: z.boolean().nullable(),
    }),
    matrixable: true,
    rationale:
      'The focus ring is the most-copied piece of color-adjacent mechanics; its color sourcing shows how deep the token system reaches.',
  },
  {
    id: 'component.color-usage',
    dimension: 'color-tokens',
    prompt:
      'Spot-check: how does a Button consume the color system? Which token layer(s) does it touch, how many variants exist, and does it hardcode any raw color values?',
    answerShape: z.object({
      component: z.string(),
      layersConsumed: z
        .array(z.enum(['primitive', 'semantic', 'component']))
        .min(1),
      variantNames: z.array(z.string()),
      accentOptions: z.number().int().nullable(),
      hardcodedValues: z.boolean(),
    }),
    matrixable: false,
    rationale:
      'A single-component spot-check, deliberately not matrixed: it samples how the architecture holds up in practice, not a system-wide claim.',
  },
]

export const questionById = new Map(questionBank.map((q) => [q.id, q]))
