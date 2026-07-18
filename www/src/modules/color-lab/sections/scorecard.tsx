import { useMemo } from 'react'

import { referenceSystems } from '../data'
import { computeSystemMetrics, type ScaleMetrics } from '../metrics'
import type { Mode } from '../page'

interface Row {
  id: string
  name: string
  monotonic: boolean
  spacingStd: number | null
  hueDrift: number | null
  textContrast: number | null
  solidFgContrast: number | null
  darkSymmetry: number | null
  statusCvdSeparation: number | null
}

/** Everything measurable, measured — aggregated across each system's five
    scales for the current mode. The engine row is the finish line. */
export function ScorecardSection({ mode }: { mode: Mode }) {
  const rows = useMemo<Row[]>(
    () =>
      referenceSystems.map((system) => {
        const metrics = computeSystemMetrics(system)
        const perScale = Object.values(
          mode === 'dark' && Object.keys(metrics.dark).length
            ? metrics.dark
            : metrics.light,
        ).filter((m): m is ScaleMetrics => Boolean(m))
        const mean = (pick: (m: ScaleMetrics) => number | null) => {
          const values = perScale
            .map(pick)
            .filter((v): v is number => v !== null)
          return values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : null
        }
        return {
          id: system.id,
          name: system.name,
          monotonic: perScale.every((m) => m.monotonic),
          spacingStd: mean((m) => m.spacingStd),
          hueDrift: perScale.length
            ? Math.max(...perScale.map((m) => m.hueDrift))
            : null,
          textContrast: mean((m) => m.textContrast),
          solidFgContrast: mean((m) => m.solidFgContrast),
          darkSymmetry: metrics.darkSymmetry,
          statusCvdSeparation: metrics.statusCvdSeparation,
        }
      }),
    [mode],
  )

  const best = {
    spacingStd: min(rows, (r) => r.spacingStd),
    hueDrift: min(rows, (r) => r.hueDrift),
    textContrast: max(rows, (r) => r.textContrast),
    solidFgContrast: max(rows, (r) => r.solidFgContrast),
    darkSymmetry: min(rows, (r) => r.darkSymmetry),
    statusCvdSeparation: max(rows, (r) => r.statusCvdSeparation),
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-180 text-left text-xs">
        <thead>
          <tr className="border-b border-neutral-200 align-bottom text-[11px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
            <th className="py-2 pr-4 font-normal">System</th>
            <Th label="Monotonic L" note="lightness never reverses" />
            <Th label="Spacing σ" note="ΔL evenness — lower is better" />
            <Th label="Hue drift" note="max deviation, ° — lower is better" />
            <Th label="Text contrast" note="mean WCAG — higher is better" />
            <Th
              label="Solid contrast"
              note="vs foreground — higher is better"
            />
            <Th label="Dark symmetry" note="L mirror error — lower is closer" />
            <Th
              label="Status ΔCVD"
              note="deuteranopia separation — higher is safer"
            />
          </tr>
        </thead>
        <tbody className="tabular-nums">
          <tr className="border-b border-neutral-100 text-neutral-400 dark:border-neutral-900 dark:text-neutral-500">
            <td className="py-2.5 pr-4 font-medium">dotUI Engine</td>
            {Array.from({ length: 7 }, (_, index) => (
              <td key={index} className="py-2.5 pr-4">
                —
              </td>
            ))}
          </tr>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-100 dark:border-neutral-900"
            >
              <td className="py-2.5 pr-4 font-medium">{row.name}</td>
              <td className="py-2.5 pr-4">
                {row.monotonic ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✓
                  </span>
                ) : (
                  <span className="text-red-500">✕</span>
                )}
              </td>
              <Td
                value={row.spacingStd}
                format={(v) => v.toFixed(3)}
                best={best.spacingStd === row.id}
              />
              <Td
                value={row.hueDrift}
                format={(v) => `${v.toFixed(1)}°`}
                best={best.hueDrift === row.id}
              />
              <Td
                value={row.textContrast}
                format={(v) => v.toFixed(2)}
                best={best.textContrast === row.id}
              />
              <Td
                value={row.solidFgContrast}
                format={(v) => v.toFixed(2)}
                best={best.solidFgContrast === row.id}
              />
              <Td
                value={row.darkSymmetry}
                format={(v) => v.toFixed(3)}
                best={best.darkSymmetry === row.id}
              />
              <Td
                value={row.statusCvdSeparation}
                format={(v) => v.toFixed(3)}
                best={best.statusCvdSeparation === row.id}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
        The dot marks the best value per column. Metrics aggregate a system's
        five scales in the current mode; dark symmetry and status separation are
        mode-independent. None of these numbers is a verdict on its own — read
        them next to the ramps and the in-context render.
      </p>
    </div>
  )
}

function Th({ label, note }: { label: string; note: string }) {
  return (
    <th className="py-2 pr-4 font-normal">
      {label}
      <span className="block text-[9px] normal-case">{note}</span>
    </th>
  )
}

function Td({
  value,
  format,
  best,
}: {
  value: number | null
  format: (v: number) => string
  best: boolean
}) {
  return (
    <td className="py-2.5 pr-4">
      {value === null ? (
        <span className="text-neutral-400 dark:text-neutral-500">—</span>
      ) : (
        <span className="inline-flex items-center gap-1">
          {format(value)}
          {best && <span className="size-1 rounded-full bg-emerald-500" />}
        </span>
      )}
    </td>
  )
}

function min(rows: Row[], pick: (r: Row) => number | null): string | null {
  return extreme(rows, pick, (a, b) => a < b)
}
function max(rows: Row[], pick: (r: Row) => number | null): string | null {
  return extreme(rows, pick, (a, b) => a > b)
}
function extreme(
  rows: Row[],
  pick: (r: Row) => number | null,
  wins: (a: number, b: number) => boolean,
): string | null {
  let bestId: string | null = null
  let bestValue: number | null = null
  for (const row of rows) {
    const value = pick(row)
    if (value === null) continue
    if (bestValue === null || wins(value, bestValue)) {
      bestValue = value
      bestId = row.id
    }
  }
  return bestId
}
