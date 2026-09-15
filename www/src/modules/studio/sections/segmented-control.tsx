"use client"

/* Segmented control — the container+chip archetype (a chip in a shared
   well is not a button group). Selected: how the chip reads against the
   track — raised, a page-colored chip lifted on shadow (iOS
   UISegmentedControl, Radix Themes, Ant Design Segmented, shadcn Tabs) vs
   flat, tone-on-tone fill with no lift (Linear, Geist — dotUI today:
   bg-selected with a whisper of shadow) vs inverse, the selected segment
   snapping to full contrast (Carbon Content Switcher, pricing toggles).
   Track: filled well (iOS, shadcn, Linear) vs outline — hairline boundary,
   no fill (Carbon, Material 3 segmented buttons). The axes compose: filled +
   raised is iOS, outline + flat is M3's tonal segmented button, outline +
   inverse is Carbon. Rejected: underline-in-a-track — no shipping system
   found; the underline is Tabs' line signature (tabs.tsx). Idle-segment
   separators — iOS's hairlines travel with the raised treatment, derived.
   Gapped/detached segments — Toggle group territory. Fluid vs hug width —
   per-usage prop. Size and radius — Space and Shape. */

import { SELECTED_OPTIONS, TRACK_OPTIONS } from "../axes/segmented-control"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

type SelectedLook = "raised" | "flat" | "inverse"

/* One ladder: chip weight rises raised → flat → inverse; raised alone gets a
   stroked edge — the light chip reads as a cutout on its darker track. */
function SelectedGlyph({ look }: { look: SelectedLook }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="7"
        width="19"
        height="10"
        rx="5"
        fill="currentColor"
        opacity={look === "raised" ? ".3" : ".15"}
      />
      {look === "raised" ? (
        <rect
          x="4.75"
          y="9"
          width="8"
          height="6"
          rx="3"
          fill="currentColor"
          opacity=".08"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      ) : (
        <rect
          x="4.5"
          y="8.75"
          width="8.5"
          height="6.5"
          rx="3.25"
          fill="currentColor"
          opacity={look === "inverse" ? "1" : ".45"}
        />
      )}
    </svg>
  )
}

const SELECTED_ROW_OPTIONS: SelectRowOption[] = SELECTED_OPTIONS.map((o) => ({
  ...o,
  illustration: <SelectedGlyph look={o.value as SelectedLook} />,
}))

export function SegmentedControlSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Selected"
        value={state.segmentedSelected}
        onChange={set("segmentedSelected")}
        options={SELECTED_ROW_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Track"
        value={state.segmentedTrack}
        onChange={set("segmentedTrack")}
        options={TRACK_OPTIONS}
      />
    </ControlGroup>
  )
}
