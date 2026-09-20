"use client"

/* The panel's control language, after DialKit (dialkit.dev): 36px rows on a
   5% foreground surface, 8px radius, 6px apart; 13px/500 labels at 70%
   foreground, mono values on the right; a slider is its whole row; folders
   fold in place between hairlines. Alpha surfaces keep both themes in one
   set of classes. Folds are instant — chrome, not content. */

import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"
import type { Color } from "react-aria-components"
import {
  Button as RacButton,
  Disclosure,
  DisclosurePanel,
  SelectionIndicator,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { toHex, toOklch } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Popover } from "@/registry/ui/popover"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"

import {
  ColorPickerPopover,
  INSTANT_POPOVER,
  ROW_OVERLAY_PLACEMENT,
  useDraft,
} from "./rows"

export const DIAL_ROW =
  "flex h-9 w-full shrink-0 items-center justify-between gap-3 rounded-lg bg-fg/5 px-3"
export const DIAL_PRESS =
  "cursor-interactive text-left focus-reset transition-colors hover:bg-fg/10 focus-visible:focus-ring pressed:bg-fg/10"
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

/** A row that opens something: label, its value, a chevron. Wraps the
 *  popover passed as `children` in a Dialog trigger. */
export function DialTrigger({
  label,
  value,
  children,
}: {
  label: string
  value: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <RacButton className={cn(DIAL_ROW, DIAL_PRESS)}>
        <span className={DIAL_LABEL}>{label}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/70">
            {value}
          </span>
          <ChevronDownIcon className={DIAL_CHEVRON} />
        </span>
      </RacButton>
      {children}
    </Dialog>
  )
}

/** What a DialTrigger opens: a run of dial rows beside the row. */
export function DialPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover
      placement={ROW_OVERLAY_PLACEMENT}
      className={cn("w-64 min-w-0", INSTANT_POPOVER)}
    >
      <DialogContent className="flex flex-col gap-1.5 p-2">
        {children}
      </DialogContent>
    </Popover>
  )
}

/* --------------------------------- Slider --------------------------------- */

/** The row is the track: label and value float over the fill. Drags through a
 *  draft and commits on release. */
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
  return (
    <Slider
      aria-label={label}
      value={draft}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => setDraft(v as number)}
      onChangeEnd={(v) => onChange(v as number)}
      className="relative w-full shrink-0"
    >
      <SliderControl>
        <SliderTrack className="relative h-9 overflow-hidden rounded-lg bg-fg/5">
          <SliderFill className="absolute inset-y-0 left-0 bg-fg/10" />
        </SliderTrack>
        {/* The fill's edge is the handle; the thumb only shows for keyboard focus. */}
        <SliderThumb className="z-10 h-5 w-[3px] rounded-full bg-fg/90 opacity-0 focus-visible:opacity-100" />
      </SliderControl>
      <span
        className={cn(
          DIAL_LABEL,
          "pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          DIAL_VALUE,
          "pointer-events-none absolute inset-y-0 right-3 z-10 flex items-center tabular-nums",
        )}
      >
        {format(draft)}
      </span>
    </Slider>
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
          <span className="pointer-events-none relative flex items-center gap-2 pr-3">
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
            <ColorSwatch className="size-5 rounded-md border border-fg/15" />
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

/** Label left, a segmented choice right; the moving pill is the only motion. */
export function DialSegmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: DialOption[]
}) {
  // Two options sit beside the label; more stack under it, sharing the width.
  const stacked = options.length > 2
  const group = (
    <RacToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className={cn("relative flex shrink-0 p-0.5", stacked && "w-full")}
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.value}
          id={option.value}
          className={cn(
            "relative isolate flex h-7 cursor-interactive items-center rounded-md px-2 text-[13px] font-medium text-fg/60 focus-reset transition-colors hover:text-fg/90 focus-visible:focus-ring selected:text-fg/95",
            stacked && "flex-1 justify-center",
          )}
        >
          <SelectionIndicator className="pointer-events-none absolute inset-0 rounded-md bg-fg/10 duration-150 ease-out motion-safe:transition-[translate,width,height]" />
          <span className="relative z-10 flex items-center gap-1.5">
            {option.label}
          </span>
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
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

/** A titled group that folds in place. `open` makes it controlled. */
export function DialFolder({
  title,
  defaultOpen = true,
  open,
  onOpenChange,
  modified,
  id,
  children,
}: {
  title: string
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
      className="group/folder flex w-full shrink-0 flex-col"
    >
      <RacButton
        slot="trigger"
        className="flex h-9 w-full cursor-interactive items-center justify-between gap-2 rounded-md px-3 text-left focus-reset focus-visible:focus-ring"
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
        <ChevronDownIcon
          className={cn(
            DIAL_CHEVRON,
            "transition-transform duration-200 group-expanded/folder:rotate-180",
          )}
        />
      </RacButton>
      <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip opacity-0 duration-300 ease-fluid-out group-expanded/folder:opacity-100 motion-safe:transition-[height,opacity]">
        <div className="flex flex-col gap-1.5 pb-2.5">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  )
}
