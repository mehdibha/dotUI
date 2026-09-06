"use client"

/* Progress — the linear bar's three forks: track weight, indeterminate
   motion, and Material 3's cut track. Rejected: end caps ride the global
   Shape chapter; fill tone (Polaris tone=success) and percent-label
   placement are props. */

import { useMemo } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { ProgressBar } from "@/registry/ui/progress-bar"

import {
  INDETERMINATE_OPTIONS,
  resolveProgress,
  TRACK_OPTIONS,
} from "../axes/progress"
import { Hero } from "../hero"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
  SwitchRow,
} from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

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

/* ---------------------------------- Hero ----------------------------------- */

/* The registry bar under a provider carrying only this chapter's params —
   the hero shows exactly what the preview does. */
export function ProgressHero({ state }: { state: StudioState }) {
  const params = useMemo(() => resolveProgress(state).params, [state])
  return (
    <Hero className="gap-5 px-5 py-6">
      <DesignSystemProvider params={params}>
        <ProgressBar aria-label="Progress" value={60} className="w-full" />
        <ProgressBar aria-label="Loading" isIndeterminate className="w-full" />
      </DesignSystemProvider>
    </Hero>
  )
}

/** Collapsed-row summary: the track weight, and the indeterminate motion. */
export function progressSummary(state: StudioState): string {
  const track =
    TRACK_OPTIONS.find((o) => o.value === state.progressTrack)?.label ??
    state.progressTrack
  const motion =
    INDETERMINATE_OPTIONS.find((o) => o.value === state.progressIndeterminate)
      ?.label ?? state.progressIndeterminate
  return `${track} track · ${motion} indeterminate`
}

export function ProgressSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
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
