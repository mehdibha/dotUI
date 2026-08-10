"use client"

/* Buttons — the synced family's axes: Button sets the look, Toggle Button and
   the groups follow. Style is a family look reshaping every fill variant at
   once; the variant enum stays API.

   Three blocks, one per decision cluster: Button (style, radius, hover,
   press), Button Group (separator), and Toggle (Toggle Button ⇄ Toggle
   Group — the selected look). Layout never appears: attached vs gapped is
   per-usage spacing, a prop not a system decision, and the container+chip
   archetype is Segmented Control, a different component. Each block opens on
   its own live specimen, its rows right under the preview they change. The
   separator is one decision shared by every attached group. */

import { useState } from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, GroupTitle, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { controlRadiusPx } from "./shape"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonHover: "dim",
  buttonPress: "dim",
  groupSeparator: "auto",
  toggleSelected: "fill",
}

/* Style families from the Aug 2026 survey: flat (Geist), outline (Primer
   hairline), raised (Radix classic 3D), elevated (Stripe). */
const STYLE_OPTIONS: SelectRowOption[] = [
  { value: "flat", label: "Flat" },
  { value: "outline", label: "Outline" },
  { value: "raised", label: "Raised" },
  { value: "elevated", label: "Elevated" },
]

const RADIUS_OPTIONS: SelectRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "sharp", label: "Sharp" },
  { value: "round", label: "Round" },
  { value: "pill", label: "Pill" },
]

/* Hover: of 16 systems surveyed, 14 dim, 2 lighten (Linear, Ant), zero use
   none or lift — dim is the default, lighten is the Linear feel. Press is
   where systems diverge: darker step (8), nothing (5), scale .97
   (Linear/HeroUI/Spectrum pressScale), 1px push (shadcn v4 styles). */
const HOVER_OPTIONS: SelectRowOption[] = [
  { value: "dim", label: "Dim" },
  { value: "lighten", label: "Lighten" },
  { value: "none", label: "None" },
]

const PRESS_OPTIONS: SelectRowOption[] = [
  { value: "dim", label: "Dim" },
  { value: "scale", label: "Scale" },
  { value: "push", label: "Push" },
  { value: "none", label: "None" },
]

const GROUP_SEPARATOR_OPTIONS: SelectRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "divider", label: "Divider" },
  { value: "none", label: "None" },
]

const TOGGLE_SELECTED_OPTIONS: SelectRowOption[] = [
  { value: "fill", label: "Fill" },
  { value: "chip", label: "Chip" },
  { value: "inverse", label: "Inverse" },
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

/* Each family reshapes every fill variant at once — `fill` is one overlay
   composing with any status fill (primary, warning, danger); quiet and link
   stay flat, as they do in every system with an aesthetic axis (Radix
   classic, Untitled UI, Primer, Geist all converge on this). */
const STYLE_LOOKS = {
  flat: {
    fill: "",
    secondary: "border border-border-field bg-neutral text-fg-on-neutral",
  },
  outline: {
    fill: "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
    secondary:
      "border border-border-field bg-neutral text-fg-on-neutral shadow-[0_1px_0_rgb(0_0_0/0.08)]",
  },
  raised: {
    fill: "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
    secondary:
      "border border-border-field bg-neutral bg-linear-to-b from-white/8 to-black/8 text-fg-on-neutral shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  elevated: {
    fill: "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
    secondary:
      "bg-neutral text-fg-on-neutral shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
  },
} as const

const FILLS = {
  primary: "bg-primary text-fg-on-primary",
  warning: "bg-warning text-fg-on-warning",
  danger: "bg-danger text-fg-on-danger",
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
  "cursor-interactive focus-reset transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-150 focus-visible:focus-ring"

/* Chip is the container archetype's floating pill; the hairline ring keeps it
   reading on dark wells and flat surfaces alike. */
function selectedFx(state: LabState): string {
  switch (state.toggleSelected) {
    case "chip":
      return "bg-bg text-fg shadow-sm ring-1 ring-border-field"
    case "inverse":
      return "bg-inverse text-fg-inverse"
    default:
      return "bg-selected text-fg-on-selected"
  }
}

/** Attached grouping shared by Button Group and Toggle Group: one container,
 *  square segments, the separator axis deciding what divides them. */
function AttachedShell({
  state,
  radius,
  className,
  segments,
}: {
  state: LabState
  radius: number
  className?: string
  segments: React.ReactNode[]
}) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden",
        state.groupSeparator === "auto" && "divide-x divide-border-field",
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-stretch">
          {state.groupSeparator === "divider" && i > 0 && (
            <span className="my-1.5 w-px bg-border-field" />
          )}
          {seg}
        </span>
      ))}
    </div>
  )
}

/** The button block's specimen: the full variant ladder wearing one style —
 *  the neutral row, then the status fills. Hover and press demo for real;
 *  link only underlines, whatever the axes say. */
function ButtonsHero({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)

  const specimen = (
    variant: keyof typeof FILLS | "secondary" | "quiet" | "link",
    label: string,
  ) => {
    const skin =
      variant === "secondary"
        ? look.secondary
        : variant === "quiet"
          ? "text-fg"
          : variant === "link"
            ? "text-fg underline-offset-4 hover:underline"
            : cn(FILLS[variant], look.fill)
    return (
      <button
        key={variant}
        type="button"
        className={cn(
          "flex h-8 items-center px-3.5 text-[0.8125rem] font-medium whitespace-nowrap",
          SPECIMEN_FX,
          skin,
          variant !== "link" &&
            cn(
              hoverFx(state, variant === "quiet" ? "quiet" : "fill"),
              pressFx(state, variant === "quiet" ? "quiet" : "fill"),
            ),
        )}
        style={{ borderRadius: radius }}
      >
        {label}
      </button>
    )
  }

  return (
    <Hero className="items-center py-5">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {specimen("primary", "Get started")}
          {specimen("secondary", "Preview")}
          {specimen("quiet", "Docs")}
        </div>
        <div className="flex items-center gap-2">
          {specimen("warning", "Reset")}
          {specimen("danger", "Delete")}
          {specimen("link", "Learn more")}
        </div>
      </div>
    </Hero>
  )
}

/** Action grouping — Cut/Copy/Paste as one control, wearing the secondary
 *  skin on the shell. Always attached (gapped is a prop, not a system
 *  decision); selection never applies here. */
function ButtonGroupHero({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const actions = ["Cut", "Copy", "Paste"]

  return (
    <Hero className="items-center py-5">
      <AttachedShell
        state={state}
        radius={radius}
        className={look.secondary}
        segments={actions.map((label) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex h-8 items-center px-3 text-[0.8125rem] font-medium",
              SPECIMEN_FX,
              hoverFx(state, "quiet"),
              pressFx(state, "quiet"),
            )}
          >
            {label}
          </button>
        ))}
      />
    </Hero>
  )
}

/** The toggle side — a lone Toggle Button and a working single-select Toggle
 *  Group wearing the same selected look. */
function ToggleHero({ state }: { state: LabState }) {
  const [starred, setStarred] = useState(true)
  const [view, setView] = useState("list")
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const selected = selectedFx(state)

  const standalone = (
    <button
      type="button"
      aria-label="Star"
      aria-pressed={starred}
      onClick={() => setStarred((s) => !s)}
      className={cn(
        "flex h-7 w-7 items-center justify-center",
        SPECIMEN_FX,
        starred
          ? cn(selected, hoverFx(state, "fill"), pressFx(state, "fill"))
          : cn(
              "text-fg-muted hover:text-fg",
              hoverFx(state, "quiet"),
              pressFx(state, "quiet"),
            ),
      )}
      style={{ borderRadius: radius }}
    >
      <StarIcon className={cn("size-3.5", starred && "fill-current")} />
    </button>
  )

  const segment = (id: string, label: string) => (
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
      )}
    >
      {label}
    </button>
  )
  const segments = [
    ["list", "List"],
    ["grid", "Grid"],
    ["board", "Board"],
  ] as const

  return (
    <Hero className="items-center py-5">
      <div className="flex items-center gap-4">
        {standalone}
        <AttachedShell
          state={state}
          radius={radius}
          className={look.secondary}
          segments={segments.map(([id, label]) => segment(id, label))}
        />
      </div>
    </Hero>
  )
}

export function ButtonsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <GroupTitle>Button</GroupTitle>
      <ControlGroup>
        <ButtonsHero state={state} />
        <SelectRow
          label="Style"
          value={state.buttonStyle}
          onChange={set("buttonStyle")}
          options={STYLE_OPTIONS}
        />
        <SelectRow
          label="Radius"
          value={state.buttonRadius}
          onChange={set("buttonRadius")}
          options={RADIUS_OPTIONS}
        />
        <SelectRow
          label="Hover"
          value={state.buttonHover}
          onChange={set("buttonHover")}
          options={HOVER_OPTIONS}
        />
        <SelectRow
          label="Press"
          value={state.buttonPress}
          onChange={set("buttonPress")}
          options={PRESS_OPTIONS}
        />
      </ControlGroup>
      <GroupTitle>Button Group</GroupTitle>
      <ControlGroup>
        <ButtonGroupHero state={state} />
        <SelectRow
          label="Separator"
          value={state.groupSeparator}
          onChange={set("groupSeparator")}
          options={GROUP_SEPARATOR_OPTIONS}
        />
      </ControlGroup>
      <GroupTitle>Toggle</GroupTitle>
      <ControlGroup>
        <ToggleHero state={state} />
        <SelectRow
          label="Selected"
          value={state.toggleSelected}
          onChange={set("toggleSelected")}
          options={TOGGLE_SELECTED_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}
