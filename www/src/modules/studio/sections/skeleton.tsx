"use client"

/* Skeleton — how skeletons idle while content loads: shimmer vs pulse vs
   none. */

import { ANIMATION_OPTIONS } from "../axes/skeleton"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function SkeletonShimmerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="9"
        width="16"
        height="6"
        rx="2"
        fill="currentColor"
        opacity=".3"
      />
      <path
        d="M12.5 9l-3 6"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".8"
      />
    </svg>
  )
}

function SkeletonPulseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6.5"
        y="9"
        width="11"
        height="6"
        rx="2"
        fill="currentColor"
        opacity=".45"
      />
      <path
        d="M4 8.5c-1.2 2-1.2 5 0 7M20 8.5c1.2 2 1.2 5 0 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  )
}

function SkeletonNoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="9"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".6"
      />
    </svg>
  )
}

const GLYPHS: Record<string, React.ReactNode> = {
  shimmer: <SkeletonShimmerGlyph />,
  pulse: <SkeletonPulseGlyph />,
  none: <SkeletonNoneGlyph />,
}

const SKELETON_OPTIONS: SelectRowOption[] = ANIMATION_OPTIONS.map((option) => ({
  ...option,
  illustration: GLYPHS[option.value],
}))

export function SkeletonSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Animation"
        value={state.skeletonAnimation}
        onChange={set("skeletonAnimation")}
        options={SKELETON_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
