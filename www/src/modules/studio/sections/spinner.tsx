"use client"

/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).
   One row. */

import { Loader as BladesLoader } from "@/registry/ui/loader/base.blades"
import { Loader as DotsLoader } from "@/registry/ui/loader/base.dots"
import { Loader as RingLoader } from "@/registry/ui/loader/base.ring"

import { STYLE_OPTIONS } from "../axes/spinner"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* The registry's own base files: the option cards show what ships. */
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

export function SpinnerSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
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
