import type { CvdType } from '../color'
import { ENGINE_SLOT, referenceSystems, type ColorSystem } from '../data'
import type { Mode } from '../page'
import { ScaleStrip } from '../primitives'

export function LineupSection({
  mode,
  cvd,
}: {
  mode: Mode
  cvd: CvdType | null
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <EngineCard />
      {referenceSystems.map((system) => (
        <SystemCard key={system.id} system={system} mode={mode} cvd={cvd} />
      ))}
    </div>
  )
}

function EngineCard() {
  return (
    <div className="flex flex-col rounded-xl border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full border border-neutral-300 dark:border-neutral-600" />
        <h3 className="text-sm font-semibold">{ENGINE_SLOT.name}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
        {ENGINE_SLOT.description} Once the rewrite emits scales, they drop into
        every comparison on this page.
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
}: {
  system: ColorSystem
  mode: Mode
  cvd: CvdType | null
}) {
  const singlePalette = system.scales.every((s) => s.dark === null)
  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{system.name}</h3>
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
      <details className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
        <summary className="cursor-pointer select-none hover:text-neutral-600 dark:hover:text-neutral-300">
          Philosophy & sources
        </summary>
        <p className="mt-1.5 leading-relaxed">{system.philosophy}</p>
        <ul className="mt-1.5 space-y-0.5">
          {system.sources.slice(0, 3).map((src) => (
            <li key={src} className="truncate">
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] underline decoration-neutral-300 underline-offset-2 dark:decoration-neutral-700"
              >
                {src.replace(/^https?:\/\//, '')}
              </a>
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
