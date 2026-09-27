"use client"

/* Accordion — how the container groups the items and the marker that says
   a trigger opens. */

import {
  CONTAINER_OPTIONS,
  MARKER_OPTIONS,
  POSITION_OPTIONS,
} from "../axes/accordion"
import { DialGlyph, DialSegmented, DialSelect } from "../dial"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

function ContainerGlyph({ container }: { container: string }) {
  if (container === "cards")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        {[3.5, 10, 16.5].map((y) => (
          <rect
            key={y}
            x="4"
            y={y}
            width="16"
            height="4"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {container === "boxed" && (
        <rect
          x="3.75"
          y="4.25"
          width="16.5"
          height="15.5"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      <path
        d="M4 9.5h16M4 14.5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".4"
      />
      {[5.75, 11, 16.25].map((y) => (
        <rect
          key={y}
          x="7"
          y={y}
          width="10"
          height="2"
          rx="1"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function MarkerGlyph({ marker }: { marker: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {marker === "plus" ? (
        <path d="M12 6v12M6 12h12" />
      ) : (
        <path d="M7 10l5 5 5-5" strokeLinejoin="round" />
      )}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function AccordionPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <ContainerGlyph container={state.accordionContainer} />
    </DialGlyph>
  )
}

export function AccordionSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Container"
        value={state.accordionContainer}
        onChange={set("accordionContainer")}
        rowPreview={false}
        options={CONTAINER_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <ContainerGlyph container={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSelect
        label="Marker"
        value={state.accordionMarker}
        onChange={set("accordionMarker")}
        options={MARKER_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <MarkerGlyph marker={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSegmented
        label="Position"
        value={state.accordionMarkerPosition}
        onChange={set("accordionMarkerPosition")}
        options={POSITION_OPTIONS}
      />
    </>
  )
}
