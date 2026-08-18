"use client"

/* Panel Lab patterns — controls invented for the full-panel recreation, built
   on the control-lab row language. If one earns its keep it graduates into
   control-lab/rows.tsx. Prototype only: local state in, callback out. */

import { useContext } from "react"
import { ChevronDownIcon, SearchIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorSlider } from "@/registry/ui/color-slider"
import { DialogContent } from "@/registry/ui/dialog"
import { Disclosure, DisclosurePanel } from "@/registry/ui/disclosure"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"
import {
  ROW,
  ROW_LABEL,
  ROW_VALUE,
  RowOverlayPlacementContext,
} from "@/modules/control-lab/rows"
import { useLoadedFamilies } from "@/modules/create/typography"

/* -------------------------------- Detail row ------------------------------- */

/**
 * Depth without navigation: a collapsed row summarizing its contents (swatch
 * dots, a value), expanding in place to sub-rows. The panel's answer to both
 * "status colors clutter" and "params-only components" — same pattern.
 */
export function DetailRow({
  label,
  summary,
  defaultExpanded,
  id,
  children,
}: {
  label: string
  /** What the collapsed row shows on the right — dots, a value, a count. */
  summary?: React.ReactNode
  defaultExpanded?: boolean
  /** Required when rendered inside a DisclosureGroup. */
  id?: string
  children: React.ReactNode
}) {
  return (
    <Disclosure
      id={id ?? label}
      defaultExpanded={defaultExpanded}
      className="w-full rounded-xl bg-muted"
    >
      <RacButton
        slot="trigger"
        className={cn(
          ROW,
          "flex cursor-interactive items-center justify-between gap-3 px-4 focus-reset hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight",
        )}
      >
        <span className={ROW_LABEL}>{label}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {summary && <span className={ROW_VALUE}>{summary}</span>}
          <ChevronDownIcon className="size-3.5 text-fg-muted transition-transform duration-200 group-expanded/disclosure:rotate-180" />
        </span>
      </RacButton>
      <DisclosurePanel className="text-inherit">
        <div className="flex flex-col px-2 pb-1.5">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  )
}

/* ------------------------------- Swatch dots ------------------------------- */

/** Collapsed-row summary for a set of colors: overlapping dots. */
export function SwatchDots({ colors }: { colors: string[] }) {
  return (
    <span className="flex items-center -space-x-1">
      {colors.map((color, i) => (
        <span
          key={i}
          className="size-3.5 rounded-full ring-2 ring-muted"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  )
}

/** A palette's color as a dot before an option label — an option that names a
 *  color should show it. */
export function PaletteDot({ color }: { color: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

/* ------------------------------ Mini color row ----------------------------- */

/** Shared picker popover body (area + hue + hex). */
export function PickerPopoverContent() {
  return (
    <Popover placement={useContext(RowOverlayPlacementContext)}>
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
  )
}

/* ------------------------------- Mini slider ------------------------------- */

/** A continuous axis at sub-row scale: label left, compact drag pill + value
 *  right — the engine's sliders in the mini-control language. */
export function MiniSliderRow({
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
  return (
    <div className="flex h-9 items-center justify-between gap-3 px-2">
      <span className="truncate text-xs text-fg-muted">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <Slider
          aria-label={label}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          onChange={(v) => onChange(v as number)}
          className="relative w-24"
        >
          <SliderControl>
            <SliderTrack className="relative h-5 overflow-hidden rounded-md bg-bg/50">
              <SliderFill className="absolute inset-y-0 left-0 bg-highlight" />
            </SliderTrack>
            <SliderThumb className="absolute top-1/2 z-10 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/25" />
          </SliderControl>
        </Slider>
        <span className="w-14 text-right font-mono text-xs text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </span>
    </div>
  )
}

/* ------------------------------ Type specimen ------------------------------ */

/** The Typography section's opening visual: the chosen faces, in use. */
export function TypeSpecimen({
  heading,
  body,
}: {
  heading: string
  body: string
}) {
  useLoadedFamilies([heading, body])
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-muted px-4 py-3">
      <span
        className="text-2xl/none font-semibold text-fg"
        style={{ fontFamily: fontStack(heading) }}
      >
        Ag
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className="truncate text-[0.8125rem]/tight font-semibold text-fg"
          style={{ fontFamily: fontStack(heading) }}
        >
          Almost before we knew it
        </span>
        <span
          className="truncate text-xs/tight text-fg-muted"
          style={{ fontFamily: fontStack(body) }}
        >
          we had left the ground.
        </span>
      </div>
    </div>
  )
}

/* -------------------------------- Filter row ------------------------------- */

/** Search shaped as a row — filters the component list as you type. */
export function FilterRow({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <SearchField value={value} onChange={onChange} aria-label={placeholder}>
      <InputGroup className={cn(ROW, "border-0 shadow-none")}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder={placeholder} className="text-[0.8125rem]" />
      </InputGroup>
    </SearchField>
  )
}
