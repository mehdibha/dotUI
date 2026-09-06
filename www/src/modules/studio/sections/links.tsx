"use client"

/* Links — two axes, see axes/links.ts. The combos are left honest:
   foreground + never barely reads, and the hero shows exactly that —
   previewing the mistake is the point. The hero is one short paragraph with
   both states side by side: a resting link, then a hovered one wearing a
   cursor badge, so the hover underline has somewhere to appear. */

import { MousePointer2Icon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { COLOR_OPTIONS, UNDERLINE_OPTIONS } from "../axes/links"
import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Lab, LabState } from "../state"

/* Mirrors the `link` registry params (registry/ui/link/styles.ts). */
const LINK_COLOR = {
  accent: "text-fg-accent",
  foreground: "font-medium text-fg",
}

/* Rest vs hover split so the hero can pin one link in its hovered state; the
   resting link keeps a live hover: class so real pointers work too. */
const LINK_REST = {
  always: "underline underline-offset-2",
  hover: "underline-offset-2 hover:underline",
  never: "",
}
const LINK_HOVERED = {
  always: "underline underline-offset-2",
  hover: "underline underline-offset-2",
  never: "",
}

export function LinksHero({ state }: { state: LabState }) {
  const color = LINK_COLOR[state.linkColor as keyof typeof LINK_COLOR]
  return (
    <Hero className="px-4 py-5">
      <p className="text-[0.8125rem] leading-relaxed text-fg-muted">
        Read the{" "}
        <span
          className={cn(
            color,
            LINK_REST[state.linkUnderline as keyof typeof LINK_REST],
          )}
        >
          changelog
        </span>{" "}
        for what shipped this week. Questions live in the{" "}
        <span className="relative">
          <span
            className={cn(
              color,
              LINK_HOVERED[state.linkUnderline as keyof typeof LINK_HOVERED],
            )}
          >
            community forum
          </span>
          <MousePointer2Icon
            aria-hidden
            className="absolute -right-2 -bottom-2 size-3 fill-fg text-bg"
          />
        </span>
        .
      </p>
    </Hero>
  )
}

/** Collapsed-row summary: the underline policy, and the link color. */
export function linksSummary(state: LabState): string {
  const underline =
    UNDERLINE_OPTIONS.find((o) => o.value === state.linkUnderline)?.label ??
    state.linkUnderline
  const color =
    COLOR_OPTIONS.find((o) => o.value === state.linkColor)?.label ??
    state.linkColor
  return `${underline} underline · ${color} color`
}

export function LinksSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <LinksHero state={state} />
      <SegmentedControlRow
        label="Underline"
        value={state.linkUnderline}
        onChange={set("linkUnderline")}
        options={UNDERLINE_OPTIONS}
      />
      <SegmentedControlRow
        label="Color"
        value={state.linkColor}
        onChange={set("linkColor")}
        options={COLOR_OPTIONS}
      />
    </ControlGroup>
  )
}
