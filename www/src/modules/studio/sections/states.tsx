"use client"

/* Focus, Disabled, Cursor and Text selection — each a Foundations page —
   plus Invalid, hosted on the Field page. Specimens draw each recipe with
   the panel's own inks at its real geometry. */

import { useRef } from "react"
import type { Color } from "react-aria-components"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import type { PrimaryColorSource } from "@/registry/theme"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { ColorPicker } from "@/registry/ui/color-picker"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { effective } from "../axes"
import type { Effective } from "../axes"
import { HIGHLIGHT_OPTIONS } from "../axes/selection.meta"
import { INVALID_FILL } from "../axes/states"
import {
  CONTROL_TEXT_OPTIONS,
  CURSOR_BUSY_OPTIONS,
  CURSOR_CONTROL_OPTIONS,
  CURSOR_DISABLED_OPTIONS,
  CURSOR_DRAG_OPTIONS,
  DISABLED_OPTIONS,
  FOCUS_COLOR_OPTIONS,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_STYLE_OPTIONS,
  INVALID_OPTIONS,
} from "../axes/states.meta"
import {
  DIAL_LABEL,
  DIAL_ROW,
  DialSelect,
  type DialSelectOption,
  DialSlider,
  UNDER_ROW,
} from "../dial"
import { usePanelMode } from "../panel-mode"
import { stateProps } from "../preview/boards/board"
import type { RowMap } from "../row-host"
import {
  ColorPickerPopover,
  PanelPopoverTitle,
  useDocked,
  useDraft,
} from "../rows"
import { useCurrent } from "../selection"
import { DialTiles } from "../tiles"
import type { DialTile } from "../tiles"
import { useAxis } from "../use-axis"
import {
  ArrowCursor,
  GrabCursor,
  HandCursor,
  NotAllowedCursor,
  ProgressCursor,
  WaitCursor,
} from "./cursors"
import { inks } from "./primary"

const INK = "var(--color-border-focus)"
const DANGER = "var(--color-fg-danger)"
const DANGER_MUTED = "var(--color-danger-muted)"

const SIZE = "h-3.5 w-6 rounded-[4px]"

/** The control ring as Focus draws it: Inset sits inside the edge, Halo
 *  hugs it at half strength. */
function ControlSpecimen({ state }: { state: Effective }) {
  const { focusStyle: style, focusWidth: width } = state
  return (
    <span
      className={cn("mx-1 block shrink-0 bg-fg/25", SIZE)}
      style={{
        outline: `${width}px solid ${INK}`,
        outlineColor:
          style === "halo"
            ? `color-mix(in oklab, ${INK} 50%, transparent)`
            : INK,
        outlineOffset: style === "inset" ? -width : style === "halo" ? 0 : 2,
      }}
    />
  )
}

function DisabledSpecimen({ treatment }: { treatment: string }) {
  // A filled button with its label: one grey for Solid, itself at 50% for Fade.
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE,
        treatment === "fade" ? "bg-primary opacity-50" : "bg-disabled",
      )}
    >
      <span
        className={cn(
          "h-[18%] w-1/2 rounded-full",
          treatment === "fade" ? "bg-fg-on-primary" : "bg-fg-disabled",
        )}
      />
    </span>
  )
}

function InvalidSpecimen({ invalid }: { invalid: string }) {
  return (
    <span
      className={cn("mx-1 block shrink-0 border bg-bg", SIZE)}
      style={{
        borderColor: DANGER,
        boxShadow: invalid === "halo" ? `0 0 0 3px ${DANGER_MUTED}` : undefined,
        backgroundImage:
          invalid === "tint"
            ? `linear-gradient(${INVALID_FILL}, ${INVALID_FILL})`
            : undefined,
      }}
    />
  )
}

/* Painted words: the option is the highlight itself. The blue depicts the OS
   default. */
const HIGHLIGHT_CHIPS: Record<string, string> = {
  accent: "bg-text-selection text-fg-on-text-selection",
  browser: "bg-[#B3D7FF] text-[#1B1B1F]",
}

function HighlightChip({ value }: { value: string }) {
  return (
    <span className={cn("rounded-xs px-1 text-[11px]", HIGHLIGHT_CHIPS[value])}>
      Aa
    </span>
  )
}

export function FocusPreview({ state }: { state: Effective }) {
  return <ControlSpecimen state={state} />
}

export function DisabledPreview({ state }: { state: Effective }) {
  return <DisabledSpecimen treatment={state.disabledTreatment} />
}

/** The cursor over a control. */
export function CursorPreview({ state }: { state: Effective }) {
  const Glyph = state.cursorControls === "pointer" ? HandCursor : ArrowCursor
  return (
    <span className="block size-5 shrink-0 *:size-full">
      <Glyph />
    </span>
  )
}

export function TextSelectionPreview({ state }: { state: Effective }) {
  return <HighlightChip value={state.selectionHighlight} />
}

/* The Focus page's pickers open under their row, clear of the preview. */
const UNDER = "bottom end"

const FocusStyleRow = () => (
  <DialSelect
    axis="focusStyle"
    label="Style"
    options={FOCUS_STYLE_OPTIONS}
    placement={UNDER}
  />
)

const px = (value: number) => `${value}px`

const FocusWidthRow = () => (
  <DialSlider
    axis="focusWidth"
    label="Width"
    minValue={1}
    maxValue={4}
    step={1}
    format={px}
  />
)

const FocusGapRow = () => (
  <DialSlider
    axis="focusRingGap"
    label="Gap"
    minValue={0}
    maxValue={4}
    step={1}
    format={px}
  />
)

const FieldFocusWidthRow = () => (
  <DialSlider
    axis="focusFieldWidth"
    label="Width"
    minValue={1}
    maxValue={4}
    step={1}
    format={px}
  />
)

const SWATCH =
  "size-5 shrink-0 cursor-interactive rounded-full border border-fg/15 ring-offset-2 ring-offset-(--panel-surface,var(--color-card)) outline-none focus-visible:focus-ring selected:ring-2 selected:ring-fg/70"

/* The custom swatch: any color before one is picked, then that color in a
   spectrum rim, so it still reads as a picker. */
const SPECTRUM =
  "conic-gradient(#ef4444, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)"
const customSwatch = (color: string) =>
  color
    ? {
        background: `linear-gradient(${color} 0 0) padding-box, ${SPECTRUM} border-box`,
        border: "2px solid transparent",
      }
    : { background: SPECTRUM }

/** Primary's two sources and a color of its own, as swatches; the custom
 *  one opens a picker. */
function FocusColorRow() {
  const axis = useAxis("focusColor")
  const customAxis = useAxis("focusCustomColor")
  const { state } = useCurrent()
  const ink = inks(usePanelMode().m)
  const saved = String(customAxis?.saved ?? "")
  const custom = saved || state.brand
  const [draft, setDraft] = useDraft<string | Color>(custom)
  // The picker drops under the whole row, like the row pickers above it.
  const row = useRef<HTMLDivElement>(null)
  const under = !useDocked()
  if (!axis) return null
  const commit = (color: Color | null) => {
    if (!color) return
    customAxis?.set(color.toString("hex"))
    axis.set("custom")
  }
  const label = (value: string) =>
    FOCUS_COLOR_OPTIONS.find((o) => o.value === value)?.label ?? value
  return (
    <div ref={row} data-axis="focusColor" className={DIAL_ROW}>
      <span className={DIAL_LABEL}>Color</span>
      <RacToggleButtonGroup
        aria-label="Focus color"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[String(axis.saved)]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) axis.set(next)
        }}
        className="flex items-center gap-2"
      >
        {(["accent", "neutral"] as const).map((source) => (
          <Tooltip key={source} delay={0}>
            <RacToggleButton
              id={source}
              aria-label={label(source)}
              className={SWATCH}
              style={{ background: ink[source].ring }}
            />
            <TooltipContent>{label(source)}</TooltipContent>
          </Tooltip>
        ))}
        <ColorPicker value={draft} onChange={setDraft}>
          <Tooltip delay={0}>
            <RacToggleButton
              id="custom"
              aria-label={label("custom")}
              className={SWATCH}
              style={customSwatch(saved)}
            />
            <TooltipContent>
              {saved ? `Custom · ${saved.toUpperCase()}` : "Custom"}
            </TooltipContent>
          </Tooltip>
          <PanelPopoverTitle.Provider value="Focus color">
            <ColorPickerPopover
              commit={commit}
              placement={UNDER}
              {...(under && {
                triggerRef: row,
                offset: 6,
                showArrow: false,
                className: UNDER_ROW,
              })}
            />
          </PanelPopoverTitle.Provider>
        </ColorPicker>
      </RacToggleButtonGroup>
    </div>
  )
}

const FieldFocusRow = () => (
  <DialSelect
    axis="focusInputStyle"
    label="Style"
    options={FOCUS_INPUT_STYLE_OPTIONS}
    placement={UNDER}
  />
)

/** A primary button, a checked box and a switch on, disabled the way
 *  `treatment` draws them, in the design system's own colors. */
function DisabledScene({
  treatment,
  state,
}: {
  treatment: string
  state: Effective
}) {
  const { m } = usePanelMode()
  const ink = (source: string) =>
    inks(m)[source as PrimaryColorSource] ?? inks(m).accent
  const gray = (step: string) =>
    m.scales.neutral?.[step as keyof (typeof m.scales)[string]] ?? m.background
  const fade = treatment === "fade"
  const button = fade
    ? ink(state.buttonColor)
    : { fill: gray("300"), on: gray("600") }
  const checkbox = fade
    ? ink(state.checkboxColor)
    : { fill: gray("100"), on: gray("600") }
  const track = fade ? ink(state.switchColor).fill : gray("100")
  const thumb = fade ? ink(state.switchColor).on : gray("400")
  // On the design system's own page: grays read as they will in the app.
  return (
    <span
      className="absolute inset-0 flex items-center justify-center rounded-[inherit] border border-fg/10"
      style={{ background: m.background }}
    >
      <span
        className="flex flex-col items-center gap-2"
        style={{ opacity: fade ? state.disabledOpacity / 100 : 1 }}
      >
        <span
          className="rounded-[5px] px-2.5 text-[10px]/5 font-medium"
          style={{ background: button.fill, color: button.on }}
        >
          Button
        </span>
        <span className="flex items-center gap-2">
          <span
            className="flex size-3.5 items-center justify-center rounded-[3px]"
            style={{ background: checkbox.fill }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={checkbox.on}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-2.5"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span
            className="flex h-3.5 w-6 items-center justify-end rounded-full p-0.5"
            style={{ background: track }}
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: thumb }}
            />
          </span>
        </span>
      </span>
    </span>
  )
}

/** The Style laid out in place: each option a scene of the look. */
function DisabledRow() {
  const values = effective(useCurrent().state).values
  return (
    <DialTiles
      axis="disabledTreatment"
      label="Style"
      options={DISABLED_OPTIONS.map((option) => ({
        ...option,
        tile: <DisabledScene treatment={option.value} state={values} />,
      }))}
    />
  )
}

const percent = (value: number) => `${value}%`

const DisabledOpacityRow = () => (
  <DialSlider
    axis="disabledOpacity"
    label="Opacity"
    minValue={30}
    maxValue={70}
    step={5}
    format={percent}
  />
)

const INVALID_ROW_OPTIONS = INVALID_OPTIONS.map((option) => ({
  ...option,
  glyph: <InvalidSpecimen invalid={option.value} />,
}))

const InvalidRow = () => (
  <DialSelect
    axis="invalidStyle"
    label="Invalid"
    options={INVALID_ROW_OPTIONS}
  />
)

const CURSORS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
  progress: ProgressCursor,
  wait: WaitCursor,
  grab: GrabCursor,
}

/** A specimen with the cursor `cursor` names resting on it. */
function CursorScene({
  cursor,
  at = "left-[70%]",
  children,
}: {
  cursor: string
  at?: string
  children: React.ReactNode
}) {
  const Glyph = CURSORS[cursor] ?? ArrowCursor
  return (
    <span className="relative inline-flex">
      {children}
      <span className={cn("absolute top-1/2 z-10 size-6 *:size-full", at)}>
        <Glyph />
      </span>
    </span>
  )
}

/** Each option as its cursor over `specimen`; `as` names the cursor where
 *  the value isn't a cursor keyword (Drag's "Same as controls"). */
function useCursorTiles(
  options: readonly DialSelectOption[],
  specimen: React.ReactNode,
  { as = {}, at }: { as?: Record<string, string>; at?: string } = {},
): DialTile[] {
  return options.map((option) => ({
    ...option,
    tile: (
      <CursorScene cursor={as[option.value] ?? option.value} at={at}>
        {specimen}
      </CursorScene>
    ),
  }))
}

function SpecimenButton(props: React.ComponentProps<"span">) {
  const button = useButtonStyles()
  return (
    <span {...props} className={button({ variant: "primary", size: "sm" })}>
      Button
    </span>
  )
}

function CursorControlsRow() {
  const options = useCursorTiles(CURSOR_CONTROL_OPTIONS, <SpecimenButton />)
  return <DialTiles axis="cursorControls" label="Controls" options={options} />
}

function CursorDisabledRow() {
  const options = useCursorTiles(
    CURSOR_DISABLED_OPTIONS,
    <SpecimenButton {...stateProps("disabled")} />,
  )
  return <DialTiles axis="cursorDisabled" label="Disabled" options={options} />
}

function CursorBusyRow() {
  const options = useCursorTiles(
    CURSOR_BUSY_OPTIONS,
    <Button variant="primary" size="sm" isPending>
      Save
    </Button>,
  )
  return (
    <DialTiles axis="cursorBusy" label="Busy" options={options} columns={3} />
  )
}

function CursorDragRow() {
  const { state } = useCurrent()
  const options = useCursorTiles(
    CURSOR_DRAG_OPTIONS,
    <Slider aria-label="Volume" defaultValue={60} className="w-20">
      <SliderControl />
    </Slider>,
    { as: { controls: state.cursorControls }, at: "left-[55%]" },
  )
  return <DialTiles axis="cursorDrag" label="Drag" options={options} />
}

const ControlTextRow = () => (
  <DialSelect
    axis="selectionUiText"
    label="Control text"
    options={CONTROL_TEXT_OPTIONS}
  />
)

const HIGHLIGHT_ROW_OPTIONS = HIGHLIGHT_OPTIONS.map((option) => ({
  ...option,
  glyph: <HighlightChip value={option.value} />,
}))

const HighlightRow = () => (
  <DialSelect
    axis="selectionHighlight"
    label="Highlight"
    options={HIGHLIGHT_ROW_OPTIONS}
  />
)

export const ROWS: RowMap = {
  focusStyle: FocusStyleRow,
  focusWidth: FocusWidthRow,
  focusRingGap: FocusGapRow,
  focusColor: FocusColorRow,
  focusInputStyle: FieldFocusRow,
  focusFieldWidth: FieldFocusWidthRow,
  disabledTreatment: DisabledRow,
  disabledOpacity: DisabledOpacityRow,
  invalidStyle: InvalidRow,
  cursorControls: CursorControlsRow,
  cursorDisabled: CursorDisabledRow,
  cursorBusy: CursorBusyRow,
  cursorDrag: CursorDragRow,
  selectionUiText: ControlTextRow,
  selectionHighlight: HighlightRow,
}
