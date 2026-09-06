"use client"

/* Sliders — thumb and track compose freely: circle-on-thick is the classic
   volume slider, bar-on-thin is M3 on a quiet page. The hero shows two static
   specimens at different values so both the fill shape and the thumb
   treatment read at a glance; the classes mirror the registry's slices. */

import { cn } from "@/registry/lib/utils"

import { THUMB_OPTIONS, TRACK_OPTIONS } from "../axes/sliders"
import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

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

/* ---------------------------------- Hero ----------------------------------- */

const TRACK = {
  thin: { track: "h-1", disc: "size-3", bar: "h-6" },
  thick: { track: "h-3", disc: "size-5", bar: "h-10" },
}

const THUMB = {
  circle: "rounded-full bg-fg",
  outline: "rounded-full border-2 border-border-control bg-bg",
  // The ring paints the hero surface over track and fill — the M3 gap.
  bar: "w-1 rounded-full bg-primary ring-[3px] ring-bg",
}

function SliderSpecimen({
  percent,
  state,
}: {
  percent: number
  state: StudioState
}) {
  const left = `${percent}%`
  const track = TRACK[state.sliderTrack as keyof typeof TRACK] ?? TRACK.thin
  const thumb = state.sliderThumb as keyof typeof THUMB
  return (
    <div className="relative flex h-10 w-full items-center">
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-neutral",
          track.track,
        )}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: left }}
        />
      </div>
      <span
        className={cn(
          "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
          thumb === "bar" ? track.bar : track.disc,
          THUMB[thumb] ?? THUMB.circle,
        )}
        style={{ left }}
      />
    </div>
  )
}

export function SlidersHero({ state }: { state: StudioState }) {
  return (
    <Hero className="gap-3 px-5 py-4">
      <SliderSpecimen percent={35} state={state} />
      <SliderSpecimen percent={70} state={state} />
    </Hero>
  )
}

/** Collapsed-row summary: the thumb treatment, and the track weight. */
export function slidersSummary(state: StudioState): string {
  const thumb =
    THUMB_OPTIONS.find((o) => o.value === state.sliderThumb)?.label ??
    state.sliderThumb
  const track =
    TRACK_OPTIONS.find((o) => o.value === state.sliderTrack)?.label ??
    state.sliderTrack
  return `${thumb} thumb · ${track} track`
}

export function SlidersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SlidersHero state={state} />
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
