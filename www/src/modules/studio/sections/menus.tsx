"use client"

/* Menus — one language for every floating list: Menu, Select and ComboBox
   listboxes, and the command palette. Indicator, highlight, items and labels
   write all of them; the palette's search chrome and scale are its own. */

import {
  HIGHLIGHT_OPTIONS,
  INDICATOR_OPTIONS,
  INSET_OPTIONS,
  LABEL_OPTIONS,
  SCALE_OPTIONS,
  SEARCH_OPTIONS,
} from "../axes/menus"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/** Three item lines; the dot is the check, the lines shift for the gutter. */
function IndicatorGlyph({ indicator }: { indicator: string }) {
  const start = indicator === "check-start"
  const rows = [9, 12.5, 16]
  const x = start ? 10 : 7
  // The trailing check shortens the first line to make room for the dot.
  const width = (i: number) => (i === 0 && !start ? 14 : 17) - x
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
          d={`M${x} ${y}h${width(i)}`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={i === 0 ? 1 : 0.45}
        />
      ))}
      <circle
        cx={start ? 7.5 : 16.5}
        cy={rows[0]}
        r="1.5"
        fill="currentColor"
      />
    </svg>
  )
}

/** One highlighted row inside the list frame. */
function HighlightGlyph({ highlight }: { highlight: string }) {
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
        opacity={highlight === "accent" ? 0.9 : 0.3}
      />
      <path
        d="M7 7h10M7 17.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** Item rows floating in a gutter, or running edge to edge. */
function InsetGlyph({ inset }: { inset: string }) {
  const x = inset === "inset" ? 6.5 : 4
  const w = inset === "inset" ? 11 : 16
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
      {[7, 10.75, 14.5].map((y) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={w}
          height="2.5"
          rx={inset === "inset" ? 1 : 0}
          fill="currentColor"
          opacity={y === 10.75 ? 0.9 : 0.35}
        />
      ))}
    </svg>
  )
}

/** A palette: the search chrome over two rows. */
function PaletteGlyph({ search }: { search: string }) {
  return (
    <span className="my-1 flex w-full flex-col overflow-hidden rounded-md border border-fg/15 bg-bg">
      {search === "field" && (
        <span className="px-1.5 pt-1.5">
          <span className="flex h-4 items-center rounded-[4px] border border-fg/20 px-1">
            <span className="h-1 w-1/2 rounded-full bg-fg/25" />
          </span>
        </span>
      )}
      {search === "bar" && (
        <span className="flex h-6 items-center gap-1 border-b border-fg/15 px-2">
          <span className="size-1.5 rounded-full border border-fg/40" />
          <span className="h-1 w-1/2 rounded-full bg-fg/25" />
        </span>
      )}
      {search === "prompt" && (
        <span className="flex h-6 items-center px-2">
          <span className="h-1 w-1/2 rounded-full bg-fg/25" />
        </span>
      )}
      <span className="flex flex-col gap-1 p-1.5">
        <span className="h-3 rounded-[3px] bg-fg/10" />
        <span className="h-3 rounded-[3px]" />
      </span>
    </span>
  )
}

/* --------------------------------- Section --------------------------------- */

export function MenusPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <HighlightGlyph highlight={state.menuHighlight} />
    </DialGlyph>
  )
}

export function MenusSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Indicator"
        value={state.menuIndicator}
        onChange={set("menuIndicator")}
        options={INDICATOR_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <IndicatorGlyph indicator={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSelect
        label="Highlight"
        value={state.menuHighlight}
        onChange={set("menuHighlight")}
        rowPreview={false}
        options={HIGHLIGHT_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <HighlightGlyph highlight={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSelect
        label="Items"
        value={state.menuInset}
        onChange={set("menuInset")}
        options={INSET_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <InsetGlyph inset={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSegmented
        label="Labels"
        value={state.menuLabels}
        onChange={set("menuLabels")}
        options={LABEL_OPTIONS}
      />
      <DialTrigger
        label="Command palette"
        value={
          <span className="truncate">
            {optionLabel(SEARCH_OPTIONS, state.menuSearch)} ·{" "}
            {optionLabel(SCALE_OPTIONS, state.menuScale)}
          </span>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Search"
            columns={3}
            value={state.menuSearch}
            onChange={set("menuSearch")}
            options={SEARCH_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: <PaletteGlyph search={option.value} />,
            }))}
          />
          <DialSegmented
            label="Scale"
            value={state.menuScale}
            onChange={set("menuScale")}
            options={SCALE_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
