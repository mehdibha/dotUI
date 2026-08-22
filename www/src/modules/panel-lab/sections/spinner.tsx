"use client"

/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).
   One row; the spinners themselves are exported for the Skeleton chapter,
   whose spinner-first hero loads content with the chosen style. The hero
   pairs the raw indicator with a "Saving…" chip — the two places a spinner
   actually lives: content loading and pending actions. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

export function RingSpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("animate-spin", className)}
    >
      <circle
        className="stroke-current opacity-25"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
      />
      <path
        className="fill-current"
        d="M22 12a10 10 0 0 1-10 10v-4a6 6 0 0 0 6-6h4Z"
      />
    </svg>
  )
}

/* Static opacity ramp on the spokes, whole dial stepped round — the
   Apple/Geist mechanic, not a smooth rotation. */
export function BladesSpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      style={{ animation: "spin 800ms steps(8, end) infinite" }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          className="fill-current"
          x="11"
          y="2.5"
          width="2"
          height="6.5"
          rx="1"
          opacity={0.15 + (i / 7) * 0.85}
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  )
}

/* Carries its own keyframes so it animates wherever it mounts — option
   cards render in a portal, away from any hero <style>. */
export function DotsSpinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <style>{`@keyframes lab-dot-pulse { 0%, 100% { opacity: .25 } 50% { opacity: 1 } }`}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-current"
          style={{
            animation: `lab-dot-pulse 900ms ease-in-out ${i * 150}ms infinite`,
          }}
        />
      ))}
    </span>
  )
}

export const SPINNER = {
  ring: RingSpinner,
  blades: BladesSpinner,
  dots: DotsSpinner,
}

const SPINNER_OPTIONS: SelectRowOption[] = [
  { value: "ring", label: "Ring", illustration: <RingSpinner /> },
  { value: "blades", label: "Blades", illustration: <BladesSpinner /> },
  { value: "dots", label: "Dots", illustration: <DotsSpinner /> },
]

export function SpinnerHero({ state }: { state: LabState }) {
  const Spinner = SPINNER[state.spinnerStyle as keyof typeof SPINNER]
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      <Spinner className="size-5 text-fg-muted" />
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3.5 py-2.5">
        <Spinner className="size-4 text-fg-muted" />
        <span className="text-[0.8125rem] text-fg-muted">Saving…</span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the spinner style. */
export function spinnerSummary(state: LabState): string {
  return (
    SPINNER_OPTIONS.find((o) => o.value === state.spinnerStyle)?.label ??
    state.spinnerStyle
  )
}

export function SpinnerSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SpinnerHero state={state} />
      <SelectRow
        label="Style"
        value={state.spinnerStyle}
        onChange={set("spinnerStyle")}
        options={SPINNER_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
