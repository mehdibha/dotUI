"use client"

/* A timing drawn as its easing curve, for the Motion board and the Motion
   page's tiles. */

import { useEffect, useState } from "react"

import { cn } from "@/registry/lib/utils"
import { easeCurve } from "@/modules/studio/axes/motion"

export interface Timing {
  ms: number
  /** A CSS easing. */
  ease: string
}

/** `false`, then `true`, flipping every `ms` while `running`. */
export function useFlip(ms: number, running = true) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!running) return setOn(false)
    const timer = setInterval(() => setOn((value) => !value), ms)
    return () => clearInterval(timer)
  }, [ms, running])
  return on
}

// Progress 0 at the bottom line, 1 at the top one; room above for overshoot.
const [TOP, BOTTOM] = [14, 50]

/** The easing as progress over `span` ms, so curves of different lengths
 *  compare; flat once it lands. */
export function EaseCurve({
  timing: { ms, ease },
  span,
  className,
}: {
  timing: Timing
  span: number
  className?: string
}) {
  const curve = easeCurve(ease)
  const points = Array.from({ length: 101 }, (_, x) => {
    const t = (x / 100) * span
    const y = ms > 0 ? curve(Math.min(t / ms, 1)) : 1
    return `${x},${(BOTTOM - y * (BOTTOM - TOP)).toFixed(2)}`
  })
  return (
    <svg
      viewBox="0 0 100 64"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <path
        d={`M0 ${TOP}H100M0 ${BOTTOM}H100`}
        className="stroke-current opacity-15"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={`0,${BOTTOM} ${points.join(" ")}`}
        fill="none"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** The curve with a dot running it: across in `span` ms at an even pace,
 *  up by the easing, so it traces the line; back at once. */
export function EaseTrace({
  timing,
  span,
  on,
  className,
}: {
  timing: Timing
  span: number
  on: boolean
  className?: string
}) {
  const percent = (y: number) => `${(y / 64) * 100}%`
  return (
    <span className={cn("relative", className)}>
      <EaseCurve
        timing={timing}
        span={span}
        className="absolute inset-0 size-full"
      />
      <span
        className="absolute size-2 -translate-1/2 rounded-full bg-current"
        style={{
          left: on ? "100%" : 0,
          top: percent(on ? TOP : BOTTOM),
          transition: on
            ? `left ${span}ms linear, top ${timing.ms}ms ${timing.ease}`
            : "none",
        }}
      />
    </span>
  )
}

// The curves `motionVars` writes, by the names designers know them by.
const EASES: Record<string, string> = {
  linear: "Linear",
  "cubic-bezier(0.25, 0.1, 0.25, 1)": "Ease",
  "cubic-bezier(0.42, 0, 1, 1)": "Ease in",
  "cubic-bezier(0, 0, 0.58, 1)": "Ease out",
  "cubic-bezier(0, 0, 0.2, 1)": "Ease out",
  "cubic-bezier(0.4, 0, 0.2, 1)": "Ease in-out",
  "cubic-bezier(0.45, 0.05, 0.55, 0.95)": "Sine in-out",
  "cubic-bezier(0.16, 1, 0.3, 1)": "Expo out",
  "cubic-bezier(0.87, 0, 0.13, 1)": "Expo in-out",
}

export const easeName = ({ ms, ease }: Timing) =>
  ms === 0
    ? "Instant"
    : ease.startsWith("linear(")
      ? "Spring"
      : (EASES[ease] ?? "Custom")

const GRID_MS = 250

/** The timing on a grid, a column every 250ms, with a dot running it. */
export function CurveGraph({
  timing,
  on,
  className,
}: {
  timing: Timing
  on: boolean
  className?: string
}) {
  const span = Math.max(1000, Math.ceil(timing.ms / GRID_MS) * GRID_MS)
  const columns = span / GRID_MS
  return (
    <div className={cn("relative text-fg/80", className)}>
      <div className="absolute inset-x-3 inset-y-1">
        <svg
          aria-hidden
          preserveAspectRatio="none"
          className="absolute inset-0 size-full stroke-current opacity-10"
        >
          {Array.from({ length: columns - 1 }, (_, i) => {
            const x = `${((i + 1) / columns) * 100}%`
            return <line key={i} x1={x} x2={x} y1="0" y2="100%" />
          })}
        </svg>
        <EaseTrace
          timing={timing}
          span={span}
          on={on}
          className="absolute inset-0"
        />
      </div>
      <span className="absolute right-3 bottom-2 font-mono text-[11px] text-fg/60 tabular-nums">
        {timing.ms}ms · {easeName(timing)}
      </span>
    </div>
  )
}
