"use client"

/* Badges — and Tags, one synced chip language: a tag is a badge that can be
   removed, so both wear the same style and shape and a change to one is a
   change to both. Style is how much intent color the chip carries: solid is
   the Bootstrap/Material filled chip (bg-success, on-color text); soft is
   the Linear/Radix Themes tinted wash (bg-success-muted, intent text) that
   most modern systems default to; outline is the Geist/shadcn badge —
   transparent fill, intent border and text; soft-outline is the Ant tag,
   wash and tinted border together. Shape is the second real disagreement:
   full-round pills (GitHub labels, Geist, Radix radius-full) vs ~4px
   corners (Ant, Bootstrap, Material) — nothing in between shows up. */

import { SHAPE_OPTIONS, STYLE_OPTIONS } from "../axes/badges"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

/** The chip reduced to its fill treatment; monochrome, like all glyphs. */
function ChipGlyph({ fill, stroke }: { fill?: number; stroke?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="8.75"
        width="15"
        height="6.5"
        rx="3.25"
        fill={fill ? "currentColor" : "none"}
        fillOpacity={fill}
        stroke={stroke ? "currentColor" : "none"}
        strokeWidth="1.5"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const STYLE_GLYPHS: Record<string, React.ReactNode> = {
  solid: <ChipGlyph fill={1} />,
  soft: <ChipGlyph fill={0.35} />,
  outline: <ChipGlyph stroke />,
  "soft-outline": <ChipGlyph fill={0.25} stroke />,
}

const STYLE_ROW_OPTIONS: SelectRowOption[] = STYLE_OPTIONS.map((o) => ({
  ...o,
  illustration: STYLE_GLYPHS[o.value],
}))

export function BadgesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Style"
        value={state.badgeStyle}
        onChange={set("badgeStyle")}
        options={STYLE_ROW_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Shape"
        value={state.badgeShape}
        onChange={set("badgeShape")}
        options={SHAPE_OPTIONS}
      />
    </ControlGroup>
  )
}
