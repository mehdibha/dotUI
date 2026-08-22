"use client"

/* Sliders — two decisions real systems actually fork on. Thumb: the circle
   knob (iOS, shadcn, Radix, Spectrum — a white-ish disc riding the track) vs
   Material 3's handle, a tall thin rounded bar with the track cut away around
   it (the post-2023 M3 slider spec). Track: hairline (iOS ~4px, Radix,
   shadcn — the track recedes, the thumb is the control) vs chunky (M3's
   16dp track, audio/media UIs — the fill itself reads as a level bar). The
   two axes compose freely: circle-on-thick is the classic volume slider,
   bar-on-thin is M3 on a quiet page. The hero shows two static specimens at
   different values so both the fill shape and the thumb treatment read at a
   glance. */

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const SLIDER_DEFAULTS = {
  sliderThumb: "circle",
  sliderTrack: "thin",
}

/* ------------------------------ Option glyphs ------------------------------ */

function ThumbGlyph({ thumb }: { thumb: "circle" | "bar" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {thumb === "circle" ? (
        <>
          <path
            d="M3 12h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".4"
          />
          <circle cx="13.5" cy="12" r="4" fill="currentColor" />
        </>
      ) : (
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
      )}
    </svg>
  )
}

const THUMB_OPTIONS: SelectRowOption[] = [
  {
    value: "circle",
    label: "Circle",
    illustration: <ThumbGlyph thumb="circle" />,
  },
  { value: "bar", label: "Bar", illustration: <ThumbGlyph thumb="bar" /> },
]

const TRACK_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "thick", label: "Thick" },
]

/* ---------------------------------- Hero ----------------------------------- */

export const TRACK_HEIGHT = {
  thin: "h-1",
  thick: "h-3",
}

function SliderSpecimen({
  percent,
  state,
}: {
  percent: number
  state: LabState
}) {
  const left = `${percent}%`
  return (
    <div className="relative flex h-6 w-full items-center">
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          TRACK_HEIGHT[state.sliderTrack as keyof typeof TRACK_HEIGHT],
        )}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: left }}
        />
      </div>
      {state.sliderThumb === "bar" ? (
        // The ring paints the hero surface over track and fill — the M3 gap.
        <span
          className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-[3px] ring-bg"
          style={{ left }}
        />
      ) : (
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-bg shadow-sm"
          style={{ left }}
        />
      )}
    </div>
  )
}

export function SlidersHero({ state }: { state: LabState }) {
  return (
    <Hero className="gap-5 px-5 py-6">
      <SliderSpecimen percent={35} state={state} />
      <SliderSpecimen percent={70} state={state} />
    </Hero>
  )
}

/** Collapsed-row summary: the thumb treatment, and the track weight. */
export function slidersSummary(state: LabState): string {
  const thumb =
    THUMB_OPTIONS.find((o) => o.value === state.sliderThumb)?.label ??
    state.sliderThumb
  const track =
    TRACK_OPTIONS.find((o) => o.value === state.sliderTrack)?.label ??
    state.sliderTrack
  return `${thumb} thumb · ${track} track`
}

export function SlidersSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SlidersHero state={state} />
      <SelectRow
        label="Thumb"
        value={state.sliderThumb}
        onChange={set("sliderThumb")}
        options={THUMB_OPTIONS}
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
