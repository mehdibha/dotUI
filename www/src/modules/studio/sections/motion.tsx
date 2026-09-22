"use client"

/* Motion — how the system moves. Character is the easing personality all
   motion shares (Geist ease-out vs Material emphasized vs spring); Speed is
   one multiplier over the duration ramp; Overlays is the entrance pattern
   for floating layers; State changes is whether hover/press color shifts
   ease or snap — the native-vs-web cue. Exits stay a plain mirrored curve at
   a shorter duration — springs are for arriving, not leaving. Deliberately
   absent: a "none" character (Linear's stillness is compositional — fast,
   overlays none, instant states), reducedMotion, which only renders under an
   OS media query, and the skeleton idle treatment, which lives in Skeleton.
   Focus rings never ease. */

import {
  CHARACTER_OPTIONS,
  OVERLAY_OPTIONS,
  SPEED_RANGE,
  STATE_OPTIONS,
} from "../axes/motion"
import { DialSelect, DialSlider } from "../dial"
import type { DialSelectOption } from "../dial"
import type { Studio, StudioState } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

/** Progress-over-time curve toward a dashed settle line. */
function CurveGlyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6h18"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2.5"
        opacity=".35"
      />
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function OverlayNoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="7"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function OverlayFadeGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="7"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".35"
      />
    </svg>
  )
}

function OverlayScaleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="6.5"
        width="15"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity=".45"
      />
      <rect
        x="8.5"
        y="9.5"
        width="7"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function OverlaySlideGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5v3.5m0 0l-2-2m2 2l2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="9"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/** Hover-state value over time: step, short ramp, long ramp. */
function StateGlyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
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

/* --------------------------------- Options --------------------------------- */

const withGlyphs = (
  options: { value: string; label: string }[],
  glyphs: Record<string, React.ReactNode>,
): DialSelectOption[] =>
  options.map((o) => ({
    ...o,
    preview: (
      <span className="size-4 shrink-0 *:size-full">{glyphs[o.value]}</span>
    ),
  }))

const CHARACTER_GLYPHS: Record<string, React.ReactNode> = {
  standard: <CurveGlyph d="M4 20C8 9 12 6 20 6" />,
  emphasized: <CurveGlyph d="M4 20C5 8 9 6 20 6" />,
  spring: (
    <CurveGlyph d="M4 20C6 6 6.5 2 9.5 3.5 12 4.8 12.5 8.2 15 7 17 6 18 6 20 6" />
  ),
}
const CHARACTERS = withGlyphs(CHARACTER_OPTIONS, CHARACTER_GLYPHS)

const OVERLAYS = withGlyphs(OVERLAY_OPTIONS, {
  none: <OverlayNoneGlyph />,
  fade: <OverlayFadeGlyph />,
  scale: <OverlayScaleGlyph />,
  slide: <OverlaySlideGlyph />,
})

const STATES = withGlyphs(STATE_OPTIONS, {
  instant: <StateGlyph d="M4 18h7V6h9" />,
  quick: <StateGlyph d="M4 18h4c2.5 0 2-12 4.5-12H20" />,
  smooth: <StateGlyph d="M4 18c10 0 6-12 16-12" />,
})

export function MotionPreview({ state }: { state: StudioState }) {
  return (
    <span className="size-4 shrink-0 *:size-full">
      {CHARACTER_GLYPHS[state.motionCharacter]}
    </span>
  )
}

export function motionSummary(state: StudioState): string {
  return (
    CHARACTER_OPTIONS.find((o) => o.value === state.motionCharacter)?.label ??
    state.motionCharacter
  )
}

export function MotionSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Character"
        value={state.motionCharacter}
        onChange={set("motionCharacter")}
        options={CHARACTERS}
      />
      <DialSlider
        label="Speed"
        value={state.motionSpeed}
        onChange={set("motionSpeed")}
        minValue={SPEED_RANGE.min}
        maxValue={SPEED_RANGE.max}
        step={SPEED_RANGE.step}
        format={(v) => `${v.toFixed(2)}×`}
      />
      <DialSelect
        label="Overlays"
        value={state.motionOverlay}
        onChange={set("motionOverlay")}
        options={OVERLAYS}
      />
      <DialSelect
        label="State changes"
        value={state.motionState}
        onChange={set("motionState")}
        options={STATES}
      />
    </>
  )
}
