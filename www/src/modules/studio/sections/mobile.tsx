"use client"

/* Mobile — how overlays adapt below the touch line: pickers as a bottom
   drawer or an anchored popover, dialogs centered or docked as a sheet.
   Deliberately baseline, never axes: the mobile line itself (768px), hover
   styles only under (hover: hover), 16px inputs against iOS zoom, safe-area
   insets, keyboard-aware sheets. Comboboxes have no row: their list stays
   anchored to the input. */

import { DIALOG_OPTIONS, PICKER_OPTIONS } from "../axes/mobile"
import { DialGlyph, DialSelect } from "../dial"
import type { DialSelectOption } from "../dial"
import type { Studio, StudioState } from "../state"

type Layer = "drawer" | "popover" | "center" | "sheet"

/* ------------------------------ Option glyphs ------------------------------ */

/** A phone with the layer drawn where it lands: anchored under a field,
 *  docked at the bottom, or floating mid-screen. */
function PhoneGlyph({ layer }: { layer: Layer }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {layer !== "popover" && (
        <rect
          x="6.75"
          y="2.75"
          width="10.5"
          height="18.5"
          rx="1.75"
          fill="currentColor"
          fillOpacity=".15"
        />
      )}
      {layer === "popover" && (
        <>
          <path
            d="M8.5 6.5h7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="8" y="9" width="8" height="6" rx="1" fill="currentColor" />
        </>
      )}
      {(layer === "drawer" || layer === "sheet") && (
        <path
          d="M6.75 15.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5.75H6.75z"
          fill="currentColor"
        />
      )}
      {layer === "center" && (
        <rect x="8.5" y="9.5" width="7" height="5" rx="1" fill="currentColor" />
      )}
    </svg>
  )
}

const withGlyphs = (
  options: { value: string; label: string }[],
): DialSelectOption[] =>
  options.map((o) => ({
    ...o,
    preview: (
      <DialGlyph>
        <PhoneGlyph layer={o.value as Layer} />
      </DialGlyph>
    ),
  }))

const PICKERS = withGlyphs(PICKER_OPTIONS)
const DIALOGS = withGlyphs(DIALOG_OPTIONS)

export function MobilePreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <PhoneGlyph layer={state.mobilePickers as Layer} />
    </DialGlyph>
  )
}

export function mobileSummary(state: StudioState): string {
  return (
    PICKER_OPTIONS.find((o) => o.value === state.mobilePickers)?.label ??
    state.mobilePickers
  )
}

export function MobileSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Pickers"
        value={state.mobilePickers}
        onChange={set("mobilePickers")}
        options={PICKERS}
        rowPreview={false}
      />
      <DialSelect
        label="Dialogs"
        value={state.mobileDialogs}
        onChange={set("mobileDialogs")}
        options={DIALOGS}
      />
    </>
  )
}
