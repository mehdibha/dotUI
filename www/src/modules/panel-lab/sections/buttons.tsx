"use client"

/* Buttons — the synced group's axes (Toggle Button follows Button). Style is a
   family look reshaping every fill variant at once; the variant enum stays
   API. Hover, press and the group layout are the rest of the model, with the
   less-load-bearing group knobs behind an Advanced disclosure.

   The hero is live: real hover, real press, radius read from Shape's roles. */

import { useState } from "react"
import type { CSSProperties } from "react"

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  GroupCaption,
  MiniButton,
  MiniSegmented,
  OptionGridRow,
  ParamRow,
  SegmentedControlRow,
} from "@/modules/control-lab/rows"
import type {
  OptionGridItem,
  SegmentedRowOption,
} from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import { DetailRow } from "../patterns"
import type { Lab, LabState } from "../state"
import { controlRadiusPx } from "./shape"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonHover: "dim",
  buttonPress: "dim",
  buttonTransition: "150",
  groupLayout: "attached",
  groupSeparator: "auto",
  groupSelected: "fill",
}

/* Style families from the Aug 2026 survey: flat (Geist), outline (Primer
   hairline), raised (Radix classic 3D), elevated (Stripe). */
const STYLE_OPTIONS: OptionGridItem[] = [
  {
    id: "flat",
    label: "Flat",
    preview: <MiniButton className="bg-primary text-fg-on-primary" />,
  },
  {
    id: "outline",
    label: "Outline",
    preview: (
      <MiniButton className="bg-primary text-fg-on-primary shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.12)]" />
    ),
  },
  {
    id: "raised",
    label: "Raised",
    preview: (
      <MiniButton className="bg-primary bg-linear-to-b from-white/15 to-black/15 text-fg-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]" />
    ),
  },
  {
    id: "elevated",
    label: "Elevated",
    preview: (
      <MiniButton className="bg-primary text-fg-on-primary shadow-[0_3px_8px_rgb(0_0_0/0.35),0_1px_2px_rgb(0_0_0/0.2)]" />
    ),
  },
]

const RADIUS_OPTIONS: SegmentedRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "sharp", label: "Sharp" },
  { value: "round", label: "Round" },
  { value: "pill", label: "Pill" },
]

/* Hover: of 16 systems surveyed, 14 dim, 2 lighten (Linear, Ant), zero use
   none or lift — dim is the default, lighten is the Linear feel. Press is
   where systems diverge: darker step (8), nothing (5), scale .97
   (Linear/HeroUI/Spectrum pressScale), 1px push (shadcn v4 styles). */
const HOVER_OPTIONS: SegmentedRowOption[] = [
  { value: "dim", label: "Dim" },
  { value: "lighten", label: "Lighten" },
  { value: "none", label: "None" },
]

const PRESS_OPTIONS: SegmentedRowOption[] = [
  { value: "dim", label: "Dim" },
  { value: "scale", label: "Scale" },
  { value: "push", label: "Push" },
  { value: "none", label: "None" },
]

const GROUP_LAYOUT_OPTIONS: SegmentedRowOption[] = [
  { value: "attached", label: "Attached" },
  { value: "gapped", label: "Gapped" },
  { value: "container", label: "Container" },
]

const GROUP_SEPARATOR_OPTIONS: SegmentedRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "divider", label: "Divider" },
  { value: "none", label: "None" },
]

const GROUP_SELECTED_OPTIONS: SegmentedRowOption[] = [
  { value: "fill", label: "Fill" },
  { value: "chip", label: "Chip" },
  { value: "inverse", label: "Inverse" },
]

const TRANSITION_OPTIONS: SegmentedRowOption[] = [
  { value: "100", label: "100ms" },
  { value: "150", label: "150ms" },
  { value: "200", label: "200ms" },
  { value: "300", label: "300ms" },
]

function buttonRadiusPx(state: LabState): number {
  switch (state.buttonRadius) {
    case "sharp":
      return 0
    case "round":
      return state.radiusPx
    case "pill":
      return 999
    default:
      return controlRadiusPx(state)
  }
}

/* Each family reshapes every fill variant at once; quiet stays flat, as it
   does in every system with an aesthetic axis (Radix classic, Untitled UI,
   Primer, Geist all converge on this). */
const STYLE_LOOKS = {
  flat: {
    primary: "bg-primary text-fg-on-primary",
    secondary: "border border-border-field bg-neutral text-fg-on-neutral",
  },
  outline: {
    primary:
      "bg-primary text-fg-on-primary shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
    secondary:
      "border border-border-field bg-neutral text-fg-on-neutral shadow-[0_1px_0_rgb(0_0_0/0.08)]",
  },
  raised: {
    primary:
      "bg-primary bg-linear-to-b from-white/15 to-black/15 text-fg-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
    secondary:
      "border border-border-field bg-neutral bg-linear-to-b from-white/8 to-black/8 text-fg-on-neutral shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  elevated: {
    primary:
      "bg-primary text-fg-on-primary shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
    secondary:
      "bg-neutral text-fg-on-neutral shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
  },
} as const

const styleLook = (state: LabState) =>
  STYLE_LOOKS[state.buttonStyle as keyof typeof STYLE_LOOKS] ?? STYLE_LOOKS.flat

/* Quiet gains a background on hover in every surveyed system, whatever the
   fill variants do — so both dim and lighten resolve to a fill for it. */
function hoverFx(state: LabState, tier: "fill" | "quiet"): string {
  if (state.buttonHover === "none") return ""
  if (tier === "quiet") return "hover:bg-highlight"
  return state.buttonHover === "lighten"
    ? "hover:brightness-110"
    : "hover:brightness-95"
}

/* Press is uniform across variants (the Linear precedent). */
function pressFx(state: LabState, tier: "fill" | "quiet"): string {
  switch (state.buttonPress) {
    case "dim":
      return tier === "quiet" ? "active:bg-inverse/15" : "active:brightness-90"
    case "scale":
      return "active:scale-[0.97]"
    case "push":
      return "active:translate-y-px"
    default:
      return ""
  }
}

const SPECIMEN_FX =
  "cursor-interactive focus-reset transition-[background-color,border-color,color,box-shadow,filter,scale,translate] focus-visible:focus-ring"

const SELECTED_LOOKS: Record<string, string> = {
  fill: "bg-selected text-fg-on-selected",
  chip: "bg-bg text-fg shadow-sm",
  inverse: "bg-inverse text-fg-inverse",
}

/** The synced group's toggle side — one working single-select group, laid out
 *  per the group axes. Separator only matters when attached. */
function GroupSpecimen({ state }: { state: LabState }) {
  const [view, setView] = useState("list")
  const radius = buttonRadiusPx(state)
  const duration = `${state.buttonTransition}ms`
  const selected = SELECTED_LOOKS[state.groupSelected] ?? SELECTED_LOOKS.fill
  const layout = state.groupLayout

  const segment = (id: string, label: string, className?: string) => (
    <button
      key={id}
      type="button"
      aria-pressed={view === id}
      onClick={() => setView(id)}
      className={cn(
        "flex h-7 items-center px-3 text-xs font-medium",
        SPECIMEN_FX,
        view === id
          ? cn(selected, pressFx(state, "fill"))
          : cn("text-fg-muted hover:text-fg", pressFx(state, "quiet")),
        className,
      )}
      style={{ transitionDuration: duration }}
    >
      {label}
    </button>
  )
  const segments = [
    ["list", "List"],
    ["grid", "Grid"],
    ["board", "Board"],
  ] as const

  if (layout === "gapped")
    return (
      <div className="flex items-center gap-2">
        {segments.map(([id, label]) =>
          segment(
            id,
            label,
            cn(
              "rounded-(--seg-radius)",
              view !== id && "border border-border-field bg-neutral",
            ),
          ),
        )}
      </div>
    )

  if (layout === "container")
    return (
      <div
        className="flex items-center gap-0.5 bg-muted p-0.5"
        style={{ borderRadius: radius >= 999 ? 999 : radius }}
      >
        {segments.map(([id, label]) =>
          segment(id, label, "rounded-(--seg-radius)"),
        )}
      </div>
    )

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden border border-border-field bg-neutral",
        state.groupSeparator === "auto" && "divide-x divide-border-field",
      )}
      style={{ borderRadius: radius }}
    >
      {segments.map(([id, label], i) => (
        <span key={id} className="flex items-stretch">
          {state.groupSeparator === "divider" && i > 0 && (
            <span className="my-1.5 w-px bg-border-field" />
          )}
          {segment(id, label)}
        </span>
      ))}
    </div>
  )
}

/** Live specimens of the synced group: the fill variants and Quiet wearing
 *  one style, plus a working toggle group. Hover and press demo for real. */
function ButtonsHero({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const segRadius = radius >= 999 ? 999 : Math.max(radius - 3, 0)
  const duration = `${state.buttonTransition}ms`

  const specimen = (tier: "primary" | "secondary" | "quiet", label: string) => (
    <button
      type="button"
      className={cn(
        "flex h-8 items-center px-3.5 text-[0.8125rem] font-medium",
        SPECIMEN_FX,
        tier === "quiet" ? "text-fg" : look[tier],
        hoverFx(state, tier === "quiet" ? "quiet" : "fill"),
        pressFx(state, tier === "quiet" ? "quiet" : "fill"),
      )}
      style={{ borderRadius: radius, transitionDuration: duration }}
    >
      {label}
    </button>
  )

  return (
    <Hero>
      <div
        className="flex flex-col items-center gap-3 py-4"
        style={{ "--seg-radius": `${segRadius}px` } as CSSProperties}
      >
        <div className="flex items-center gap-2">
          {specimen("primary", "Get started")}
          {specimen("secondary", "Preview")}
          {specimen("quiet", "Docs")}
        </div>
        <GroupSpecimen state={state} />
      </div>
    </Hero>
  )
}

export function ButtonsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <ButtonsHero state={state} />
      <OptionGridRow
        label="Style"
        value={state.buttonStyle}
        onChange={set("buttonStyle")}
        options={STYLE_OPTIONS}
      />
      <ControlGroup>
        <SegmentedControlRow
          label="Radius"
          value={state.buttonRadius}
          onChange={set("buttonRadius")}
          options={RADIUS_OPTIONS}
        />
        <SegmentedControlRow
          label="Hover"
          value={state.buttonHover}
          onChange={set("buttonHover")}
          options={HOVER_OPTIONS}
        />
        <SegmentedControlRow
          label="Press"
          value={state.buttonPress}
          onChange={set("buttonPress")}
          options={PRESS_OPTIONS}
        />
      </ControlGroup>
      <ControlGroup>
        <SegmentedControlRow
          label="Group"
          value={state.groupLayout}
          onChange={set("groupLayout")}
          options={GROUP_LAYOUT_OPTIONS}
        />
      </ControlGroup>
      <DetailRow label="Advanced">
        <ParamRow label="Selected segment">
          <MiniSegmented
            ariaLabel="Selected segment treatment"
            value={state.groupSelected}
            onChange={set("groupSelected")}
            options={GROUP_SELECTED_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Group separator">
          <MiniSegmented
            ariaLabel="Group separator"
            value={state.groupSeparator}
            onChange={set("groupSeparator")}
            options={GROUP_SEPARATOR_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Transition">
          <MiniSegmented
            ariaLabel="Transition duration"
            value={state.buttonTransition}
            onChange={set("buttonTransition")}
            options={TRANSITION_OPTIONS}
          />
        </ParamRow>
      </DetailRow>
      <GroupCaption>
        Style reshapes the fill variants; Quiet and Link stay flat. Toggle
        Button follows Button.
      </GroupCaption>
    </>
  )
}
