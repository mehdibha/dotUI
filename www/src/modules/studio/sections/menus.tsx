"use client"

/* Menus — one language for every floating list: Menu, Select listbox,
   searchable picker, command palette. Six axes. Indicator: how a selected
   item is marked — leading check with a reserved left gutter on every item
   (Radix, shadcn, Material) or trailing check on the selected item only
   (macOS menus, Arc). Highlight: the hover/active treatment — a neutral gray
   wash (Linear, Geist, Vercel) or the solid accent with inverted text (macOS,
   Windows, Chakra). Inset: rounded items floating in a padded gutter (macOS
   Big Sur+, Radix Themes, shadcn) vs full-bleed edge-to-edge rows (older
   Material menus, Bootstrap dropdowns). Labels: section headers in sentence
   case (shadcn, Raycast, Linear) or tracked caps, the classic uppercase
   micro-label. Search: the chrome a filterable list — palette, searchable
   picker — opens with: a boxed field floating in the padding, wearing the
   Inputs style live (shadcn/cmdk, Spotlight — and dotUI's CommandInput is a
   SearchField, hence the default), a full-bleed bar keeping the magnifier
   over a hairline (cmdk's full-bleed themes), or a bare text-only prompt
   (Linear, Raycast). Search and Inset are independent axes — Raycast pairs
   the bare prompt with inset items. Scale: search-led surfaces stay at menu
   scale (shadcn, GitHub's palette) or step up into a hero surface (Raycast,
   Linear's ⌘K) — input, rows and icons grow together. Footers, context chips
   and per-item shortcut hints are composition, not axes. */

import {
  HIGHLIGHT_OPTIONS,
  INDICATOR_OPTIONS,
  INSET_OPTIONS,
  LABEL_OPTIONS,
  SCALE_OPTIONS,
  SEARCH_OPTIONS,
} from "../axes/menus"
import { DetailRow } from "../patterns"
import {
  ControlGroup,
  MiniSegmented,
  ParamRow,
  SegmentedControlRow,
  SelectRow,
} from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

const optionLabel = (options: { value: string; label: string }[], v: string) =>
  options.find((o) => o.value === v)?.label ?? v

/* ------------------------------ Option glyphs ------------------------------ */

/** A menu reduced to three item lines; the dot is the check, and the lines
 *  shift to show whether the gutter is reserved. */
function IndicatorGlyph({ indicator }: { indicator: "start" | "end" }) {
  const rows = [9, 12.5, 16]
  const start = indicator === "start" ? 10 : 7
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {rows.map((y, i) => (
        <path
          key={y}
          d={`M${start} ${y}h${(i === 0 && indicator === "end" ? 14 : 17) - start}`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={i === 0 ? 1 : 0.45}
        />
      ))}
      <circle
        cx={indicator === "start" ? 7.5 : 16.5}
        cy={rows[0]}
        r="1.5"
        fill="currentColor"
      />
    </svg>
  )
}

/** One highlighted row inside the list frame, wearing the treatment. */
function HighlightGlyph({ kind }: { kind: "neutral" | "accent" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <rect
        x="6"
        y="10"
        width="12"
        height="4.5"
        rx="1.5"
        fill="currentColor"
        opacity={kind === "accent" ? 0.9 : 0.3}
      />
      <path
        d="M7 7h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
      <path
        d="M7 17.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const INDICATOR_CARDS: SelectRowOption[] = INDICATOR_OPTIONS.map((o) => ({
  ...o,
  illustration: (
    <IndicatorGlyph indicator={o.value === "check-start" ? "start" : "end"} />
  ),
}))

const HIGHLIGHT_CARDS: SelectRowOption[] = HIGHLIGHT_OPTIONS.map((o) => ({
  ...o,
  illustration: <HighlightGlyph kind={o.value as "neutral" | "accent"} />,
}))

export function MenusSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const detailsModified =
    state.menuLabels !== "sentence" ||
    state.menuSearch !== "field" ||
    state.menuScale !== "default"
  return (
    <>
      <ControlGroup>
        <SelectRow
          label="Indicator"
          value={state.menuIndicator}
          onChange={set("menuIndicator")}
          options={INDICATOR_CARDS}
          layout="grid"
        />
        <SelectRow
          label="Highlight"
          value={state.menuHighlight}
          onChange={set("menuHighlight")}
          options={HIGHLIGHT_CARDS}
          layout="grid"
        />
        <SegmentedControlRow
          label="Items"
          value={state.menuInset}
          onChange={set("menuInset")}
          options={INSET_OPTIONS}
        />
      </ControlGroup>
      <DetailRow
        label="Details"
        summary={
          detailsModified
            ? `${optionLabel(LABEL_OPTIONS, state.menuLabels)} · ${optionLabel(SEARCH_OPTIONS, state.menuSearch)} · ${optionLabel(SCALE_OPTIONS, state.menuScale)}`
            : "Default"
        }
      >
        <ParamRow label="Labels">
          <MiniSegmented
            ariaLabel="Labels"
            value={state.menuLabels}
            onChange={set("menuLabels")}
            options={LABEL_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Search">
          <MiniSegmented
            ariaLabel="Search"
            value={state.menuSearch}
            onChange={set("menuSearch")}
            options={SEARCH_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Scale">
          <MiniSegmented
            ariaLabel="Scale"
            value={state.menuScale}
            onChange={set("menuScale")}
            options={SCALE_OPTIONS}
          />
        </ParamRow>
      </DetailRow>
    </>
  )
}
