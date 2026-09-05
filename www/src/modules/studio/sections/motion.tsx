"use client"

/* Motion — how the system moves. Character is the easing personality all
   motion shares (Geist ease-out vs Material emphasized vs spring); Speed is
   one multiplier over the duration ramp; Overlays is the entrance pattern
   for floating layers; State changes is whether hover/press color shifts
   ease or snap — the native-vs-web cue. The hero is self-serve proof: a
   real menu inside a scoped design system wearing the chapter's resolved
   tokens and overlay param, its trigger wearing the state timing. Exits
   stay a plain mirrored curve at a shorter duration — springs are for
   arriving, not leaving. Deliberately absent: a "none" character (Linear's
   stillness is compositional — fast, overlays none, instant states),
   overlayExit as its own row, reducedMotion, which only renders under an OS
   media query, and the skeleton idle treatment, which lives in Skeleton — a
   loading decision that happens to animate. Focus rings never ease —
   pattern constant, not part of the state axis. */

import { useMemo } from "react"
import { ChevronDownIcon } from "lucide-react"

import { DesignSystemProvider } from "@/lib/styles"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"

import {
  CHARACTER_OPTIONS,
  OVERLAY_OPTIONS,
  resolveMotion,
  SPEED,
  SPEED_OPTIONS,
  STATE_OPTIONS,
} from "../axes/motion"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

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

const withGlyphs = (
  options: { value: string; label: string }[],
  glyphs: Record<string, React.ReactNode>,
): SelectRowOption[] =>
  options.map((o) => ({ ...o, illustration: glyphs[o.value] }))

const CHARACTER_ROWS = withGlyphs(CHARACTER_OPTIONS, {
  standard: <CurveGlyph d="M4 20C8 9 12 6 20 6" />,
  emphasized: <CurveGlyph d="M4 20C5 8 9 6 20 6" />,
  spring: (
    <CurveGlyph d="M4 20C6 6 6.5 2 9.5 3.5 12 4.8 12.5 8.2 15 7 17 6 18 6 20 6" />
  ),
})

const SPEED_ROWS = withGlyphs(
  SPEED_OPTIONS,
  Object.fromEntries(
    Object.entries(SPEED).map(([value, factor]) => [
      value,
      <SpeedGlyph key={value}>{factor}×</SpeedGlyph>,
    ]),
  ),
)

const OVERLAY_ROWS = withGlyphs(OVERLAY_OPTIONS, {
  none: <OverlayNoneGlyph />,
  fade: <OverlayFadeGlyph />,
  scale: <OverlayScaleGlyph />,
  slide: <OverlaySlideGlyph />,
})

const STATE_ROWS = withGlyphs(STATE_OPTIONS, {
  instant: <StateGlyph d="M4 18h7V6h9" />,
  quick: <StateGlyph d="M4 18h4c2.5 0 2-12 4.5-12H20" />,
  smooth: <StateGlyph d="M4 18c10 0 6-12 16-12" />,
})

/* ---------------------------------- Hero ----------------------------------- */

/* A menu the user opens themselves — self-serve replay, no fake loop. The
   scoped provider is the engine: the popover reads the overlay param, the
   tokens ride on the scope and its portal. */
export function MotionHero({ state }: { state: LabState }) {
  const { tokens, params } = useMemo(() => resolveMotion(state), [state])
  return (
    <Hero className="flex-row items-center justify-center gap-4 px-4 py-6">
      <DesignSystemProvider scoped tokens={tokens} params={params}>
        <Menu>
          <Button variant="secondary">
            Menu <ChevronDownIcon />
          </Button>
          <Popover placement="bottom start">
            <MenuContent>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Archive</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </DesignSystemProvider>
    </Hero>
  )
}

const optionLabel = (
  options: { value: string; label: string }[],
  value: string,
) => options.find((o) => o.value === value)?.label ?? value

/** Collapsed-row summary: the easing character, and the overlay entrance
 *  when overlays animate. */
export function motionSummary(state: LabState): string {
  const character = optionLabel(CHARACTER_OPTIONS, state.motionCharacter)
  return state.motionOverlay === "none"
    ? character
    : `${character} · ${optionLabel(OVERLAY_OPTIONS, state.motionOverlay)} overlays`
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
        options={CHARACTER_ROWS}
        layout="grid"
      />
      <SelectRow
        label="Speed"
        value={state.motionSpeed}
        onChange={set("motionSpeed")}
        options={SPEED_ROWS}
        layout="grid"
      />
      <SelectRow
        label="Overlays"
        value={state.motionOverlay}
        onChange={set("motionOverlay")}
        options={OVERLAY_ROWS}
        layout="grid"
      />
      <SelectRow
        label="State changes"
        value={state.motionState}
        onChange={set("motionState")}
        options={STATE_ROWS}
        layout="grid"
      />
    </ControlGroup>
  )
}
