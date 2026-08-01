'use client'

/* Control Lab rows — one visual language (compact row, label left, value +
   control right) applied to every interaction model the panel needs: triggers,
   drag surfaces, toggles, steppers, specimen grids, drill-in navigation, and
   the grouped-list container that fuses rows into cards.
   Prototype only: local state in, callback out, no design-system wiring. */

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import {
  Button as RacButton,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from 'react-aria-components'

import { FONT_CATALOG, fontStack } from '@/lib/fonts'
import type { FontCategory } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { Command } from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import { Disclosure, DisclosurePanel } from '@/registry/ui/disclosure'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/registry/ui/slider'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'
import {
  useLazyFontPreviews,
  useLoadedFamilies,
} from '@/modules/create/typography'

/* -------------------------------- Shared shell --------------------------- */

export const ROW = 'h-11 w-full rounded-xl bg-muted transition-colors'
export const ROW_TRIGGER = cn(
  ROW,
  'flex items-center justify-between gap-3 px-4 text-left hover:bg-highlight pressed:bg-highlight',
)
export const ROW_LABEL = 'truncate text-[0.8125rem] font-medium text-fg'
export const ROW_VALUE = 'truncate text-[0.8125rem] text-fg-muted'

/* ------------------------------ Control group ----------------------------- */

/**
 * Fuses adjacent rows into one card: shared surface, hairline separators,
 * only the group's corners round — the grouped-list look. Rows opt in by
 * carrying `data-row` on their surface element.
 */
export function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col divide-y divide-bg/50 overflow-hidden rounded-xl bg-muted **:data-row:rounded-none **:data-row:bg-transparent">
      {children}
    </div>
  )
}

/* ------------------------------ Group caption ----------------------------- */

/** iOS-style footnote under a group: one sentence of context for the axis. */
export function GroupCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pt-0.5 text-xs/relaxed text-pretty text-fg-muted">
      {children}
    </p>
  )
}

/* ------------------------------ Section header ---------------------------- */

/** A section marker: quiet uppercase label, modified dot, reset on the right. */
export function SectionHeader({
  label,
  modified,
  onReset,
  className,
}: {
  label: string
  modified?: boolean
  onReset?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'mt-3 flex h-7 items-center gap-1.5 px-1 first:mt-0',
        className,
      )}
    >
      <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      {modified && (
        <>
          <span
            aria-label="Modified"
            className="size-1 rounded-full bg-accent"
          />
          {onReset && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Reset ${label.toLowerCase()}`}
              onPress={onReset}
              className="ml-auto text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
        </>
      )}
    </div>
  )
}

/* -------------------------------- Action row ------------------------------- */

/** A verb as a row: centered label, accent for actions, danger for destructive. */
export function ActionRow({
  label,
  onPress,
  destructive,
}: {
  label: string
  onPress: () => void
  destructive?: boolean
}) {
  return (
    <RacButton
      data-row=""
      onPress={onPress}
      className={cn(
        ROW,
        'flex cursor-interactive items-center justify-center px-4 text-[0.8125rem] font-medium focus-reset hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight',
        destructive ? 'text-danger' : 'text-accent',
      )}
    >
      {label}
    </RacButton>
  )
}

/* -------------------------------- Drill-in row ----------------------------- */

/** A navigation row: label left, current value + chevron right, pushes a
 *  sub-panel. Depth lives here; the accordion handles breadth. */
export function DrillInRow({
  label,
  value,
  onPress,
}: {
  label: string
  value?: React.ReactNode
  onPress: () => void
}) {
  return (
    <RacButton
      data-row=""
      onPress={onPress}
      className={cn(
        ROW_TRIGGER,
        'cursor-interactive focus-reset focus-visible:focus-ring',
      )}
    >
      <span className={ROW_LABEL}>{label}</span>
      <span className="flex min-w-0 shrink-0 items-center gap-1.5">
        {value && <span className={ROW_VALUE}>{value}</span>}
        <ChevronRightIcon className="size-3.5 shrink-0 text-fg-muted" />
      </span>
    </RacButton>
  )
}

/* --------------------------------- Select -------------------------------- */

export interface SelectRowOption {
  value: string
  label: string
  /** Optional glyph shown before the label in the list and in the trigger. */
  icon?: React.ReactNode
}

/** A listbox trigger shaped as a settings row: label left, value + chevrons right. */
export function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectRowOption[]
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
      className="w-full"
    >
      <Button variant="quiet" data-row="" className={ROW_TRIGGER}>
        <span className={ROW_LABEL}>{label}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {selected?.icon && (
            <span className="text-fg-muted **:[svg]:size-3.5">
              {selected.icon}
            </span>
          )}
          <SelectValue className={cn(ROW_VALUE, 'text-right')} />
          <ChevronsUpDownIcon className="size-3.5 text-fg-muted" />
        </span>
      </Button>
      <Popover className="w-(--trigger-width)" placement="right top">
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value} textValue={opt.label}>
              <span className="flex items-center gap-2 **:[svg]:size-4">
                {opt.icon}
                {opt.label}
              </span>
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/* ------------------------------ Color picker ------------------------------ */

/** A color-picker trigger shaped as a settings row: label left, hex + swatch right. */
export function ColorPickerRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      {({ color }) => (
        <>
          <Button variant="quiet" data-row="" className={ROW_TRIGGER}>
            <span className={ROW_LABEL}>{label}</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <span className={cn(ROW_VALUE, 'font-mono uppercase')}>
                {color.toString('hex')}
              </span>
              <ColorSwatch className="size-5 rounded-full" />
            </span>
          </Button>
          <Popover placement="right top">
            <DialogContent className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider
                  orientation="vertical"
                  colorSpace="hsb"
                  channel="hue"
                  className="h-auto self-stretch"
                />
              </div>
              <ColorField aria-label="Hex" className="w-full">
                <Input size="sm" className="w-full" />
              </ColorField>
            </DialogContent>
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}

/* ------------------------------- Font picker ------------------------------ */

/** The searchable font list shared by every font trigger: search on top, the
 *  catalog grouped by category, each family previewed in its own lazily-loaded
 *  face. Must render inside a Select. */
export function FontListPopover({
  categories,
}: {
  categories: FontCategory[]
}) {
  const listRef = useLazyFontPreviews()
  return (
    <Popover
      className="w-(--trigger-width) outline-hidden"
      placement="right top"
    >
      <Command>
        <SearchField autoFocus aria-label="Search fonts">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search fonts..." />
            <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
              <Button variant="quiet" isIconOnly>
                <XIcon aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </SearchField>
        {/* The `display:contents` wrapper hands the lazy-preview observer the
            listbox scroll container (ListBox forwards no ref). */}
        <div ref={listRef} className="contents">
          <ListBox className="max-h-64 overflow-y-auto! overscroll-contain">
            {categories.map((category) => (
              <ListBoxSection key={category}>
                <ListBoxSectionHeader className="capitalize">
                  {category}
                </ListBoxSectionHeader>
                {FONT_CATALOG.filter((font) => font.category === category).map(
                  (font) => (
                    <ListBoxItem
                      key={font.family}
                      id={font.family}
                      textValue={font.family}
                    >
                      <span
                        data-preview-family={font.family}
                        style={{ fontFamily: fontStack(font.family) }}
                      >
                        {font.family}
                      </span>
                    </ListBoxItem>
                  ),
                )}
              </ListBoxSection>
            ))}
          </ListBox>
        </div>
      </Command>
    </Popover>
  )
}

/** A searchable font trigger shaped as a settings row: label left, the family
 *  itself set in its own typeface on the right — the row doubles as a specimen. */
export function FontPickerRow({
  label,
  categories,
  selectedKey,
  onChange,
}: {
  label: string
  categories: FontCategory[]
  selectedKey: string
  onChange: (family: string) => void
}) {
  useLoadedFamilies([selectedKey])
  return (
    <Select
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
    >
      <Button variant="quiet" data-row="" className={ROW_TRIGGER}>
        <span className={ROW_LABEL}>{label}</span>
        <span className="flex min-w-0 items-center gap-1.5">
          <SelectValue
            className={cn(ROW_VALUE, 'text-right')}
            style={{ fontFamily: fontStack(selectedKey) }}
          />
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </span>
      </Button>
      <FontListPopover categories={categories} />
    </Select>
  )
}

/* ---------------------------------- Slider --------------------------------- */

/** A full-bleed slider shaped as a settings row: the entire pill is the drag
 *  surface, label and value float on top, the fill reads as row progress. */
export function SliderRow({
  label,
  value,
  onChange,
  minValue = 0,
  maxValue = 1,
  step = 0.05,
  format = (v: number) => v.toFixed(2),
  trackStyle,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  format?: (value: number) => string
  /** Style the track from the current value — lets the control demo itself
   *  (e.g. the Radius row rounding its own corners as you drag). */
  trackStyle?: React.CSSProperties
}) {
  return (
    <Slider
      aria-label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => onChange(v as number)}
      className="relative w-full"
    >
      <SliderControl>
        <SliderTrack
          data-row=""
          className={cn(ROW, 'relative overflow-hidden')}
          style={trackStyle}
        >
          <SliderFill className="absolute inset-y-0 left-0 bg-highlight" />
        </SliderTrack>
        <SliderThumb className="absolute top-1/2 z-10 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/25" />
      </SliderControl>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4">
        <span className={ROW_LABEL}>{label}</span>
        <span className={cn(ROW_VALUE, 'font-mono tabular-nums')}>
          {format(value)}
        </span>
      </div>
    </Slider>
  )
}

/* ---------------------------------- Switch --------------------------------- */

/** A switch shaped as a settings row: the whole pill toggles, knob on the right. */
export function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Switch
      aria-label={label}
      size="sm"
      isSelected={value}
      onChange={onChange}
      className="w-full"
    >
      <SwitchControl data-row="" className={cn(ROW_TRIGGER, 'border-0')}>
        <span className={ROW_LABEL}>{label}</span>
        <SwitchIndicator className="bg-highlight selected:bg-accent" />
      </SwitchControl>
    </Switch>
  )
}

/* -------------------------------- Style grid ------------------------------- */

export interface StyleGridOption {
  id: string
  label: string
  /** Renders the option's mini specimen inside the card. */
  preview: React.ReactNode
}

/** The bare specimen grid — shared by the inline row and the expandable row. */
function StyleGrid({
  ariaLabel,
  value,
  onChange,
  options,
  columns = 2,
}: {
  ariaLabel: string
  value: string
  onChange: (id: string) => void
  options: StyleGridOption[]
  columns?: number
}) {
  return (
    <RacToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.id}
          id={option.id}
          aria-label={option.label}
          className="flex h-14 cursor-interactive items-center justify-center rounded-lg bg-bg/50 focus-reset transition-[background-color,transform] hover:bg-bg/75 focus-visible:focus-ring motion-safe:pressed:scale-[0.97] selected:bg-bg selected:inset-ring-2 selected:inset-ring-accent"
        >
          {option.preview}
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
  )
}

/**
 * A per-component style picker: a tall row whose body is a grid of selectable
 * cards, each showing the style as a mini specimen — pick by look, not name.
 */
export function StyleGridRow({
  label,
  value,
  onChange,
  options,
  columns,
}: {
  label: string
  value: string
  onChange: (id: string) => void
  options: StyleGridOption[]
  columns?: number
}) {
  const selected = options.find((o) => o.id === value)
  return (
    <div className="w-full rounded-xl bg-muted p-2">
      <div className="flex h-8 items-center justify-between px-2">
        <span className={ROW_LABEL}>{label}</span>
        <span className={ROW_VALUE}>{selected?.label}</span>
      </div>
      <StyleGrid
        ariaLabel={label}
        value={value}
        onChange={onChange}
        options={options}
        columns={columns}
      />
    </div>
  )
}

/* -------------------------------- Segmented -------------------------------- */

export interface SegmentedRowOption {
  value: string
  /** Text or an icon glyph. Icon-only segments must set `ariaLabel`. */
  label: React.ReactNode
  ariaLabel?: string
}

/** A segmented control shaped as a settings row: label left, joined pills right. */
export function SegmentedRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SegmentedRowOption[]
}) {
  return (
    <div
      data-row=""
      className={cn(ROW, 'flex items-center justify-between gap-3 pr-1.5 pl-4')}
    >
      <span className={ROW_LABEL}>{label}</span>
      <RacToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) onChange(next as string)
        }}
        className="flex h-8 shrink-0 items-center gap-0.5 rounded-lg bg-bg/50 p-0.5"
      >
        {options.map((option) => (
          <RacToggleButton
            key={option.value}
            id={option.value}
            aria-label={option.ariaLabel}
            className="flex h-7 cursor-interactive items-center rounded-md px-3 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring selected:bg-highlight selected:text-fg **:[svg]:size-3.5"
          >
            {option.label}
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
    </div>
  )
}

/* --------------------------------- Stepper --------------------------------- */

/** A numeric stepper shaped as a settings row: label left, − value + right. */
export function StepperRow({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  unit,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  unit?: string
}) {
  return (
    <NumberField
      aria-label={label}
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      className="w-full"
    >
      <div
        data-row=""
        className={cn(
          ROW,
          'flex items-center justify-between gap-3 pr-1.5 pl-4',
        )}
      >
        <span className={ROW_LABEL}>{label}</span>
        <div className="flex shrink-0 items-center gap-0.5">
          <NumberFieldDecrement
            variant="quiet"
            size="sm"
            className="rounded-lg bg-bg/50 hover:bg-bg/75"
          />
          <div className="flex items-baseline">
            <Input className="h-7 w-8 border-0 bg-transparent p-0 text-center text-[0.8125rem] tabular-nums" />
            {unit && <span className={cn(ROW_VALUE, 'text-xs')}>{unit}</span>}
          </div>
          <NumberFieldIncrement
            variant="quiet"
            size="sm"
            className="rounded-lg bg-bg/50 hover:bg-bg/75"
          />
        </div>
      </div>
    </NumberField>
  )
}

/* ------------------------------ Param controls ----------------------------- */

/** A quiet sub-row inside an expanded component panel: label left, control right. */
export function ParamRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-3 px-2">
      <span className="truncate text-xs text-fg-muted">{label}</span>
      {children}
    </div>
  )
}

/** A compact segmented control sized for ParamRow. */
export function MiniSegmented({
  ariaLabel,
  value,
  onChange,
  options,
}: {
  ariaLabel: string
  value: string
  onChange: (value: string) => void
  options: SegmentedRowOption[]
}) {
  return (
    <RacToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className="flex h-7 shrink-0 items-center gap-0.5 rounded-md bg-bg/50 p-0.5"
    >
      {options.map((option) => (
        <RacToggleButton
          key={option.value}
          id={option.value}
          aria-label={option.ariaLabel}
          className="flex h-6 cursor-interactive items-center rounded-[5px] px-2 text-xs text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring selected:bg-highlight selected:text-fg **:[svg]:size-3"
        >
          {option.label}
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
  )
}

/** A compact switch sized for ParamRow. */
export function MiniSwitch({
  ariaLabel,
  value,
  onChange,
}: {
  ariaLabel: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Switch
      aria-label={ariaLabel}
      size="sm"
      isSelected={value}
      onChange={onChange}
    >
      <SwitchControl>
        <SwitchIndicator className="bg-bg/50 selected:bg-accent" />
      </SwitchControl>
    </Switch>
  )
}

/* ----------------------------- Component row ------------------------------- */

/**
 * A component's entry in the panel: a collapsed pill (name + current style),
 * expanding in place to the style grid. The answer to "inline grid vs popover"
 * at 20+ components: grids exist, but only one at a time is open.
 */
export function ComponentRow({
  name,
  value,
  onChange,
  options,
  columns,
  defaultExpanded,
  children,
}: {
  name: string
  value: string
  onChange: (id: string) => void
  options: StyleGridOption[]
  columns?: number
  defaultExpanded?: boolean
  /** Per-component params (ParamRow items) rendered under the style grid. */
  children?: React.ReactNode
}) {
  const selected = options.find((o) => o.id === value)
  return (
    <Disclosure
      id={name}
      defaultExpanded={defaultExpanded}
      className="w-full rounded-xl bg-muted"
    >
      <RacButton
        slot="trigger"
        className={cn(
          ROW,
          'flex cursor-interactive items-center justify-between gap-3 px-4 focus-reset hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight',
        )}
      >
        <span className={ROW_LABEL}>{name}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={ROW_VALUE}>{selected?.label}</span>
          <ChevronDownIcon className="size-3.5 text-fg-muted transition-transform duration-200 group-expanded/disclosure:rotate-180" />
        </span>
      </RacButton>
      <DisclosurePanel className="text-inherit">
        <div className="flex flex-col gap-1 px-2">
          <StyleGrid
            ariaLabel={`${name} style`}
            value={value}
            onChange={onChange}
            options={options}
            columns={columns}
          />
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
