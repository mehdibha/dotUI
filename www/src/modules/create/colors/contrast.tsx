'use client'

import type { GuaranteeResult, ThemeReport } from '@dotui/colors'

import { PALETTE_ORDER } from '@/registry/theme'

const MODES = ['light', 'dark'] as const

const GROUPS = [
  {
    id: 'text',
    label: 'Text',
    match: (name: string) => name.startsWith('text'),
  },
  {
    id: 'on-solid',
    label: 'On solid',
    match: (name: string) => name === 'on-solid',
  },
  {
    id: 'border',
    label: 'Border',
    match: (name: string) => name.startsWith('border'),
  },
] as const

/** Scales in display order: known palettes first, custom extras after. */
function orderedScales(guarantees: GuaranteeResult[]): string[] {
  const present = new Set(guarantees.map((g) => g.scale))
  const ordered = PALETTE_ORDER.filter((name) => present.has(name))
  const extra = [...present]
    .filter((name) => !(PALETTE_ORDER as readonly string[]).includes(name))
    .sort()
  return [...ordered, ...extra]
}

function failureTitle(failures: GuaranteeResult[]): string | undefined {
  if (failures.length === 0) return undefined
  return failures
    .map(
      (f) =>
        `${f.name} (${f.fg} on ${f.bg}): WCAG ${f.wcag.toFixed(2)}/${f.wcagTarget} · Lc ${f.lc.toFixed(1)}/${f.lcTarget}`,
    )
    .join('\n')
}

function GroupChip({
  label,
  results,
}: {
  label: string
  results: GuaranteeResult[]
}) {
  // No audited pairings of this kind for the scale/mode — don't claim a pass.
  if (results.length === 0) return null
  const failures = results.filter((r) => !r.passes)
  const passes = failures.length === 0
  return (
    <span
      title={failureTitle(failures)}
      className={
        passes
          ? 'rounded bg-neutral px-1.5 py-0.5 text-[10px] font-medium text-fg-muted'
          : 'rounded bg-danger px-1.5 py-0.5 text-[10px] font-medium text-fg-on-danger'
      }
    >
      {label} {passes ? '✓' : '✕'}
    </span>
  )
}

/**
 * The engine's guarantee audit (`theme.report`): pass/fail per scale for the
 * actually-shipped pairings in both modes, plus the report's warnings (CVD
 * gate, accent proximity, preserve-seed prices).
 */
export function ContrastReadout({ report }: { report: ThemeReport }) {
  const scales = orderedScales(report.guarantees)
  if (scales.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs font-medium text-fg-muted">
        Contrast guarantees
      </span>

      {report.warnings.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-md bg-warning-muted p-2 text-[11px] text-fg-warning">
          {report.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-1">
        {scales.map((scale) => {
          const forScale = report.guarantees.filter((g) => g.scale === scale)
          return (
            <div key={scale} className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 capitalize">{scale}</span>
              {MODES.map((mode) => {
                const forMode = forScale.filter((g) => g.mode === mode)
                return (
                  <div key={mode} className="flex flex-1 items-center gap-1">
                    <span className="text-[10px] text-fg-muted">
                      {mode === 'light' ? 'L' : 'D'}
                    </span>
                    {GROUPS.map((group) => (
                      <GroupChip
                        key={group.id}
                        label={group.label}
                        results={forMode.filter((g) => group.match(g.name))}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
