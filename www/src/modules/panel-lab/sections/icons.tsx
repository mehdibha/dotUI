"use client"

/* Icons — the library, and the weight axis that library exposes. The hero is
   the set itself: real registry icons, so switching library actually swaps the
   glyphs rather than restyling a stand-in. */

import type { CSSProperties } from "react"

import * as registryIcons from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"
import { ControlGroup, SelectRow, SliderRow } from "@/modules/control-lab/rows"
import {
  ICON_STROKE_WIDTH_VAR,
  STROKE_DEFAULTS,
} from "@/modules/create/iconography"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const ICON_DEFAULTS = {
  iconLibrary: "lucide",
  iconStroke: 2,
  iconWeight: "regular",
}

const LIBRARY_OPTIONS = [
  { value: "lucide", label: "Lucide" },
  { value: "phosphor", label: "Phosphor" },
  { value: "tabler", label: "Tabler" },
  { value: "remix", label: "Remix" },
]

const WEIGHT_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "bold", label: "Bold" },
  { value: "fill", label: "Fill" },
  { value: "duotone", label: "Duotone" },
]

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
                } as CSSProperties)
              : undefined
          }
        >
          {children}
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

const SPECIMEN = [
  ["Home", registryIcons.HomeIcon],
  ["Search", registryIcons.SearchIcon],
  ["Heart", registryIcons.HeartIcon],
  ["Star", registryIcons.StarIcon],
  ["Bell", registryIcons.BellIcon],
  ["Mail", registryIcons.MailIcon],
  ["Calendar", registryIcons.CalendarIcon],
  ["Settings", registryIcons.SettingsIcon],
  ["User", registryIcons.UserIcon],
  ["Folder", registryIcons.FolderIcon],
  ["Camera", registryIcons.CameraIcon],
  ["Image", registryIcons.ImageIcon],
  ["Trash", registryIcons.TrashIcon],
  ["Pencil", registryIcons.PencilIcon],
  ["Share", registryIcons.ShareIcon],
  ["Download", registryIcons.DownloadIcon],
  ["Clock", registryIcons.ClockIcon],
  ["Copy", registryIcons.CopyIcon],
  ["Link", registryIcons.LinkIcon],
  ["Tag", registryIcons.TagIcon],
  ["Bookmark", registryIcons.BookmarkIcon],
  ["Message", registryIcons.MessageSquareIcon],
  ["Globe", registryIcons.GlobeIcon],
  ["Layers", registryIcons.LayersIcon],
] as const

/** Rows of real registry icons in the current library, stroke and weight. No
 *  inspect verb — the set itself is the specimen, so the space goes to more
 *  glyphs instead of a readout. */
function IconsHero({ state }: { state: LabState }) {
  const library = state.iconLibrary as IconLibraryName
  const weight =
    library === "phosphor" ? (state.iconWeight as PhosphorWeight) : undefined

  return (
    <Hero inset={false}>
      <IconScope
        library={library}
        weight={weight}
        stroke={state.iconStroke}
        className="grid w-full grid-cols-8 gap-0.5 p-2"
      >
        {SPECIMEN.map(([label, Icon]) => (
          <span
            key={label}
            className="flex aspect-square items-center justify-center rounded-lg text-fg"
          >
            <Icon size={16} />
          </span>
        ))}
      </IconScope>
    </Hero>
  )
}

export function IconsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <IconsHero state={state} />
      <ControlGroup>
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set("iconLibrary")}
          options={LIBRARY_OPTIONS}
        />
        {/* Stroke only exists on line-based sets; Phosphor swaps it for weight. */}
        {STROKE_DEFAULTS[state.iconLibrary as IconLibraryName] !==
          undefined && (
          <SliderRow
            label="Stroke"
            value={state.iconStroke}
            onChange={set("iconStroke")}
            minValue={1}
            maxValue={3}
            step={0.25}
            format={(v) => v.toFixed(2)}
          />
        )}
        {state.iconLibrary === "phosphor" && (
          <SelectRow
            label="Weight"
            value={state.iconWeight}
            onChange={set("iconWeight")}
            options={WEIGHT_OPTIONS}
          />
        )}
      </ControlGroup>
    </>
  )
}
