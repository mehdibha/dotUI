"use client"

/* Motion: the timing table, the anchored entrance, then links to family patterns. */

import { springProgress, springSettleMs, tableOf } from "../axes/motion"
import { ENTRANCE_OPTIONS, MOTION_OPTIONS } from "../axes/motion.meta"
import { DialGap, DialGlyph, DialList, DialSegmented } from "../dial"
import { UsesRow } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"

/** The anchored layers' entrance curve under a table; None is a step. */
function MotionGlyph({ motion }: { motion: string }) {
  const { curve } = tableOf(motion).anchored.enter
  const p = (x: number, y: number) => `${2 + x * 12} ${14 - y * 12}`
  let d: string
  if (motion === "none") d = `M${p(0, 0)} L${p(0, 1)} L${p(1, 1)}`
  else if (curve.type === "easing") {
    const [x1, y1, x2, y2] = curve.ease
    d = `M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`
  } else {
    const ms = springSettleMs(curve)
    d = Array.from({ length: 25 }, (_, i) => {
      const v = springProgress(((i / 24) * ms) / 1000, curve)
      return `${i ? "L" : "M"}${p(i / 24, v)}`
    }).join(" ")
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MotionPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <MotionGlyph motion={state.motion} />
    </DialGlyph>
  )
}

export function MotionSection(_: { studio: Studio }) {
  return (
    <>
      <DialList
        axis="motion"
        label="Motion"
        options={MOTION_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <MotionGlyph motion={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSegmented
        axis="motionEntrance"
        label="Entrance"
        options={ENTRANCE_OPTIONS}
      />
      <DialGap />
      <UsesRow axis="dialogEntrance" label="Dialog entrance" />
      <UsesRow axis="mobilePickers" label="Pickers on mobile" />
      <UsesRow axis="skeletonAnimation" label="Skeleton" />
      <UsesRow axis="spinnerStyle" label="Spinner" />
      <UsesRow axis="chartMotion" label="Chart transition" />
    </>
  )
}

export const ROWS: RowMap = {}
