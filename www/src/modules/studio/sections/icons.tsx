"use client"

/* Icons — the library, and the one axis that library exposes: stroke width on
   line sets, weight on Phosphor. The library picker shows a wall of glyphs
   drawn by the library under the pointer, so the pick is made by look. */

import { memo, useRef, useState } from "react"
import type { ListBoxItemProps } from "react-aria-components"
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
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import {
  ICON_STROKE_WIDTH_VAR,
  LIBRARY_OPTIONS,
  STROKE_DEFAULTS,
  STROKE_RANGE,
  WEIGHT_OPTIONS,
} from "../axes/icons"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialSelect,
  DialSlider,
} from "../dial"
import { warmPreview } from "../live"
import { useOptionPreview } from "../option-preview"
import { PanelPopover, PanelPopoverTitle } from "../rows"
import type { Studio, StudioState } from "../state"

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
export function IconsPreview({ state }: { state: StudioState }) {
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
 *  selected one at rest. The preview follows too, its chunks warmed on open. */
const IconLibraryRow = memo(function IconLibraryRow({
  label,
  value,
  onChange,
  weight,
  stroke,
}: {
  label: string
  value: IconLibraryName
  onChange: (value: IconLibraryName) => void
  weight: PhosphorWeight
  stroke: number
}) {
  const [peek, setPeek] = useState<IconLibraryName | null>(null)
  const focused = useRef<IconLibraryName | null>(null)
  const shown = peek ?? value
  return (
    <RacSelect
      aria-label={label}
      value={value}
      onChange={(key) => key && onChange(key as IconLibraryName)}
      shouldCloseOnSelect={false}
      onOpenChange={(isOpen) => {
        if (isOpen)
          warmPreview({ icons: LIBRARY_OPTIONS.map((option) => option.value) })
        else setPeek(null)
      }}
    >
      <RacButton className={cn(DIAL_ROW, DIAL_PRESS)}>
        <span className={DIAL_LABEL}>{label}</span>
        <SelectValue className="truncate text-[13px] font-medium text-fg/60">
          {({ selectedText }) => selectedText}
        </SelectValue>
      </RacButton>
      <PanelPopoverTitle.Provider value={label}>
        <PanelPopover className="w-104 min-w-0">
          {/* Crossing to the wall keeps the peek; leaving falls back to the focused row. */}
          <div
            className="flex min-h-0 gap-1.5 overflow-y-auto overscroll-contain p-2"
            onPointerLeave={() => setPeek(focused.current)}
          >
            <ListBox className="w-36 shrink-0 p-0">
              {LIBRARY_OPTIONS.map((option) => {
                const library = option.value as IconLibraryName
                return (
                  <LibraryItem
                    key={library}
                    id={library}
                    label={option.label}
                    run={() => onChange(library)}
                    onHoverStart={() => setPeek(library)}
                    onFocusChange={(isFocused) => {
                      focused.current = isFocused ? library : null
                      setPeek(focused.current)
                    }}
                  />
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
})

function LibraryItem({
  id,
  label,
  run,
  ...props
}: {
  id: string
  label: string
  run: () => void
} & Pick<ListBoxItemProps, "onHoverStart" | "onFocusChange">) {
  const previewProps = useOptionPreview()
  return (
    <ListBoxItem id={id} textValue={label} {...previewProps(run)} {...props}>
      {label}
    </ListBoxItem>
  )
}

export function IconsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const library = state.iconLibrary as IconLibraryName
  const weight = state.iconWeight as PhosphorWeight
  const strokeDefault = STROKE_DEFAULTS[library]
  return (
    <>
      <IconLibraryRow
        label="Icon Library"
        value={library}
        onChange={set("iconLibrary")}
        weight={weight}
        stroke={state.iconStroke}
      />
      {/* Stroke only exists on line sets; Phosphor swaps it for weight. */}
      {strokeDefault !== undefined && (
        <DialSlider
          label="Stroke"
          value={state.iconStroke}
          onChange={set("iconStroke")}
          minValue={STROKE_RANGE.min}
          maxValue={STROKE_RANGE.max}
          step={STROKE_RANGE.step}
          format={(v) => v.toFixed(2)}
        />
      )}
      {library === "phosphor" && (
        <DialSelect
          label="Weight"
          value={state.iconWeight}
          onChange={set("iconWeight")}
          options={WEIGHT_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <Glyphs
                library="phosphor"
                weight={option.value as PhosphorWeight}
              />
            ),
          }))}
        />
      )}
    </>
  )
}
