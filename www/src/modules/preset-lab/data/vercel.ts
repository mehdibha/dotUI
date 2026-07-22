import type { AuditEntry } from '../rubric'

/**
 * Vercel/Geist preset audit. Every entry is seeded unscored (`scores: null`) —
 * the Phase 1/2 fidelity passes fill in the rubric scores.
 */
export const vercelAudit: AuditEntry[] = [
  { component: 'button', scores: null },
  { component: 'input', scores: null },
  { component: 'tabs', scores: null },
  { component: 'switch', scores: null },
  { component: 'badge', scores: null },
  { component: 'command', scores: null },
  { component: 'checkbox', scores: null },
  { component: 'tooltip', scores: null },
]
