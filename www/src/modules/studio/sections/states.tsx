"use client"

/* Focus, Disabled, Cursor and Text selection — each a Foundations page —
   plus Invalid, hosted on the Field page. Specimens draw each recipe with
   the panel's own inks at its real geometry. */

import { useRef } from "react"
import { AppWindowIcon } from "lucide-react"
import type { Color } from "react-aria-components"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { toHex, toOklch } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import type { PrimaryColorSource } from "@/registry/theme"
import { ColorPicker } from "@/registry/ui/color-picker"
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

/** Each highlight as the panel's mode paints it. */
function useHighlightFill() {
  const { m, mode } = usePanelMode()
  return (value: string, custom: string) => {
    if (value === "browser") return "Highlight"
    if (value === "custom" && custom) return custom
    const step = value === "neutral" && mode === "dark" ? "500" : "300"
    const palette = value === "neutral" ? "neutral" : "accent"
    return m.scales[palette]?.[step] ?? m.background
  }
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

/** The text on a highlight: the system's pair for Browser, else whichever
 *  ink reads. */
const textOn = (value: string, background: string) =>
  value === "browser"
    ? "HighlightText"
    : toOklch(background).l > 0.6
      ? "#1B1B1F"
      : "#FAFAFA"

/** Painted words: the row shows the highlight itself. */
export function TextSelectionPreview({ state }: { state: Effective }) {
  const value = state.selectionHighlight
  const fill = useHighlightFill()
  if (value === "browser")
    return <AppWindowIcon className="size-4 shrink-0 text-fg/70" />
  const background = fill(value, state.selectionCustomColor)
  const color = textOn(value, background)
  return (
    <span className="rounded-xs px-1 text-[11px]" style={{ background, color }}>
      Aa
    </span>
  )
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

/** A tile's scene on the design system's own page: colors read as they
 *  will in the app. */
function ScenePage({ children }: { children: React.ReactNode }) {
  const { m } = usePanelMode()
  return (
    <span
      className="absolute inset-0 flex items-center justify-center rounded-[inherit] border border-fg/10"
      style={{ background: m.background }}
    >
      {children}
    </span>
  )
}

const SCENE_BUTTON =
  "flex h-5 items-center justify-center rounded-[5px] px-2.5 text-[10px] font-medium"

/** The inks a primary button, a checked box and a switch on take, disabled
 *  the way `treatment` draws them. */
function useDisabledInks(treatment: string, state: Effective) {
  const { m } = usePanelMode()
  const ink = (source: string) =>
    inks(m)[source as PrimaryColorSource] ?? inks(m).accent
  const gray = (step: string) =>
    m.scales.neutral?.[step as keyof (typeof m.scales)[string]] ?? m.background
  const fade = treatment === "fade"
  return {
    button: fade
      ? ink(state.buttonColor)
      : { fill: gray("300"), on: gray("600") },
    checkbox: fade
      ? ink(state.checkboxColor)
      : { fill: gray("100"), on: gray("600") },
    track: fade ? ink(state.switchColor).fill : gray("100"),
    thumb: fade ? ink(state.switchColor).on : gray("400"),
    opacity: fade ? state.disabledOpacity / 100 : 1,
  }
}

/** A primary button, a checked box and a switch on, disabled the way
 *  `treatment` draws them, in the design system's own colors. */
function DisabledScene({
  treatment,
  state,
}: {
  treatment: string
  state: Effective
}) {
  const { button, checkbox, track, thumb, opacity } = useDisabledInks(
    treatment,
    state,
  )
  return (
    <ScenePage>
      <span className="flex flex-col items-center gap-2" style={{ opacity }}>
        <span
          className={SCENE_BUTTON}
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
    </ScenePage>
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

/** A specimen on the design system's page with the cursor `cursor` names
 *  resting on it. */
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
    <ScenePage>
      <span className="relative inline-flex">
        {children}
        <span className={cn("absolute top-1/2 z-10 size-5 *:size-full", at)}>
          <Glyph />
        </span>
      </span>
    </ScenePage>
  )
}

/** Each option as its cursor over `specimen`; `as` names the cursor where
 *  the value isn't a cursor keyword (Drag's "Same as controls"). */
function cursorTiles(
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

function usePrimaryInk(source: string) {
  const ink = inks(usePanelMode().m)
  return ink[source as PrimaryColorSource] ?? ink.accent
}

function CursorControlsRow() {
  const { fill, on } = usePrimaryInk(useCurrent().state.buttonColor)
  const options = cursorTiles(
    CURSOR_CONTROL_OPTIONS,
    <span className={SCENE_BUTTON} style={{ background: fill, color: on }}>
      Button
    </span>,
  )
  return <DialTiles axis="cursorControls" label="Controls" options={options} />
}

function CursorDisabledRow() {
  const values = effective(useCurrent().state).values
  const { button, opacity } = useDisabledInks(values.disabledTreatment, values)
  const options = cursorTiles(
    CURSOR_DISABLED_OPTIONS,
    <span
      className={SCENE_BUTTON}
      style={{ background: button.fill, color: button.on, opacity }}
    >
      Button
    </span>,
  )
  return <DialTiles axis="cursorDisabled" label="Disabled" options={options} />
}

function CursorBusyRow() {
  const { fill, on } = usePrimaryInk(useCurrent().state.buttonColor)
  const options = cursorTiles(
    CURSOR_BUSY_OPTIONS,
    <span
      className={cn(SCENE_BUTTON, "w-12")}
      style={{ background: fill, color: on }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="size-3"
      >
        <path d="M21 12a9 9 0 1 1-6.2-8.6" />
      </svg>
    </span>,
  )
  return (
    <DialTiles axis="cursorBusy" label="Busy" options={options} columns={3} />
  )
}

function CursorDragRow() {
  const { state } = useCurrent()
  const { m } = usePanelMode()
  const { fill } = usePrimaryInk(state.sliderColor)
  const track = m.scales.neutral?.["200"] ?? m.background
  const options = cursorTiles(
    CURSOR_DRAG_OPTIONS,
    <span
      className="relative flex h-1 w-16 items-center rounded-full"
      style={{ background: track }}
    >
      <span
        className="h-full w-3/5 rounded-full"
        style={{ background: fill }}
      />
      <span
        className="absolute left-3/5 size-3 -translate-x-1/2 rounded-full border-2 bg-white"
        style={{ borderColor: fill }}
      />
    </span>,
    { as: { controls: state.cursorControls }, at: "left-[60%]" },
  )
  return <DialTiles axis="cursorDrag" label="Drag" options={options} />
}

/** A drag across a word and a button: the button's label lights up
 *  only when control text selects. */
function ControlTextScene({ selectable }: { selectable: boolean }) {
  const { state } = useCurrent()
  const { m } = usePanelMode()
  const values = effective(state).values
  const button =
    inks(m)[values.buttonColor as PrimaryColorSource] ?? inks(m).accent
  const background = useHighlightFill()(
    values.selectionHighlight,
    values.selectionCustomColor,
  )
  const color = textOn(values.selectionHighlight, background)
  const marked = { background, color }
  return (
    <span
      className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-[inherit] border border-fg/10 text-[10px]/4 font-medium"
      style={{ background: m.background, color: m.scales.neutral?.["950"] }}
    >
      <span style={marked}>Saved</span>
      <span
        className="rounded-[5px] px-2 py-0.5"
        style={{ background: button.fill, color: button.on }}
      >
        <span style={selectable ? marked : undefined}>Undo</span>
      </span>
    </span>
  )
}

/** Whether labels select, laid out in place: each option a drag over a
 *  button. */
const ControlTextRow = () => (
  <DialTiles
    axis="selectionUiText"
    label="Labels"
    options={CONTROL_TEXT_OPTIONS.map((option) => ({
      ...option,
      tile: <ControlTextScene selectable={option.value === "selectable"} />,
    }))}
  />
)

/** The highlight's sources as swatches, each painted as the panel's mode
 *  draws it; the custom one opens a picker. */
function HighlightRow() {
  const axis = useAxis("selectionHighlight")
  const customAxis = useAxis("selectionCustomColor")
  const fill = useHighlightFill()
  const saved = String(customAxis?.saved ?? "")
  // Unpicked, the picker starts on the accent highlight.
  const [draft, setDraft] = useDraft<string | Color>(
    saved || toHex(toOklch(fill("accent", ""))),
  )
  const row = useRef<HTMLDivElement>(null)
  const under = !useDocked()
  if (!axis) return null
  const commit = (color: Color | null) => {
    if (!color) return
    customAxis?.set(color.toString("hex"))
    axis.set("custom")
  }
  const label = (value: string) =>
    HIGHLIGHT_OPTIONS.find((o) => o.value === value)?.label ?? value
  return (
    <div ref={row} data-axis="selectionHighlight" className={DIAL_ROW}>
      <span className={DIAL_LABEL}>Highlight</span>
      <RacToggleButtonGroup
        aria-label="Highlight"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[String(axis.saved)]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) axis.set(next)
        }}
        className="flex items-center gap-2"
      >
        {(["accent", "neutral"] as const).map((value) => (
          <Tooltip key={value} delay={0}>
            <RacToggleButton
              id={value}
              aria-label={label(value)}
              className={SWATCH}
              style={{ background: fill(value, "") }}
            />
            <TooltipContent>{label(value)}</TooltipContent>
          </Tooltip>
        ))}
        {/* Not a color: each viewer's system decides it. */}
        <Tooltip delay={0}>
          <RacToggleButton
            id="browser"
            aria-label="Browser default"
            className={cn(
              SWATCH,
              "flex items-center justify-center bg-(--panel-surface,var(--color-card))",
            )}
          >
            <AppWindowIcon className="size-3 text-fg/70" />
          </RacToggleButton>
          <TooltipContent>Browser default</TooltipContent>
        </Tooltip>
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
          <PanelPopoverTitle.Provider value="Highlight color">
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
