"use client"

/* Dialogs — how modal layers meet the page: the scrim under them, where
   a dialog rests. Backdrop writes Dialog and Drawer together. */

import { BACKDROP_OPTIONS, POSITION_OPTIONS } from "../axes/dialogs"
import { DialGlyph, DialSegmented, DialSelect } from "../dial"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/** The viewport under an open layer: dimmed away, frosted, or crisp. */
function BackdropGlyph({ backdrop }: { backdrop: string }) {
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
      {backdrop !== "dim" && (
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={backdrop === "blur" ? 2.25 : 1.25}
          opacity={backdrop === "blur" ? 0.25 : 0.45}
        >
          <path d="M6 8.5h6" />
          <path d="M6 15.5h5" />
          <path d="M15 15.5h3" />
        </g>
      )}
      {backdrop !== "none" && (
        <rect
          x="3.75"
          y="5.75"
          width="16.5"
          height="12.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={backdrop === "dim" ? 0.32 : 0.15}
        />
      )}
      <rect x="8.5" y="9" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function DialogsPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <BackdropGlyph backdrop={state.dialogBackdrop} />
    </DialGlyph>
  )
}

export function DialogsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Backdrop"
        value={state.dialogBackdrop}
        onChange={set("dialogBackdrop")}
        rowPreview={false}
        options={BACKDROP_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <BackdropGlyph backdrop={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSegmented
        label="Position"
        value={state.dialogPosition}
        onChange={set("dialogPosition")}
        options={POSITION_OPTIONS}
      />
    </>
  )
}
