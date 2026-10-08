"use client"

/* The panel's control language, after DialKit (dialkit.dev): 36px rows on a
   5% foreground surface, 8px radius, 6px apart; 13px/500 labels at 70%
   foreground, mono values on the right; a slider is its whole row; folders
   fold in place between hairlines. Alpha surfaces keep both themes in one
   set of classes. Folds are instant — chrome, not content. */

import { useContext, useEffect, useRef, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
} from "lucide-react"
import type { Color } from "react-aria-components"
import {
  Button as RacButton,
  Disclosure,
  DisclosurePanel,
  Label as RacLabel,
  ListBox as RacListBox,
  ListBoxItem as RacListBoxItem,
  Select as RacSelect,
  SelectionIndicator,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { toHex, toOklch } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"
import { Separator } from "@/registry/ui/separator"

import { effective, SCOPES } from "./axes"
import type { StudioState } from "./axes"
import { PlaceLabel, Row, RowLabel, useRowLabel } from "./family-page"
import {
  ColorPickerPopover,
  PanelPopover,
  PanelPopoverBoundary,
  PanelPopoverTitle,
  useDraft,
  useMedia,
} from "./rows"
import { useCurrent } from "./selection"
import { CauseChip, ChipButton, useAxis, useAxisGate } from "./use-axis"
import type { Axis, AxisKey } from "./use-axis"

export const DIAL_ROW =
  "flex h-9 w-full shrink-0 items-center justify-between gap-3 rounded-lg tint-5 px-3"
export const DIAL_PRESS =
  "cursor-interactive text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring pressed:tint-10"
export const DIAL_LABEL = "shrink-0 text-[13px] font-medium text-fg/70"
export const DIAL_VALUE =
  "truncate font-mono text-[13px] font-medium text-fg/70"
export const DIAL_CHEVRON = "size-4 shrink-0 text-fg/60"

/** The line under an option's label: its description, then its credits. */
export const subline = (option: {
  description?: string
  credits?: readonly string[]
}) =>
  [option.description, option.credits?.join(", ")]
    .filter(Boolean)
    .join(" — ") || undefined

/* ---------------------------------- Rows ---------------------------------- */

const SCOPED = new Set(Object.values(SCOPES).flat())

/** A cause chip; a family's own copy names its page ("Menus · None"). */
function Cause({ cause }: { cause: string }) {
  const place = useContext(PlaceLabel)(cause as AxisKey)
  return (
    <CauseChip cause={cause} place={SCOPED.has(cause) ? place : undefined} />
  )
}

/** A 16px SVG specimen beside a row's value or an option's label. */
export function DialGlyph({ children }: { children: React.ReactNode }) {
  return (
    <span data-slot="glyph" className="size-4 shrink-0 *:size-full">
      {children}
    </span>
  )
}

/** The accent dot beside anything that leaves its defaults. */
export function ModifiedDot() {
  return (
    <span
      role="img"
      aria-label="Modified"
      className="size-1 shrink-0 rounded-full bg-accent"
    />
  )
}

/** A row a rule holds: dimmed, its value set elsewhere, the cause beside it. */
export function PinnedRow({
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
        <span className="truncate text-[13px] font-medium text-fg/50">
          {children}
        </span>
        <Cause cause={cause} />
      </span>
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
 *  DialColor's. `holds` names keys edited inside, so a reveal lands here;
 *  `aside` (a cause chip) sits before the value, outside the trigger. */
export function DialTrigger({
  axis,
  holds,
  label: labelProp,
  value,
  aside,
  chevron = true,
  children,
}: {
  axis?: string
  holds?: readonly string[]
  label: string
  value: React.ReactNode
  aside?: React.ReactNode
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
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/70">
        {value}
      </span>
      {chevron && <ChevronDownIcon className={DIAL_CHEVRON} />}
    </span>
  )
  return (
    <Dialog>
      {aside ? (
        // A chip can't nest in the trigger: the trigger is laid under the row.
        <div
          {...row}
          className={cn(DIAL_ROW, "relative", !chevron && "pr-2.5")}
        >
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
          className={cn(DIAL_ROW, DIAL_PRESS, !chevron && "pr-2.5")}
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

/** What a DialTrigger opens: a run of dial rows beside the row, shown whole. */
export function DialPopover({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <PanelPopover className={cn("w-64 min-w-0", className)}>
      <DialogContent className="flex min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain p-2">
        {children}
      </DialogContent>
    </PanelPopover>
  )
}

/** A row that opens a page in place of the panel: label, value, a chevron. */
export function DialLink({
  label,
  value,
  onPress,
}: {
  label: string
  value: React.ReactNode
  onPress: () => void
}) {
  return (
    <RacButton onPress={onPress} className={cn(DIAL_ROW, DIAL_PRESS)}>
      <span className={DIAL_LABEL}>{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/70">
          {value}
        </span>
        <ChevronRightIcon className={DIAL_CHEVRON} />
      </span>
    </RacButton>
  )
}

/* --------------------------------- Select --------------------------------- */

/** The checked, unpickable item while a scoped copy overrides the key. */
const CUSTOM = "__custom"

/** Only DialSelect reads Custom: a global with scoped copies renders there. */
function assertUnscoped(key: string | undefined) {
  if (key && SCOPES[key])
    console.error(`${key} has scoped copies: render it with DialSelect`)
}

export interface DialSelectOption {
  value: string
  label: string
  /** A line under the label, in the popover, before the credits. */
  description?: string
  credits?: readonly string[]
  /** A specimen beside the label — glyphs, a swatch. */
  preview?: React.ReactNode
  /** The row's specimen, in place of `preview`. */
  glyph?: React.ReactNode
  /** Beside the label: a follow option's source chip. */
  aside?: React.ReactNode
}

/** A pick from a short list: the row shows the choice (and its specimen,
 *  unless the chapter title already carries it), the popover lists every
 *  option in the registry's own ListBox. Picking keeps the popover up — the
 *  choice is a comparison against the preview behind it. `children` are dial
 *  rows under the list, past a separator. While a family's scoped copy
 *  overrides the key the row reads Custom, and the overriding rows follow. */
export function DialSelect({
  axis: key,
  holds,
  label: labelProp,
  value: valueProp,
  onChange: onChangeProp,
  options,
  rowPreview = true,
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
  rowPreview?: boolean
  children?: React.ReactNode
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude, held, following } = useAxisGate(key)
  if (hidden) return null
  // A key read through a follow keeps its follow option picked ("Auto · Tone").
  const value = valueProp ?? String(following ? axis?.saved : axis?.effective)
  const onChange = onChangeProp ?? ((v: string) => axis?.set(v))
  const selected = options.find((option) => option.value === value)
  const resolved = following
    ? options.find((option) => option.value === String(axis?.effective))
    : undefined
  const shown = resolved ?? selected
  const custom = (axis?.overriders ?? []).length > 0
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
      aside={held && <Cause cause={held} />}
      value={
        custom ? (
          <>
            <span className="truncate">Custom</span>
            <ModifiedDot />
          </>
        ) : (
          <>
            <span className="truncate">
              {resolved ? (
                <>
                  <span className="capitalize">{following} · </span>
                  {resolved.label}
                </>
              ) : (
                (selected?.label ?? value)
              )}
            </span>
            {rowPreview && (shown?.glyph ?? shown?.preview)}
          </>
        )
      }
    >
      {/* A global's popover hosts its scoped copies' rows: room for their values. */}
      <PanelPopover
        className={cn("min-w-0", key && SCOPES[key] ? "w-72" : "w-64")}
      >
        <SelectBody
          axis={axis}
          label={label}
          value={value}
          onChange={onChange}
          options={options}
          exclude={exclude}
        >
          {children}
        </SelectBody>
      </PanelPopover>
    </DialTrigger>
  )
}

/** The options, then `children` and the overriding rows, kept until close. */
function SelectBody({
  axis,
  value,
  children,
  ...list
}: Omit<React.ComponentProps<typeof SelectOptions>, "custom"> & {
  children?: React.ReactNode
}) {
  const placeLabel = useContext(PlaceLabel)
  const overriders = axis?.overriders ?? []
  const [kept, setKept] = useState(overriders)
  const added = overriders.filter((k) => !kept.includes(k))
  const rows = [...kept, ...added]
  if (added.length > 0) setKept(rows)
  const custom = overriders.length > 0
  return (
    <DialogContent className="flex min-h-0 flex-col gap-0 overflow-y-auto overscroll-contain p-0">
      <SelectOptions
        {...list}
        axis={axis}
        value={custom ? CUSTOM : value}
        custom={custom}
      />
      {(children || rows.length > 0) && (
        <>
          <Separator />
          <div className="flex flex-col gap-1.5 p-2">
            {children}
            {rows.map((k) => (
              <Row key={k} axis={k} label={placeLabel(k)} />
            ))}
          </div>
        </>
      )}
    </DialogContent>
  )
}

/** The list; a follow option names and draws its target ("Same as Motion · Standard"). */
function SelectOptions({
  axis,
  label,
  value,
  onChange,
  options,
  exclude,
  custom,
}: {
  axis: Axis | undefined
  label: string
  value: string
  onChange: (value: string) => void
  options: DialSelectOption[]
  exclude: Axis["explain"]["exclude"]
  custom: boolean
}) {
  const { state } = useCurrent()
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
    <ListBox
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      disabledKeys={[...(exclude?.options ?? []), CUSTOM]}
      // The popover scrolls as one column; a nested list would collapse when docked.
      className="max-h-none shrink-0 overflow-visible"
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
    >
      {options.map((option) => {
        const to = target(option)
        const preview = option.preview ?? to?.preview
        const excluded = exclude?.options?.includes(option.value)
        return (
          <ListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            // The specimen sits beside the text, not under the description.
            className="has-[[slot=description]]:flex-row has-[[slot=description]]:items-center has-[[slot=description]]:gap-3"
          >
            <span className="flex min-w-0 flex-col">
              <ListBoxItemLabel>
                {to ? `${option.label} · ${to.label}` : option.label}
                {option.aside}
              </ListBoxItemLabel>
              {subline(option) && (
                <ListBoxItemDescription>
                  {subline(option)}
                </ListBoxItemDescription>
              )}
            </span>
            {(preview || excluded) && (
              <span className="ml-auto flex shrink-0 items-center gap-2">
                {excluded && exclude && <Cause cause={exclude.cause} />}
                {preview}
              </span>
            )}
          </ListBoxItem>
        )
      })}
      {custom && (
        <ListBoxItem id={CUSTOM} textValue="Custom">
          <ListBoxItemLabel>Custom</ListBoxItemLabel>
        </ListBoxItem>
      )}
    </ListBox>
  )
}

/* --------------------------------- Picks ---------------------------------- */

export interface DialPickOption {
  value: string
  label: string
  description?: string
  credits?: readonly string[]
  disabled?: boolean
  /** A muted aside on the label's line. */
  note?: string
  /** A specimen beside the label. */
  visual?: React.ReactNode
}

const PICK_ITEM =
  "flex cursor-interactive items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-left outline-hidden transition-colors hover:tint-5 focus-visible:tint-5 pressed:tint-10 disabled:cursor-disabled disabled:opacity-40"

function PickItem({
  option,
  modified,
  aside,
}: {
  option: DialPickOption
  modified?: boolean
  /** Beside the label: an excluded option's cause chip. */
  aside?: React.ReactNode
}) {
  return (
    <RacListBoxItem
      id={option.value}
      textValue={option.label}
      className={PICK_ITEM}
    >
      {({ isSelected }) => (
        <>
          <span className="flex min-w-0 items-center gap-3">
            {option.visual}
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-fg/90">
                {option.label}
                {modified && <ModifiedDot />}
                {option.note && (
                  <span className="truncate text-xs font-normal text-fg/45">
                    {option.note}
                  </span>
                )}
                {aside}
              </span>
              {subline(option) && (
                <span className="text-xs leading-snug text-fg/55">
                  {subline(option)}
                </span>
              )}
            </span>
          </span>
          <CheckIcon
            className={cn("mt-px size-4 shrink-0", !isSelected && "invisible")}
          />
        </>
      )}
    </RacListBoxItem>
  )
}

/** Options laid out in place, each with what it means. `value` undefined
 *  selects nothing; `modified` marks the option the state was edited from. */
export function DialPickList({
  label,
  value,
  onChange,
  options,
  modified,
}: {
  label: string
  value: string | undefined
  onChange: (value: string) => void
  options: DialPickOption[]
  modified?: string
}) {
  return (
    <RacListBox
      aria-label={label}
      selectionMode="single"
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className="-mx-0.5 flex flex-col gap-0.5 outline-hidden"
    >
      {options.map((option) => (
        <PickItem
          key={option.value}
          option={option}
          modified={option.value === modified}
        />
      ))}
    </RacListBox>
  )
}

/** A setting as a plain line, Linear's settings style: the label left, a
 *  compact picker right whose menu says what each option does. */
export function DialPicker({
  axis: key,
  label: labelProp,
  value: valueProp,
  onChange: onChangeProp,
  options,
}: {
  /** The key the row edits: value, change, hide and exclusions follow it. */
  axis?: AxisKey
  label: string
  value?: string
  onChange?: (value: string) => void
  options: DialPickOption[]
}) {
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude, held } = useAxisGate(key)
  if (hidden) return null
  const value = valueProp ?? String(axis?.effective)
  const onChange = onChangeProp ?? ((v: string) => axis?.set(v))
  const selected = options.find((option) => option.value === value)
  const excluded = new Set(exclude?.options)
  const cause = pinned ?? held
  return (
    <RacSelect
      data-axis={key}
      selectedKey={value}
      onSelectionChange={(k) => k !== null && onChange(String(k))}
      isDisabled={!!pinned}
      disabledKeys={[
        ...options.filter((o) => o.disabled).map((o) => o.value),
        ...excluded,
      ]}
      className="flex h-9 w-full shrink-0 items-center justify-between gap-3 pr-1 pl-3 disabled:*:opacity-50"
    >
      <RacLabel className={DIAL_LABEL}>{label}</RacLabel>
      <span className="flex min-w-0 items-center gap-1">
        {cause && <Cause cause={cause} />}
        <RacButton className="flex h-7 min-w-0 cursor-interactive items-center gap-1 rounded-md pr-1.5 pl-2 text-[13px] font-medium text-fg/80 focus-reset transition-colors hover:tint-5 focus-visible:focus-ring pressed:tint-10">
          <span className="truncate">{selected?.label ?? value}</span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg/50" />
        </RacButton>
      </span>
      <PanelPopoverBoundary.Provider value={null}>
        <PanelPopoverTitle.Provider value={label}>
          <PanelPopover
            placement="bottom end"
            offset={4}
            showArrow={false}
            className="w-64 min-w-0 overflow-y-auto p-1"
          >
            <RacListBox className="flex flex-col gap-0.5 outline-hidden">
              {options.map((option) => (
                <PickItem
                  key={option.value}
                  option={option}
                  aside={
                    excluded.has(option.value) &&
                    exclude && <Cause cause={exclude.cause} />
                  }
                />
              ))}
            </RacListBox>
          </PanelPopover>
        </PanelPopoverTitle.Provider>
      </PanelPopoverBoundary.Provider>
    </RacSelect>
  )
}

/** A full-bleed hairline between a popover's parts. */
export function DialSeparator() {
  return <div role="separator" className="-mx-2 my-1 h-px shrink-0 bg-fg/8" />
}

/** A page's main decision, every option in view: a titled list of rows, each
 *  a radio dot, the label and its specimen. */
export function DialList({
  axis: key,
  label,
  value: valueProp,
  onChange: onChangeProp,
  options,
}: {
  /** The key the list edits: value, change, hide and exclusions follow it. */
  axis?: AxisKey
  label: string
  value?: string
  onChange?: (value: string) => void
  options: DialSelectOption[]
}) {
  const { axis, hidden, exclude, following } = useAxisGate(key)
  if (hidden) return null
  const value = valueProp ?? String(following ? axis?.saved : axis?.effective)
  const onChange = onChangeProp ?? ((v: string) => axis?.set(v))
  return (
    <div data-axis={key} className="flex flex-col">
      <span className="flex h-9 items-center gap-2 px-1 text-xs font-medium text-fg/50">
        {label}
        {exclude && <Cause cause={exclude.cause} />}
      </span>
      <RacToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) onChange(next as string)
        }}
        orientation="vertical"
        className="flex flex-col gap-1"
      >
        {options.map((option) => (
          <RacToggleButton
            key={option.value}
            id={option.value}
            isDisabled={exclude?.options?.includes(option.value)}
            className="group/option flex min-h-10 w-full cursor-interactive items-center justify-between gap-3 rounded-lg tint-5 py-2 pr-2 pl-3 text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring disabled:cursor-disabled disabled:opacity-40 selected:tint-10 selected:inset-ring-1 selected:inset-ring-fg/25"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-3 shrink-0 rounded-full border border-fg/30 transition-[border-width] group-selected/option:border-4 group-selected/option:border-fg" />
              <span className="flex min-w-0 flex-col">
                <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-fg/85">
                  <span className="truncate">{option.label}</span>
                  {option.aside}
                </span>
                {subline(option) && (
                  <span className="truncate text-xs text-fg/50">
                    {subline(option)}
                  </span>
                )}
              </span>
            </span>
            {option.preview && (
              <span className="flex shrink-0 items-center gap-1.5 **:data-[slot=glyph]:size-5">
                {option.preview}
              </span>
            )}
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
    </div>
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
  assertUnscoped(row.axis)
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
      aside={exclude && <Cause cause={exclude.cause} />}
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
    if (down.touch) {
      const raw = touchValueAt(e.clientX)
      paint(toPct(raw))
      setDraft(round(raw))
      return
    }
    stretchTo(stretchAt(e.clientX))
    const raw = valueAt(e.clientX)
    paint(toPct(raw))
    setDraft(round(raw))
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
        className="group absolute inset-y-0 left-0 w-full cursor-interactive touch-pan-y overflow-hidden rounded-lg tint-5 focus-reset select-none focus-visible:focus-ring"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
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
            "pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 tabular-nums transition-colors duration-150 group-focus-visible:text-fg group-data-active:text-fg",
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

/* ---------------------------------- Color --------------------------------- */

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
  disabled,
  className,
}: {
  label: string
  value: string | null
  onChange: (value: string) => void
  options: DialOption[]
  disabled?: readonly string[]
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
          isDisabled={disabled?.includes(option.value)}
          className="relative isolate flex h-7 flex-1 cursor-interactive items-center justify-center rounded-md px-2 text-[13px] font-medium text-fg/60 focus-reset transition-colors hover:text-fg/90 focus-visible:focus-ring disabled:cursor-disabled disabled:opacity-40 pointer-coarse:h-8 pointer-coarse:min-w-11 selected:text-fg/95"
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
  assertUnscoped(key)
  const label = useRowLabel(labelProp)
  const { axis, hidden, pinned, exclude } = useAxisGate(key)
  if (hidden) return null
  const value = valueProp !== undefined ? valueProp : String(axis?.effective)
  const onChange = onChangeProp ?? ((v: string) => axis?.set(v))
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
      onChange={onChange}
      options={options}
      disabled={exclude?.options}
      className={stacked ? "w-full" : undefined}
    />
  )
  // The cause sits by the label: the options' own width is spoken for.
  const title = (
    <span className="flex min-w-0 items-center gap-2">
      <span className={DIAL_LABEL}>{label}</span>
      {exclude && <Cause cause={exclude.cause} />}
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

/* --------------------------------- Folder --------------------------------- */

/** A titled group that folds in place, instantly: chrome, not content.
 *  `open` makes it controlled; `value` summarizes the contents; `badge`
 *  counts what was edited inside. */
export function DialFolder({
  title,
  value,
  defaultOpen = true,
  open,
  onOpenChange,
  modified,
  badge = 0,
  children,
}: {
  title: string
  value?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modified?: boolean
  badge?: number
  children: React.ReactNode
}) {
  return (
    <Disclosure
      data-folder
      defaultExpanded={defaultOpen}
      isExpanded={open}
      onExpandedChange={onOpenChange}
      className="flex w-full shrink-0 flex-col"
    >
      {({ isExpanded }) => (
        <>
          <RacButton
            slot="trigger"
            data-folder-trigger
            className="flex h-9 w-full cursor-interactive items-center justify-between gap-2 rounded-lg px-3 text-left focus-reset transition-colors hover:tint-5 focus-visible:focus-ring"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className={DIAL_LABEL}>{title}</span>
              {modified && <ModifiedDot />}
              {badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-fg-on-accent tabular-nums">
                  {badge}
                  <span className="sr-only"> edited</span>
                </span>
              )}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              {value && (
                <span className="truncate text-[13px] font-medium text-fg/50">
                  {value}
                </span>
              )}
              <ChevronDownIcon
                className={cn(DIAL_CHEVRON, isExpanded && "rotate-180")}
              />
            </span>
          </RacButton>
          <DisclosurePanel>
            <div className="flex flex-col gap-1.5 pt-1.5">{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
