"use client"

/* Lists — in-page rows: grouped on cards or plain, and the color of their
   action rows. */

import { STYLE_OPTIONS, TINT_OPTIONS } from "../axes/lists"
import { DialGlyph, DialSegmented } from "../dial"
import type { Studio, StudioState } from "../state"

/** Three rows: one rounded card, or hairline-split full-bleed rows. */
function ListGlyph({ style }: { style: string }) {
  const inset = style === "inset"
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {inset && (
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="3.5"
          fill="currentColor"
          opacity=".15"
        />
      )}
      {[9.667, 14.333].map((y) => (
        <path
          key={y}
          d={inset ? `M6 ${y}h15` : `M2 ${y}h20`}
          stroke="currentColor"
          strokeWidth="1"
          opacity=".35"
        />
      ))}
      {[7.333, 12, 16.667].map((y) => (
        <path
          key={y}
          d={`M${inset ? 6 : 3} ${y}h7`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export function ListsPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <ListGlyph style={state.listStyle} />
    </DialGlyph>
  )
}

export function ListsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSegmented
        label="Style"
        value={state.listStyle}
        onChange={set("listStyle")}
        options={STYLE_OPTIONS}
      />
      <DialSegmented
        label="Actions"
        value={state.listTint}
        onChange={set("listTint")}
        options={TINT_OPTIONS}
      />
    </>
  )
}
