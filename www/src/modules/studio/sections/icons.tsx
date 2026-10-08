"use client"

/* Icons — the library, and the one axis that library exposes: stroke width on
   line sets, weight on Phosphor. The library picker shows a wall of glyphs
   drawn by the library under the pointer, so the pick is made by look. */

import { useRef, useState } from "react"
import {
  Button as RacButton,
  Select as RacSelect,
  SelectValue,
} from "react-aria-components"

import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
} from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"

import { ICON_STROKE_WIDTH_VAR, STROKE_RANGE } from "../axes/icons"
import { LIBRARY_OPTIONS, WEIGHT_OPTIONS } from "../axes/icons.meta"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialSelect,
  DialSlider,
} from "../dial"
import { Row, useRowLabel } from "../family-page"
import type { RowMap } from "../family-page"
import { PanelPopover, PanelPopoverTitle } from "../rows"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"

const SPECIMEN_ICONS = [
  SearchIcon,
  SettingsIcon,
  HeartIcon,
  BellIcon,
  HomeIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  CameraIcon,
  FolderIcon,
  SunIcon,
  TrashIcon,
]

/** Draws the registry icons inside it with `library`, at `weight` on
 *  Phosphor and `stroke` on line sets. */
function IconScope({
  library,
  weight,
  stroke,
  className,
  children,
}: {
  library: IconLibraryName
  weight?: PhosphorWeight
  stroke?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <IconLibraryContext.Provider value={library}>
      <IconWeightContext.Provider value={weight}>
        <span
          className={className}
          style={{ [ICON_STROKE_WIDTH_VAR]: stroke } as React.CSSProperties}
        >
          {children}
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

/** A strip of registry icons drawn by `library`. */
function Glyphs(props: {
  library: IconLibraryName
  weight?: PhosphorWeight
  stroke?: number
}) {
  return (
    <IconScope
      {...props}
      className="flex shrink-0 items-center gap-1.5 **:[svg]:size-4"
    >
      {SPECIMEN_ICONS.slice(0, 3).map((Icon, i) => (
        <Icon key={i} />
      ))}
    </IconScope>
  )
}

/** Beside the title: the strip as the library draws it. */
export function IconsPreview({ state }: { state: Effective }) {
  return (
    <Glyphs
      library={state.iconLibrary as IconLibraryName}
      weight={state.iconWeight as PhosphorWeight}
      stroke={state.iconStroke}
    />
  )
}

/** A select that stays open on pick: the libraries by name beside a wall of
 *  every specimen drawn by the one under the pointer or keyboard focus — the
 *  selected one at rest. */
function IconLibraryRow({ label: labelProp }: { label: string }) {
  const { effective, set } = useStudio()
  const label = useRowLabel(labelProp)
  const value = effective.iconLibrary as IconLibraryName
  const onChange = set("iconLibrary")
  const weight = effective.iconWeight as PhosphorWeight
  const stroke = effective.iconStroke
  const [peek, setPeek] = useState<IconLibraryName | null>(null)
  const focused = useRef<IconLibraryName | null>(null)
  const shown = peek ?? value
  return (
    <RacSelect
      aria-label={label}
      value={value}
      onChange={(key) => key && onChange(key as IconLibraryName)}
      shouldCloseOnSelect={false}
      onOpenChange={(isOpen) => !isOpen && setPeek(null)}
    >
      <RacButton data-axis="iconLibrary" className={cn(DIAL_ROW, DIAL_PRESS)}>
        <span className={DIAL_LABEL}>{label}</span>
        <SelectValue className="truncate text-[13px] font-medium text-fg/70">
          {({ selectedText }) => selectedText}
        </SelectValue>
      </RacButton>
      <PanelPopoverTitle.Provider value={label}>
        <PanelPopover className="w-112 min-w-0">
          {/* Crossing to the wall keeps the peek; leaving falls back to the focused row. */}
          <div
            className="flex min-h-0 gap-1.5 overflow-y-auto overscroll-contain p-2"
            onPointerLeave={() => setPeek(focused.current)}
          >
            <ListBox className="w-44 shrink-0 p-0">
              {LIBRARY_OPTIONS.map((option) => {
                const library = option.value as IconLibraryName
                return (
                  <ListBoxItem
                    key={library}
                    id={library}
                    textValue={option.label}
                    onHoverStart={() => setPeek(library)}
                    onFocusChange={(isFocused) => {
                      focused.current = isFocused ? library : null
                      setPeek(focused.current)
                    }}
                  >
                    <ListBoxItemLabel>{option.label}</ListBoxItemLabel>
                    <ListBoxItemDescription>
                      {option.credits?.join(", ")}
                    </ListBoxItemDescription>
                  </ListBoxItem>
                )
              })}
            </ListBox>
            {/* All walls stay mounted: chunks load on open, swaps never flash lucide. */}
            <div
              aria-hidden
              className="grid min-w-0 flex-1 rounded-lg tint-5 text-fg/80"
            >
              {LIBRARY_OPTIONS.map((option) => {
                const library = option.value as IconLibraryName
                return (
                  <IconScope
                    key={library}
                    library={library}
                    weight={library === "phosphor" ? weight : undefined}
                    stroke={library === value ? stroke : undefined}
                    className={cn(
                      "col-start-1 row-start-1 grid grid-cols-[repeat(4,auto)] grid-rows-[repeat(3,auto)] content-evenly justify-evenly **:[svg]:size-6",
                      library !== shown && "invisible",
                    )}
                  >
                    {SPECIMEN_ICONS.map((Icon, i) => (
                      <Icon key={i} />
                    ))}
                  </IconScope>
                )
              })}
            </div>
          </div>
        </PanelPopover>
      </PanelPopoverTitle.Provider>
    </RacSelect>
  )
}

const LibraryRow = () => <IconLibraryRow label="Icon Library" />

const StrokeRow = () => (
  <DialSlider
    axis="iconStroke"
    label="Stroke"
    minValue={STROKE_RANGE.min}
    maxValue={STROKE_RANGE.max}
    step={STROKE_RANGE.step}
    format={(v) => v.toFixed(2)}
  />
)

const WEIGHT_ROW_OPTIONS = WEIGHT_OPTIONS.map((option) => ({
  ...option,
  preview: (
    <Glyphs library="phosphor" weight={option.value as PhosphorWeight} />
  ),
}))

const WeightRow = () => (
  <DialSelect axis="iconWeight" label="Weight" options={WEIGHT_ROW_OPTIONS} />
)

export function IconsSection() {
  return (
    <>
      <Row axis="iconLibrary" />
      <Row axis="iconStroke" />
      <Row axis="iconWeight" />
    </>
  )
}

export const ROWS: RowMap = {
  iconLibrary: LibraryRow,
  iconStroke: StrokeRow,
  iconWeight: WeightRow,
}
