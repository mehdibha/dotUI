// Drift: re-run a system's extract in memory and diff against the committed
// colors.json. Behaviour depends on the source tier:
//   - repo/npm: any mismatch is a bug (extractor drift or a hand-edited data
//     file) → print the diff and exit 1.
//   - live-site: a mismatch means the upstream stylesheet moved → report
//     "source changed, review the diff" and exit 0 (the snapshot is expected
//     to be re-run deliberately).
import type { ColorsFile } from '../../src/data/schema'

/** A minimal path-addressed deep diff, enough to point at what moved. */
export function diff(
  committed: unknown,
  fresh: unknown,
  pathPrefix = '',
): string[] {
  const out: string[] = []
  const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null

  if (Array.isArray(committed) && Array.isArray(fresh)) {
    if (committed.length !== fresh.length) {
      out.push(`${pathPrefix}: length ${committed.length} → ${fresh.length}`)
    }
    const max = Math.max(committed.length, fresh.length)
    for (let i = 0; i < max; i++) {
      out.push(...diff(committed[i], fresh[i], `${pathPrefix}[${i}]`))
    }
    return out
  }

  if (isObj(committed) && isObj(fresh)) {
    const keys = new Set([...Object.keys(committed), ...Object.keys(fresh)])
    for (const key of keys) {
      out.push(...diff(committed[key], fresh[key], `${pathPrefix}.${key}`))
    }
    return out
  }

  if (JSON.stringify(committed) !== JSON.stringify(fresh)) {
    out.push(
      `${pathPrefix}: ${JSON.stringify(committed)} → ${JSON.stringify(fresh)}`,
    )
  }
  return out
}

export interface DriftResult {
  changed: boolean
  diffs: string[]
  /** Exit code the caller should use, per source tier. */
  exitCode: number
  message: string
}

export function evaluateDrift(
  committed: ColorsFile,
  fresh: ColorsFile,
): DriftResult {
  const diffs = diff(committed, fresh, 'colors')
  const changed = diffs.length > 0
  // The strongest source tier decides how a mismatch is treated.
  const tiers = new Set(committed.provenance.sources.map((s) => s.kind))
  const isLiveSite =
    tiers.has('live-site') && !tiers.has('repo') && !tiers.has('npm')

  if (!changed) {
    return {
      changed,
      diffs,
      exitCode: 0,
      message: 'no drift — extract matches committed data',
    }
  }
  if (isLiveSite) {
    return {
      changed,
      diffs,
      exitCode: 0,
      message:
        'source changed, review the diff (live-site) — re-run snapshot to accept',
    }
  }
  return {
    changed,
    diffs,
    exitCode: 1,
    message:
      'drift detected against a pinned source — extractor bug or hand-edited data',
  }
}
