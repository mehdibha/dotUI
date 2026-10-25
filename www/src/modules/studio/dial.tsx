"use client"

/* The panel's control language, after DialKit (dialkit.dev): 36px rows on a
   5% foreground surface, 8px radius, 6px apart; 13px/500 labels at 85%
   foreground, values on the right at 60%; a slider is its whole row. Rows
   that open a popover carry no chevron, rows that open a page do. Alpha
   surfaces keep both themes in one set of classes. */

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { CheckIcon, ChevronRightIcon, ChevronsUpDownIcon } from "lucide-react"
import type { Color, KeyboardEvent } from "react-aria-components"
import {
  Button as RacButton,
  ListBox as RacListBox,
  ListBoxItem as RacListBoxItem,
  OverlayTriggerStateContext,
  SelectionIndicator,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { toHex, toOklch } from "@dotui/colors"

import { useMedia } from "@/hooks/use-media"
import { cn } from "@/registry/lib/utils"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Dialog, DialogContent } from "@/registry/ui/dialog"

import { effective } from "./axes"
import type { StudioState } from "./axes"
import { COLUMNS } from "./axes/style"
import type { StyleKey } from "./axes/style"
import { FOLLOW_STYLE } from "./axes/style.meta"
import { holdEditFocus } from "./focus"
import { clearLive, previewNow } from "./live"
import { useOptionPreview } from "./option-preview"
import { RowLabel, useRowLabel } from "./row-host"
import {
  ColorPickerPopover,
  PanelNav,
  PanelPopover,
  PanelPopoverTitle,
  useDocked,
  useDraft,
} from "./rows"
import { useCurrent } from "./selection"
import { CauseChip, ChipButton, useAxis, useAxisGate } from "./use-axis"
import type { Axis, AxisKey } from "./use-axis"

export const DIAL_ROW =
  "flex h-9 w-full shrink-0 items-center justify-between gap-3 rounded-lg tint-5 px-3"
export const DIAL_PRESS =
  "cursor-interactive text-left outline-none transition-colors hover:tint-10 focus-visible:focus-ring pressed:tint-10"
export const DIAL_LABEL = "shrink-0 text-[13px] font-medium text-fg/85"
const DIAL_VALUE = "truncate font-mono text-[13px] font-medium text-fg/60"

/** A 16px SVG specimen beside a row's value or an option's label. */
export function DialGlyph({ children }: { children: React.ReactNode }) {
  return (
    <span data-glyph="" className="size-4 shrink-0 *:size-full">
      {children}
    </span>
  )
}

/** A row a rule holds: dimmed, its value set elsewhere, the cause beside it. */
function PinnedRow({
  axis,
  label,
  cause,
  children,
}: {
  axis?: string
  label: string
  cause: string
  children: React.ReactNode
}) {
  return (
    <div data-axis={axis} aria-disabled className={DIAL_ROW}>
      <span className={cn(DIAL_LABEL, "opacity-50")}>{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        {/* Short of room, the value wraps past the spacer out of sight: the chip says why. */}
        <span className="flex h-5 min-w-0 flex-wrap justify-end overflow-hidden">
          <span className="h-5" />
          <span className="text-[13px]/5 font-medium whitespace-nowrap text-fg/50">
            {children}
          </span>
        </span>
        <CauseChip cause={cause} />
      </span>
    </div>
  )
}

/** A break between row groups: rows sit 6px apart, groups 16px. */
export function DialGap() {
  return <div className="h-1" />
}

/** A name over a group of rows, set like the panel's chapter titles. */
export function DialGroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="truncate px-2.5 pt-1 text-xs/4 font-medium text-fg/50">
      {children}
    </h3>
  )
}

/** A row that opens a popover: label, its value. Wraps the popover passed
 *  as `children` in a Dialog trigger. `swatch` for values that end in one:
 *  inset like DialColor's. `holds` names keys edited inside, so a reveal
 *  lands here; `aside` (a cause chip) sits before the value, outside the
 *  trigger. */
export function DialTrigger({
  axis,
  holds,
  label: labelProp,
  value,
  aside,
  swatch,
  chevron,
  children,
}: {
  axis?: string
  holds?: readonly string[]
  label: string
  value: React.ReactNode
  aside?: React.ReactNode
  swatch?: boolean
  /** Up-down chevrons after the value: the row opens a list under itself. */
  chevron?: boolean
  children: React.ReactNode
}) {
  const label = useRowLabel(labelProp)
  const row = {
    "data-axis": axis,
    "data-holds": holds?.join(" "),
  }
  const right = (
    <span className="flex min-w-0 items-center gap-2">
      {aside && <span className="pointer-events-auto flex">{aside}</span>}
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/60">
        {value}
        {chevron && (
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg/40" />
        )}
      </span>
    </span>
  )
  return (
    <Dialog>
      {aside ? (
        // A chip can't nest in the trigger: the trigger is laid under the row.
        <div {...row} className={cn(DIAL_ROW, "relative", swatch && "pr-2.5")}>
          <RacButton
            aria-label={label}
            className={cn(DIAL_PRESS, "absolute inset-0 rounded-[inherit]")}
          />
          <span className={cn(DIAL_LABEL, "pointer-events-none relative")}>
            {label}
          </span>
          <span className="pointer-events-none relative flex min-w-0">
            {right}
          </span>
        </div>
      ) : (
        <RacButton
          {...row}
          className={cn(DIAL_ROW, DIAL_PRESS, swatch && "pr-2.5")}
        >
          <span className={DIAL_LABEL}>{label}</span>
          {right}
        </RacButton>
      )}
      <PanelPopoverTitle.Provider value={label}>
        <RowLabel.Provider value={undefined}>{children}</RowLabel.Provider>
      </PanelPopoverTitle.Provider>
    </Dialog>
  )
}

/** A pick list's popover: as wide as its longest option, not the row. */
export const PICK_POPOVER = "w-max min-w-48 max-w-64"

/* Under its row, a popover covers the rows below: the row's width, a row gap
   away, a step brighter than the row with a deeper shadow so it reads as on
   top. Its hover tints step from that surface. Unlike other panel popovers it
   keeps the registry popover's entrance, grown from the row's middle rather
   than its end. */
const UNDER_ROW =
  "w-(--trigger-width)! min-w-0! max-w-none! origin-top! border-fg/10 bg-(--panel-surface) shadow-xl transition-[transform,opacity,scale] will-change-[transform,opacity,scale] [--panel-surface:color-mix(in_oklab,var(--color-fg)_7%,var(--color-card))]!"

/** Under its row a popover covers the rows below, so a pick closes it. */
const PickCloses = createContext(false)

/** What a DialTrigger opens: a run of dial rows beside the row, shown whole;
 *  with a bottom `placement`, under it instead. */
export function DialPopover({
  className,
  placement,
  children,
}: {
  className?: string
  placement?: React.ComponentProps<typeof PanelPopover>["placement"]
  children: React.ReactNode
}) {
  const docked = useDocked()
  const under = !docked && !!placement?.startsWith("bottom")
  return (
    <PanelPopover
      placement={placement}
      {...(under && { offset: 6, showArrow: false })}
      className={cn("w-64 min-w-0", className, under && UNDER_ROW)}
    >
      <DialogContent className="flex min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain p-1.5">
        <PickCloses.Provider value={under}>{children}</PickCloses.Provider>
      </DialogContent>
    </PanelPopover>
  )
}

/** A row that opens a page in place of the panel: label, value, a chevron. */
export function DialLink({
  page,
  label,
  value,
  className,
}: {
  page: string
  label: string
  value: React.ReactNode
  className?: string
}) {
  const open = useContext(PanelNav)
  return (
    <RacButton
      data-page-link={page}
      onPress={() => open(page)}
      className={cn(DIAL_ROW, DIAL_PRESS, "pr-2", className)}
    >
      <span className={DIAL_LABEL}>{label}</span>
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/60">
        {value}
        <ChevronRightIcon className="size-4 shrink-0 text-fg/40" />
      </span>
    </RacButton>
  )
}

export interface DialSelectOption {
  value: string
  label: string
  /** What the option does: a line under the label, in the popover. */
  description?: string
  credits?: readonly string[]
  /** A specimen beside the row's value. */
  glyph?: React.ReactNode
  /** Beside the label: a follow option's source chip. */
  aside?: React.ReactNode
}

/** A pick from a short list: the row shows the choice (and its glyph), the
 *  popover lists every option in the dial's pick list. Beside the panel,
 *  picking keeps the popover up — the choice is a comparison against the
 *  preview behind it; under the row, hovering previews and a pick closes it.
 *  `children` are dial rows under the list, past a separator. */
export function DialSelect({
  axis: key,
  holds,
  label: labelProp,
  value: valueProp,
  onChange: onChangeProp,
  options: listed,
  placement,
  children,
}: {
  /** The key the row edits: value, change, hide and exclusions follow it. */
  axis?: AxisKey
  /** Keys edited in the rows under the list, so a reveal lands here. */
  holds?: readonly string[]
  label: string
  value?: string
  onChange?: (value: string) => void
  options: DialSelectOption[]
  /** Beside the panel by default; "bottom end" drops it under the row. */
  placement?: React.ComponentProps<typeof PanelPopover>["placement"]
  children?: React.ReactNode
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude, held, following } = useAxisGate(key)
  const { state } = useCurrent()
  if (hidden) return null
  // A Style key's first option is the Style itself ("Style · Line"); a
  // follow its column reads ("auto") would list the same pick twice.
  const column =
    key && Object.hasOwn(COLUMNS, key)
      ? COLUMNS[key as StyleKey][state.style]
      : undefined
  const options: DialSelectOption[] =
    axis?.follows.includes(FOLLOW_STYLE.value) &&
    !listed.some((option) => option.value === FOLLOW_STYLE.value)
      ? [
          FOLLOW_STYLE,
          ...listed.filter(
            (option) =>
              option.value !== column ||
              !axis.follows.includes(column) ||
              option.value === axis.saved,
          ),
        ]
      : listed
  // A key read through a follow keeps its follow option picked ("Auto · Tone").
  const value = valueProp ?? String(following ? axis?.saved : axis?.effective)
  const onChange = onChangeProp ?? ((v: string) => axis?.set(v))
  const selected = options.find((option) => option.value === value)
  const resolved = following
    ? options.find((option) => option.value === String(axis?.effective))
    : undefined
  const shown = resolved ?? selected
  if (pinned)
    return (
      <PinnedRow axis={key} label={label} cause={pinned}>
        {selected?.label ?? value}
      </PinnedRow>
    )
  return (
    <DialTrigger
      axis={key}
      holds={holds}
      label={label}
      aside={held && <CauseChip cause={held} />}
      chevron={placement?.startsWith("bottom")}
      value={
        <>
          <span className="truncate">
            {(resolved ?? selected)?.label ?? value}
          </span>
          {shown?.glyph}
        </>
      }
    >
      <DialPopover className={PICK_POPOVER} placement={placement}>
        <SelectOptions
          axis={axis}
          label={label}
          value={value}
          onChange={onChange}
          options={options}
          exclude={exclude}
        />
        {Children.toArray(children).length > 0 && (
          <>
            <DialSeparator />
            {children}
          </>
        )}
      </DialPopover>
    </DialTrigger>
  )
}

/** The list; a follow option names and draws its target ("Same as motion · Standard"). */
function SelectOptions({
  axis,
  label,
  value,
  onChange,
  options,
  exclude,
}: {
  axis: Axis | undefined
  label: string
  value: string
  onChange: (value: string) => void
  options: DialSelectOption[]
  exclude: Axis["explain"]["exclude"]
}) {
  const { state } = useCurrent()
  const closes = useContext(PickCloses)
  const overlay = useContext(OverlayTriggerStateContext)
  const target = (option: DialSelectOption) => {
    if (!axis?.follows.includes(option.value)) return
    const resolved =
      option.value === axis.saved
        ? axis.effective
        : effective({ ...state, [axis.key]: option.value } as StudioState)
            .values[axis.key]
    return options.find((o) => o.value === String(resolved))
  }
  return (
    <DialPickList
      label={label}
      value={value}
      onChange={onChange}
      onPicked={closes ? () => overlay?.close() : undefined}
      disabledKeys={exclude?.options}
      options={options.map((option) => {
        const to = target(option)
        const cause = exclude?.options?.includes(option.value)
          ? exclude.cause
          : undefined
        return {
          ...option,
          label: to ? `${option.label} · ${to.label}` : option.label,
          aside: (option.aside || cause) && (
            <>
              {option.aside}
              {cause && <CauseChip cause={cause} />}
            </>
          ),
        }
      })}
    />
  )
}

interface DialPickOption {
  value: string
  label: string
  description?: string
  credits?: readonly string[]
  /** After the label: a follow's source chip, an exclusion's cause. */
  aside?: React.ReactNode
}

const PICK_ITEM =
  "flex cursor-interactive items-start justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left outline-hidden transition-colors hover:tint-5 focus-visible:tint-5 pressed:tint-10 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"

function PickItem({
  option,
  run,
  onRepick,
}: {
  option: DialPickOption
  run: () => void
  onRepick?: () => void
}) {
  const previewProps = useOptionPreview()
  return (
    <RacListBoxItem
      id={option.value}
      textValue={option.label}
      className={PICK_ITEM}
      {...previewProps(run)}
      {...(onRepick && {
        onPointerUp: (e: React.PointerEvent) => e.button === 0 && onRepick(),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") onRepick()
          e.continuePropagation()
        },
      })}
    >
      {({ isSelected }) => (
        <>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-fg/90">
              {option.label}
              {option.aside}
            </span>
            {option.description && (
              <span className="text-xs leading-snug text-fg/55">
                {option.description}
              </span>
            )}
          </span>
          <CheckIcon
            className={cn("mt-px size-4 shrink-0", !isSelected && "invisible")}
          />
        </>
      )}
    </RacListBoxItem>
  )
}

/** Options laid out in place, each with what it means. */
export function DialPickList({
  label,
  value,
  onChange,
  options,
  disabledKeys,
  onPicked,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: DialPickOption[]
  disabledKeys?: readonly string[]
  /** After a press picks an option, the current one included. */
  onPicked?: () => void
}) {
  return (
    <RacListBox
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      // A pick that closes the list lands on release, so the release can't
      // fall through to the row under it.
      shouldSelectOnPressUp={!!onPicked}
      selectedKeys={[value]}
      disabledKeys={disabledKeys}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const next = keys.values().next().value
        if (!next) return
        onChange(next as string)
        onPicked?.()
      }}
      className="flex flex-col gap-0.5 outline-hidden"
    >
      {options.map((option) => (
        <PickItem
          key={option.value}
          option={option}
          run={() => onChange(option.value)}
          // Pressing the current option selects nothing new.
          onRepick={option.value === value ? onPicked : undefined}
        />
      ))}
    </RacListBox>
  )
}

/** A full-width action at a popover's foot ("Reset all"). */
export function DialAction({
  onPress,
  children,
}: {
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <RacButton
      onPress={onPress}
      className={cn(DIAL_ROW, DIAL_PRESS, "justify-center")}
    >
      <span className={DIAL_LABEL}>{children}</span>
    </RacButton>
  )
}

/** A full-bleed hairline between a popover's parts. */
export function DialSeparator() {
  return <div role="separator" className="-mx-1.5 h-px shrink-0 bg-fg/8" />
}

/* DialKit's slider: the row is the track, the fill follows the pointer
   unstepped and springs to the nearest step on release. Hashmarks and a
   3×20 handle surface only while hovered or held; the handle fades where it
   would sit under the label or value. Past either end the track stretches.
   Springs are CSS `linear()` transitions — no animation library in the
   panel's bundle. */

const CLICK_THRESHOLD = 3
const DEAD_ZONE = 32
const MAX_CURSOR_RANGE = 200
const MAX_STRETCH = 8
const LABEL_LEFT = 12
const VALUE_RIGHT = 12
const HANDLE_BUFFER = 8
/* A lightly bounced spring, ~6% overshoot. */
const SPRING =
  "linear(0, 0.26 8%, 0.62 20%, 0.9 32%, 1.04 44%, 1.06 52%, 1.03 64%, 1 78%, 0.995 88%, 1)"
const SNAP = `width 420ms ${SPRING}`
const RELAX = `width 350ms ${SPRING}, translate 350ms ${SPRING}`

/** Clicks near a tenth of the range land on it; elsewhere they stay put. */
function snapToDecile(raw: number, min: number, max: number) {
  const t = (raw - min) / (max - min)
  const nearest = Math.round(t * 10) / 10
  return Math.abs(t - nearest) <= 0.03125 ? min + nearest * (max - min) : raw
}

interface SliderProps {
  label: string
  minValue: number
  maxValue: number
  step: number
  format: (value: number) => string
}

/** Drags through a draft and commits on release. With `axis`, the row edits
 *  that key: hidden or held by a rule, an excluded range greyed, and a key
 *  that follows another reads "Auto" until dragged (its chip goes back). */
export function DialSlider(
  row: SliderProps &
    (
      | { axis: AxisKey; value?: undefined; onChange?: undefined }
      | { axis?: undefined; value: number; onChange: (value: number) => void }
    ),
) {
  const label = useRowLabel(row.label)
  const { axis, hidden, pinned, exclude, following } = useAxisGate(row.axis)
  if (hidden) return null
  if (row.axis === undefined) return <SliderRow {...row} label={label} />
  const { axis: _, value: __, onChange: ___, ...rest } = row
  const props = { ...rest, label }
  if (!axis) return null
  const current = Number(axis.effective)
  if (pinned)
    return (
      <PinnedRow axis={axis.key} label={props.label} cause={pinned}>
        {props.format(current)}
      </PinnedRow>
    )
  const follow = axis.follows[0]
  return (
    <SliderRow
      {...props}
      axis={axis.key}
      value={current}
      onChange={axis.set}
      following={following}
      exclude={exclude}
      aside={exclude && <CauseChip cause={exclude.cause} />}
      reset={
        follow &&
        !following && (
          <ChipButton onPress={() => axis.set(follow)}>
            <span className="capitalize">{follow}</span>
          </ChipButton>
        )
      }
    />
  )
}

function SliderRow({
  axis,
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  format,
  following,
  exclude,
  aside,
  reset,
}: SliderProps & {
  axis?: string
  value: number
  onChange: (value: number) => void
  following?: string
  exclude?: { above?: number; below?: number }
  aside?: React.ReactNode
  /** Back to the follow: after the value, while hovered or focused. */
  reset?: React.ReactNode
}) {
  const [draft, setDraft] = useDraft(value)
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)")
  const range = maxValue - minValue
  const steps = range / step
  const toPct = (v: number) => ((v - minValue) / range) * 100
  const clamp = (v: number) => Math.max(minValue, Math.min(maxValue, v))
  const round = (v: number) =>
    clamp(
      Number(
        (minValue + Math.round((v - minValue) / step) * step).toPrecision(12),
      ),
    )

  const wrapperRef = useRef<HTMLDivElement>(null)
  const commit = (next: number) => {
    if (axis) holdEditFocus(wrapperRef.current)
    onChange(next)
  }
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [interacting, setInteracting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = interacting || hovered
  // Touch has no hover: the handle rests visible, and a tap flashes it.
  const coarse = useMedia("(pointer: coarse)")
  const [nudged, setNudged] = useState(false)
  useEffect(() => {
    if (!nudged) return
    const timer = setTimeout(() => setNudged(false), 600)
    return () => clearTimeout(timer)
  }, [nudged])

  const pointerDown = useRef<{
    x: number
    y: number
    value: number
    touch: boolean
  } | null>(null)
  const isClick = useRef(true)
  const rect = useRef<DOMRect | null>(null)
  const committed = useRef(value)
  // Unmounted mid-drag, nothing would commit or drop the drag's preview.
  useEffect(
    () => () => {
      if (pointerDown.current) clearLive()
    },
    [],
  )

  /* The fill and the handle move together, off React: written straight to
     style, with the snap transition only on release. */
  const paint = (pct: number, transition = "none") => {
    const fill = fillRef.current
    const handle = handleRef.current
    if (!fill || !handle) return
    const t = reducedMotion ? "none" : transition
    fill.style.transition = t
    handle.style.transition = t.replace(/width/g, "left")
    fill.style.width = `${pct}%`
    handle.style.left = `max(5px, calc(${pct}% - 9px))`
  }

  const stretchTo = (s: number, relax = false) => {
    const track = trackRef.current
    if (!track) return
    track.style.transition = relax && !reducedMotion ? RELAX : "none"
    track.style.width = `calc(100% + ${Math.abs(s)}px)`
    track.style.translate = `${Math.min(s, 0)}px 0`
  }

  // Sync the fill when the value changes from outside (reset, a preset); a
  // value this slider just committed is already painted, mid-snap.
  useEffect(() => {
    if (!interacting && value !== committed.current) paint(toPct(value))
    committed.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, minValue, maxValue])

  const settle = (next: number) => {
    committed.current = next
    paint(toPct(next), SNAP)
    setDraft(next)
    commit(next)
  }

  const valueAt = (clientX: number) => {
    const r = rect.current
    const el = wrapperRef.current
    if (!r || !el) return draft
    const scale = r.width / el.offsetWidth || 1
    const t = Math.max(
      0,
      Math.min(1, (clientX - r.left) / scale / el.offsetWidth),
    )
    return minValue + t * range
  }

  const stretchAt = (clientX: number) => {
    const r = rect.current
    if (!r) return 0
    if (clientX < r.left) {
      const over = Math.max(0, r.left - clientX - DEAD_ZONE)
      return -MAX_STRETCH * Math.sqrt(Math.min(over / MAX_CURSOR_RANGE, 1))
    }
    if (clientX > r.right) {
      const over = Math.max(0, clientX - r.right - DEAD_ZONE)
      return MAX_STRETCH * Math.sqrt(Math.min(over / MAX_CURSOR_RANGE, 1))
    }
    return 0
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerDown.current = {
      x: e.clientX,
      y: e.clientY,
      value: draft,
      touch: e.pointerType === "touch",
    }
    isClick.current = true
    rect.current = wrapperRef.current?.getBoundingClientRect() ?? null
    setInteracting(true)
  }

  /* Touch drags are relative and never jump: the row is also what the dock
     scrolls by, so a vertical swipe hands off to the scroll and a tap is a
     no-op. The mouse keeps DialKit's absolute track. */
  const touchValueAt = (clientX: number) => {
    const down = pointerDown.current
    const width = wrapperRef.current?.offsetWidth
    if (!down || !width) return draft
    return clamp(down.value + ((clientX - down.x) / width) * range)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const down = pointerDown.current
    if (!interacting || !down) return
    if (isClick.current) {
      const dx = e.clientX - down.x
      const dy = e.clientY - down.y
      if (Math.hypot(dx, dy) <= CLICK_THRESHOLD) return
      if (down.touch && Math.abs(dy) > Math.abs(dx)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
        return onPointerCancel()
      }
      isClick.current = false
      setDragging(true)
    }
    if (!down.touch) stretchTo(stretchAt(e.clientX))
    const raw = down.touch ? touchValueAt(e.clientX) : valueAt(e.clientX)
    paint(toPct(raw))
    const next = round(raw)
    setDraft(next)
    previewNow(() => onChange(next))
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interacting) return
    if (pointerDown.current?.touch) {
      if (isClick.current) {
        onPointerCancel()
        setNudged(true)
      } else {
        settle(round(touchValueAt(e.clientX)))
        setInteracting(false)
        setDragging(false)
        pointerDown.current = null
      }
      return
    }
    const raw = valueAt(e.clientX)
    settle(
      round(
        isClick.current && steps > 10
          ? snapToDecile(raw, minValue, maxValue)
          : raw,
      ),
    )
    stretchTo(0, true)
    setInteracting(false)
    setDragging(false)
    pointerDown.current = null
  }

  const onPointerCancel = () => {
    if (!interacting) return
    clearLive()
    stretchTo(0)
    paint(toPct(value))
    setDraft(value)
    setInteracting(false)
    setDragging(false)
    pointerDown.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.altKey || e.metaKey || e.ctrlKey)
      return
    let next: number | undefined
    if (e.key === "Home") next = minValue
    else if (e.key === "End") next = maxValue
    else {
      const dir = ["ArrowRight", "ArrowUp", "PageUp"].includes(e.key)
        ? 1
        : ["ArrowLeft", "ArrowDown", "PageDown"].includes(e.key)
          ? -1
          : 0
      if (!dir) return
      const amount = e.key.startsWith("Page") || e.shiftKey ? 10 : 1
      const pos = (draft - minValue) / step
      const n =
        dir > 0
          ? Math.floor(pos + 1e-9) + amount
          : Math.ceil(pos - 1e-9) - amount
      next = round(minValue + n * step)
    }
    e.preventDefault()
    e.stopPropagation()
    committed.current = next
    paint(toPct(next))
    setDraft(next)
    commit(next)
  }

  // The handle: hidden at rest (half-strength on touch), half-strength on
  // hover, full while dragging, and nearly gone where it would cross the
  // label or the value.
  const pct = toPct(draft)
  const [handleLook, setHandleLook] = useState({ opacity: 0, x: 0.25, y: 1 })
  useEffect(() => {
    const width = trackRef.current?.offsetWidth ?? 0
    const left =
      width && labelRef.current
        ? ((LABEL_LEFT + labelRef.current.offsetWidth + HANDLE_BUFFER) /
            width) *
          100
        : 30
    const right =
      width && valueRef.current
        ? ((width -
            VALUE_RIGHT -
            valueRef.current.offsetWidth -
            HANDLE_BUFFER) /
            width) *
          100
        : 78
    const dodge = pct < left || pct > right
    setHandleLook({
      opacity: nudged
        ? 0.9
        : !active && !coarse
          ? 0
          : dodge
            ? 0.1
            : dragging
              ? 0.9
              : 0.5,
      x: active || coarse ? 1 : 0.25,
      y: active && dodge ? 0.75 : 1,
    })
  }, [active, coarse, dragging, nudged, pct])

  // Nine marks at each tenth, or one per step when the range has ten or fewer.
  const marks =
    steps <= 10
      ? Array.from(
          { length: Math.max(0, Math.round(steps) - 1) },
          (_, i) => ((i + 1) * step * 100) / range,
        )
      : Array.from({ length: 9 }, (_, i) => (i + 1) * 10)

  const excluded = exclude && {
    from: toPct(exclude.below ?? minValue),
    to: toPct(exclude.above ?? maxValue),
    above: exclude.above !== undefined,
  }

  return (
    <div
      data-axis={axis}
      ref={wrapperRef}
      className="relative h-9 w-full shrink-0"
    >
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuenow={draft}
        aria-valuetext={format(draft)}
        data-active={active || undefined}
        data-dragging={dragging || undefined}
        className="group absolute inset-y-0 left-0 w-full cursor-interactive touch-pan-y overflow-hidden rounded-lg tint-5 outline-none select-none focus-visible:focus-ring"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={() => {
          if (pointerDown.current) onPointerCancel()
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={onKeyDown}
      >
        {excluded && (
          <div
            className="pointer-events-none absolute inset-y-0 bg-[repeating-linear-gradient(135deg,transparent_0_4px,color-mix(in_oklab,var(--color-fg)_8%,transparent)_4px_5px)]"
            style={
              excluded.above
                ? { left: `${excluded.to}%`, right: 0 }
                : { left: 0, width: `${excluded.from}%` }
            }
          />
        )}
        <div className="pointer-events-none absolute inset-0">
          {marks.map((left) => (
            <span
              key={left}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent transition-colors duration-200 group-data-active:bg-fg/15"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
        <div
          ref={fillRef}
          style={{ width: `${toPct(value)}%` }}
          className="pointer-events-none absolute inset-y-0 left-0 tint-10 transition-colors duration-150 group-focus-visible:tint-15 group-data-active:tint-15"
        />
        <div
          ref={handleRef}
          style={{
            left: `max(5px, calc(${toPct(value)}% - 9px))`,
            opacity: handleLook.opacity,
            scale: `${handleLook.x} ${handleLook.y}`,
            transitionProperty: "opacity, scale",
            transitionDuration: reducedMotion ? "0s" : "150ms, 250ms",
            transitionTimingFunction: `ease, ${SPRING}`,
          }}
          className="pointer-events-none absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-fg/90"
        />
        <span
          ref={labelRef}
          className={cn(
            DIAL_LABEL,
            "pointer-events-none absolute inset-y-0 left-3 flex items-center transition-colors duration-150",
          )}
        >
          {label}
        </span>
        <span
          ref={valueRef}
          className={cn(
            DIAL_VALUE,
            "pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 tabular-nums",
          )}
        >
          {aside}
          {following && !interacting && (
            <span className="capitalize">{following} ·</span>
          )}
          {format(draft)}
          {reset && (
            // Visually hidden, not display:none, so Tab can still land on it;
            // it unmounts on reset, so focus goes back to the slider first.
            <span
              onClickCapture={() => trackRef.current?.focus()}
              className="sr-only flex group-focus-visible:not-sr-only group-has-focus-visible:not-sr-only group-data-active:not-sr-only pointer-coarse:not-sr-only"
            >
              {reset}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

/** Label, hex, swatch; the row opens the picker. With `derived`, an empty
 *  value reads "Auto" on the engine's color. */
export function DialColor({
  axis,
  label: labelProp,
  value,
  derived,
  onChange,
  status,
  footer,
}: {
  /** The key the row edits, so a reveal lands on it. */
  axis?: string
  label: string
  value: string
  /** The engine's derived color while `value` is '' (any CSS color). */
  derived?: string
  onChange: (hex: string) => void
  /** Something to show before the value — a warning glyph. */
  status?: React.ReactNode
  /** Rows under the picker — settings that belong to this one color. */
  footer?: React.ReactNode
}) {
  const label = useRowLabel(labelProp)
  const auto = derived !== undefined && value === ""
  const [draft, setDraft] = useDraft<string | Color>(
    auto ? toHex(toOklch(derived)) : value,
  )
  const commit = (color: Color | null) =>
    color && onChange(color.toString("hex"))
  return (
    <ColorPicker value={draft} onChange={setDraft}>
      {({ color }) => (
        <div data-axis={axis} className={cn(DIAL_ROW, "relative pr-0")}>
          {/* Explicit children: the ColorPicker hands childless buttons a swatch. */}
          <RacButton
            className={cn(DIAL_PRESS, "absolute inset-0 rounded-[inherit]")}
          >
            <span className="sr-only">{label}</span>
          </RacButton>
          <span className={cn(DIAL_LABEL, "pointer-events-none relative")}>
            {label}
          </span>
          {/* The right cluster floats over the row button: it lets clicks
              through except on its own buttons. */}
          <span className="pointer-events-none relative flex items-center gap-2 pr-2.5">
            {status && <span className="pointer-events-auto">{status}</span>}
            <span className={cn(DIAL_VALUE, !auto && "uppercase")}>
              {auto ? "Auto" : color.toString("hex")}
            </span>
            <ColorSwatch className="size-4 rounded-full border border-fg/15" />
          </span>
          <PanelPopoverTitle.Provider value={label}>
            <ColorPickerPopover commit={commit}>
              <RowLabel.Provider value={undefined}>{footer}</RowLabel.Provider>
            </ColorPickerPopover>
          </PanelPopoverTitle.Provider>
        </div>
      )}
    </ColorPicker>
  )
}

interface DialOption {
  value: string
  label: React.ReactNode
}

/** The segmented choice itself; the moving pill is the only motion. `null`
 *  selects nothing — a view over values that disagree. */
function SegmentedGroup({
  label,
  value,
  onChange,
  options,
  disabled,
  className,
}: {
  label: string
  value: string | null
  /** `row`: the row the group sits in. */
  onChange: (value: string, row: Element | null) => void
  options: DialOption[]
  disabled?: readonly string[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <RacToggleButtonGroup
      ref={ref}
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={value === null ? [] : [value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next)
          onChange(next as string, ref.current?.closest("[data-axis]") ?? null)
      }}
      className={cn("relative flex shrink-0 p-0.5", className)}
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.value}
          id={option.value}
          isDisabled={disabled?.includes(option.value)}
          className="relative isolate flex h-7 flex-1 cursor-interactive items-center justify-center rounded-md px-2 text-[13px] font-medium text-fg/60 transition-colors outline-none hover:text-fg/90 focus-visible:focus-ring disabled:cursor-disabled disabled:opacity-40 pointer-coarse:h-8 pointer-coarse:min-w-11 selected:text-fg/95"
        >
          <SelectionIndicator className="pointer-events-none absolute inset-0 rounded-md bg-fg/10 duration-150 ease-out motion-safe:transition-[translate,width,height]" />
          <span className="relative z-10 flex items-center gap-1.5">
            {option.label}
          </span>
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
  )
}

/** Label left, a segmented choice right. */
export function DialSegmented({
  axis: key,
  label: labelProp,
  value: valueProp,
  onChange: onChangeProp,
  options,
}: {
  /** The key the row edits: value, change and hide follow it. */
  axis?: AxisKey
  label: string
  value?: string | null
  onChange?: (value: string) => void
  options: DialOption[]
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude: gate } = useAxisGate(key)
  if (hidden) return null
  // A row listing a subset (a Style's finishes) names a cause only for its own options.
  const exclude = gate?.options?.some((o) => options.some((x) => x.value === o))
    ? gate
    : undefined
  const value = valueProp !== undefined ? valueProp : String(axis?.effective)
  const set = onChangeProp ?? ((v: string) => axis?.set(v))
  if (pinned)
    return (
      <PinnedRow axis={key} label={label} cause={pinned}>
        {options.find((o) => o.value === value)?.label ?? value}
      </PinnedRow>
    )
  // Two options sit beside the label; more stack under it, sharing the width.
  const stacked = options.length > 2
  const group = (
    <SegmentedGroup
      label={label}
      value={value}
      onChange={(next, row) => {
        if (key) holdEditFocus(row)
        set(next)
      }}
      options={options}
      disabled={exclude?.options}
      className={stacked ? "w-full" : undefined}
    />
  )
  // The cause sits by the label: the options' own width is spoken for.
  const title = (
    <span className="flex min-w-0 items-center gap-2">
      <span className={DIAL_LABEL}>{label}</span>
      {exclude && <CauseChip cause={exclude.cause} />}
    </span>
  )
  if (stacked) {
    return (
      <div
        data-axis={key}
        className={cn(DIAL_ROW, "h-auto flex-col items-stretch gap-0 pb-1.5")}
      >
        <span className="flex h-9 items-center">{title}</span>
        {group}
      </div>
    )
  }
  return (
    <div data-axis={key} className={cn(DIAL_ROW, "pr-1.5")}>
      {title}
      {group}
    </div>
  )
}

const OFF_ON: DialOption[] = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
]

/** A boolean as Off / On. */
export function DialToggle({
  axis: key,
  label,
  value,
  onChange,
}: {
  /** The key the row edits, when `value` and `onChange` aren't given. */
  axis?: AxisKey
  label: string
  value?: boolean
  onChange?: (value: boolean) => void
}) {
  const axis = useAxis(key)
  const on = value ?? axis?.effective === true
  return (
    <DialSegmented
      axis={key}
      label={label}
      value={on ? "on" : "off"}
      onChange={(next) => (onChange ?? axis?.set)?.(next === "on")}
      options={OFF_ON}
    />
  )
}
