"use client"

/* The ideal Icons section — every option judged by look, on the real icon
   infrastructure. The specimen grid, the library rows and the weight segments
   all render through createIcon's contexts, so what you see IS the chosen
   library at the chosen stroke and weight — not a lucide stand-in.

   Axes: library (visible side-by-side compare), stroke (auto = the library's
   own default, drag to override), weight (Phosphor's variant axis) and size
   (a proposed global icon scale — flagged, not yet a builder axis). */

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import * as icons from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import { phosphorWeights } from "@/registry/icons/icon-map"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  GroupCaption,
  ROW_LABEL,
  ROW_TRIGGER,
  SegmentedRow,
  SliderRow,
} from "@/modules/control-lab/rows"
import {
  ICON_STROKE_WIDTH_VAR,
  STROKE_DEFAULTS,
} from "@/modules/create/iconography"

import type { Lab } from "../data"

/* --------------------------------- Scope ---------------------------------- */

/** Renders children as real icons of a library: context + stroke var in one. */
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
          style={
            stroke !== undefined
              ? ({
                  [ICON_STROKE_WIDTH_VAR]: String(stroke),
                } as React.CSSProperties)
              : undefined
          }
        >
          {children}
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

/* -------------------------------- Section --------------------------------- */

function useIcons(lab: Lab) {
  const { state } = lab
  const library = state.iconLibrary as IconLibraryName
  const strokeDefault = STROKE_DEFAULTS[library]
  const stroke = state.iconStrokeAuto ? (strokeDefault ?? 2) : state.iconStroke
  const weight =
    library === "phosphor" ? (state.iconWeight as PhosphorWeight) : undefined
  return { library, strokeDefault, stroke, weight }
}

/* -------------------------------- Specimen -------------------------------- */

const SPECIMEN = [
  ["Home", icons.HomeIcon],
  ["Search", icons.SearchIcon],
  ["Heart", icons.HeartIcon],
  ["Star", icons.StarIcon],
  ["Bell", icons.BellIcon],
  ["Mail", icons.MailIcon],
  ["Calendar", icons.CalendarIcon],
  ["Settings", icons.SettingsIcon],
  ["User", icons.UserIcon],
  ["Folder", icons.FolderIcon],
  ["Camera", icons.CameraIcon],
  ["Image", icons.ImageIcon],
  ["Trash", icons.TrashIcon],
  ["Pencil", icons.PencilIcon],
  ["Share", icons.ShareIcon],
  ["Download", icons.DownloadIcon],
  ["Globe", icons.GlobeIcon],
  ["Zap", icons.ZapIcon],
  ["Shield", icons.ShieldIcon],
  ["Eye", icons.EyeIcon],
  ["Tag", icons.TagIcon],
  ["Clock", icons.ClockIcon],
  ["Card", icons.CreditCardIcon],
  ["Message", icons.MessageSquareIcon],
] as const

/**
 * The section's opening visual: a full grid of real registry icons in the
 * current library/stroke/weight, plus an inspector footer — hover or focus any
 * glyph to read its name and see it at the four sizes components actually use.
 */
function IconSpecimen({ lab }: { lab: Lab }) {
  const { library, stroke, weight } = useIcons(lab)
  const scale = lab.state.iconScale
  // Star, not Search — a magnifier next to a name reads as a search field.
  const [inspected, setInspected] = useState(3)
  const [name, InspectedIcon] = SPECIMEN[inspected]!
  return (
    <IconScope
      library={library}
      weight={weight}
      stroke={stroke}
      className="flex w-full flex-col overflow-hidden rounded-xl bg-muted"
    >
      <div className="grid grid-cols-8 gap-0.5 p-2">
        {SPECIMEN.map(([label, Icon], i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onMouseEnter={() => setInspected(i)}
            onFocus={() => setInspected(i)}
            className={cn(
              "flex aspect-square cursor-interactive items-center justify-center rounded-lg text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring",
              i === inspected
                ? "bg-highlight text-fg"
                : "hover:bg-highlight/60",
            )}
          >
            <Icon size={Math.round(16 * scale)} />
          </button>
        ))}
      </div>
      <div className="flex h-11 items-center justify-between border-t border-bg/50 px-4">
        <span className="flex min-w-0 items-center gap-2 text-fg">
          <InspectedIcon size={Math.round(16 * scale)} className="shrink-0" />
          <span className="truncate text-xs font-medium">{name}</span>
        </span>
        {/* The four sizes components actually use — 12 / 16 / 20 / 24. */}
        <span className="flex shrink-0 items-center gap-3 text-fg-muted">
          {[12, 16, 20, 24].map((size) => (
            <InspectedIcon key={size} size={Math.round(size * scale)} />
          ))}
        </span>
      </div>
    </IconScope>
  )
}

/* ------------------------------ Library rows ------------------------------- */

const LIBRARIES: { name: IconLibraryName; label: string }[] = [
  { name: "lucide", label: "Lucide" },
  { name: "remix", label: "Remix" },
  { name: "tabler", label: "Tabler" },
  { name: "hugeicons", label: "Hugeicons" },
  { name: "phosphor", label: "Phosphor" },
]

/**
 * The library decision, made by comparison instead of a name in a popover:
 * every library is a row wearing its own live specimen, always visible, one
 * glance to compare. The selected row's specimen tracks stroke and weight;
 * the others sit at their library defaults — what you'd get by switching.
 */
function LibraryRows({ lab }: { lab: Lab }) {
  const { library, stroke, weight } = useIcons(lab)
  return (
    <RacToggleButtonGroup
      aria-label="Icon library"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[library]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) lab.set("iconLibrary")(next as string)
      }}
      className="flex w-full flex-col divide-y divide-bg/50 overflow-hidden rounded-xl bg-muted"
    >
      {LIBRARIES.map((lib) => {
        const selected = lib.name === library
        return (
          <RacToggleButton
            key={lib.name}
            id={lib.name}
            className={cn(
              ROW_TRIGGER,
              "cursor-interactive rounded-none bg-transparent focus-reset focus-visible:focus-ring",
            )}
          >
            <span className={ROW_LABEL}>{lib.label}</span>
            <span className="flex shrink-0 items-center gap-3">
              <IconScope
                library={lib.name}
                weight={selected ? weight : undefined}
                stroke={selected ? stroke : STROKE_DEFAULTS[lib.name]}
                className="flex items-center gap-2 text-fg-muted"
              >
                <icons.HomeIcon size={16} />
                <icons.SearchIcon size={16} />
                <icons.HeartIcon size={16} />
                <icons.SettingsIcon size={16} />
              </IconScope>
              <CheckIcon
                aria-hidden
                className={cn(
                  "size-3.5 text-accent",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </span>
          </RacToggleButton>
        )
      })}
    </RacToggleButtonGroup>
  )
}

/* --------------------------------- Weight ---------------------------------- */

/** Phosphor's weight axis as glyphs, not names — the same star at each weight. */
function WeightRow({ lab }: { lab: Lab }) {
  return (
    <SegmentedRow
      label="Weight"
      value={lab.state.iconWeight}
      onChange={lab.set("iconWeight")}
      options={phosphorWeights.map((weight) => ({
        value: weight,
        ariaLabel: weight,
        label: (
          <IconScope library="phosphor" weight={weight}>
            <icons.StarIcon size={14} />
          </IconScope>
        ),
      }))}
    />
  )
}

/* ---------------------------------- Body ----------------------------------- */

export function IdealIconsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const { library, strokeDefault, stroke } = useIcons(lab)
  return (
    <>
      <IconSpecimen lab={lab} />
      <LibraryRows lab={lab} />
      <ControlGroup>
        {/* Stroke only exists on line-based sets; Phosphor swaps it for weight. */}
        {strokeDefault !== undefined && (
          <SliderRow
            label="Stroke"
            value={stroke}
            onChange={(v) => {
              set("iconStroke")(v)
              set("iconStrokeAuto")(false)
            }}
            minValue={1}
            maxValue={3}
            step={0.25}
            format={(v) =>
              state.iconStrokeAuto ? `Auto · ${v.toFixed(2)}` : v.toFixed(2)
            }
          />
        )}
        {library === "phosphor" && <WeightRow lab={lab} />}
        <SliderRow
          label="Size"
          value={state.iconScale}
          onChange={set("iconScale")}
          minValue={0.8}
          maxValue={1.2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
        />
      </ControlGroup>
      <GroupCaption>
        Stroke follows the library until you drag it; Phosphor trades stroke for
        weights. Size scales every icon relative to text.
      </GroupCaption>
    </>
  )
}
