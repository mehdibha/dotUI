"use client"

/* Motion — how the system moves. Character is the easing personality all
   motion shares (Geist ease-out vs Material emphasized vs spring); Speed is
   one multiplier over the duration ramp; Overlays is the entrance pattern
   for floating layers; State changes is whether hover/press color shifts
   ease or snap — the native-vs-web cue. The hero is self-serve proof: a
   real menu wearing overlay + character + speed, its trigger and items
   wearing the state timing. Exits stay a plain mirrored curve at ~0.6x —
   springs are for arriving, not leaving. Deliberately absent: a "none"
   character (Linear's stillness is compositional — fast, overlays none,
   instant states), overlayExit as its own row, reducedMotion, which only
   renders under an OS media query, and the skeleton idle treatment, which
   lives in Feedback — a loading decision that happens to animate. Focus
   rings never ease — pattern constant, not part of the state axis. */

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const MOTION_DEFAULTS = {
  motionCharacter: "standard",
  motionSpeed: "default",
  motionOverlay: "scale",
  motionState: "smooth",
}

/* Jake Archibald-style linear() spring, ~15% overshoot settling over the
   full duration. */
const SPRING =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077 20.4%, 1.121, 1.149 24.3%, 1.159, 1.163 27%, 1.154, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)"

/* Character sets both the curve and the base entrance duration — emphasized
   settles longer, springs need room to oscillate. */
const CHARACTER = {
  standard: { ease: "cubic-bezier(0, 0, 0.2, 1)", enterMs: 200 },
  emphasized: { ease: "cubic-bezier(0.05, 0.7, 0.1, 1)", enterMs: 280 },
  spring: { ease: SPRING, enterMs: 450 },
}

const SPEED = { fast: 0.75, default: 1, relaxed: 1.4 }

const STATE_MS = { instant: 0, quick: 100, smooth: 180 }

/* The overlay overrides ride a doubled marker class so they outrank the
   popover's own entering/exiting utilities regardless of sheet order. */
const S = ".motion-lab-overlay.motion-lab-overlay"

function heroCss(state: LabState) {
  const character = CHARACTER[state.motionCharacter as keyof typeof CHARACTER]
  const speed = SPEED[state.motionSpeed as keyof typeof SPEED]
  const enter = Math.round(character.enterMs * speed)
  const exit = Math.round(character.enterMs * 0.6 * speed)
  const stateMs = Math.round(
    STATE_MS[state.motionState as keyof typeof STATE_MS] * speed,
  )

  const overlay = {
    none: `${S}, ${S}[data-entering], ${S}[data-exiting] { transition: none; }`,
    fade: `${S}[data-entering], ${S}[data-exiting] { scale: 1; transform: none; }`,
    scale: "",
    slide: `${S} { --slide-offset: 8px; } ${S}[data-entering], ${S}[data-exiting] { scale: 1; }`,
  }[state.motionOverlay as "none" | "fade" | "scale" | "slide"]

  return `
    ${S} { transition-timing-function: ${character.ease}; transition-duration: ${enter}ms; }
    ${S}[data-exiting] { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); transition-duration: ${exit}ms; }
    ${overlay}
    [data-motion-hero] [data-button] { transition-duration: ${stateMs}ms; }
    .motion-lab-overlay [data-menu-item] { transition: background-color ${stateMs}ms ease, color ${stateMs}ms ease; }
  `
}

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

function SpeedGlyph({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-sm text-fg">{children}</span>
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

const CHARACTER_OPTIONS: SelectRowOption[] = [
  {
    value: "standard",
    label: "Standard",
    illustration: <CurveGlyph d="M4 20C8 9 12 6 20 6" />,
  },
  {
    value: "emphasized",
    label: "Emphasized",
    illustration: <CurveGlyph d="M4 20C5 8 9 6 20 6" />,
  },
  {
    value: "spring",
    label: "Spring",
    illustration: (
      <CurveGlyph d="M4 20C6 6 6.5 2 9.5 3.5 12 4.8 12.5 8.2 15 7 17 6 18 6 20 6" />
    ),
  },
]

const SPEED_OPTIONS: SelectRowOption[] = [
  {
    value: "fast",
    label: "Fast",
    illustration: <SpeedGlyph>0.75×</SpeedGlyph>,
  },
  {
    value: "default",
    label: "Default",
    illustration: <SpeedGlyph>1×</SpeedGlyph>,
  },
  {
    value: "relaxed",
    label: "Relaxed",
    illustration: <SpeedGlyph>1.4×</SpeedGlyph>,
  },
]

const OVERLAY_OPTIONS: SelectRowOption[] = [
  { value: "none", label: "None", illustration: <OverlayNoneGlyph /> },
  { value: "fade", label: "Fade", illustration: <OverlayFadeGlyph /> },
  { value: "scale", label: "Scale", illustration: <OverlayScaleGlyph /> },
  { value: "slide", label: "Slide", illustration: <OverlaySlideGlyph /> },
]

const STATE_OPTIONS: SelectRowOption[] = [
  {
    value: "instant",
    label: "Instant",
    illustration: <StateGlyph d="M4 18h7V6h9" />,
  },
  {
    value: "quick",
    label: "Quick",
    illustration: <StateGlyph d="M4 18h4c2.5 0 2-12 4.5-12H20" />,
  },
  {
    value: "smooth",
    label: "Smooth",
    illustration: <StateGlyph d="M4 18c10 0 6-12 16-12" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

/* A menu the user opens themselves — self-serve replay, no fake loop. */
function MotionHero({ state }: { state: LabState }) {
  return (
    <Hero className="flex-row items-center justify-center gap-4 px-4 py-6">
      <style>{heroCss(state)}</style>
      <div data-motion-hero="" className="contents">
        <Menu>
          <Button variant="secondary">
            Menu <ChevronDownIcon />
          </Button>
          <Popover placement="bottom start" className="motion-lab-overlay">
            <MenuContent>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Archive</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </div>
    </Hero>
  )
}

export function MotionSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <MotionHero state={state} />
      <SelectRow
        label="Character"
        value={state.motionCharacter}
        onChange={set("motionCharacter")}
        options={CHARACTER_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Speed"
        value={state.motionSpeed}
        onChange={set("motionSpeed")}
        options={SPEED_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Overlays"
        value={state.motionOverlay}
        onChange={set("motionOverlay")}
        options={OVERLAY_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="State changes"
        value={state.motionState}
        onChange={set("motionState")}
        options={STATE_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
