"use client"

/* Buttons — the synced family's shared axes: Button sets the look, and the
   Button groups and Toggles sections reuse it through the helpers exported
   here. Style is a family look reshaping every fill variant at once; the
   variant enum stays API. */

import { cn } from "@/registry/lib/utils"

import {
  HOVER_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
  STYLE_OPTIONS,
} from "../axes/buttons"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { controlRadiusPx } from "./shape"

const optionLabel = (options: SelectRowOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

/** Collapsed-row summary: the style family, and the press feel. */
export function buttonsSummary(state: StudioState): string {
  return `${optionLabel(STYLE_OPTIONS, state.buttonStyle)} · ${optionLabel(PRESS_OPTIONS, state.buttonPress)} press`
}

export function buttonRadiusPx(state: StudioState): number {
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

/* Each family is one overlay composing with any status fill; quiet and link
   stay flat. Spelled here because the panel document never wears the design
   system (mirrors button/styles.ts). Glossy's translucent fill needs the
   color in the class, hence the per-fill overrides. */
const RAISED =
  "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]"
const GLOSSY =
  "relative isolate shadow-sm before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgb(255_255_255/0.2),transparent_30%,rgb(255_255_255/0.2))] before:mask-[linear-gradient(#000_0_0),linear-gradient(#000_0_0)] before:mask-exclude before:[mask-clip:content-box,border-box] before:p-[0.75px] after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-[radial-gradient(65%_35%_at_50%_0%,rgb(255_255_255/0.05),transparent_70%),radial-gradient(65%_35%_at_50%_100%,rgb(255_255_255/0.05),transparent_70%)]"

const STYLE_LOOKS = {
  flat: {
    fill: "",
    secondary: "border border-border-control bg-neutral text-fg-on-neutral",
  },
  raised: {
    fill: RAISED,
    secondary:
      "border border-border-control bg-neutral bg-linear-to-b from-white/8 to-black/8 text-fg-on-neutral shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  glossy: {
    fill: GLOSSY,
    fills: {
      primary: "bg-primary/90",
      warning: "bg-warning/90",
      danger: "bg-danger/90",
    },
    secondary: cn(
      "border border-transparent bg-neutral/85 text-fg-on-neutral",
      GLOSSY,
    ),
  },
} as const

const FILLS = {
  primary: "bg-primary text-fg-on-primary",
  warning: "bg-warning text-fg-on-warning",
  danger: "bg-danger text-fg-on-danger",
} as const

type StyleLook = {
  fill: string
  secondary: string
  fills?: Partial<Record<keyof typeof FILLS, string>>
}

export const styleLook = (state: StudioState): StyleLook =>
  STYLE_LOOKS[state.buttonStyle as keyof typeof STYLE_LOOKS] ?? STYLE_LOOKS.flat

/* Quiet gains a background on hover in every surveyed system, whatever the
   fill variants do — so both dim and lighten resolve to a fill for it. */
export function hoverFx(state: StudioState, tier: "fill" | "quiet"): string {
  if (state.buttonHover === "none") return ""
  if (tier === "quiet") return "hover:bg-highlight"
  return state.buttonHover === "lighten"
    ? "hover:brightness-110"
    : "hover:brightness-95"
}

/* Press is uniform across variants (the Linear precedent). */
export function pressFx(state: StudioState, tier: "fill" | "quiet"): string {
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

export const SPECIMEN_FX =
  "cursor-interactive focus-reset transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-150 focus-visible:focus-ring"

/** The section's specimen: the full variant ladder wearing one style — the
 *  neutral row, then the status fills. Hover and press demo for real; link
 *  only underlines, whatever the axes say. */
export function ButtonsHero({ state }: { state: StudioState }) {
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
            : cn(FILLS[variant], look.fill, look.fills?.[variant])
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

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
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
  )
}
