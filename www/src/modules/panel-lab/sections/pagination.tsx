"use client"

/* Pagination — a Buttons follower: page items wear the family's quiet button
   language (radius, hover, press all inherit Buttons). One own axis.
   Current-page emphasis: filled (Primer solid accent, GOV.UK solid block,
   MUI selected) vs outline (shadcn isActive → outline variant, Ant bordered
   white). Rejected: numbered vs prev/next-only is a prop (Ant `simple`;
   Polaris and Carbon simply never number); prev/next labels are content;
   item shape, hover, press and radius inherit Buttons. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import {
  buttonRadiusPx,
  hoverFx,
  pressFx,
  SPECIMEN_FX,
  styleLook,
} from "./buttons"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "filled",
}

/* ------------------------------ Option glyphs ------------------------------ */

function CurrentGlyph({ emphasis }: { emphasis: "filled" | "outline" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {emphasis === "filled" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
        />
      ) : (
        <rect
          x="8.25"
          y="8.25"
          width="7.5"
          height="7.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}

const CURRENT_OPTIONS: SelectRowOption[] = [
  {
    value: "filled",
    label: "Filled",
    illustration: <CurrentGlyph emphasis="filled" />,
  },
  {
    value: "outline",
    label: "Outline",
    illustration: <CurrentGlyph emphasis="outline" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path
        d={dir === "prev" ? "M9.5 4 5.5 8l4 4" : "M6.5 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ITEM =
  "flex h-8 min-w-8 items-center justify-center px-1 text-[0.8125rem] font-medium"

function PaginationHero({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)

  const quiet = (key: string, children: React.ReactNode) => (
    <button
      key={key}
      type="button"
      className={cn(
        ITEM,
        SPECIMEN_FX,
        "text-fg",
        hoverFx(state, "quiet"),
        pressFx(state, "quiet"),
      )}
      style={{ borderRadius: radius }}
    >
      {children}
    </button>
  )

  const current =
    state.paginationCurrent === "outline"
      ? look.secondary
      : cn("bg-primary text-fg-on-primary", look.fill)

  return (
    <Hero className="flex-row items-center justify-center gap-1 py-6">
      {quiet("prev", <Chevron dir="prev" />)}
      {quiet("1", "1")}
      <span className={cn(ITEM, current)} style={{ borderRadius: radius }}>
        2
      </span>
      {quiet("3", "3")}
      <span className={cn(ITEM, "text-fg-muted")} aria-hidden>
        …
      </span>
      {quiet("8", "8")}
      {quiet("next", <Chevron dir="next" />)}
    </Hero>
  )
}

export function PaginationSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <PaginationHero state={state} />
      <SelectRow
        label="Current page"
        value={state.paginationCurrent}
        onChange={set("paginationCurrent")}
        options={CURRENT_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
