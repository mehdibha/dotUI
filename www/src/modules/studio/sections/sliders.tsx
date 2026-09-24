"use client"

/* Sliders — thumb and track compose freely: circle-on-thick is the classic
   volume slider, bar-on-thin is M3 on a quiet page. The fill's color is a
   leaf of Color's Primary. */

import { THUMB_OPTIONS, TRACK_OPTIONS } from "../axes/sliders"
import { DialGlyph, DialSegmented, DialSelect } from "../dial"
import { SliderMotion } from "../motion-controls"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

function ThumbGlyph({ thumb, track }: { thumb: string; track: string }) {
  const weight = track === "thick" ? 5 : 2
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {thumb === "bar" ? (
        <>
          <path
            d="M3 12h5.5M15.5 12h5.5"
            stroke="currentColor"
            strokeWidth={weight}
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
            strokeWidth={weight}
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

/* --------------------------------- Section --------------------------------- */

export function SlidersPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <ThumbGlyph thumb={state.sliderThumb} track={state.sliderTrack} />
    </DialGlyph>
  )
}

export function SlidersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Thumb"
        value={state.sliderThumb}
        onChange={set("sliderThumb")}
        rowPreview={false}
        options={THUMB_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <ThumbGlyph thumb={option.value} track={state.sliderTrack} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSegmented
        label="Track"
        value={state.sliderTrack}
        onChange={set("sliderTrack")}
        options={TRACK_OPTIONS}
      />
      <SliderMotion label="Transition" studio={studio} />
    </>
  )
}
