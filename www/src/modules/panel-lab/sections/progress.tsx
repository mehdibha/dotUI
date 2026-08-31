"use client"

/* Progress — the linear bar's three forks. Track weight: hairline ~4px
   (iOS, Material 3, Spectrum, Carbon) vs chunky (Ant 8px, shadcn h-2,
   Bootstrap 16px) — independent of the slider track axis: M3 sets 4dp
   progress against a 16dp slider. Indeterminate motion: a sliding
   indicator segment (Material, Carbon) vs a pulsing fill (Bootstrap
   striped, dashboard shimmer). Track gap: M3's cut track + stop-indicator
   dot — an M3-only signature, kept as a boolean for preset fidelity.
   Rejected: end caps ride the global Shape chapter; fill tone (Polaris
   tone=success) is a prop; percent-label placement is a prop. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
  SwitchRow,
} from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressIndeterminate: "slide",
  progressGap: false,
}

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

const INDETERMINATE_OPTIONS: SelectRowOption[] = [
  { value: "slide", label: "Slide", illustration: <SlideGlyph /> },
  { value: "pulse", label: "Pulse", illustration: <PulseGlyph /> },
]

const TRACK_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "thick", label: "Thick" },
]

/* ---------------------------------- Hero ----------------------------------- */

const TRACK_HEIGHT = {
  thin: "h-1",
  thick: "h-2",
}

function trackHeight(state: LabState) {
  return TRACK_HEIGHT[state.progressTrack as keyof typeof TRACK_HEIGHT]
}

function DeterminateBar({
  percent,
  state,
}: {
  percent: number
  state: LabState
}) {
  if (state.progressGap) {
    return (
      <div className={cn("flex w-full items-center gap-1", trackHeight(state))}>
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${percent}%` }}
        />
        <div className="relative h-full flex-1 rounded-full bg-muted">
          <span className="absolute top-1/2 right-0 size-1 -translate-y-1/2 rounded-full bg-accent" />
        </div>
      </div>
    )
  }
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        trackHeight(state),
      )}
    >
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

/* Carries its own keyframes so it animates wherever it mounts. */
function IndeterminateBar({ state }: { state: LabState }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        trackHeight(state),
      )}
    >
      <style>{`
        @keyframes lab-progress-slide { 0% { left: -40% } 100% { left: 100% } }
        @keyframes lab-progress-pulse { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
      `}</style>
      {state.progressIndeterminate === "slide" ? (
        <span
          className="absolute inset-y-0 w-2/5 rounded-full bg-accent"
          style={{
            animation: "lab-progress-slide 1.4s ease-in-out infinite",
          }}
        />
      ) : (
        <span
          className="absolute inset-0 rounded-full bg-accent"
          style={{
            animation: "lab-progress-pulse 1.6s ease-in-out infinite",
          }}
        />
      )}
    </div>
  )
}

export function ProgressHero({ state }: { state: LabState }) {
  return (
    <Hero className="gap-5 px-5 py-6">
      <DeterminateBar percent={60} state={state} />
      <IndeterminateBar state={state} />
    </Hero>
  )
}

/** Collapsed-row summary: the track weight, and the indeterminate motion. */
export function progressSummary(state: LabState): string {
  const track =
    TRACK_OPTIONS.find((o) => o.value === state.progressTrack)?.label ??
    state.progressTrack
  const motion =
    INDETERMINATE_OPTIONS.find((o) => o.value === state.progressIndeterminate)
      ?.label ?? state.progressIndeterminate
  return `${track} track · ${motion} indeterminate`
}

export function ProgressSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ProgressHero state={state} />
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
        options={INDETERMINATE_OPTIONS}
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
