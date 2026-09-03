"use client"

/* Mobile — how the system adapts below the touch line. Off is a real option
   (Radix Themes renders the same everywhere) and empties the chapter down to
   the switch. Detect is what "mobile" means — a narrow viewport (Material's
   window classes, every Tailwind breakpoint), a coarse pointer, or either —
   the touch tablet is the case they disagree on. Pickers is the loudest
   split: shadcn/Vaul and most product apps slide selects, menus and
   comboboxes into a bottom drawer, Material 3 takes them full-screen, Geist
   keeps the popover anchored. Dialogs split again: the classic modal stays
   centered, iOS-style systems drop it to a sheet, Material goes full-screen.
   Controls is whether touch earns bigger targets: the same ladder one step up
   (Material 48dp, Apple 44pt), or the visual size kept and the hit area grown
   invisibly. The hero is two phones — a picker and a dialog — wearing the
   choices, the scrim borrowed from Dialogs. Deliberately baseline, never
   axes: hover styles only under (hover: hover), 16px inputs against iOS zoom,
   safe-area insets, keyboard-aware sheets. Comboboxes have no row: they
   follow Pickers. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow, SwitchRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { BACKDROP } from "./dialogs"

export const MOBILE_DEFAULTS = {
  mobileAdapt: true,
  mobileDetect: "viewport",
  mobilePickers: "drawer",
  mobileDialogs: "center",
  mobileControls: "larger",
}

type PickerLayer = "drawer" | "fullscreen" | "popover"
type DialogLayer = "center" | "drawer" | "fullscreen"
type Controls = "same" | "larger" | "hit-area"

/* ------------------------------ Option glyphs ------------------------------ */

/** A phone with the layer drawn where it lands: anchored under a field,
 *  docked at the bottom, covering the screen, or floating mid-screen. */
function PhoneGlyph({ layer }: { layer: PickerLayer | DialogLayer }) {
  const scrim = layer === "drawer" || layer === "center"
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
      {scrim && (
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
      {layer === "drawer" && (
        <path
          d="M6.75 15.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5.75H6.75z"
          fill="currentColor"
        />
      )}
      {layer === "fullscreen" && (
        <rect
          x="7.25"
          y="3.25"
          width="9.5"
          height="17.5"
          rx="1.25"
          fill="currentColor"
        />
      )}
      {layer === "center" && (
        <rect x="8.5" y="9.5" width="7" height="5" rx="1" fill="currentColor" />
      )}
    </svg>
  )
}

/** A control at its touch size: unchanged, one step up, or unchanged with
 *  the dashed hit area it actually answers to. */
function ControlGlyph({ kind }: { kind: Controls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {kind === "same" && (
        <rect
          x="5"
          y="9"
          width="14"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {kind === "larger" && (
        <rect
          x="4"
          y="7.5"
          width="16"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {kind === "hit-area" && (
        <>
          <rect
            x="6.5"
            y="9.5"
            width="11"
            height="5"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="3.5"
            y="6"
            width="17"
            height="12"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity=".45"
          />
        </>
      )}
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const DETECT_OPTIONS: SelectRowOption[] = [
  { value: "viewport", label: "Narrow viewport" },
  { value: "pointer", label: "Coarse pointer" },
  { value: "either", label: "Either" },
]

const PICKER_OPTIONS: SelectRowOption[] = [
  {
    value: "drawer",
    label: "Drawer",
    illustration: <PhoneGlyph layer="drawer" />,
  },
  {
    value: "fullscreen",
    label: "Full screen",
    illustration: <PhoneGlyph layer="fullscreen" />,
  },
  {
    value: "popover",
    label: "Popover",
    illustration: <PhoneGlyph layer="popover" />,
  },
]

const DIALOG_OPTIONS: SelectRowOption[] = [
  {
    value: "center",
    label: "Center",
    illustration: <PhoneGlyph layer="center" />,
  },
  {
    value: "drawer",
    label: "Drawer",
    illustration: <PhoneGlyph layer="drawer" />,
  },
  {
    value: "fullscreen",
    label: "Full screen",
    illustration: <PhoneGlyph layer="fullscreen" />,
  },
]

const CONTROL_OPTIONS: SelectRowOption[] = [
  { value: "same", label: "Same", illustration: <ControlGlyph kind="same" /> },
  {
    value: "larger",
    label: "Larger",
    illustration: <ControlGlyph kind="larger" />,
  },
  {
    value: "hit-area",
    label: "Hit area",
    illustration: <ControlGlyph kind="hit-area" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

/* Control heights per touch treatment; hit-area keeps the height and draws
   the invisible target it grows into. */
const CONTROL = {
  same: "h-5",
  larger: "h-6",
  "hit-area": "h-5 outline-1 outline-offset-[3px] outline-fg/30 outline-dashed",
}

/* Bottom sheets: a hairline top edge so the sheet reads against the page in
   dark mode, where card and page sit a step apart. */
const SHEET =
  "absolute inset-x-0 bottom-0 rounded-t-[10px] border-t border-border/60 bg-card px-2 pt-1.5 pb-2 shadow-xl"

function Bar({ className }: { className: string }) {
  return <div className={cn("rounded-full bg-fg/15", className)} />
}

function Rows({ highlight }: { highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex h-3.5 items-center rounded-[4px] px-1",
          highlight && "bg-muted",
        )}
      >
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

function SearchBar() {
  return <div className="mb-1 h-3.5 rounded-[4px] bg-muted" />
}

function SheetHeader() {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <div className="size-1.5 rounded-[2px] border border-fg/40" />
      <Bar className="h-1 w-8 bg-fg/50" />
    </div>
  )
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
 *  button — the last two wearing the touch control size. `anchored` renders
 *  inside the field's stacking context (the popover); `overlay` above the
 *  page (scrimmed layers). */
function Phone({
  controls,
  anchored,
  overlay,
}: {
  controls: Controls
  anchored?: React.ReactNode
  overlay?: React.ReactNode
}) {
  const control = CONTROL[controls]
  return (
    <div className="relative flex h-40 w-28 shrink-0 flex-col overflow-hidden rounded-[14px] border border-fg/20 bg-bg">
      <div className="mx-auto mt-2 h-1 w-7 rounded-full bg-fg/15" />
      <div className="flex flex-1 flex-col gap-2 px-2.5 pt-3 pb-3.5">
        <Bar className="h-1.5 w-12 bg-fg/50" />
        <Bar className="h-1 w-full" />
        <div className="relative mt-1">
          <div
            className={cn(
              "flex items-center justify-between rounded-[5px] border border-border bg-card px-1.5",
              control,
            )}
          >
            <Bar className="h-1 w-9" />
            <div className="size-1 rotate-45 border-r border-b border-fg/40" />
          </div>
          {anchored}
        </div>
        <div className={cn("mt-auto rounded-[5px] bg-accent", control)} />
      </div>
      {overlay}
    </div>
  )
}

export function MobileHero({ state }: { state: LabState }) {
  const adapt = state.mobileAdapt
  const pickers = (adapt ? state.mobilePickers : "popover") as PickerLayer
  const dialogs = (adapt ? state.mobileDialogs : "center") as DialogLayer
  const controls = (adapt ? state.mobileControls : "same") as Controls
  const scrim = cn(
    "absolute inset-0",
    BACKDROP[state.dialogBackdrop as keyof typeof BACKDROP],
  )

  return (
    <Hero className="flex-row items-center justify-center gap-4 px-4 py-4">
      <Phone
        controls={controls}
        anchored={
          pickers === "popover" && (
            <div className="absolute inset-x-0 top-full mt-1 rounded-[6px] border border-border/60 bg-card p-1 shadow-lg">
              <Rows highlight />
            </div>
          )
        }
        overlay={
          pickers === "drawer" ? (
            <>
              <div className={scrim} />
              <div className={SHEET}>
                <Handle />
                <SearchBar />
                <Rows highlight />
              </div>
            </>
          ) : pickers === "fullscreen" ? (
            <div className="absolute inset-0 bg-card px-2 pt-3">
              <SheetHeader />
              <SearchBar />
              <Rows highlight />
            </div>
          ) : null
        }
      />
      <Phone
        controls={controls}
        overlay={
          dialogs === "center" ? (
            <>
              <div className={scrim} />
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-[6px] bg-card p-2 shadow-xl">
                <Bar className="mb-1.5 h-1.5 w-10 bg-fg/60" />
                <Bar className="mb-2.5 h-1 w-full" />
                <Buttons />
              </div>
            </>
          ) : dialogs === "drawer" ? (
            <>
              <div className={scrim} />
              <div className={SHEET}>
                <Handle />
                <Bar className="mb-1.5 h-1.5 w-10 bg-fg/60" />
                <Bar className="mb-2.5 h-1 w-full" />
                <Buttons stacked />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col bg-card px-2 pt-3 pb-2">
              <SheetHeader />
              <Bar className="mb-1.5 h-1 w-full" />
              <Bar className="mb-1.5 h-1 w-3/4" />
              <Bar className="h-1 w-5/6" />
              <div className="mt-auto">
                <Buttons stacked />
              </div>
            </div>
          )
        }
      />
    </Hero>
  )
}

/** Collapsed-row summary: off, or what pickers and dialogs become. */
export function mobileSummary(state: LabState): string {
  if (!state.mobileAdapt) return "Off"
  const pickers =
    PICKER_OPTIONS.find((o) => o.value === state.mobilePickers)?.label ??
    state.mobilePickers
  const dialogs =
    DIALOG_OPTIONS.find((o) => o.value === state.mobileDialogs)?.label ??
    state.mobileDialogs
  return `${pickers} pickers · ${dialogs} dialogs`
}

export function MobileSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <MobileHero state={state} />
      <SwitchRow
        label="Adapt for touch"
        description="Overlays and controls change shape below the mobile line."
        value={state.mobileAdapt}
        onChange={set("mobileAdapt")}
      />
      {state.mobileAdapt && (
        <>
          <SelectRow
            label="Detect by"
            value={state.mobileDetect}
            onChange={set("mobileDetect")}
            options={DETECT_OPTIONS}
          />
          <SelectRow
            label="Pickers & menus"
            value={state.mobilePickers}
            onChange={set("mobilePickers")}
            options={PICKER_OPTIONS}
            layout="grid"
          />
          <SelectRow
            label="Dialogs"
            value={state.mobileDialogs}
            onChange={set("mobileDialogs")}
            options={DIALOG_OPTIONS}
            layout="grid"
          />
          <SelectRow
            label="Controls"
            value={state.mobileControls}
            onChange={set("mobileControls")}
            options={CONTROL_OPTIONS}
            layout="grid"
          />
        </>
      )}
    </ControlGroup>
  )
}
