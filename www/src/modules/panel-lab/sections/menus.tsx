"use client"

/* Menus — one language for every floating list: Menu, Select listbox,
   searchable picker, command palette. Six axes. Indicator: how a selected
   item is marked — leading check with a reserved left gutter on every item
   (Radix, shadcn, Material), trailing check on the selected item only (macOS
   menus, Arc), or none, where the highlight alone carries selection (Linear's
   command menu). Highlight: the hover/active treatment — a neutral gray wash
   (Linear, Geist, Vercel), the solid accent with inverted text (macOS,
   Windows, Chakra), the wash plus an accent bar on the leading edge (Linear's
   issue palette), or an outlined card (dotUI's docs search). Inset: rounded
   items floating in a padded gutter (macOS Big Sur+, Radix Themes, shadcn) vs
   full-bleed edge-to-edge rows (older Material menus, Bootstrap dropdowns).
   Labels: section headers in sentence case (shadcn, Raycast, Linear) or
   tracked caps, the classic uppercase micro-label. Search: the chrome a
   filterable list — palette, searchable picker — opens with: a boxed field
   floating in the padding, wearing the Inputs style live (shadcn/cmdk,
   Spotlight — and dotUI's CommandInput is a SearchField, hence the default),
   a full-bleed bar keeping the magnifier over a hairline (cmdk's full-bleed
   themes), or a bare text-only prompt (Linear, Raycast). Search and Inset
   are independent axes — Raycast pairs the bare prompt with inset items.
   Scale: search-led surfaces stay at menu scale (shadcn, GitHub's palette)
   or step up into a hero surface (Raycast, Linear's ⌘K) — input, rows and
   icons grow together. Footers, context chips and per-item shortcut hints
   are composition, not axes. The hero is the intersection specimen, a
   searchable picker: every axis lands on it. */

import { CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

export const MENU_DEFAULTS = {
  menuIndicator: "check-start",
  menuHighlight: "neutral",
  menuInset: "inset",
  menuLabels: "sentence",
  menuSearch: "field",
  menuScale: "default",
}

export const HIGHLIGHT = {
  neutral: "bg-highlight text-fg-on-highlight",
  accent: "bg-accent text-fg-on-accent",
  edge: "bg-highlight text-fg-on-highlight",
  outline: "bg-highlight text-fg-on-highlight ring-1 ring-border ring-inset",
}

/* ------------------------------ Option glyphs ------------------------------ */

/** A menu reduced to three item lines; the dot is the check, and the lines
 *  shift to show whether the gutter is reserved. */
function IndicatorGlyph({
  indicator,
}: {
  indicator: "start" | "end" | "none"
}) {
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
      {indicator !== "none" && (
        <circle
          cx={indicator === "start" ? 7.5 : 16.5}
          cy={rows[0]}
          r="1.5"
          fill="currentColor"
        />
      )}
    </svg>
  )
}

/** One highlighted row inside the list frame, wearing the treatment. */
function HighlightGlyph({
  kind,
}: {
  kind: "neutral" | "accent" | "edge" | "outline"
}) {
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
      {kind === "outline" ? (
        <rect
          x="6"
          y="10"
          width="12"
          height="4.5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ) : (
        <rect
          x="6"
          y="10"
          width="12"
          height="4.5"
          rx="1.5"
          fill="currentColor"
          opacity={kind === "accent" ? 0.9 : 0.3}
        />
      )}
      {kind === "edge" && (
        <path
          d="M6.75 10.75v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
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

/** The list's head: a boxed field in the padding, a full-bleed bar keeping
 *  the magnifier, or a bare prompt — the last two capped by a divider that
 *  runs edge to edge. */
function SearchGlyph({ kind }: { kind: "field" | "bar" | "prompt" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {kind === "field" ? (
        <rect
          x="6.5"
          y="6.5"
          width="11"
          height="4.5"
          rx="1.75"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ) : (
        <>
          {kind === "bar" && (
            <circle
              cx="7.5"
              cy="8"
              r="1.25"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          )}
          <path
            d={kind === "bar" ? "M10.5 8h6" : "M7 8h6"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4.75 11h14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity=".45"
          />
        </>
      )}
      <path
        d="M7 14.5h10"
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

const INDICATOR_OPTIONS: SelectRowOption[] = [
  {
    value: "check-start",
    label: "Leading check",
    illustration: <IndicatorGlyph indicator="start" />,
  },
  {
    value: "check-end",
    label: "Trailing check",
    illustration: <IndicatorGlyph indicator="end" />,
  },
  {
    value: "none",
    label: "None",
    illustration: <IndicatorGlyph indicator="none" />,
  },
]

const HIGHLIGHT_OPTIONS: SelectRowOption[] = [
  {
    value: "neutral",
    label: "Neutral",
    illustration: <HighlightGlyph kind="neutral" />,
  },
  {
    value: "accent",
    label: "Accent",
    illustration: <HighlightGlyph kind="accent" />,
  },
  {
    value: "edge",
    label: "Edge",
    illustration: <HighlightGlyph kind="edge" />,
  },
  {
    value: "outline",
    label: "Outline",
    illustration: <HighlightGlyph kind="outline" />,
  },
]

const INSET_OPTIONS = [
  { value: "inset", label: "Inset" },
  { value: "full-bleed", label: "Full bleed" },
]

const LABEL_OPTIONS = [
  { value: "sentence", label: "Sentence" },
  { value: "caps", label: "Caps" },
]

const SEARCH_OPTIONS: SelectRowOption[] = [
  {
    value: "field",
    label: "Field",
    illustration: <SearchGlyph kind="field" />,
  },
  { value: "bar", label: "Bar", illustration: <SearchGlyph kind="bar" /> },
  {
    value: "prompt",
    label: "Prompt",
    illustration: <SearchGlyph kind="prompt" />,
  },
]

const SCALE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
]

/* ---------------------------------- Hero ----------------------------------- */

function MenuItem({
  label,
  state,
  selected,
  highlighted,
}: {
  label: string
  state: LabState
  selected?: boolean
  highlighted?: boolean
}) {
  const indicator = state.menuIndicator
  const inset = state.menuInset === "inset"
  const lg = state.menuScale === "large"
  return (
    <div
      className={cn(
        "relative flex items-center",
        lg ? "gap-2 py-2 text-sm" : "gap-1.5 py-1.5 text-[0.8125rem]",
        inset ? "rounded-md px-2" : "px-3",
        highlighted
          ? HIGHLIGHT[state.menuHighlight as keyof typeof HIGHLIGHT]
          : "text-fg",
      )}
    >
      {highlighted && state.menuHighlight === "edge" && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
      )}
      {/* Leading check reserves its gutter on every item — the Radix/shadcn
          alignment contract — so the slot renders even unchecked. */}
      {indicator === "check-start" && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center",
            lg ? "size-4" : "size-3.5",
          )}
        >
          {selected && <CheckIcon className={lg ? "size-4" : "size-3.5"} />}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {indicator === "check-end" && selected && (
        <CheckIcon className={cn("shrink-0", lg ? "size-4" : "size-3.5")} />
      )}
    </div>
  )
}

export function MenusHero({ state }: { state: LabState }) {
  const inset = state.menuInset === "inset"
  const lg = state.menuScale === "large"
  const search = state.menuSearch
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  return (
    <Hero className="items-center py-4">
      <div
        className={cn(
          "rounded-lg border border-border/60 bg-card shadow-lg",
          lg ? "w-52" : "w-44",
        )}
      >
        {search === "field" ? (
          <div className="p-1 pb-0">
            <div
              className={cn(
                SHELL,
                lg ? "h-9 gap-2 px-2.5 text-sm" : "h-7 gap-1.5 px-2",
                look.className,
                hoverFx(state),
              )}
              style={look.style}
            >
              <SearchIcon
                className={cn(
                  "shrink-0 text-fg-muted",
                  lg ? "size-4" : "size-3.5",
                )}
              />
              <span className="flex-1 truncate text-fg-muted">Search…</span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center border-b border-border/60 px-3",
              lg ? "gap-2 py-2.5 text-sm" : "gap-1.5 py-2 text-[0.8125rem]",
            )}
          >
            {search === "bar" && (
              <SearchIcon
                className={cn(
                  "shrink-0 text-fg-muted",
                  lg ? "size-4" : "size-3.5",
                )}
              />
            )}
            <span className="flex-1 truncate text-fg-muted">Search…</span>
          </div>
        )}
        <div className={inset ? "p-1" : "py-1"}>
          <div
            className={cn(
              "pb-1 text-fg-muted",
              inset ? "px-2" : "px-3",
              lg ? "pt-2" : "pt-1.5",
              state.menuLabels === "caps"
                ? "text-[0.625rem] font-medium tracking-widest uppercase"
                : "text-[0.6875rem]",
            )}
          >
            Status
          </div>
          <MenuItem label="Backlog" state={state} />
          <MenuItem label="In progress" state={state} selected />
          <MenuItem label="Done" state={state} highlighted />
          <MenuItem label="Canceled" state={state} />
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the check placement, and the highlight treatment. */
export function menusSummary(state: LabState): string {
  const indicator =
    INDICATOR_OPTIONS.find((o) => o.value === state.menuIndicator)?.label ??
    state.menuIndicator
  const highlight =
    HIGHLIGHT_OPTIONS.find((o) => o.value === state.menuHighlight)?.label ??
    state.menuHighlight
  return `${indicator} · ${highlight} highlight`
}

export function MenusSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <MenusHero state={state} />
      <SelectRow
        label="Indicator"
        value={state.menuIndicator}
        onChange={set("menuIndicator")}
        options={INDICATOR_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Highlight"
        value={state.menuHighlight}
        onChange={set("menuHighlight")}
        options={HIGHLIGHT_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Items"
        value={state.menuInset}
        onChange={set("menuInset")}
        options={INSET_OPTIONS}
      />
      <SegmentedControlRow
        label="Labels"
        value={state.menuLabels}
        onChange={set("menuLabels")}
        options={LABEL_OPTIONS}
      />
      <SelectRow
        label="Search"
        value={state.menuSearch}
        onChange={set("menuSearch")}
        options={SEARCH_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Scale"
        value={state.menuScale}
        onChange={set("menuScale")}
        options={SCALE_OPTIONS}
      />
    </ControlGroup>
  )
}
