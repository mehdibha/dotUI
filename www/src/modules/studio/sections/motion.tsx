"use client"

/* Motion: the timing table, the anchored entrance, the rows that move; and
   each family's own Motion, which its page hosts. */

import {
  FAMILY_MOTION_KEYS,
  springProgress,
  springSettleMs,
  tableOf,
} from "../axes/motion"
import {
  ENTRANCE_OPTIONS,
  FAMILY_MOTION_OPTIONS,
  MOTION_OPTIONS,
} from "../axes/motion.meta"
import { DialGap, DialGlyph, DialSegmented, DialSelect } from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective } from "../state"

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

const glyph = (motion: string) => (
  <DialGlyph>
    <MotionGlyph motion={motion} />
  </DialGlyph>
)

const MOTION_ROW_OPTIONS = MOTION_OPTIONS.map((option) => ({
  ...option,
  preview: glyph(option.value),
}))

// "Same as Motion" wears the glyph of the table it resolves to.
const FAMILY_ROW_OPTIONS = FAMILY_MOTION_OPTIONS.map((option) => ({
  ...option,
  preview: option.value === "same" ? undefined : glyph(option.value),
}))

function MotionRow() {
  return (
    <DialSelect axis="motion" label="Motion" options={MOTION_ROW_OPTIONS} />
  )
}

function EntranceRow() {
  return (
    <DialSegmented
      axis="motionEntrance"
      label="Entrance"
      options={ENTRANCE_OPTIONS}
    />
  )
}

const familyRow = (key: (typeof FAMILY_MOTION_KEYS)[number]) =>
  function FamilyMotionRow() {
    return <DialSelect axis={key} label="Motion" options={FAMILY_ROW_OPTIONS} />
  }

export function MotionSection() {
  return (
    <>
      <Row axis="motion" />
      <Row axis="motionEntrance" />
      <DialGap />
      <Row axis="dialogEntrance" />
      <Row axis="mobilePickers" />
      <Row axis="skeletonAnimation" />
      <Row axis="spinnerStyle" />
      <Row axis="chartMotion" />
    </>
  )
}

export const ROWS: RowMap = {
  motion: MotionRow,
  motionEntrance: EntranceRow,
  ...Object.fromEntries(FAMILY_MOTION_KEYS.map((key) => [key, familyRow(key)])),
}
