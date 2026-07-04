'use client'

import type { Ramp } from '@/data/schema'

import { SwatchPopover } from './swatch-popover'

const kindLabels: Record<Ramp['kind'], string> = {
  neutral: 'Neutrals',
  chromatic: 'Colors',
  alpha: 'Alpha',
  overlay: 'Overlays',
  static: 'Static',
}

const kindOrder: Ramp['kind'][] = [
  'neutral',
  'chromatic',
  'alpha',
  'overlay',
  'static',
]

interface RampGridProps {
  ramps: Ramp[]
  mode: string
}

/** All ramps as swatch rows, clustered by kind. Click a swatch for its dossier. */
export function RampGrid({ ramps, mode }: RampGridProps) {
  const clusters = kindOrder
    .map((kind) => ({ kind, ramps: ramps.filter((r) => r.kind === kind) }))
    .filter((cluster) => cluster.ramps.length > 0)

  return (
    <div className="flex flex-col gap-8">
      {clusters.map(({ kind, ramps: clusterRamps }) => (
        <div key={kind}>
          <h3 className="text-sm font-medium text-fg-muted">
            {kindLabels[kind]}
            <span className="ml-2 font-normal">
              {clusterRamps.length}{' '}
              {clusterRamps.length === 1 ? 'ramp' : 'ramps'}
              {' · '}
              {clusterRamps[0]?.steps.length} steps
            </span>
          </h3>
          <div className="mt-3 flex flex-col gap-1.5">
            {clusterRamps.map((ramp) => {
              const bgStep = ramp.steps.find((step) => step.step === '2')
              return (
                <div
                  key={ramp.name}
                  className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]"
                >
                  <span
                    className="truncate font-mono text-xs text-fg-muted"
                    title={ramp.note ?? ramp.name}
                  >
                    {ramp.name}
                  </span>
                  <div className="flex overflow-hidden rounded-md border">
                    {ramp.steps.map((step) => {
                      const value =
                        step.values[mode] ?? Object.values(step.values)[0]
                      if (!value) return null
                      const bg = bgStep?.values[mode]
                      return (
                        <SwatchPopover
                          key={step.step}
                          title={`${ramp.name} · ${step.step}`}
                          value={value}
                          values={step.values}
                          measured={
                            bg && step.step !== bgStep.step
                              ? [
                                  {
                                    label: `on step 2 (${mode})`,
                                    fg: value,
                                    bg,
                                  },
                                ]
                              : []
                          }
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
