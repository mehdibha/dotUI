"use client"

/* Accordion — Container: divided — hairline-separated full-bleed rows
   (shadcn, Radix Themes, Spectrum) — vs boxed — one bordered surface with internal
   dividers (Ant, Bootstrap, HeroUI bordered) — vs cards — each item its own
   separated card (Material expansion panels, HeroUI splitted, marketing
   FAQs). Marker: chevron (shadcn, Radix, Spectrum, Carbon) vs plus/minus
   (GOV.UK lineage, marketing FAQ patterns). Position: trailing (shadcn,
   Radix, Material) vs leading (GOV.UK, Polaris, Carbon). Rejected:
   open-item tint — shadcn, Radix, Spectrum, Carbon, Material all leave the
   open item unfilled; a tinted open row is a product one-off, not a system
   fork. Multiple-open is behavior, a prop (Radix type="multiple"); expand
   motion lives in the Motion chapter. */

import {
  CONTAINER_OPTIONS as CONTAINER_VALUES,
  MARKER_OPTIONS as MARKER_VALUES,
  POSITION_OPTIONS,
} from "../axes/accordion"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function ContainerGlyph({ style }: { style: "divided" | "boxed" | "cards" }) {
  if (style === "cards")
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
      {style === "boxed" && (
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

function MarkerGlyph({ glyph }: { glyph: "chevron" | "plus" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {glyph === "chevron" ? (
        <path d="M7 10l5 5 5-5" strokeLinejoin="round" />
      ) : (
        <path d="M12 6v12M6 12h12" />
      )}
    </svg>
  )
}

const CONTAINER_OPTIONS: SelectRowOption[] = CONTAINER_VALUES.map((option) => ({
  ...option,
  illustration: (
    <ContainerGlyph style={option.value as "divided" | "boxed" | "cards"} />
  ),
}))

const MARKER_OPTIONS: SelectRowOption[] = MARKER_VALUES.map((option) => ({
  ...option,
  illustration: <MarkerGlyph glyph={option.value as "chevron" | "plus"} />,
}))

export function AccordionSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Container"
        value={state.accordionContainer}
        onChange={set("accordionContainer")}
        options={CONTAINER_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Marker"
        value={state.accordionMarker}
        onChange={set("accordionMarker")}
        options={MARKER_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Position"
        value={state.accordionMarkerPosition}
        onChange={set("accordionMarkerPosition")}
        options={POSITION_OPTIONS}
      />
    </ControlGroup>
  )
}
