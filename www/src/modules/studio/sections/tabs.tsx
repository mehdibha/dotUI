"use client"

/* Tabs — the selected-tab signature: how a strip says "you are here".
   Segmented sits the tabs in a filled track and slides a chip under the
   selected one (shadcn, Radix Themes, dotUI today). Line draws an underline
   indicator over a hairline baseline — the dominant modern form (Material,
   Geist, Linear, GitHub). Pill fills the selected tab as a free-floating
   rounded chip, no baseline at all (Radix Themes' soft variant, dashboard
   pill navs). Enclosed is the folder tab: the selected tab grows side and
   top borders and fuses with the content surface below — browser tabs,
   Chakra's enclosed variant, classic Bootstrap. */

import { TAB_STYLE_OPTIONS } from "../axes/tabs"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function TabGlyph({ style }: { style: string }) {
  if (style === "segmented")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="7.5"
          width="18"
          height="9"
          rx="3"
          fill="currentColor"
          opacity=".2"
        />
        <rect
          x="4.5"
          y="9"
          width="7.5"
          height="6"
          rx="2"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
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

const TAB_OPTIONS: SelectRowOption[] = TAB_STYLE_OPTIONS.map((option) => ({
  ...option,
  illustration: <TabGlyph style={option.value} />,
}))

export function TabsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
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
