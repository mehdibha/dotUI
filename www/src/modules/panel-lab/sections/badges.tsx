"use client"

/* Badges — and Tags, one synced chip language: a tag is a badge that can be
   removed, so both wear the same style and shape and a change to one is a
   change to both. Style is how much intent color the chip carries: solid is
   the Bootstrap/Material filled chip (bg-success, on-color text); soft is
   the Linear/Radix Themes tinted wash (bg-success-muted, intent text) that
   most modern systems default to; outline is the Geist/shadcn badge —
   transparent fill, intent border and text; soft-outline is the Ant tag,
   wash and tinted border together. Shape is the second real disagreement:
   full-round pills (GitHub labels, Geist, Radix radius-full) vs ~4px
   corners (Ant, Bootstrap, Material) — nothing in between shows up. */

import { XIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

export const BADGE_DEFAULTS = {
  badgeStyle: "soft",
  badgeShape: "pill",
}

export const BADGE_STYLE = {
  solid: {
    neutral: "bg-neutral text-fg-on-neutral",
    success: "bg-success text-fg-on-success",
    warning: "bg-warning text-fg-on-warning",
    danger: "bg-danger text-fg-on-danger",
  },
  soft: {
    neutral: "bg-muted text-fg",
    success: "bg-success-muted text-fg-success",
    warning: "bg-warning-muted text-fg-warning",
    danger: "bg-danger-muted text-fg-danger",
  },
  outline: {
    neutral: "border border-border text-fg",
    success: "border border-border-success text-fg-success",
    warning: "border border-border-warning text-fg-warning",
    danger: "border border-border-danger text-fg-danger",
  },
  "soft-outline": {
    neutral: "border border-border bg-muted text-fg",
    success: "border border-border-success bg-success-muted text-fg-success",
    warning: "border border-border-warning bg-warning-muted text-fg-warning",
    danger: "border border-border-danger bg-danger-muted text-fg-danger",
  },
}

export const BADGE_SHAPE = {
  pill: "rounded-full",
  rounded: "rounded-[4px]",
}

/* ------------------------------ Option glyphs ------------------------------ */

/** The chip reduced to its fill treatment; monochrome, like all glyphs. */
function ChipGlyph({ fill, stroke }: { fill?: number; stroke?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="8.75"
        width="15"
        height="6.5"
        rx="3.25"
        fill={fill ? "currentColor" : "none"}
        fillOpacity={fill}
        stroke={stroke ? "currentColor" : "none"}
        strokeWidth="1.5"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const STYLE_OPTIONS: SelectRowOption[] = [
  { value: "solid", label: "Solid", illustration: <ChipGlyph fill={1} /> },
  { value: "soft", label: "Soft", illustration: <ChipGlyph fill={0.35} /> },
  { value: "outline", label: "Outline", illustration: <ChipGlyph stroke /> },
  {
    value: "soft-outline",
    label: "Soft outline",
    illustration: <ChipGlyph fill={0.25} stroke />,
  },
]

const SHAPE_OPTIONS = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
]

/* ---------------------------------- Hero ----------------------------------- */

function Chip({
  intent,
  state,
  dismissible,
  children,
}: {
  intent: keyof (typeof BADGE_STYLE)["soft"]
  state: LabState
  dismissible?: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "flex h-5 items-center gap-1 px-2 text-[0.6875rem] font-medium",
        BADGE_STYLE[state.badgeStyle as keyof typeof BADGE_STYLE][intent],
        BADGE_SHAPE[state.badgeShape as keyof typeof BADGE_SHAPE],
      )}
    >
      {children}
      {dismissible && <XIcon aria-hidden className="size-3 opacity-60" />}
    </span>
  )
}

export function BadgesHero({ state }: { state: LabState }) {
  return (
    <Hero className="items-start py-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip intent="neutral" state={state}>
          Neutral
        </Chip>
        <Chip intent="success" state={state}>
          Success
        </Chip>
        <Chip intent="warning" state={state}>
          Warning
        </Chip>
        <Chip intent="danger" state={state}>
          Danger
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip intent="neutral" state={state} dismissible>
          design
        </Chip>
        <Chip intent="neutral" state={state} dismissible>
          frontend
        </Chip>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the chip style, and its shape. */
export function badgesSummary(state: LabState): string {
  const style =
    STYLE_OPTIONS.find((o) => o.value === state.badgeStyle)?.label ??
    state.badgeStyle
  const shape = state.badgeShape === "rounded" ? "Rounded" : "Pill"
  return `${style} · ${shape}`
}

export function BadgesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <BadgesHero state={state} />
      <SelectRow
        label="Style"
        value={state.badgeStyle}
        onChange={set("badgeStyle")}
        options={STYLE_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Shape"
        value={state.badgeShape}
        onChange={set("badgeShape")}
        options={SHAPE_OPTIONS}
      />
    </ControlGroup>
  )
}
