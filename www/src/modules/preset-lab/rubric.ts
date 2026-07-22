export const RUBRIC_CRITERIA = [
  { id: 'silhouette', label: 'Silhouette', hint: 'Shape, size, proportions' },
  { id: 'surface', label: 'Surface', hint: 'Background, border, shadow' },
  { id: 'color', label: 'Color', hint: 'Token colors match the reference' },
  {
    id: 'typography',
    label: 'Typography',
    hint: 'Family, size, weight, tracking',
  },
  {
    id: 'states',
    label: 'States',
    hint: 'Hover, focus, active, disabled, selected',
  },
  { id: 'spacing', label: 'Spacing', hint: 'Padding, gaps, density' },
] as const

export type CriterionId = (typeof RUBRIC_CRITERIA)[number]['id']

/** Per-criterion score: 0 = off, 1 = close, 2 = matches. */
export type Score = 0 | 1 | 2

export type RubricScores = Record<CriterionId, Score>

export type AuditEntry = {
  component: string
  /** `null` = not yet audited; the Phase 1/2 audits fill this in. */
  scores: RubricScores | null
  notes?: string
  /** Optional explicit ref overrides; the page resolves refs by convention otherwise. */
  refLight?: string
  refDark?: string
}

export const MAX_SCORE = RUBRIC_CRITERIA.length * 2
export const PASS_THRESHOLD = 9

export function totalScore(scores: RubricScores): number {
  return RUBRIC_CRITERIA.reduce((sum, c) => sum + scores[c.id], 0)
}

/** Passes at total ≥ threshold with no criterion at 0. */
export function passes(scores: RubricScores): boolean {
  return (
    totalScore(scores) >= PASS_THRESHOLD &&
    RUBRIC_CRITERIA.every((c) => scores[c.id] > 0)
  )
}
