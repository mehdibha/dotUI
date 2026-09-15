"use client"

/* Dialogs — how modal layers meet the page, shared by Dialog, Drawer and
   Popover. Backdrop is the loudest split: shadcn/Radix and Vaul drop a plain
   black scrim (~black/50) over the page; Apple sheets, visionOS and Arc dim
   less but frost what's behind with a backdrop blur; Linear's dialogs and
   palettes use no scrim at all — elevation is carried by shadow alone, the
   page stays legible. Position is where a dialog rests: the classic modal
   centers, while Linear and Raycast dock it in the upper third — a
   command-palette habit that keeps the top edge fixed so the box never jumps
   as results grow. */

import { BACKDROP_OPTIONS, POSITION_OPTIONS } from "../axes/dialogs"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

/** The viewport with its scrim treatment: what the page reads like under the
 *  open layer — dimmed away, frosted, or crisp with only a shadow between. */
function BackdropGlyph({ treatment }: { treatment: "dim" | "blur" | "none" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {treatment !== "dim" && (
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={treatment === "blur" ? 2.25 : 1.25}
          opacity={treatment === "blur" ? 0.25 : 0.45}
        >
          <path d="M6 8.5h6" />
          <path d="M6 15.5h5" />
          <path d="M15 15.5h3" />
        </g>
      )}
      {treatment !== "none" && (
        <rect
          x="3.75"
          y="5.75"
          width="16.5"
          height="12.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={treatment === "dim" ? 0.32 : 0.15}
        />
      )}
      <rect x="8.5" y="9" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const BACKDROP_ROW_OPTIONS: SelectRowOption[] = BACKDROP_OPTIONS.map((o) => ({
  ...o,
  illustration: (
    <BackdropGlyph treatment={o.value as "dim" | "blur" | "none"} />
  ),
}))

export function DialogsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Backdrop"
        value={state.dialogBackdrop}
        onChange={set("dialogBackdrop")}
        options={BACKDROP_ROW_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Position"
        value={state.dialogPosition}
        onChange={set("dialogPosition")}
        options={POSITION_OPTIONS}
      />
    </ControlGroup>
  )
}
