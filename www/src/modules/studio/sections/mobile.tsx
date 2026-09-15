"use client"

/* Mobile — how overlays adapt below the touch line. Off is a real option
   (Radix Themes renders the same everywhere) and empties the chapter down to
   the switch. Pickers is the loudest split: shadcn/Vaul and most product
   apps slide selects, menus and date pickers into a bottom drawer, Geist
   keeps the popover anchored. Dialogs split again: the classic modal stays
   centered, iOS-style systems drop it to a sheet. Deliberately baseline,
   never axes: the mobile line itself (the
   768px viewport breakpoint), hover styles only under (hover: hover), 16px
   inputs against iOS zoom, safe-area insets, keyboard-aware sheets.
   Comboboxes have no row: their list stays anchored to the input. */

import { DIALOG_OPTIONS, PICKER_OPTIONS } from "../axes/mobile"
import { ControlGroup, SelectRow, SwitchRow } from "../rows"
import type { SelectRowOption } from "../rows"
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

const withGlyphs = (options: SelectRowOption[]): SelectRowOption[] =>
  options.map((o) => ({
    ...o,
    illustration: <PhoneGlyph layer={o.value as Layer} />,
  }))

const PICKERS = withGlyphs(PICKER_OPTIONS)
const DIALOGS = withGlyphs(DIALOG_OPTIONS)

/** Collapsed-row summary: off, or what pickers and dialogs become. */
export function mobileSummary(state: StudioState): string {
  if (!state.mobileAdapt) return "Off"
  const pickers =
    PICKER_OPTIONS.find((o) => o.value === state.mobilePickers)?.label ??
    state.mobilePickers
  return `${pickers} pickers`
}

export function MobileSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SwitchRow
        label="Adapt for touch"
        description="Pickers and dialogs change shape below the mobile line."
        value={state.mobileAdapt}
        onChange={set("mobileAdapt")}
      />
      {state.mobileAdapt && (
        <>
          <SelectRow
            label="Pickers & menus"
            value={state.mobilePickers}
            onChange={set("mobilePickers")}
            options={PICKERS}
            layout="grid"
          />
          <SelectRow
            label="Dialogs"
            value={state.mobileDialogs}
            onChange={set("mobileDialogs")}
            options={DIALOGS}
            layout="grid"
          />
        </>
      )}
    </ControlGroup>
  )
}
