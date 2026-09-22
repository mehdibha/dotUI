"use client"

/* The panel's control language, after DialKit (dialkit.dev): 36px rows on a
   5% foreground surface, 8px radius, 6px apart; 13px/500 labels at 70%
   foreground, mono values on the right; a slider is its whole row; folders
   fold in place between hairlines. Alpha surfaces keep both themes in one
   set of classes. Folds are instant — chrome, not content. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { CheckIcon, ChevronDownIcon, RotateCcwIcon } from "lucide-react"
import type { Color } from "react-aria-components"
import {
  Button as RacButton,
  Disclosure,
  DisclosurePanel,
  ListBox as RacListBox,
  ListBoxItem as RacListBoxItem,
  SelectionIndicator,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { toHex, toOklch } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Dialog, DialogContent } from "@/registry/ui/dialog"

import { ColorPickerPopover, PanelPopover, useDraft } from "./rows"

export const DIAL_ROW =
  "flex h-9 w-full shrink-0 items-center justify-between gap-3 rounded-lg tint-5 px-3"
export const DIAL_PRESS =
  "cursor-interactive text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring pressed:tint-10"
export const DIAL_LABEL = "shrink-0 text-[13px] font-medium text-fg/70"
export const DIAL_VALUE =
  "truncate font-mono text-[13px] font-medium text-fg/70"
export const DIAL_CHEVRON = "size-4 shrink-0 text-fg/60"

/* ---------------------------------- Rows ---------------------------------- */

/** Label left, control right. */
export function DialRow({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(DIAL_ROW, className)}>
      <span className={DIAL_LABEL}>{label}</span>
      {children}
    </div>
  )
}

/** A break between row groups: rows sit 6px apart, groups 16px. */
export function DialGap() {
  return <div className="h-1" />
}

/** A row that opens something: label, its value, a chevron. Wraps the
 *  popover passed as `children` in a Dialog trigger. `chevron={false}` for
 *  values that end in a swatch: the swatch is the affordance, inset like
 *  DialColor's. */
export function DialTrigger({
  label,
  value,
  chevron = true,
  children,
}: {
  label: string
  value: React.ReactNode
  chevron?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <RacButton className={cn(DIAL_ROW, DIAL_PRESS, !chevron && "pr-2.5")}>
        <span className={DIAL_LABEL}>{label}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/70">
            {value}
          </span>
          {chevron && <ChevronDownIcon className={DIAL_CHEVRON} />}
        </span>
      </RacButton>
      {children}
    </Dialog>
  )
}

/** Keeps `data-scrollable` on a scroller current as its rows fold and unfold
 *  (observed as direct children); scroll-fade-b-in (styles.css) eases on it.
 *  The first measurement lands without easing — the popover is capped after
 *  it mounts, and its edge should be in place the frame it appears. */
function useScrollable() {
  return useCallback((node: HTMLElement | null) => {
    if (!node) return
    let first = true
    const observer = new ResizeObserver(() => {
      if (first) node.style.transition = "none"
      node.toggleAttribute(
        "data-scrollable",
        node.scrollHeight > node.clientHeight,
      )
      if (first) {
        void node.offsetHeight
        node.style.transition = ""
        first = false
      }
    })
    observer.observe(node)
    for (const child of node.children) observer.observe(child)
    return () => observer.disconnect()
  }, [])
}

/** What a DialTrigger opens: a run of dial rows beside the row. Capped to the
 *  panel by PanelPopover, it scrolls inside, fading at the bottom. */
export function DialPopover({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <PanelPopover className={cn("w-64 min-w-0", className)}>
      <DialogContent
        ref={useScrollable()}
        className="no-scrollbar flex scroll-fade-b-in flex-col gap-1.5 overflow-y-auto overscroll-contain p-2 [--scroll-fade-reveal:--spacing(6)] scroll-fade-8"
      >
        {children}
      </DialogContent>
    </PanelPopover>
  )
}

/* --------------------------------- Select --------------------------------- */

export interface DialSelectOption {
  value: string
  label: string
  /** A specimen beside the label — glyphs, a swatch. */
  preview?: React.ReactNode
}

/** A pick from a short list: the row shows the choice (and its specimen), the
 *  popover lists every option as a row. Picking keeps the popover up — the
 *  choice is a comparison against the preview behind it. */
export function DialSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: DialSelectOption[]
}) {
  const selected = options.find((option) => option.value === value)
  return (
    <DialTrigger
      label={label}
      value={
        <>
          <span className="truncate">{selected?.label ?? value}</span>
          {selected?.preview}
        </>
      }
    >
      <DialPopover>
        <RacListBox
          aria-label={label}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[value]}
          onSelectionChange={(keys) => {
            if (keys === "all") return
            const next = keys.values().next().value
            if (next) onChange(next as string)
          }}
          className="flex flex-col gap-1.5 outline-hidden"
        >
          {options.map((option) => (
            <RacListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className={cn(DIAL_ROW, DIAL_PRESS, "selected:tint-10")}
            >
              {({ isSelected }) => (
                <>
                  <span className={DIAL_LABEL}>{option.label}</span>
                  <span className="flex min-w-0 items-center gap-2 text-fg/70">
                    {option.preview}
                    <CheckIcon
                      className={cn(
                        "size-4 shrink-0 text-fg",
                        !isSelected && "invisible",
                      )}
                    />
                  </span>
                </>
              )}
            </RacListBoxItem>
          ))}
        </RacListBox>
      </DialPopover>
    </DialTrigger>
  )
}

/* --------------------------------- Slider --------------------------------- */

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

const REDUCED = "(prefers-reduced-motion: reduce)"
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(REDUCED)
      query.addEventListener("change", notify)
      return () => query.removeEventListener("change", notify)
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  )
}

/** Drags through a draft and commits on release. */
export function DialSlider({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  format,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
  format: (value: number) => string
}) {
  const [draft, setDraft] = useDraft(value)
  const reducedMotion = usePrefersReducedMotion()
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
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [interacting, setInteracting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = interacting || hovered

  const pointerDown = useRef<{ x: number; y: number } | null>(null)
  const isClick = useRef(true)
  const rect = useRef<DOMRect | null>(null)
  const committed = useRef(value)

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
    onChange(next)
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
    pointerDown.current = { x: e.clientX, y: e.clientY }
    isClick.current = true
    rect.current = wrapperRef.current?.getBoundingClientRect() ?? null
    setInteracting(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interacting || !pointerDown.current) return
    if (isClick.current) {
      const dx = e.clientX - pointerDown.current.x
      const dy = e.clientY - pointerDown.current.y
      if (Math.hypot(dx, dy) <= CLICK_THRESHOLD) return
      isClick.current = false
      setDragging(true)
    }
    stretchTo(stretchAt(e.clientX))
    const raw = valueAt(e.clientX)
    paint(toPct(raw))
    setDraft(round(raw))
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interacting) return
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
    onChange(next)
  }

  // The handle: hidden at rest, half-strength on hover, full while dragging,
  // and nearly gone where it would cross the label or the value.
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
      opacity: !active ? 0 : dodge ? 0.1 : dragging ? 0.9 : 0.5,
      x: active ? 1 : 0.25,
      y: active && dodge ? 0.75 : 1,
    })
  }, [active, dragging, pct])

  // Nine marks at each tenth, or one per step when the range has ten or fewer.
  const marks =
    steps <= 10
      ? Array.from(
          { length: Math.max(0, Math.round(steps) - 1) },
          (_, i) => ((i + 1) * step * 100) / range,
        )
      : Array.from({ length: 9 }, (_, i) => (i + 1) * 10)

  return (
    <div ref={wrapperRef} className="relative h-9 w-full shrink-0">
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
        className="group absolute inset-y-0 left-0 w-full cursor-interactive touch-none overflow-hidden rounded-lg tint-5 focus-reset select-none focus-visible:focus-ring"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={onKeyDown}
      >
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
            "pointer-events-none absolute inset-y-0 right-3 flex items-center tabular-nums transition-colors duration-150 group-focus-visible:text-fg group-data-active:text-fg",
          )}
        >
          {format(draft)}
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------- Color --------------------------------- */

/** Label, hex, swatch; the row opens the picker. With `derived`, an empty
 *  value reads "Auto" on the engine's color, and a reset appears once set. */
export function DialColor({
  label,
  value,
  derived,
  onChange,
  onReset,
  status,
  footer,
}: {
  label: string
  value: string
  /** The engine's derived color while `value` is '' (any CSS color). */
  derived?: string
  onChange: (hex: string) => void
  onReset?: () => void
  /** Something to show before the value — a warning glyph. */
  status?: React.ReactNode
  /** Rows under the picker — settings that belong to this one color. */
  footer?: React.ReactNode
}) {
  const auto = derived !== undefined && value === ""
  const [draft, setDraft] = useDraft<string | Color>(
    auto ? toHex(toOklch(derived)) : value,
  )
  const commit = (color: Color | null) =>
    color && onChange(color.toString("hex"))
  return (
    <ColorPicker value={draft} onChange={setDraft}>
      {({ color }) => (
        <div className={cn(DIAL_ROW, "relative pr-0")}>
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
            {onReset && !auto && (
              <RacButton
                aria-label={`Reset ${label} to auto`}
                onPress={onReset}
                className="pointer-events-auto flex size-5 cursor-interactive items-center justify-center rounded-md text-fg/60 focus-reset hover:text-fg focus-visible:focus-ring"
              >
                <RotateCcwIcon className="size-3.5" />
              </RacButton>
            )}
            <span className={cn(DIAL_VALUE, !auto && "uppercase")}>
              {auto ? "Auto" : color.toString("hex")}
            </span>
            <ColorSwatch className="size-4 rounded-full border border-fg/15" />
          </span>
          <ColorPickerPopover commit={commit}>{footer}</ColorPickerPopover>
        </div>
      )}
    </ColorPicker>
  )
}

/* -------------------------------- Segmented -------------------------------- */

export interface DialOption {
  value: string
  label: React.ReactNode
}

/** The segmented choice itself; the moving pill is the only motion. `null`
 *  selects nothing — a view over values that disagree. */
export function SegmentedGroup({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string
  value: string | null
  onChange: (value: string) => void
  options: DialOption[]
  className?: string
}) {
  return (
    <RacToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={value === null ? [] : [value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className={cn("relative flex shrink-0 p-0.5", className)}
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.value}
          id={option.value}
          className="relative isolate flex h-7 flex-1 cursor-interactive items-center justify-center rounded-md px-2 text-[13px] font-medium text-fg/60 focus-reset transition-colors hover:text-fg/90 focus-visible:focus-ring selected:text-fg/95"
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
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string | null
  onChange: (value: string) => void
  options: DialOption[]
}) {
  // Two options sit beside the label; more stack under it, sharing the width.
  const stacked = options.length > 2
  const group = (
    <SegmentedGroup
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      className={stacked ? "w-full" : undefined}
    />
  )
  if (stacked) {
    return (
      <div
        className={cn(DIAL_ROW, "h-auto flex-col items-stretch gap-0 pb-1.5")}
      >
        <span className={cn(DIAL_LABEL, "flex h-9 items-center")}>{label}</span>
        {group}
      </div>
    )
  }
  return (
    <div className={cn(DIAL_ROW, "pr-1.5")}>
      <span className={DIAL_LABEL}>{label}</span>
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
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <DialSegmented
      label={label}
      value={value ? "on" : "off"}
      onChange={(next) => onChange(next === "on")}
      options={OFF_ON}
    />
  )
}

/* --------------------------------- Folder --------------------------------- */

/** A titled group that folds in place. `open` makes it controlled; `value`
 *  summarizes the contents beside the chevron while folded. */
export function DialFolder({
  title,
  value,
  defaultOpen = true,
  open,
  onOpenChange,
  modified,
  id,
  children,
}: {
  title: string
  value?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modified?: boolean
  id?: string
  children: React.ReactNode
}) {
  return (
    <Disclosure
      data-folder={id}
      defaultExpanded={defaultOpen}
      isExpanded={open}
      onExpandedChange={onOpenChange}
      className="flex w-full shrink-0 flex-col"
    >
      {({ isExpanded }) => (
        <>
          <RacButton
            slot="trigger"
            className="flex h-9 w-full cursor-interactive items-center justify-between gap-2 rounded-md px-1 text-left focus-reset focus-visible:focus-ring"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[13px] font-semibold text-fg/70">
                {title}
              </span>
              {modified && (
                <span
                  aria-label="Modified"
                  className="size-1 rounded-full bg-accent"
                />
              )}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              {value && (
                <span className="truncate text-[13px] font-medium text-fg/50">
                  {value}
                </span>
              )}
              <ChevronDownIcon
                className={cn(
                  DIAL_CHEVRON,
                  "transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            </span>
          </RacButton>
          {/* Folders nest, so the state comes from the render prop, not a group. */}
          <DisclosurePanel
            className={cn(
              "h-(--disclosure-panel-height) overflow-clip duration-300 ease-fluid-out motion-safe:transition-[height,opacity]",
              isExpanded ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex flex-col gap-1.5 pb-2.5">{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
