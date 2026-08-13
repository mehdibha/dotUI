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

import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const SCROLLBAR_DEFAULTS = {
  scrollbarStyle: "native",
}

/* ------------------------------ Option glyphs ------------------------------ */

function ScrollbarGlyph({ kind }: { kind: "native" | "thin" | "overlay" }) {
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

const STYLE_OPTIONS: SelectRowOption[] = [
  {
    value: "native",
    label: "Native",
    illustration: <ScrollbarGlyph kind="native" />,
  },
  {
    value: "thin",
    label: "Thin",
    illustration: <ScrollbarGlyph kind="thin" />,
  },
  {
    value: "overlay",
    label: "Hover reveal",
    illustration: <ScrollbarGlyph kind="overlay" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

const SCROLLBAR_CSS: Record<string, string> = {
  native: "",
  thin: `.lab-scrollbar { scrollbar-width: thin; scrollbar-color: var(--color-border) transparent }`,
  overlay: `.lab-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent }
.lab-scrollbar:hover { scrollbar-color: var(--color-border) transparent }`,
}

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

/* A list long enough that the bar renders at rest, tall enough to grab. */
function ScrollbarsHero({ state }: { state: LabState }) {
  return (
    <Hero inset={false}>
      <style>
        {SCROLLBAR_CSS[state.scrollbarStyle as keyof typeof SCROLLBAR_CSS]}
      </style>
      <div className="lab-scrollbar h-44 overflow-y-auto">
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

export function ScrollbarsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ScrollbarsHero state={state} />
      <SelectRow
        label="Style"
        value={state.scrollbarStyle}
        onChange={set("scrollbarStyle")}
        options={STYLE_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
