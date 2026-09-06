"use client"

/* Scrollbars — what the browser's scroll chrome becomes inside the product.
   One axis, the bar itself: native (Geist, shadcn — the browser's own bar,
   untouched) vs thin themed (Linear, Raycast — scrollbar-width: thin, a
   token-colored thumb on a transparent track) vs hover reveal (Notion's
   overlay panes, the macOS overlay behavior recreated — invisible until the
   pointer is over the scroll area). Rejected: per-surface color (Notion tints
   the thumb per surface — that's the surface's tokens doing the work, not a
   second decision); thumb radius (rides Shape); scrollbar-gutter (layout
   engineering every option needs, no system treats it as a look). */

import type { CSSProperties } from "react"

import { resolveScrollbars, STYLE_OPTIONS } from "../axes/scrollbars"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function ScrollbarGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h10.5M4 12h10.5M4 18h10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      {kind === "native" && (
        <>
          <rect
            x="17.5"
            y="3.5"
            width="4"
            height="17"
            rx="2"
            fill="currentColor"
            opacity=".2"
          />
          <rect
            x="17.5"
            y="5"
            width="4"
            height="8"
            rx="2"
            fill="currentColor"
          />
        </>
      )}
      {kind === "thin" && (
        <rect
          x="19"
          y="5"
          width="2.5"
          height="9"
          rx="1.25"
          fill="currentColor"
        />
      )}
      {kind === "overlay" && (
        <rect
          x="19"
          y="5"
          width="2.5"
          height="9"
          rx="1.25"
          fill="currentColor"
          opacity=".3"
        />
      )}
    </svg>
  )
}

const styleOptions: SelectRowOption[] = STYLE_OPTIONS.map((o) => ({
  ...o,
  illustration: <ScrollbarGlyph kind={o.value} />,
}))

/* ---------------------------------- Hero ----------------------------------- */

const SETTINGS_ROWS: [string, string][] = [
  ["Appearance", "System"],
  ["Notifications", "On"],
  ["Keyboard", "Default"],
  ["Members", "12"],
  ["Billing", "Pro"],
  ["Integrations", "4"],
  ["Security", "2FA"],
  ["API tokens", "3"],
  ["Webhooks", "1"],
  ["Labels", "18"],
  ["Templates", "6"],
  ["Import", "CSV"],
  ["Archive", "Off"],
  ["Advanced", ""],
]

/* A list long enough that the bar renders at rest, tall enough to grab,
   wearing the engine's own tokens so the bar is the one users will ship. */
export function ScrollbarsHero({ state }: { state: StudioState }) {
  return (
    <Hero inset={false}>
      <div
        className="h-44 overflow-y-auto"
        style={resolveScrollbars(state).tokens as CSSProperties}
      >
        <div className="divide-y divide-border/40">
          {SETTINGS_ROWS.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between px-3.5 py-2"
            >
              <span className="text-[0.8125rem] text-fg">{label}</span>
              <span className="text-xs text-fg-muted">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the scrollbar style. */
export function scrollbarsSummary(state: StudioState): string {
  return (
    STYLE_OPTIONS.find((o) => o.value === state.scrollbarStyle)?.label ??
    state.scrollbarStyle
  )
}

export function ScrollbarsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <ScrollbarsHero state={state} />
      <SelectRow
        label="Style"
        value={state.scrollbarStyle}
        onChange={set("scrollbarStyle")}
        options={styleOptions}
        layout="grid"
      />
    </ControlGroup>
  )
}
