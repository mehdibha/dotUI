"use client"

/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).
   One row. The hero pairs the raw indicator with a "Saving…" chip — the two
   places a spinner actually lives: content loading and pending actions. */

import { Loader as BladesLoader } from "@/registry/ui/loader/base.blades"
import { Loader as DotsLoader } from "@/registry/ui/loader/base.dots"
import { Loader as RingLoader } from "@/registry/ui/loader/base.ring"

import { STYLE_OPTIONS } from "../axes/spinner"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

/* The registry's own base files: the hero and option cards show what ships. */
const LOADERS = {
  ring: RingLoader,
  blades: BladesLoader,
  dots: DotsLoader,
}

const loaderFor = (style: string) =>
  LOADERS[style as keyof typeof LOADERS] ?? RingLoader

const SPINNER_OPTIONS: SelectRowOption[] = STYLE_OPTIONS.map((option) => {
  const Loader = loaderFor(option.value)
  return { ...option, illustration: <Loader className="size-6" /> }
})

export function SpinnerHero({ state }: { state: LabState }) {
  const Loader = loaderFor(state.spinnerStyle)
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      <Loader className="size-5 text-fg-muted" />
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3.5 py-2.5">
        <Loader className="size-4 text-fg-muted" />
        <span className="text-[0.8125rem] text-fg-muted">Saving…</span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the spinner style. */
export function spinnerSummary(state: LabState): string {
  return (
    STYLE_OPTIONS.find((o) => o.value === state.spinnerStyle)?.label ??
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
