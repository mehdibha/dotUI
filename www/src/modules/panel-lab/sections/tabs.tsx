"use client"

/* Tabs — the selected-tab signature: how a strip says "you are here". Line
   draws an underline indicator over a hairline baseline — the dominant
   modern form (Material, Geist, Linear, GitHub). Pill fills the selected
   tab as a free-floating rounded chip, no baseline at all (Radix Themes'
   soft variant, dashboard pill navs). Enclosed is the folder tab: the
   selected tab grows side and top borders and fuses with the content
   surface below — browser tabs, Chakra's enclosed variant, classic
   Bootstrap. Deliberately absent: the segmented container. Tabs in a
   filled track are the SegmentedControl component, not a tab style —
   the axis-vs-prop line; a product wanting that look reaches for the
   other component. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

export const TAB_DEFAULTS = {
  tabStyle: "line",
}

export const TAB_STRIP = {
  line: "gap-4 border-b border-border px-3 pt-1",
  pill: "gap-1 px-2 py-1.5",
  enclosed: "items-end px-2 pt-1.5",
}

export const TAB_FAMILY = {
  line: {
    base: "py-2",
    idle: "text-fg-muted",
    selected:
      "relative font-medium text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-fg",
  },
  pill: {
    base: "rounded-full px-2.5 py-1",
    idle: "text-fg-muted",
    selected: "bg-muted font-medium text-fg",
  },
  enclosed: {
    base: "rounded-t-lg border px-3 py-1.5",
    idle: "border-transparent text-fg-muted",
    /* -mb-px drops the tab one pixel onto the content's top border; its
       matching fill erases that segment, so tab and surface read as one. */
    selected:
      "z-10 -mb-px border-border border-b-0 bg-card font-medium text-fg",
  },
}

/* ------------------------------ Option glyphs ------------------------------ */

function TabGlyph({ style }: { style: "line" | "pill" | "enclosed" }) {
  if (style === "line")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="7.5"
          y="8.5"
          width="9"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".5"
        />
        <path
          d="M3 16h18"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".3"
        />
        <path
          d="M6.5 16h11"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  if (style === "pill")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="7.5"
          width="15"
          height="9"
          rx="4.5"
          fill="currentColor"
          opacity=".25"
        />
        <rect
          x="8"
          y="10.75"
          width="8"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16.5h3.5v-5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5H21"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="11.5"
        width="5"
        height="2.5"
        rx="1.25"
        fill="currentColor"
        opacity=".5"
      />
    </svg>
  )
}

const TAB_OPTIONS: SelectRowOption[] = [
  { value: "line", label: "Line", illustration: <TabGlyph style="line" /> },
  { value: "pill", label: "Pill", illustration: <TabGlyph style="pill" /> },
  {
    value: "enclosed",
    label: "Enclosed",
    illustration: <TabGlyph style="enclosed" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

const TABS = ["Overview", "Activity", "Settings"]

export function TabsHero({ state }: { state: LabState }) {
  const style = state.tabStyle as keyof typeof TAB_FAMILY
  const tab = TAB_FAMILY[style]
  return (
    <Hero inset={false}>
      <div className={cn("flex text-[0.8125rem]", TAB_STRIP[style])}>
        {TABS.map((label) => {
          const selected = label === "Activity"
          return (
            <span
              key={label}
              className={cn(tab.base, selected ? tab.selected : tab.idle)}
            >
              {label}
            </span>
          )
        })}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 p-3",
          style === "enclosed" && "border-t border-border bg-card",
        )}
      >
        <span className="h-2 w-4/5 rounded-full bg-muted" />
        <span className="h-2 w-3/5 rounded-full bg-muted" />
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the selected-tab style. */
export function tabsSummary(state: LabState): string {
  return (
    TAB_OPTIONS.find((o) => o.value === state.tabStyle)?.label ?? state.tabStyle
  )
}

export function TabsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <TabsHero state={state} />
      <SelectRow
        label="Style"
        value={state.tabStyle}
        onChange={set("tabStyle")}
        options={TAB_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
