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
