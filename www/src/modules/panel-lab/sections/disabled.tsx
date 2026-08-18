"use client"

/* Disabled — how the system says "not now", everywhere at once. One axis,
   treatment: fade (shadcn, Geist, Radix — the control keeps its colors under
   flat ~50% opacity) vs alpha grey (Material 3 — no opacity, fixed on-surface
   alphas: 38% text, 12% container fills) vs solid grey (Spectrum 2 — opaque
   gray fills with muted text; every variant collapses to the same gray).
   Rejected: disabled cursor (not-allowed vs default) — the Cursor chapter
   owns it; per-component disabled looks — disabled is system-wide by
   definition, no surveyed system forks it; fade amount (50% vs 38%) — a knob
   inside one treatment, not a fork. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SegmentedControlRow } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const DISABLED_DEFAULTS = {
  disabledTreatment: "fade",
}

const TREATMENT_OPTIONS = [
  { value: "fade", label: "Fade" },
  { value: "alpha", label: "Alpha" },
  { value: "solid", label: "Solid" },
]

/* ---------------------------------- Hero ----------------------------------- */

interface Look {
  primary: string
  secondary: string
  boxOn: string
  boxOff: string
  label: string
  field: string
}

const ENABLED: Look = {
  primary: "bg-primary text-fg-on-primary",
  secondary: "border border-border-field bg-card text-fg",
  boxOn: "bg-primary text-fg-on-primary",
  boxOff: "border border-border-field bg-card",
  label: "text-fg",
  field: "border border-border-field bg-card text-fg",
}

const DISABLED_LOOKS = {
  fade: {
    primary: cn(ENABLED.primary, "opacity-50"),
    secondary: cn(ENABLED.secondary, "opacity-50"),
    boxOn: cn(ENABLED.boxOn, "opacity-50"),
    boxOff: cn(ENABLED.boxOff, "opacity-50"),
    label: cn(ENABLED.label, "opacity-50"),
    field: cn(ENABLED.field, "opacity-50"),
  },
  alpha: {
    primary: "bg-fg/10 text-fg/35",
    secondary: "border border-fg/15 text-fg/35",
    boxOn: "bg-fg/35 text-bg",
    boxOff: "border border-fg/35",
    label: "text-fg/35",
    field: "border border-fg/15 bg-fg/5 text-fg/35",
  },
  solid: {
    primary: "bg-muted text-fg-muted",
    secondary: "bg-muted text-fg-muted",
    boxOn: "border border-border bg-muted text-fg-muted",
    boxOff: "border border-border bg-muted",
    label: "text-fg-muted",
    field: "bg-muted text-fg-muted",
  },
}

const BTN = "flex h-7 items-center rounded-lg px-3 text-[0.8125rem] font-medium"
const FIELD =
  "flex h-7 w-full min-w-0 items-center truncate rounded-lg px-2.5 text-[0.8125rem]"

function CheckSpecimen({
  checked,
  look,
  children,
}: {
  checked?: boolean
  look: Look
  children: string
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px]",
          checked ? look.boxOn : look.boxOff,
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3">
            <path
              d="M2.5 6.5 5 9l4.5-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={cn("text-[0.8125rem]", look.label)}>{children}</span>
    </span>
  )
}

function SpecimenColumn({ look }: { look: Look }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex gap-2">
        <span className={cn(BTN, look.primary)}>Save</span>
        <span className={cn(BTN, look.secondary)}>Cancel</span>
      </div>
      <div className="flex flex-col gap-2">
        <CheckSpecimen checked look={look}>
          Alerts
        </CheckSpecimen>
        <CheckSpecimen look={look}>Digest</CheckSpecimen>
      </div>
      <span className={cn(FIELD, look.field)}>hello@dotui.org</span>
    </div>
  )
}

export function DisabledHero({ state }: { state: LabState }) {
  const look =
    DISABLED_LOOKS[state.disabledTreatment as keyof typeof DISABLED_LOOKS]
  return (
    <Hero className="p-4">
      <div className="grid grid-cols-2 gap-5">
        <SpecimenColumn look={ENABLED} />
        <SpecimenColumn look={look} />
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the disabled treatment. */
export function disabledSummary(state: LabState): string {
  return (
    TREATMENT_OPTIONS.find((o) => o.value === state.disabledTreatment)?.label ??
    state.disabledTreatment
  )
}

export function DisabledSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <DisabledHero state={state} />
      <SegmentedControlRow
        label="Treatment"
        value={state.disabledTreatment}
        onChange={set("disabledTreatment")}
        options={TREATMENT_OPTIONS}
      />
    </ControlGroup>
  )
}
