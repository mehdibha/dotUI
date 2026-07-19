import { useState } from 'react'

import { rgbToHex, simulateCvd, type CvdType } from './color'
import type { Step } from './data'

export function stepHex(step: Step, cvd: CvdType | null): string {
  return cvd ? rgbToHex(simulateCvd(step.rgb, cvd)) : step.hex
}

/** A scale as a physical strip of paint chips. */
export function ScaleStrip({
  steps,
  cvd,
  height = 'h-10',
  active,
  onStepHover,
}: {
  steps: Step[]
  cvd: CvdType | null
  height?: string
  /** Step index to emphasize (e.g. hovered step across all systems). */
  active?: number | null
  onStepHover?: (index: number | null) => void
}) {
  return (
    <div
      className={`flex ${height} w-full overflow-hidden rounded-md`}
      onMouseLeave={() => onStepHover?.(null)}
    >
      {steps.map((step, index) => (
        <button
          key={index}
          type="button"
          title={`${step.name} · ${step.hex} · L ${step.oklch.l.toFixed(3)}`}
          onMouseEnter={() => onStepHover?.(index)}
          onClick={() => navigator.clipboard?.writeText(step.raw)}
          style={{ backgroundColor: stepHex(step, cvd) }}
          className={`min-w-0 flex-1 transition-[flex-grow] duration-150 ${
            active === index ? 'grow-[1.6]' : ''
          }`}
        />
      ))}
    </div>
  )
}

export interface CurveSeries {
  id: string
  label: string
  /** x normalized 0..1 across the scale, y in the plot's domain, color = the
      actual step color (the data IS color — no arbitrary palette). */
  points: { x: number; y: number; color: string }[]
  muted?: boolean
}

/** Minimal comparative line plot: recessive grid, one axis, ink lines with
    step-colored markers, direct labels via the caller. */
export function CurvePlot({
  series,
  yDomain,
  height = 180,
  formatY = (v) => v.toFixed(2),
  yTicks = 4,
}: {
  series: CurveSeries[]
  yDomain: [number, number]
  height?: number
  formatY?: (v: number) => string
  yTicks?: number
}) {
  const [hover, setHover] = useState<{ s: CurveSeries; index: number } | null>(
    null,
  )
  const width = 560
  const pad = { top: 10, right: 12, bottom: 8, left: 40 }
  const iw = width - pad.left - pad.right
  const ih = height - pad.top - pad.bottom
  const [y0, y1] = yDomain
  const px = (x: number) => pad.left + x * iw
  const py = (y: number) => pad.top + (1 - (y - y0) / (y1 - y0)) * ih
  const ticks = Array.from(
    { length: yTicks + 1 },
    (_, index) => y0 + ((y1 - y0) * index) / yTicks,
  )
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={py(t)}
              y2={py(t)}
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth={1}
            />
            <text
              x={pad.left - 8}
              y={py(t) + 3}
              textAnchor="end"
              className="fill-neutral-400 text-[9px] tabular-nums dark:fill-neutral-500"
            >
              {formatY(t)}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <g key={s.id} opacity={s.muted ? 0.18 : 1}>
            <polyline
              points={s.points.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')}
              fill="none"
              strokeWidth={s.muted ? 1 : 1.5}
              className="stroke-neutral-400 dark:stroke-neutral-600"
            />
            {!s.muted &&
              s.points.map((p, index) => (
                <circle
                  key={index}
                  cx={px(p.x)}
                  cy={py(p.y)}
                  r={hover?.s.id === s.id && hover.index === index ? 5 : 3.5}
                  fill={p.color}
                  className="stroke-white dark:stroke-neutral-950"
                  strokeWidth={1.5}
                  onMouseEnter={() => setHover({ s, index })}
                />
              ))}
          </g>
        ))}
      </svg>
      {hover && (
        <div className="pointer-events-none absolute top-1 right-2 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[10px] tabular-nums shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {hover.s.label}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {' '}
            · step {hover.index + 1} ·{' '}
            {formatY(hover.s.points[hover.index]?.y ?? 0)}
          </span>
        </div>
      )}
    </div>
  )
}
