"use client"

/* Sliders — thumb and track compose freely: circle-on-thick is the classic
   volume slider, bar-on-thin is M3 on a quiet page. */

import { THUMB_OPTIONS, TRACK_OPTIONS } from "../axes/sliders"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function ThumbGlyph({ thumb }: { thumb: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {thumb === "bar" ? (
        <>
          <path
            d="M3 12h5.5M15.5 12h5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".4"
          />
          <rect
            x="10.75"
            y="6.5"
            width="2.5"
            height="11"
            rx="1.25"
            fill="currentColor"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".4"
          />
          {thumb === "outline" ? (
            <circle
              cx="13.5"
              cy="12"
              r="3.5"
              fill="var(--color-bg)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ) : (
            <circle cx="13.5" cy="12" r="4" fill="currentColor" />
          )}
        </>
      )}
    </svg>
  )
}

const THUMB_SELECT_OPTIONS: SelectRowOption[] = THUMB_OPTIONS.map((o) => ({
  ...o,
  illustration: <ThumbGlyph thumb={o.value} />,
}))

export function SlidersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Thumb"
        value={state.sliderThumb}
        onChange={set("sliderThumb")}
        options={THUMB_SELECT_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Track"
        value={state.sliderTrack}
        onChange={set("sliderTrack")}
        options={TRACK_OPTIONS}
      />
    </ControlGroup>
  )
}
