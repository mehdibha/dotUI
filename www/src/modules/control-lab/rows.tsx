"use client"

/* Control Lab rows — one visual language (compact row, label left, value +
   control right) applied to every interaction model the panel needs: triggers,
   drag surfaces, toggles, steppers, specimen grids, drill-in navigation, and
   the grouped-list container that fuses rows into cards.
   Prototype only: local state in, callback out, no design-system wiring. */

import { createContext, useContext, useState } from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Button as RacButton,
  ListBox as RacListBox,
  ListBoxItem as RacListBoxItem,
  SelectionIndicator,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { FONT_CATALOG, fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"
import { Command } from "@/registry/ui/command"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Disclosure, DisclosurePanel } from "@/registry/ui/disclosure"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Select, SelectValue } from "@/registry/ui/select"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import {
  useLazyFontPreviews,
  useLoadedFamilies,
} from "@/modules/create/typography"

/* -------------------------------- Shared shell --------------------------- */

export const ROW = "h-11 w-full rounded-xl bg-muted transition-colors"
export const ROW_TRIGGER = cn(
  ROW,
  "flex items-center justify-between gap-3 px-4 text-left hover:bg-highlight pressed:bg-highlight",
)
export const ROW_LABEL = "truncate text-[0.8125rem] font-medium text-fg"
export const ROW_VALUE = "truncate text-[0.8125rem] text-fg-muted"
/** What a fixed-height row becomes once it carries a description. */
export const ROW_DESCRIBED = "h-auto py-2.5"

/* Where row-attached overlays (pickers, selects, menus) open. Panel-lab's
   preview-rail draft overrides it to explore preview/popover combos. */
export type RowOverlayPlacement = "right top" | "left top" | "bottom start"
export const RowOverlayPlacementContext =
  createContext<RowOverlayPlacement>("right top")

/** The left column of a row: the label, and the line under it that says what
 *  the axis actually changes. Rows stay one line until a description arrives.
 *  `text-left` is explicit — stacked, the label stretches to the column width
 *  and would otherwise inherit a `<button>`'s centered text. */
export function RowLabel({
  label,
  description,
}: {
  label: string
  description?: string
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5 text-left">
      <span className={ROW_LABEL}>{label}</span>
      {description && (
        <span className="text-xs/snug text-pretty text-fg-muted">
          {description}
        </span>
      )}
    </span>
  )
}

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
        "mt-3 flex h-7 items-center gap-1.5 px-1 first:mt-0",
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
        "flex cursor-interactive items-center justify-center px-4 text-[0.8125rem] font-medium focus-reset hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight",
        destructive ? "text-danger" : "text-accent",
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
  description,
  value,
  onPress,
}: {
  label: string
  description?: string
  value?: React.ReactNode
  onPress: () => void
}) {
  return (
    <RacButton
      data-row=""
      onPress={onPress}
      className={cn(
        ROW_TRIGGER,
        "cursor-interactive focus-reset focus-visible:focus-ring",
        description && ROW_DESCRIBED,
      )}
    >
      <RowLabel label={label} description={description} />
      <span className="flex min-w-0 shrink-0 items-center gap-1.5">
        {value && <span className={ROW_VALUE}>{value}</span>}
        <ChevronRightIcon className="size-3.5 shrink-0 text-fg-muted" />
      </span>
    </RacButton>
  )
}

/* ------------------------------ Disclosure row ---------------------------- */

/**
 * A row that opens in place: label left, current value and chevron right, its
 * own rows inside. The panel's answer to depth that shouldn't cost a
 * sub-panel — DrillInRow pushes, this one unfolds.
 */
export function DisclosureRow({
  label,
  description,
  value,
  defaultExpanded,
  inset,
  children,
}: {
  label: string
  description?: string
  /** What the row reads back while collapsed. */
  value?: React.ReactNode
  defaultExpanded?: boolean
  /** Drops the content onto a recessed, hairlined surface — separates the
   *  panel from its rows when the flat look reads as one long card. */
  inset?: boolean
  children?: React.ReactNode
}) {
  return (
    <Disclosure
      id={label}
      defaultExpanded={defaultExpanded}
      className={cn(
        "w-full rounded-xl bg-muted",
        // The root owns the recessed surface; the header keeps its own row
        // fill and reads as raised on it, content rows clear theirs below.
        inset &&
          "bg-[color-mix(in_oklab,var(--color-card),var(--color-muted))]",
      )}
    >
      <RacButton
        slot="trigger"
        data-row=""
        className={cn(
          ROW_TRIGGER,
          "cursor-interactive focus-reset focus-visible:focus-ring",
          description && ROW_DESCRIBED,
        )}
      >
        <RowLabel label={label} description={description} />
        <span className="flex shrink-0 items-center gap-1.5">
          {value && <span className={ROW_VALUE}>{value}</span>}
          <ChevronDownIcon className="size-3.5 text-fg-muted transition-transform duration-200 group-expanded/disclosure:rotate-180" />
        </span>
      </RacButton>
      {/* `*:pb-0` cancels the panel's built-in bottom pad — spacing is owned
          here so content bottom matches the row insets. */}
      <DisclosurePanel className="text-inherit *:pb-0">
        {/* No inset either way: rows inside carry the trigger's own padding,
            so content shares the header's text edges on both sides. */}
        <div
          className={cn(
            "flex flex-col pb-2",
            // Symmetric padding: the raised header needs the same breathing
            // room above the content as below it.
            inset && "pt-2 **:data-row:bg-transparent",
          )}
        >
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

/* --------------------------------- Select -------------------------------- */

export interface SelectRowOption {
  value: string
  label: string
  /** Optional glyph shown before the label in the list and in the trigger. */
  icon?: React.ReactNode
  /** Grid layout only: the artwork drawn on the card. Falls back to `icon`. */
  illustration?: React.ReactNode
}

/** A listbox trigger shaped as a settings row: label left, value + chevrons right. */
export function SelectRow({
  label,
  description,
  value,
  onChange,
  options,
  layout = "list",
}: {
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: SelectRowOption[]
  /** `grid` swaps the dropdown list for illustrated cards — artwork on top,
   *  label below — with 2D arrow-key navigation. Pick by look, in a popover. */
  layout?: "list" | "grid"
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
      className="w-full"
    >
      <Button
        variant="quiet"
        data-row=""
        className={cn(ROW_TRIGGER, description && ROW_DESCRIBED)}
      >
        <RowLabel label={label} description={description} />
        <span className="flex shrink-0 items-center gap-1.5">
          {selected?.icon && (
            <span className="text-fg-muted **:[svg]:size-3.5">
              {selected.icon}
            </span>
          )}
          <SelectValue className={cn(ROW_VALUE, "text-right")} />
          <ChevronsUpDownIcon className="size-3.5 text-fg-muted" />
        </span>
      </Button>
      <Popover
        className="w-(--trigger-width)"
        placement={useContext(RowOverlayPlacementContext)}
      >
        {layout === "grid" ? (
          /* Raw RAC listbox: Select wires it up through context, and
             layout="grid" gives the cards real 2D arrow-key navigation. */
          <RacListBox
            layout="grid"
            className="grid max-h-[inherit] grid-cols-2 gap-2 overflow-auto p-2 outline-hidden"
          >
            {options.map((opt) => (
              <RacListBoxItem
                key={opt.value}
                id={opt.value}
                textValue={opt.label}
                className="flex min-w-0 cursor-interactive flex-col items-center gap-2 rounded-lg bg-muted p-4 text-fg-muted outline-hidden transition-transform select-none focus:bg-highlight focus:text-fg-on-highlight motion-safe:pressed:scale-[0.98] selected:text-fg selected:inset-ring selected:inset-ring-accent"
              >
                <span className="flex h-9 items-center justify-center text-fg **:[svg]:size-6">
                  {opt.illustration ?? opt.icon}
                </span>
                <span className="truncate text-xs">{opt.label}</span>
              </RacListBoxItem>
            ))}
          </RacListBox>
        ) : (
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
        )}
      </Popover>
    </Select>
  )
}

/* ------------------------------ Color picker ------------------------------ */

/** Hue-spaced seeds: one tap to a plausible brand before touching the area. */
const COLOR_PRESETS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
]

/** A color-picker trigger shaped as a settings row: label left, hex + swatch right. */
export function ColorPickerRow({
  label,
  description,
  layout = "row",
  value,
  onChange,
  ramp,
}: {
  label: string
  description?: string
  /** `tile` trades the row's width for height: the swatch becomes the face of
   *  the control, big enough to judge the color rather than identify it.
   *  `palette` keeps the row line and adds the resolved scale under it —
   *  the seed and what it becomes, in one trigger. Requires `ramp`. */
  layout?: "row" | "tile" | "palette"
  value: string
  onChange: (hex: string) => void
  /** The resolved scale the seed produces, lightest step first (`palette`). */
  ramp?: string[]
}) {
  const tile = layout === "tile"
  const palette = layout === "palette"
  const rowPlacement = useContext(RowOverlayPlacementContext)
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString("hex"))}>
      {({ color }) => (
        <>
          {tile ? (
            <Button
              variant="quiet"
              className="flex h-auto w-full items-center justify-between gap-3 rounded-xl bg-muted p-3 text-left hover:bg-highlight pressed:bg-highlight"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={ROW_LABEL}>{label}</span>
                <span className={cn(ROW_VALUE, "font-mono text-xs uppercase")}>
                  {color.toString("hex")}
                </span>
                {description && (
                  <span className="text-xs/snug text-pretty text-fg-muted">
                    {description}
                  </span>
                )}
              </span>
              <ColorSwatch className="size-5 shrink-0 rounded-full" />
            </Button>
          ) : palette ? (
            <Button
              variant="quiet"
              data-row=""
              className={cn(
                ROW,
                "flex h-auto flex-col items-stretch gap-2.5 px-4 py-3 text-left hover:bg-highlight pressed:bg-highlight",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <RowLabel label={label} description={description} />
                <span className="flex shrink-0 items-center gap-2.5">
                  <span className={cn(ROW_VALUE, "font-mono uppercase")}>
                    {color.toString("hex")}
                  </span>
                  <ColorSwatch className="size-5 rounded-full" />
                </span>
              </span>
              {/* Hairline: the near-white end would otherwise dissolve into
                  the row and the scale would look short. */}
              <span className="flex h-5 overflow-hidden rounded-full inset-ring-1 inset-ring-border/60">
                {ramp?.map((step, i) => (
                  <span
                    key={i}
                    className="flex-1"
                    style={{ background: step }}
                  />
                ))}
              </span>
            </Button>
          ) : (
            <Button
              variant="quiet"
              data-row=""
              className={cn(ROW_TRIGGER, description && ROW_DESCRIBED)}
            >
              <RowLabel label={label} description={description} />
              <span className="flex shrink-0 items-center gap-2.5">
                <span className={cn(ROW_VALUE, "font-mono uppercase")}>
                  {color.toString("hex")}
                </span>
                <ColorSwatch className="size-5 rounded-full" />
              </span>
            </Button>
          )}
          <Popover
            // A tile is as wide as the picker, so opening below it keeps the
            // two edges aligned; a row has no width to align to.
            placement={tile ? "bottom start" : rowPlacement}
            className="w-64 min-w-0"
          >
            <DialogContent className="flex flex-col gap-3 p-3">
              <ColorSwatchPicker className="justify-between gap-0">
                {COLOR_PRESETS.map((preset) => (
                  <ColorSwatchPickerItem
                    key={preset}
                    color={preset}
                    className="size-5 rounded-full ring-offset-2 ring-offset-popover before:hidden selected:ring-2 selected:ring-(--color)"
                  />
                ))}
              </ColorSwatchPicker>
              <ColorArea
                aria-label="Saturation and brightness"
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="w-full rounded-xl"
              />
              <ColorSlider
                aria-label="Hue"
                colorSpace="hsb"
                channel="hue"
                className="w-full"
              >
                <ColorSliderControl className="h-5 rounded-full" />
              </ColorSlider>
              <ColorField aria-label="Hex" className="w-full">
                <InputGroup size="sm" className="w-full">
                  <InputGroupAddon>
                    <ColorSwatch className="size-4 rounded-full" />
                  </InputGroupAddon>
                  <Input className="font-mono uppercase" />
                </InputGroup>
              </ColorField>
            </DialogContent>
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}

/* ----------------------------- Neutral picker ----------------------------- */

/**
 * A gray is not a free color — the engine models it as a hue to lean toward
 * plus how far to lean (D8), so those are the only two axes here: no area, no
 * spectrum, no hex. `hue: null` follows the brand, which is the engine default.
 */
export interface NeutralValue {
  hue: number | null
  /** Multiplier on the engine's tint peak; 0 is a pure gray. */
  tint: number
}

/** The far end of the tint slider: twice the engine's default lean. */
const MAX_TINT = 2

/** The untinted gray — an option with a name, not the absence of one. */
const PURE_GRAY = { id: "neutral", label: "Neutral" }

/**
 * The named gray families, in hue order: the swatch row, and the vocabulary
 * the row reads back as you scrub. Hues come from their references (Tailwind
 * stone 59°, zinc 286°, Radix olive 137°), spaced where those collide —
 * Radix mauve lands on 293°, on top of zinc, so it takes the 320° it reads as.
 */
const NEUTRAL_FAMILIES = [
  { id: "taupe", label: "Taupe", hue: 30 },
  { id: "stone", label: "Stone", hue: 60 },
  { id: "olive", label: "Olive", hue: 130 },
  { id: "mist", label: "Mist", hue: 250 },
  { id: "zinc", label: "Zinc", hue: 286 },
  { id: "mauve", label: "Mauve", hue: 320 },
]

/* A real neutral peaks around 0.016 chroma — invisible in a 20px dot or a
   5px track. The controls exaggerate it so the lean reads; the scale is true. */
const SAMPLE_CHROMA = 0.05
const sample = (hue: number, tint = MAX_TINT) =>
  `oklch(0.72 ${((SAMPLE_CHROMA * tint) / MAX_TINT).toFixed(4)} ${hue})`

/** Every gray there is, in hue order — the track you scrub for a direction. */
const HUE_TRACK = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => sample(i * 30),
).join(", ")})`

const circularDelta = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/** What to call the gray you landed on: the nearest named family. */
const nearestFamilyName = (hue: number) =>
  NEUTRAL_FAMILIES.reduce((best, option) =>
    circularDelta(option.hue, hue) < circularDelta(best.hue, hue)
      ? option
      : best,
  ).label

const GROUP_LABEL =
  "text-[11px] font-medium tracking-wider text-fg-muted uppercase"

/** A slider painted with the neutrals it selects between — the track is the
 *  swatch set, so nothing has to be named to be understood. */
function NeutralSlider({
  label,
  note,
  value,
  maxValue,
  step,
  track,
  thumb,
  onChange,
}: {
  label: string
  /** Where the value is coming from, when it isn't the user — e.g. the brand. */
  note?: string
  value: number
  maxValue: number
  step: number
  /** The gradient the track is painted with. */
  track: string
  /** The sample the thumb carries — the color at the current value. */
  thumb: string
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className={GROUP_LABEL}>{label}</span>
        {note && <span className="text-[11px] text-fg-muted">{note}</span>}
      </div>
      <Slider
        aria-label={label}
        value={value}
        minValue={0}
        maxValue={maxValue}
        step={step}
        onChange={(v) => onChange(v as number)}
        className="w-full"
      >
        <SliderControl>
          <SliderTrack
            className="h-5 rounded-full"
            style={{ background: track }}
          />
          <SliderThumb
            // Named on the thumb too: the group's label doesn't reach the
            // range input, which is what a screen reader lands on.
            aria-label={label}
            className="z-10 size-5 rounded-full border-2 border-thumb ring-1 ring-overlay/40"
            style={{ background: thumb }}
          />
        </SliderControl>
      </Slider>
    </div>
  )
}

/** Steps 50 / 200 / 400 / 600 / 800 — enough of the scale to recognise it. */
const TRIGGER_STEPS = [1, 3, 5, 7, 9]

/** The neutral as a row: its scale on the right, opening the two axes that
 *  produce it. The preview is the resolved scale, not a restatement of inputs. */
export function NeutralPickerRow({
  label = "Neutral",
  description,
  value,
  onChange,
  brandHue,
  ramp,
}: {
  label?: string
  description?: string
  value: NeutralValue
  onChange: (value: NeutralValue) => void
  /** The brand's OKLCH hue — what the `Brand` tint follows. */
  brandHue: number
  /** The resolved neutral scale, lightest step first. */
  ramp: string[]
}) {
  // Seven dots can't carry their names at 20px, so the Hue readout speaks for
  // whichever one you're pointing at.
  const [hovered, setHovered] = useState<string | null>(null)
  const hue = value.hue ?? brandHue
  const family =
    value.tint === 0
      ? PURE_GRAY.label
      : value.hue === null
        ? "From brand"
        : nearestFamilyName(value.hue)
  const preset =
    value.tint === 0
      ? PURE_GRAY.id
      : value.hue === null
        ? "brand"
        : NEUTRAL_FAMILIES.find((option) => option.hue === value.hue)?.id
  return (
    <Dialog>
      <Button
        variant="quiet"
        data-row=""
        className={cn(ROW_TRIGGER, description && ROW_DESCRIBED)}
      >
        <RowLabel label={label} description={description} />
        <span className="flex shrink-0 items-center gap-2.5">
          <span className={ROW_VALUE}>{family}</span>
          {/* Hairline: the near-black end of a dark ramp would otherwise
              dissolve into the row and the scale would look half as long. */}
          <span className="flex h-5 w-14 overflow-hidden rounded-full inset-ring-1 inset-ring-border/60">
            {TRIGGER_STEPS.map((step) => (
              <span
                key={step}
                className="flex-1"
                style={{ background: ramp[step] }}
              />
            ))}
          </span>
        </span>
      </Button>
      <Popover
        placement={useContext(RowOverlayPlacementContext)}
        className="w-64 min-w-0"
      >
        <DialogContent className="flex flex-col gap-3 p-3">
          {/* Seeds, same as the brand picker: one tap to a known gray family,
              then the sliders for anything between them. Tapping while flat
              also restores the lean, or the tap would do nothing visible. */}
          <RacToggleButtonGroup
            aria-label="Neutral presets"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={preset ? [preset] : []}
            onSelectionChange={(keys) => {
              const next = keys.values().next().value
              if (!next) return
              if (next === PURE_GRAY.id) return onChange({ ...value, tint: 0 })
              const picked = NEUTRAL_FAMILIES.find(
                (option) => option.id === next,
              )
              // A family tapped while flat also restores the lean, or the tap
              // would leave the same gray on screen.
              onChange({ hue: picked?.hue ?? null, tint: value.tint || 1 })
            }}
            className="flex justify-between"
          >
            {/* Auto is named, not a dot: following the brand is the default
                and a gray that quietly tracks another color has to say so. */}
            <RacToggleButton
              id="brand"
              onHoverStart={() => setHovered("From brand")}
              onHoverEnd={() => setHovered(null)}
              className="flex h-5 cursor-interactive items-center gap-1.5 rounded-full bg-bg/50 pr-2 pl-0.5 text-[11px] text-fg-muted focus-reset hover:text-fg focus-visible:focus-ring selected:text-fg selected:inset-ring-1 selected:inset-ring-accent"
            >
              <span
                className="size-4 rounded-full"
                style={{ background: sample(brandHue) }}
              />
              Auto
            </RacToggleButton>
            {[{ ...PURE_GRAY, hue: null }, ...NEUTRAL_FAMILIES].map(
              (option) => (
                <RacToggleButton
                  key={option.id}
                  id={option.id}
                  aria-label={option.label}
                  onHoverStart={() => setHovered(option.label)}
                  onHoverEnd={() => setHovered(null)}
                  style={{
                    background:
                      option.hue === null ? sample(0, 0) : sample(option.hue),
                  }}
                  className="size-5 cursor-interactive rounded-full focus-reset ring-offset-2 ring-offset-popover focus-visible:focus-ring selected:ring-2 selected:ring-accent"
                />
              ),
            )}
          </RacToggleButtonGroup>

          <NeutralSlider
            label="Hue"
            note={hovered ?? family}
            value={hue}
            maxValue={360}
            step={1}
            track={HUE_TRACK}
            thumb={sample(hue)}
            onChange={(next) => onChange({ ...value, hue: next })}
          />

          <NeutralSlider
            label="Tint"
            value={value.tint}
            maxValue={MAX_TINT}
            step={0.05}
            track={`linear-gradient(to right, ${sample(hue, 0)}, ${sample(hue)})`}
            thumb={sample(hue, value.tint)}
            onChange={(next) => onChange({ ...value, tint: next })}
          />

          <div className="flex h-6 overflow-hidden rounded-lg inset-ring-1 inset-ring-border/60">
            {ramp.map((step) => (
              <span
                key={step}
                className="flex-1"
                style={{ background: step }}
              />
            ))}
          </div>
        </DialogContent>
      </Popover>
    </Dialog>
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
      placement={useContext(RowOverlayPlacementContext)}
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
  description,
  categories,
  selectedKey,
  onChange,
}: {
  label: string
  description?: string
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
      <Button
        variant="quiet"
        data-row=""
        className={cn(ROW_TRIGGER, description && ROW_DESCRIBED)}
      >
        <RowLabel label={label} description={description} />
        <span className="flex min-w-0 items-center gap-1.5">
          <SelectValue
            className={cn(ROW_VALUE, "text-right")}
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
  description,
  value,
  onChange,
  minValue = 0,
  maxValue = 1,
  step = 0.05,
  format = (v: number) => v.toFixed(2),
  trackStyle,
  ticks,
}: {
  label: string
  /** Sits under the pill, not beside the label: the whole row is the drag
   *  surface here, so a second line inside it would be dragged, not read. */
  description?: string
  value: number
  onChange: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  format?: (value: number) => string
  /** Style the track from the current value — lets the control demo itself
   *  (e.g. the Radius row rounding its own corners as you drag). */
  trackStyle?: React.CSSProperties
  /** Values worth stopping at, marked on the track as faint dots. */
  ticks?: number[]
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
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
            className={cn(ROW, "relative overflow-hidden")}
            style={trackStyle}
          >
            <SliderFill className="absolute inset-y-0 left-0 bg-highlight" />
            {ticks?.map((tick) => (
              <span
                key={tick}
                className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/20"
                style={{
                  left: `${((tick - minValue) / (maxValue - minValue)) * 100}%`,
                }}
              />
            ))}
          </SliderTrack>
          <SliderThumb className="z-10 h-5 w-0.5 rounded-full bg-fg/25" />
        </SliderControl>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4">
          <span className={ROW_LABEL}>{label}</span>
          <span className={cn(ROW_VALUE, "font-mono tabular-nums")}>
            {format(value)}
          </span>
        </div>
      </Slider>
      {description && (
        <span className="px-4 text-xs/snug text-pretty text-fg-muted">
          {description}
        </span>
      )}
    </div>
  )
}

/* ---------------------------------- Switch --------------------------------- */

/** A switch shaped as a settings row: the whole pill toggles, knob on the right. */
export function SwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  /** One line on what the switch actually changes — for axes whose name isn't
   *  self-evident. The row grows to fit it; short labels stay one line. */
  description?: string
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
      <SwitchControl
        data-row=""
        className={cn(ROW_TRIGGER, "border-0", description && ROW_DESCRIBED)}
      >
        <RowLabel label={label} description={description} />
        <SwitchIndicator className="bg-highlight selected:bg-accent" />
      </SwitchControl>
    </Switch>
  )
}

/* ------------------------------- Option grid ------------------------------- */

export interface OptionGridItem {
  id: string
  label: string
  /** Renders the option's mini specimen inside the card. */
  preview: React.ReactNode
}

/** The bare specimen grid — shared by the inline row and the expandable row. */
function OptionGrid({
  ariaLabel,
  value,
  onChange,
  options,
  columns = 2,
  variant = "card",
}: {
  ariaLabel: string
  value: string
  onChange: (id: string) => void
  options: OptionGridItem[]
  columns?: number
  /** `plain` drops the card surface: specimens sit right on the panel. */
  variant?: "card" | "plain"
}) {
  return (
    // A listbox, not a toggle group: grid layout gives the cards 2-D arrow-key
    // navigation, which a ToggleButtonGroup (1-D) can't.
    <RacListBox
      aria-label={ariaLabel}
      layout="grid"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const next = keys.values().next().value
        if (next) onChange(next as string)
      }}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((option) => (
        <RacListBoxItem
          key={option.id}
          id={option.id}
          aria-label={option.label}
          textValue={option.label}
          className={cn(
            "relative flex min-w-0 cursor-interactive items-center justify-center rounded-lg p-4 focus-reset transition-transform after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-white/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 focus-visible:focus-ring motion-safe:pressed:scale-[0.98]",
            variant === "card"
              ? "bg-bg selected:inset-ring selected:inset-ring-accent"
              : "border border-border transition-[background-color,transform] selected:bg-white/10",
          )}
        >
          <span className="flex w-full min-w-0 items-center justify-center">
            {option.preview}
          </span>
        </RacListBoxItem>
      ))}
    </RacListBox>
  )
}

/**
 * A tall row whose body is a grid of selectable cards, each rendering its
 * option as a mini specimen — pick by look, not by name.
 */
export function OptionGridRow({
  label,
  description,
  value,
  onChange,
  options,
  columns,
  variant,
}: {
  label: string
  description?: string
  value: string
  onChange: (id: string) => void
  options: OptionGridItem[]
  columns?: number
  /** `plain` drops the card surface: specimens sit right on the panel. */
  variant?: "card" | "plain"
}) {
  const selected = options.find((o) => o.id === value)
  return (
    <div className="w-full rounded-xl bg-muted p-2">
      {/* mb-1 + the h-8 line box's slack ≈ the 10px header-to-content gap the
          palette row sets with gap-2.5; the described padding lands there too. */}
      <div
        className={cn(
          "mb-1 flex h-8 items-center justify-between gap-3 px-2",
          description && "h-auto py-1.5",
        )}
      >
        <RowLabel label={label} description={description} />
        <span className={ROW_VALUE}>{selected?.label}</span>
      </div>
      <OptionGrid
        ariaLabel={label}
        value={value}
        onChange={onChange}
        options={options}
        columns={columns}
        variant={variant}
      />
    </div>
  )
}

/* ------------------------------ Option pager ------------------------------- */

/** The step chevron shared by both arrow placements. */
function PagerArrowButton({
  direction,
  onPress,
}: {
  direction: -1 | 1
  onPress: () => void
}) {
  const Icon = direction === 1 ? ChevronRightIcon : ChevronLeftIcon
  return (
    <RacButton
      aria-label={direction === 1 ? "Next option" : "Previous option"}
      onPress={onPress}
      className="flex size-7 shrink-0 cursor-interactive items-center justify-center rounded-md text-fg-muted focus-reset transition-colors hover:bg-white/5 hover:text-fg focus-visible:focus-ring pressed:bg-white/10"
    >
      <Icon className="size-3.5" />
    </RacButton>
  )
}

/**
 * OptionGridRow's purpose in a single card: one option's specimen at a time,
 * chevrons stepping through the rest. Stepping is selecting — landing on an
 * option picks it — and the ends wrap. For sets too long for a grid.
 */
export function OptionPagerRow({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string
  description?: string
  value: string
  onChange: (id: string) => void
  options: OptionGridItem[]
}) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  )
  const selected = options[index]
  // The chevron pressed decides which side the incoming specimen enters from.
  const [direction, setDirection] = useState(1)
  const reducedMotion = useReducedMotion()
  const offset = reducedMotion ? 0 : direction * 60
  const step = (delta: number) => {
    const next = options[(index + delta + options.length) % options.length]
    if (next) {
      setDirection(delta)
      onChange(next.id)
    }
  }
  return (
    <div className="w-full rounded-xl bg-muted p-2">
      {/* Same 10px header-to-content rhythm as OptionGridRow. */}
      <div
        className={cn(
          "mb-1 flex h-8 items-center justify-between gap-3 px-2",
          description && "h-auto py-1.5",
        )}
      >
        <RowLabel label={label} description={description} />
        <span aria-live="polite" className={ROW_VALUE}>
          {selected?.label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PagerArrowButton direction={-1} onPress={() => step(-1)} />
        {/* The frame is the constant — specimens slide through it from the
            side of the chevron pressed; the accent dot below marks selection. */}
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg bg-bg p-4">
          <AnimatePresence initial={false} custom={offset} mode="popLayout">
            <motion.span
              key={selected?.id}
              custom={offset}
              variants={{
                enter: (o: number) => ({ x: `${o}%`, opacity: 0 }),
                center: { x: "0%", opacity: 1 },
                exit: (o: number) => ({ x: `${-o}%`, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="flex w-full min-w-0 items-center justify-center"
            >
              {selected?.preview}
            </motion.span>
          </AnimatePresence>
        </div>
        <PagerArrowButton direction={1} onPress={() => step(1)} />
      </div>
      <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
        {options.map((option) => (
          <span
            key={option.id}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out",
              option.id === value ? "w-3 bg-accent" : "w-1.5 bg-fg/20",
            )}
          />
        ))}
      </div>
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
  description,
  value,
  onChange,
  options,
}: {
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: SegmentedRowOption[]
}) {
  return (
    <div
      data-row=""
      className={cn(
        ROW,
        "flex items-center justify-between gap-3 px-4",
        description && ROW_DESCRIBED,
      )}
    >
      <RowLabel label={label} description={description} />
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
            className="relative isolate flex h-7 cursor-interactive items-center rounded-md px-3 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring selected:text-fg **:[svg]:size-3.5"
          >
            <SelectionIndicator className="pointer-events-none absolute inset-0 rounded-md bg-highlight duration-150 ease-out motion-safe:transition-[translate,width,height]" />
            <span className="relative z-10 flex items-center">
              {option.label}
            </span>
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
  description,
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  unit,
}: {
  label: string
  description?: string
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
          "flex items-center justify-between gap-3 px-4",
          description && ROW_DESCRIBED,
        )}
      >
        <RowLabel label={label} description={description} />
        <div className="flex shrink-0 items-center gap-0.5">
          <NumberFieldDecrement
            variant="quiet"
            size="sm"
            className="rounded-lg bg-bg/50 hover:bg-bg/75"
          />
          {/* Padded, not just gapped: the unit sits at the block's right edge,
              so without it the suffix would touch the increment button. */}
          <div className="flex items-baseline px-1.5">
            <Input className="h-7 w-8 border-0 bg-transparent p-0 text-center text-[0.8125rem] tabular-nums" />
            {unit && <span className={cn(ROW_VALUE, "text-xs")}>{unit}</span>}
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
          className="relative isolate flex h-6 cursor-interactive items-center rounded-[5px] px-2 text-xs text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring selected:text-fg **:[svg]:size-3"
        >
          <SelectionIndicator className="pointer-events-none absolute inset-0 rounded-[5px] bg-highlight duration-150 ease-out motion-safe:transition-[translate,width,height]" />
          <span className="relative z-10 flex items-center">
            {option.label}
          </span>
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
  description,
  value,
  onChange,
  options,
  columns,
  defaultExpanded,
  children,
}: {
  name: string
  description?: string
  value: string
  onChange: (id: string) => void
  options: OptionGridItem[]
  columns?: number
  defaultExpanded?: boolean
  /** Per-component params (ParamRow items) rendered under the style grid. */
  children?: React.ReactNode
}) {
  const selected = options.find((o) => o.id === value)
  return (
    <DisclosureRow
      label={name}
      description={description}
      value={selected?.label}
      defaultExpanded={defaultExpanded}
    >
      <div className="flex flex-col gap-1 px-2">
        <OptionGrid
          ariaLabel={`${name} style`}
          value={value}
          onChange={onChange}
          options={options}
          columns={columns}
        />
        {children}
      </div>
    </DisclosureRow>
  )
}
