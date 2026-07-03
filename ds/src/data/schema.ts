// Data schema v2 — 2026-07-03. v1's question-bank/facts model was replaced by
// structured color-system data rendered by shared exploration components
// (migration note in data/RETRO.md). Additive changes only; breaking changes
// need a new migration note.
import { z } from 'zod'

// Plain ISO days: full timestamps churn diffs without adding meaning.
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'expected an ISO date (YYYY-MM-DD)')

export const methodSchema = z.enum([
  'documented',
  'source-read',
  'reverse-engineered',
])

export const systemTypeSchema = z.enum([
  'corporate-design-system',
  'component-library',
  'token-or-color-system',
  'styling-distribution',
])

export const systemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  org: z.string().min(1),
  type: systemTypeSchema,
  upstream: z.array(z.string()),
  sources: z.object({
    docs: z.url().nullable(),
    repo: z.url().nullable(),
    site: z.url().nullable(),
    figma: z.url().nullable(),
  }),
  status: z.enum(['planned', 'researched', 'published']),
  createdAt: isoDate,
  updatedAt: isoDate,
  reviewedAt: isoDate,
})

/** A labeled fact for spec tables (overview, focus…), with optional sources. */
export const specEntrySchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().nullable(),
  sources: z.array(z.url()).default([]),
})

export const layerKindSchema = z.enum(['primitive', 'semantic', 'component'])

export const layerSchema = z.object({
  name: z.string().min(1),
  kind: layerKindSchema,
  example: z.string().min(1),
  note: z.string().nullable(),
})

/** Mode name → shipped CSS color/value string (hex, rgb(), var(), color-mix()…). */
const valuesByMode = z.record(z.string(), z.string().min(1))

export const rampSchema = z.object({
  name: z.string().min(1),
  kind: z.enum(['chromatic', 'neutral', 'alpha', 'static', 'overlay']),
  note: z.string().nullable(),
  steps: z
    .array(z.object({ step: z.string().min(1), values: valuesByMode }))
    .min(1),
})

export const tokenSchema = z.object({
  name: z.string().min(1),
  /** What the token points at in the system's own vocabulary ({blue-800}, var(--gray-1)…). */
  ref: z.string().nullable(),
  values: valuesByMode,
  note: z.string().nullable(),
})

export const tokenGroupSchema = z.object({
  name: z.string().min(1),
  layer: layerKindSchema,
  note: z.string().nullable(),
  sources: z.array(z.url()).default([]),
  tokens: z.array(tokenSchema).min(1),
})

export const contrastPairSchema = z.object({
  label: z.string().min(1),
  /** Resolved colors for preview; null when the pair is documented but not resolvable. */
  fgColor: z.string().nullable(),
  bgColor: z.string().nullable(),
  mode: z.string().nullable(),
  metric: z.enum(['wcag2', 'apca']),
  value: z.string().min(1),
  kind: z.enum(['documented', 'measured']),
  note: z.string().nullable(),
})

export const colorsFileSchema = z.object({
  modes: z.array(z.string().min(1)).min(1),
  overview: z.array(specEntrySchema),
  layers: z.array(layerSchema),
  ramps: z.array(rampSchema),
  tokenGroups: z.array(tokenGroupSchema),
  focus: z.array(specEntrySchema),
  contrast: z.array(contrastPairSchema),
  sources: z.array(z.url()).min(1),
})

export const rosterEntrySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  org: z.string().min(1),
  type: systemTypeSchema,
  status: z.enum(['tier1', 'watchlist', 'rejected']),
  method: methodSchema,
  upstream: z.array(z.string()),
  scores: z.array(z.number().int().min(0).max(3)).length(5),
  sources: z.object({
    docs: z.url().nullable(),
    repo: z.url().nullable(),
    npm: z.array(z.string()),
    other: z.array(z.url()),
  }),
  rationale: z.string().min(1),
})

export const rosterSchema = z.object({
  $comment: z.string().optional(),
  version: z.number().int(),
  approvedAt: isoDate,
  systems: z.array(rosterEntrySchema),
})

export type Method = z.infer<typeof methodSchema>
export type System = z.infer<typeof systemSchema>
export type SpecEntry = z.infer<typeof specEntrySchema>
export type Layer = z.infer<typeof layerSchema>
export type Ramp = z.infer<typeof rampSchema>
export type Token = z.infer<typeof tokenSchema>
export type TokenGroup = z.infer<typeof tokenGroupSchema>
export type ContrastPair = z.infer<typeof contrastPairSchema>
export type ColorsFile = z.infer<typeof colorsFileSchema>
export type RosterEntry = z.infer<typeof rosterEntrySchema>

export interface SystemWithColors extends System {
  colors: ColorsFile
}

/** Shape of the generated `src/data/__generated__/index.json`. */
export interface DataIndex {
  roster: RosterEntry[]
  systems: SystemWithColors[]
}
