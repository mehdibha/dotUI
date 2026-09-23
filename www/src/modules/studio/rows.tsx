"use client"

/* The panel's popover shell, and the pickers too specific for dial.tsx: the
   color seed, the neutral, the font list. Everything is controlled — value
   in, callback out. */

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react"
import { SearchIcon, XIcon } from "lucide-react"
import type { Color } from "react-aria-components"
import {
  composeRenderProps,
  OverlayTriggerStateContext,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { FONT_CATALOG, fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"
import { Command } from "@/registry/ui/command"
import { DialogContent } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover/base.popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Slider,
  SliderControl,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"
import { useLazyFontPreviews } from "@/modules/studio/fonts"

/** Where row-attached overlays open. */
const ROW_OVERLAY_PLACEMENT = "right top" as const

/* A popover sits off the panel's edge by the panel's own padding, not off its
   row: rows end at the padding, so the offset crosses it and the border. */
const PANEL_PADDING = 8
const PANEL_BORDER = 1
const PANEL_POPOVER_OFFSET = PANEL_PADDING + PANEL_BORDER + PANEL_PADDING

export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
/* Below `lg` the panel docks under the preview (or beside it, on short
   screens) and its popovers open over the dock, never the preview. */
export const DOCKED_QUERY = "(max-width: 1023px)"
export const useDocked = () => useMedia(DOCKED_QUERY)

/** The element panel popovers stay within — the panel's own height, so their
 *  edges line up with it. Unset (mobile sheet), they fall back to the viewport. */
export const PanelPopoverBoundary = createContext<Element | null>(null)

/** The docked panel's positioned wrapper, which docked popovers portal into. */
export const DockLayer = createContext<Element | null>(null)

/** The row a popover edits, named over it when docked — the sheet covers it. */
export const PanelPopoverTitle = createContext<string | null>(null)

function DockedTitle({ title }: { title: string }) {
  const state = useContext(OverlayTriggerStateContext)
  return (
    <div className="sticky top-0 z-40 flex h-9 shrink-0 items-center justify-between bg-card pr-1 pl-3">
      <span className="truncate text-sm font-medium text-fg">{title}</span>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label="Close"
        onPress={() => state?.close()}
        className="pointer-coarse:data-icon-only:size-9"
      >
        <XIcon />
      </Button>
    </div>
  )
}

/** Panel popovers open and close instantly — control feedback, not content —
 *  and wear the panel's own surface, raised: its card, hairline, radius and
 *  padding, never the design system's popover recipe (that lives in the
 *  preview). They show everything they hold: react-aria slides one that outgrows the
 *  room below its row up to fit the boundary. Its inline max-height is
 *  overridden so the box grows with its content — that growth is what
 *  react-aria observes to re-slide it; a capped box would never report it.
 *  The viewport cap is the last resort, where the content scrolls. Docked,
 *  the popover covers the dock's rows at its width, rising over the preview
 *  when it holds more, and names the row it edits. */
export function PanelPopover({
  className,
  placement = ROW_OVERLAY_PLACEMENT,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Popover>, "className"> & {
  className?: string
}) {
  const boundary = useContext(PanelPopoverBoundary)
  const layer = useContext(DockLayer)
  const title = useContext(PanelPopoverTitle)
  const docked = useDocked() && layer !== null
  return (
    <Popover
      placement={placement}
      boundaryElement={boundary ?? undefined}
      containerPadding={boundary ? 0 : undefined}
      offset={boundary ? PANEL_POPOVER_OFFSET : undefined}
      UNSTABLE_portalContainer={docked ? (layer ?? undefined) : undefined}
      showArrow={!docked}
      className={cn(
        "flex max-h-[calc(100dvh-24px)]! flex-col rounded-[14px] border-fg/6 bg-card shadow-lg transition-none will-change-auto [--panel-surface:var(--color-card)] before:hidden",
        className,
        docked &&
          "absolute! inset-x-0! w-auto! max-w-none! min-w-0! overflow-y-auto overscroll-contain [@media(max-height:500px)]:top-(--dock-chrome)! [@media(max-height:500px)]:bottom-0! [@media(max-height:500px)]:max-h-none! [@media(max-height:500px)]:rounded-t-none [@media(max-height:500px)]:border-t-0 [@media(min-height:501px)]:top-auto! [@media(min-height:501px)]:bottom-(--dock-chrome)! [@media(min-height:501px)]:max-h-[42svh]! [@media(min-height:501px)]:min-h-[calc(100%-var(--dock-chrome))] [@media(min-height:501px)]:rounded-b-none [@media(min-height:501px)]:border-b-0",
      )}
      {...props}
    >
      {docked && title
        ? composeRenderProps(children, (children) => (
            <>
              <DockedTitle title={title} />
              {children}
            </>
          ))
        : children}
    </Popover>
  )
}

/** The left column of a row: the label, and the line under it that says what
 *  the axis actually changes. Rows stay one line until a description arrives.
 *  `text-left` is explicit — stacked, the label stretches to the column width
 *  and would otherwise inherit a `<button>`'s centered text. */
/* ------------------------------- Group title ------------------------------ */

/** The line that opens a group: what the rows under it configure. Quieter than
 *  the chapter heading above it, and bound to its group — the margin sits on
 *  top, never between. */
export function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-2.5 px-1 text-xs font-medium text-fg-muted first:mt-0">
      {children}
    </span>
  )
}

/* ------------------------------- Drafting -------------------------------- */

/** A value the control owns while it's being dragged, reseeded whenever the
 *  committed prop changes from outside (preset switch, reset). Lets continuous
 *  controls commit once on release instead of on every frame. */
export function useDraft<T>(committed: T) {
  const [draft, setDraft] = useState(committed)
  const [seed, setSeed] = useState(committed)
  if (seed !== committed) {
    setSeed(committed)
    setDraft(committed)
  }
  return [draft, setDraft] as const
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
/** The seed picker's popover: presets, area, hue, hex. Discrete controls
 *  commit at once; the area and hue slider commit on release. */
export function ColorPickerPopover({
  commit,
  placement = ROW_OVERLAY_PLACEMENT,
  children,
}: {
  commit: (color: Color | null) => void
  placement?: React.ComponentProps<typeof Popover>["placement"]
  /** Rows under the hex field — settings that belong to this one color. */
  children?: React.ReactNode
}) {
  return (
    <PanelPopover placement={placement} className="w-64 min-w-0">
      <DialogContent className="flex flex-col gap-3 p-2 max-lg:shrink-0">
        <ColorSwatchPicker className="justify-between gap-0" onChange={commit}>
          {COLOR_PRESETS.map((preset) => (
            <ColorSwatchPickerItem
              key={preset}
              color={preset}
              className="size-5 rounded-full ring-offset-2 ring-offset-card before:hidden pointer-coarse:size-7 selected:ring-2 selected:ring-(--color)"
            />
          ))}
        </ColorSwatchPicker>
        <ColorArea
          aria-label="Saturation and brightness"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          onChangeEnd={commit}
          className="w-full rounded-xl max-lg:aspect-auto max-lg:h-28 max-lg:shrink-0"
        />
        <ColorSlider
          aria-label="Hue"
          colorSpace="hsb"
          channel="hue"
          onChangeEnd={commit}
          className="w-full"
        >
          <ColorSliderControl className="h-5 rounded-full" />
        </ColorSlider>
        <ColorField aria-label="Hex" onChange={commit} className="w-full">
          <InputGroup size="sm" className="w-full">
            <InputGroupAddon>
              <ColorSwatch className="size-4 rounded-full" />
            </InputGroupAddon>
            <Input className="font-mono uppercase" />
          </InputGroup>
        </ColorField>
        {children}
      </DialogContent>
    </PanelPopover>
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
  onChangeEnd,
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
  onChangeEnd: (value: number) => void
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
        onChangeEnd={(v) => onChangeEnd(v as number)}
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

/** What the row reads back: the family the committed value lands on. */
export function neutralFamily(value: NeutralValue, brandHue: number) {
  if (value.tint === 0) return PURE_GRAY.label
  if (value.hue === null) return "Auto"
  return nearestFamilyName(value.hue ?? brandHue)
}

/** Steps 50 / 200 / 400 / 600 / 800 — enough of the scale to recognise it. */
const TRIGGER_STEPS = [1, 3, 5, 7, 9]
/** Five steps of the resolved scale in a pill. Hairline: the near-black end
 *  of a dark ramp would otherwise dissolve into the row and the scale would
 *  look half as long. */
export function NeutralStrip({
  ramp,
  className,
}: {
  ramp: string[]
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex h-5 overflow-hidden rounded-full inset-ring-1 inset-ring-border/60",
        className,
      )}
    >
      {TRIGGER_STEPS.map((step) => (
        <span
          key={step}
          className="flex-1"
          style={{ background: ramp[step] }}
        />
      ))}
    </span>
  )
}

/** The neutral's popover: family seeds, then the hue and tint sliders. Must
 *  render inside a Dialog trigger. */
export function NeutralPickerPopover({
  value,
  onChange,
  brandHue,
  ramp,
}: {
  value: NeutralValue
  onChange: (value: NeutralValue) => void
  brandHue: number
  ramp: string[]
}) {
  // Seven dots can't carry their names at 20px, so the Hue readout speaks for
  // whichever one you're pointing at.
  const [hovered, setHovered] = useState<string | null>(null)
  // Sliders drag through drafts and commit on release: the neutral scale is
  // a full engine run, too slow to resolve per frame.
  const [hue, setHue] = useDraft(value.hue ?? brandHue)
  const [tint, setTint] = useDraft(value.tint)
  const family =
    tint === 0
      ? PURE_GRAY.label
      : value.hue === null && hue === brandHue
        ? "Auto"
        : nearestFamilyName(hue)
  const preset =
    value.tint === 0
      ? PURE_GRAY.id
      : value.hue === null
        ? "brand"
        : NEUTRAL_FAMILIES.find((option) => option.hue === value.hue)?.id
  return (
    <PanelPopover className="w-64 min-w-0">
      <DialogContent className="flex flex-col gap-3 p-2">
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
            const picked = NEUTRAL_FAMILIES.find((option) => option.id === next)
            onChange({ hue: picked?.hue ?? null, tint: value.tint || 1 })
          }}
          className="flex justify-between"
        >
          {/* Auto is named, not a dot: following the brand is the default
              and a gray that quietly tracks another color has to say so. */}
          <RacToggleButton
            id="brand"
            onHoverStart={() => setHovered("Auto")}
            onHoverEnd={() => setHovered(null)}
            className="flex h-5 cursor-interactive items-center gap-1.5 rounded-full bg-bg/50 pr-2 pl-0.5 text-[11px] text-fg-muted focus-reset hover:text-fg focus-visible:focus-ring pointer-coarse:h-7 selected:text-fg selected:inset-ring-1 selected:inset-ring-accent"
          >
            <span
              className="size-4 rounded-full"
              style={{ background: sample(brandHue) }}
            />
            Auto
          </RacToggleButton>
          {[{ ...PURE_GRAY, hue: null }, ...NEUTRAL_FAMILIES].map((option) => (
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
              className="size-5 cursor-interactive rounded-full focus-reset ring-offset-2 ring-offset-card focus-visible:focus-ring pointer-coarse:size-7 selected:ring-2 selected:ring-accent"
            />
          ))}
        </RacToggleButtonGroup>

        <NeutralSlider
          label="Hue"
          note={hovered ?? family}
          value={hue}
          maxValue={360}
          step={1}
          track={HUE_TRACK}
          thumb={sample(hue)}
          onChange={setHue}
          onChangeEnd={(next) => onChange({ ...value, hue: next })}
        />

        <NeutralSlider
          label="Tint"
          value={tint}
          maxValue={MAX_TINT}
          step={0.05}
          track={`linear-gradient(to right, ${sample(hue, 0)}, ${sample(hue)})`}
          thumb={sample(hue, tint)}
          onChange={setTint}
          onChangeEnd={(next) => onChange({ ...value, tint: next })}
        />

        <div className="flex h-6 overflow-hidden rounded-lg inset-ring-1 inset-ring-border/60">
          {ramp.map((step) => (
            <span key={step} className="flex-1" style={{ background: step }} />
          ))}
        </div>
      </DialogContent>
    </PanelPopover>
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
  // On touch, a focused field would raise the keyboard over the list.
  const finePointer = useMedia("(pointer: fine)")
  return (
    <PanelPopover className="w-(--trigger-width) outline-hidden">
      {/* Docked, the list fills the sheet over the field, which sits on the
          keyboard. */}
      <Command className="max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col-reverse">
        <SearchField autoFocus={finePointer} aria-label="Search fonts">
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
          <ListBox className="max-h-64 overflow-y-auto! overscroll-contain max-lg:max-h-none max-lg:min-h-0 max-lg:flex-1">
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
                      className="pointer-coarse:min-h-11"
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
    </PanelPopover>
  )
}
