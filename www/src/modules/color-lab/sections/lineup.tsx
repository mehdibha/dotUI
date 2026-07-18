import type { Theme } from '@dotui/colors'

import type { CvdType } from '../color'
import type { ColorSystem } from '../data'
import type { Mode } from '../page'
import { ScaleStrip } from '../primitives'

export function LineupSection({
  systems,
  engineReport,
  mode,
  cvd,
}: {
  systems: ColorSystem[]
  engineReport: Theme['report'] | null
  mode: Mode
  cvd: CvdType | null
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {systems.map((system) =>
        system.empty ? (
          <EmptyEngineCard key={system.id} system={system} />
        ) : (
          <SystemCard
            key={system.id}
            system={system}
            mode={mode}
            cvd={cvd}
            report={system.id === 'dotui' ? engineReport : null}
          />
        ),
      )}
    </div>
  )
}

function EmptyEngineCard({ system }: { system: ColorSystem }) {
  return (
    <div className="flex flex-col rounded-xl border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full border border-neutral-300 dark:border-neutral-600" />
        <h3 className="text-sm font-semibold">{system.name}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
        {system.description} Once the engine emits scales, they drop into every
        comparison on this page.
      </p>
      <div className="mt-auto space-y-1.5 pt-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-4 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800"
          />
        ))}
      </div>
    </div>
  )
}

function SystemCard({
  system,
  mode,
  cvd,
  report,
}: {
  system: ColorSystem
  mode: Mode
  cvd: CvdType | null
  report: Theme['report'] | null
}) {
  const singlePalette = system.scales.every((s) => s.dark === null)
  return (
    <div
      className={`flex flex-col rounded-xl border p-5 ${
        report
          ? 'border-neutral-400 dark:border-neutral-500'
          : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          {system.name}
          {report && (
            <span className="rounded-full bg-neutral-900 px-1.5 py-px font-mono text-[9px] font-medium text-white uppercase dark:bg-neutral-100 dark:text-neutral-900">
              live
            </span>
          )}
        </h3>
        <a
          href={system.website}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          {system.stepCount} steps{singlePalette ? ' · single palette' : ''} ↗
        </a>
      </div>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {system.description}
      </p>
      {report && (
        <p
          className={`mt-2 text-[11px] leading-relaxed ${
            report.ok
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {report.ok
            ? `All ${report.guarantees.length} guarantees hold.`
            : `${report.guarantees.filter((g) => !g.passes).length} guarantee(s) missed.`}
          {report.warnings.length > 0 &&
            ` ${report.warnings.length} warning(s).`}
        </p>
      )}
      <details className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
        <summary className="cursor-pointer select-none hover:text-neutral-600 dark:hover:text-neutral-300">
          Philosophy & sources
        </summary>
        <p className="mt-1.5 leading-relaxed">{system.philosophy}</p>
        {report && report.warnings.length > 0 && (
          <ul className="mt-1.5 space-y-0.5 text-amber-600 dark:text-amber-400">
            {report.warnings.map((w) => (
              <li key={w}>⚠ {w}</li>
            ))}
          </ul>
        )}
        <ul className="mt-1.5 space-y-0.5">
          {system.sources.slice(0, 3).map((src) => (
            <li key={src} className="truncate">
              {src.startsWith('http') ? (
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] underline decoration-neutral-300 underline-offset-2 dark:decoration-neutral-700"
                >
                  {src.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <span className="font-mono text-[10px]">{src}</span>
              )}
            </li>
          ))}
        </ul>
      </details>
      <div className="mt-auto space-y-1.5 pt-4">
        {system.scales.map((scale) => (
          <ScaleStrip
            key={scale.id}
            steps={mode === 'dark' && scale.dark ? scale.dark : scale.light}
            cvd={cvd}
            height="h-4"
          />
        ))}
      </div>
    </div>
  )
}
