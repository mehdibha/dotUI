"use client"

/* Links — how an inline link announces itself, two axes. Underline: `always`
   is the prose-first camp (GOV.UK mandates it, Apple's HIG for web and most
   docs systems follow — a link must read without color); `hover` is the
   GitHub/MDN middle ground — clean line at rest, underline as pointer
   feedback; `never` is app UIs (Linear, Figma) where color or weight alone
   carries it. Color: `accent` is the classic blue/brand link (GOV.UK blue,
   Material primary); `foreground` is the Vercel/Linear move — the link wears
   the text's own color, distinguished only by weight and whatever the
   underline axis grants. The combos are left honest: foreground + never
   barely reads, and the hero shows exactly that — previewing the mistake is
   the point. The hero is one short paragraph with both states side by side:
   a resting link, then a hovered one wearing a cursor badge, so the hover
   underline has somewhere to appear. */

import { MousePointer2Icon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SegmentedControlRow } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const LINK_DEFAULTS = {
  linkUnderline: "always",
  linkColor: "accent",
}

const UNDERLINE_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "hover", label: "Hover" },
  { value: "never", label: "Never" },
]

const COLOR_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "foreground", label: "Foreground" },
]

const LINK_COLOR = {
  accent: "text-accent",
  // Weight is the only resting cue foreground links get — the Vercel/Linear
  // pattern against a muted paragraph.
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
