"use client"

/* Mobile — how overlays adapt below the touch line. Off is a real option
   (Radix Themes renders the same everywhere) and empties the chapter down to
   the switch. Pickers is the loudest split: shadcn/Vaul and most product
   apps slide selects, menus and date pickers into a bottom drawer, Geist
   keeps the popover anchored. Dialogs split again: the classic modal stays
   centered, iOS-style systems drop it to a sheet. The hero is two phones — a
   picker and a dialog — wearing the choices, the scrim borrowed from
   Dialogs. Deliberately baseline, never axes: the mobile line itself (the
   768px viewport breakpoint), hover styles only under (hover: hover), 16px
   inputs against iOS zoom, safe-area insets, keyboard-aware sheets.
   Comboboxes have no row: their list stays anchored to the input. */

import { cn } from "@/registry/lib/utils"

import { DIALOG_OPTIONS, mobileOverlays, PICKER_OPTIONS } from "../axes/mobile"
import { Hero } from "../hero"
import { ControlGroup, SelectRow, SwitchRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { BACKDROP } from "./dialogs"

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

/* ---------------------------------- Hero ----------------------------------- */

/* Bottom sheets: a hairline top edge so the sheet reads against the page in
   dark mode, where card and page sit a step apart. */
const SHEET =
  "absolute inset-x-0 bottom-0 rounded-t-[10px] border-t border-border/60 bg-card px-2 pt-1.5 pb-2 shadow-xl"

function Bar({ className }: { className: string }) {
  return <div className={cn("rounded-full bg-fg/15", className)} />
}

function Rows() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-3.5 items-center rounded-[4px] bg-muted px-1">
        <Bar className="h-1 w-9 bg-fg/50" />
      </div>
      <div className="flex h-3.5 items-center px-1">
        <Bar className="h-1 w-7" />
      </div>
      <div className="flex h-3.5 items-center px-1">
        <Bar className="h-1 w-10" />
      </div>
    </div>
  )
}

function Handle() {
  return <div className="mx-auto mb-1.5 h-0.5 w-5 rounded-full bg-fg/25" />
}

function Buttons({ stacked }: { stacked?: boolean }) {
  return (
    <div className={cn("flex gap-1", stacked ? "flex-col" : "justify-end")}>
      <span
        className={cn("h-3.5 rounded-[4px] bg-accent", stacked ? "" : "w-8")}
      />
      <span
        className={cn(
          "h-3.5 rounded-[4px] border border-border bg-muted",
          stacked ? "" : "w-8",
        )}
      />
    </div>
  )
}

/** Page chrome every phone shares: a title, a select-shaped field, a primary
 *  button. `anchored` renders inside the field's stacking context (the
 *  popover); `overlay` above the page (scrimmed layers). */
function Phone({
  anchored,
  overlay,
}: {
  anchored?: React.ReactNode
  overlay?: React.ReactNode
}) {
  return (
    <div className="relative flex h-40 w-28 shrink-0 flex-col overflow-hidden rounded-[14px] border border-fg/20 bg-bg">
      <div className="mx-auto mt-2 h-1 w-7 rounded-full bg-fg/15" />
      <div className="flex flex-1 flex-col gap-2 px-2.5 pt-3 pb-3.5">
        <Bar className="h-1.5 w-12 bg-fg/50" />
        <Bar className="h-1 w-full" />
        <div className="relative mt-1">
          <div className="flex h-5 items-center justify-between rounded-[5px] border border-border bg-card px-1.5">
            <Bar className="h-1 w-9" />
            <div className="size-1 rotate-45 border-r border-b border-fg/40" />
          </div>
          {anchored}
        </div>
        <div className="mt-auto h-5 rounded-[5px] bg-accent" />
      </div>
      {overlay}
    </div>
  )
}

export function MobileHero({ state }: { state: StudioState }) {
  const { pickers, dialogs } = mobileOverlays(state)
  const scrim = cn(
    "absolute inset-0",
    BACKDROP[state.dialogBackdrop as keyof typeof BACKDROP],
  )

  return (
    <Hero className="flex-row items-center justify-center gap-4 px-4 py-4">
      <Phone
        anchored={
          pickers === "popover" && (
            <div className="absolute inset-x-0 top-full mt-1 rounded-[6px] border border-border/60 bg-card p-1 shadow-lg">
              <Rows />
            </div>
          )
        }
        overlay={
          pickers === "drawer" && (
            <>
              <div className={scrim} />
              <div className={SHEET}>
                <Handle />
                <div className="mb-1 h-3.5 rounded-[4px] bg-muted" />
                <Rows />
              </div>
            </>
          )
        }
      />
      <Phone
        overlay={
          <>
            <div className={scrim} />
            {dialogs === "center" ? (
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-[6px] bg-card p-2 shadow-xl">
                <Bar className="mb-1.5 h-1.5 w-10 bg-fg/60" />
                <Bar className="mb-2.5 h-1 w-full" />
                <Buttons />
              </div>
            ) : (
              <div className={SHEET}>
                <Bar className="mt-1 mb-1.5 h-1.5 w-10 bg-fg/60" />
                <Bar className="mb-2.5 h-1 w-full" />
                <Buttons stacked />
              </div>
            )}
          </>
        }
      />
    </Hero>
  )
}

/** Collapsed-row summary: off, or what pickers and dialogs become. */
export function mobileSummary(state: StudioState): string {
  if (!state.mobileAdapt) return "Off"
  const label = (options: SelectRowOption[], value: string) =>
    options.find((o) => o.value === value)?.label ?? value
  return `${label(PICKER_OPTIONS, state.mobilePickers)} pickers · ${label(DIALOG_OPTIONS, state.mobileDialogs)} dialogs`
}

export function MobileSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <MobileHero state={state} />
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
