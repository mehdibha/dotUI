"use client"

/* Progress — the linear bar's three forks: track weight, indeterminate
   motion, and Material 3's cut track. Rejected: end caps ride the global
   Shape chapter; fill tone (Polaris tone=success) and percent-label
   placement are props. */

import { INDETERMINATE_OPTIONS, TRACK_OPTIONS } from "../axes/progress"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
  SwitchRow,
} from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function SlideGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12h18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".3"
      />
      <path
        d="M8.5 12h6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PulseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 12h10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".55"
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

const GLYPHS: Record<string, React.ReactNode> = {
  slide: <SlideGlyph />,
  pulse: <PulseGlyph />,
}

const INDETERMINATE_ROW_OPTIONS: SelectRowOption[] = INDETERMINATE_OPTIONS.map(
  (option) => ({ ...option, illustration: GLYPHS[option.value] }),
)

export function ProgressSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Track"
        value={state.progressTrack}
        onChange={set("progressTrack")}
        options={TRACK_OPTIONS}
      />
      <SelectRow
        label="Indeterminate"
        value={state.progressIndeterminate}
        onChange={set("progressIndeterminate")}
        options={INDETERMINATE_ROW_OPTIONS}
        layout="grid"
      />
      <SwitchRow
        label="Track gap"
        description="Material 3's cut track and stop dot"
        value={state.progressGap}
        onChange={set("progressGap")}
      />
    </ControlGroup>
  )
}
