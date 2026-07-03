// Fact schema v1 — frozen 2026-07-03 after the plan-002 Radix/Linear pilot.
// Additive changes only; breaking changes need a migration note in data/RETRO.md.
import { z } from 'zod'

// Plain ISO days: full timestamps churn diffs without adding meaning.
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'expected an ISO date (YYYY-MM-DD)')

export const evidenceKindSchema = z.enum([
  'docs',
  'source',
  'shipped-css',
  'changelog',
  'blog',
  'talk',
])

export const methodSchema = z.enum([
  'documented',
  'source-read',
  'reverse-engineered',
])

export const confidenceSchema = z.enum(['verified', 'inferred'])

export const evidenceSchema = z.object({
  url: z.url(),
  kind: evidenceKindSchema,
  retrievedAt: isoDate,
  excerpt: z.string().max(600).optional(),
  note: z.string().optional(),
})

const factBase = {
  questionId: z.string().min(1),
  summary: z.string().min(1),
  evidence: z.array(evidenceSchema).min(1),
  method: methodSchema,
  verifiedAt: isoDate,
  confidence: confidenceSchema,
  notes: z.string().optional(),
}

// `unknown`/`not-applicable` facts carry a reason instead of an answer — never guess.
export const factSchema = z.discriminatedUnion('status', [
  z.object({ ...factBase, status: z.literal('answered'), answer: z.unknown() }),
  z.object({
    ...factBase,
    status: z.enum(['unknown', 'not-applicable']),
    reason: z.string().min(1),
  }),
])

export const factsFileSchema = z.array(factSchema)

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
  addedAt: isoDate,
})

export const dimensionSchema = z.enum(['color-tokens'])

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

export type EvidenceKind = z.infer<typeof evidenceKindSchema>
export type Method = z.infer<typeof methodSchema>
export type Confidence = z.infer<typeof confidenceSchema>
export type Evidence = z.infer<typeof evidenceSchema>
export type Fact = z.infer<typeof factSchema>
export type System = z.infer<typeof systemSchema>
export type Dimension = z.infer<typeof dimensionSchema>
export type RosterEntry = z.infer<typeof rosterEntrySchema>

export interface SystemWithFacts extends System {
  facts: Fact[]
}

/** Question-bank entry minus its zod answerShape (JSON-serializable). */
export interface QuestionMeta {
  id: string
  dimension: Dimension
  prompt: string
  matrixable: boolean
  rationale: string
}

/** Shape of the generated `src/data/__generated__/index.json`. */
export interface DataIndex {
  questionBankVersion: number
  questionBank: QuestionMeta[]
  roster: RosterEntry[]
  systems: SystemWithFacts[]
}
