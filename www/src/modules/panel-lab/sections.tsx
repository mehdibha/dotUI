"use client"

/* Panel Lab sections — each schema section rendered in the grouped-row
   language, composed by the frames in variants/. The Color section lives in
   color-ideal.tsx (engine-true, its own state slice). */

import { useState } from "react"
import type { CSSProperties } from "react"
import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CloudIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  RotateCcwIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"
import { DisclosureGroup } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import * as registryIcons from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Select } from "@/registry/ui/select"
import {
  ControlGroup,
  FontListPopover,
  FontPickerRow,
  GroupCaption,
  GroupTitle,
  MiniSegmented,
  ParamRow,
  ROW,
  ROW_LABEL,
  ROW_VALUE,
  SelectRow,
  SliderRow,
  StepperRow,
  SPECIMEN_BUTTON,
  SPECIMEN_FIELD,
  OptionGridRow,
  SegmentedControlRow,
} from "@/modules/control-lab/rows"
import {
  ICON_STROKE_WIDTH_VAR,
  STROKE_DEFAULTS,
} from "@/modules/create/iconography"
import { useLoadedFamilies } from "@/modules/create/typography"

import { MiniSliderRow } from "./color-ideal"
import {
  BUTTON_HOVER_OPTIONS,
  BUTTON_PRESS_OPTIONS,
  BUTTON_STYLES,
  BUTTON_TRANSITION_OPTIONS,
  CLUSTERS,
  CONTROL_SIZE_OPTIONS,
  CONTROL_SIZE_UNITS,
  CORNER_SHAPE_OPTIONS,
  CURSOR_DISABLED_OPTIONS,
  CURSOR_INTERACTIVE_OPTIONS,
  CURSOR_OPTIONS,
  DEFAULTS,
  DENSITY_FACTORS,
  DENSITY_OPTIONS,
  FOCUS_COLOR_OPTIONS,
  FOCUS_CONTROL_STYLE_OPTIONS,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_OFFSET_OPTIONS,
  GROUP_LAYOUT_OPTIONS,
  GROUP_SELECTED_OPTIONS,
  GROUP_SEPARATOR_OPTIONS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  INPUT_STYLES,
  RADIUS_PARAM_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "./data"
import type { Lab, LabState, ShapeRoleKey } from "./data"
import { Hero, HeroInspector, useInspect } from "./hero"
import { DetailRow, FilterRow, TypeSpecimen } from "./patterns"

export function TypographySectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <TypeSpecimen
        heading={state.headingFont || state.bodyFont}
        body={state.bodyFont}
      />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={["sans-serif", "serif", "display", "handwriting"]}
          selectedKey={state.headingFont || state.bodyFont}
          onChange={set("headingFont")}
        />
        <FontPickerRow
          label="Body"
          categories={["sans-serif", "serif"]}
          selectedKey={state.bodyFont}
          onChange={set("bodyFont")}
        />
        <FontPickerRow
          label="Mono"
          categories={["mono"]}
          selectedKey={state.monoFont}
          onChange={set("monoFont")}
        />
      </ControlGroup>
    </>
  )
}

/* ------------------------------- Type (v2) -------------------------------- */

type TypeProbeId = "heading" | "body" | "ui" | "code"

/* Hand-tuned ladder, not a modular ratio — every shipped system enumerates its
   steps. Offsets from base give 14/16/20/24/28 at base 16. */
const HEADING_STEPS = [-2, 0, 4, 8, 12]
const HERO_STEP = 12

/** A heading step in px: base plus the step's offset, scaled by the heading
 *  adjust (Radix's --heading-font-size-adjust). Body never takes it. */
function headingPx(state: LabState, step: number): number {
  return Math.round((state.typeBase + step) * state.headingAdjust * 10) / 10
}

const adjustLabel = (adjust: number) => `${Math.round(adjust * 100)}%`

const WEIGHT_OPTIONS = [
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
]

/* Linear's two buckets. Web tracking only ever tightens with size — no shipped
   system widens a heading. */
const TRACKING_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "tight", label: "Tight" },
  { value: "tighter", label: "Tighter" },
]

const TRACKING_EM: Record<string, string> = {
  normal: "0em",
  tight: "-0.012em",
  tighter: "-0.022em",
}

/** A role's live recipe — heading and body follow the scale axes, UI and code
 *  sizes are the section's constants. */
function typeRole(state: LabState, id: TypeProbeId) {
  switch (id) {
    case "heading":
      return {
        label: "Heading",
        family: state.headingFont || state.bodyFont,
        px: headingPx(state, HERO_STEP),
        weight: Number(state.headingWeight),
      }
    case "body":
      return {
        label: "Body",
        family: state.bodyFont,
        px: state.typeBase,
        weight: 400,
      }
    case "ui":
      return { label: "UI label", family: state.bodyFont, px: 13, weight: 500 }
    case "code":
      return { label: "Code", family: state.monoFont, px: 12, weight: 400 }
  }
}

/** Every text role the system ships, live in the chosen faces — heading, body,
 *  UI labels and code. Probes follow the hero contract: hover peeks a role's
 *  recipe, click pins it. */
function TypeHeroV2({ state }: { state: LabState }) {
  const { inspected, pinned, probeProps } = useInspect<TypeProbeId>()
  const heading = typeRole(state, "heading")
  const body = typeRole(state, "body")
  const ui = typeRole(state, "ui")
  const code = typeRole(state, "code")
  useLoadedFamilies([heading.family, body.family, code.family])

  const probeClass = (id: TypeProbeId) =>
    cn(
      "-mx-1 cursor-interactive rounded-md px-1 text-left focus-reset transition-colors focus-visible:focus-ring",
      pinned === id && "bg-muted",
    )
  const role = inspected ? typeRole(state, inspected) : null

  return (
    <Hero>
      <button
        type="button"
        aria-label="Inspect heading"
        {...probeProps("heading")}
        className={probeClass("heading")}
      >
        <span
          className="block text-balance text-fg"
          style={{
            fontFamily: fontStack(heading.family),
            fontSize: heading.px,
            fontWeight: heading.weight,
            letterSpacing: TRACKING_EM[state.headingTracking],
            lineHeight: 1.15,
          }}
        >
          Before we knew it
        </span>
      </button>
      <button
        type="button"
        aria-label="Inspect body"
        {...probeProps("body")}
        className={probeClass("body")}
      >
        <span
          className="block text-pretty text-fg-muted"
          style={{
            fontFamily: fontStack(body.family),
            fontSize: body.px,
            lineHeight: 1.6,
          }}
        >
          We had left the ground, and the city lights fell away beneath us.
        </span>
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Inspect UI label"
          {...probeProps("ui")}
          className={cn(probeClass("ui"), "shrink-0")}
        >
          <span
            className="flex h-7 items-center rounded-full bg-primary px-3.5 text-fg-on-primary"
            style={{
              fontFamily: fontStack(ui.family),
              fontSize: ui.px,
              fontWeight: ui.weight,
            }}
          >
            Get started
          </span>
        </button>
        <span
          className="flex h-7 shrink-0 items-center rounded-full border border-border-field px-3.5 text-fg"
          style={{
            fontFamily: fontStack(ui.family),
            fontSize: ui.px,
            fontWeight: ui.weight,
          }}
        >
          Learn more
        </span>
        <button
          type="button"
          aria-label="Inspect code"
          {...probeProps("code")}
          className={cn(probeClass("code"), "ml-auto shrink-0")}
        >
          <span
            className="flex h-6 items-center rounded-md bg-muted px-2 text-fg-muted"
            style={{
              fontFamily: fontStack(code.family),
              fontSize: code.px,
            }}
          >
            v2.4.0
          </span>
        </button>
      </div>
      {inspected && role && (
        <HeroInspector
          label={role.label}
          detail={`${role.family} · ${role.px}px · ${role.weight}`}
        />
      )}
    </Hero>
  )
}

/** The heading row mirrors the engine's --font-heading contract: absent ('')
 *  means Auto — the heading follows the body font until one is pinned. */
function AutoFontRow({
  label,
  value,
  derived,
  categories,
  onChange,
  onReset,
}: {
  label: string
  /** '' = Auto. */
  value: string
  /** The family followed while Auto. */
  derived: string
  categories: FontCategory[]
  onChange: (family: string) => void
  onReset: () => void
}) {
  const resolved = value || derived
  useLoadedFamilies([resolved])
  return (
    <div data-row="" className={cn(ROW, "flex items-center gap-0.5 pr-1.5")}>
      <Select
        className="h-full min-w-0 flex-1"
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(key as string)}
        aria-label={label}
      >
        <Button
          variant="quiet"
          className="flex h-full w-full items-center justify-between gap-3 rounded-none px-4 font-normal"
        >
          <span className={ROW_LABEL}>{label}</span>
          <span className="flex min-w-0 items-center gap-1.5">
            {!value && <span className={ROW_VALUE}>Auto ·</span>}
            <span
              className={cn(ROW_VALUE, "text-right")}
              style={{ fontFamily: fontStack(resolved) }}
            >
              {resolved}
            </span>
            <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
          </span>
        </Button>
        <FontListPopover categories={categories} />
      </Select>
      {value !== "" && (
        <Button
          size="xs"
          variant="quiet"
          isIconOnly
          aria-label={`Reset ${label} to auto`}
          onPress={onReset}
          className="shrink-0 text-fg-muted"
        >
          <RotateCcwIcon />
        </Button>
      )}
    </div>
  )
}

/** The scale as a glyph ramp — every step of the heading ladder, live. */
function ScaleLadder({ state }: { state: LabState }) {
  const heading = typeRole(state, "heading")
  return (
    <div className="flex items-baseline gap-3 overflow-hidden px-2 pt-1.5 pb-1">
      {HEADING_STEPS.map((step) => (
        <span
          key={step}
          className="text-fg"
          style={{
            fontFamily: fontStack(heading.family),
            fontSize: headingPx(state, step),
            fontWeight: heading.weight,
            letterSpacing: TRACKING_EM[state.headingTracking],
            lineHeight: 1,
          }}
        >
          Ag
        </span>
      ))}
    </div>
  )
}

export function TypographySectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const scaleModified =
    state.typeBase !== DEFAULTS.typeBase ||
    state.headingAdjust !== DEFAULTS.headingAdjust
  return (
    <>
      <TypeHeroV2 state={state} />
      <ControlGroup>
        <AutoFontRow
          label="Heading"
          value={state.headingFont}
          derived={state.bodyFont}
          categories={["sans-serif", "serif", "display", "handwriting"]}
          onChange={set("headingFont")}
          onReset={() => set("headingFont")("")}
        />
        <FontPickerRow
          label="Body"
          categories={["sans-serif", "serif"]}
          selectedKey={state.bodyFont}
          onChange={set("bodyFont")}
        />
        <FontPickerRow
          label="Mono"
          categories={["mono"]}
          selectedKey={state.monoFont}
          onChange={set("monoFont")}
        />
      </ControlGroup>
      <ControlGroup>
        <SegmentedControlRow
          label="Heading weight"
          value={state.headingWeight}
          onChange={set("headingWeight")}
          options={WEIGHT_OPTIONS}
        />
        <SegmentedControlRow
          label="Heading tracking"
          value={state.headingTracking}
          onChange={set("headingTracking")}
          options={TRACKING_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        Every heading level shares one weight and one tracking — body and UI
        text keep the font's own metrics.
      </GroupCaption>
      <DetailRow
        label="Scale"
        summary={
          scaleModified
            ? `${state.typeBase}px · ${adjustLabel(state.headingAdjust)}`
            : "Default"
        }
      >
        <ScaleLadder state={state} />
        <MiniSliderRow
          label="Base size"
          value={state.typeBase}
          onChange={set("typeBase")}
          minValue={14}
          maxValue={18}
          step={1}
          format={(v) => `${v}px`}
        />
        <MiniSliderRow
          label="Heading size"
          value={state.headingAdjust}
          onChange={set("headingAdjust")}
          minValue={0.9}
          maxValue={1.1}
          step={0.05}
          format={adjustLabel}
        />
      </DetailRow>
    </>
  )
}

const STRIP_ICONS = [
  HomeIcon,
  SearchIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  MailIcon,
  CalendarIcon,
  SettingsIcon,
  UserIcon,
  FolderIcon,
  CameraIcon,
  CloudIcon,
  LockIcon,
]

/** Live strip of the icon set at the chosen stroke — the section's specimen. */
export function IconStrip({ stroke }: { stroke: number }) {
  return (
    <div
      data-row=""
      className="flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl bg-muted [mask-image:linear-gradient(to_right,black_75%,transparent)] px-4 text-fg-muted"
    >
      {STRIP_ICONS.map((Icon, i) => (
        <Icon key={i} className="size-4 shrink-0" strokeWidth={stroke} />
      ))}
    </div>
  )
}

export function IconsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <ControlGroup>
        <IconStrip stroke={state.iconStroke} />
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set("iconLibrary")}
          options={ICON_LIBRARY_OPTIONS}
        />
        <SliderRow
          label="Stroke"
          value={state.iconStroke}
          onChange={set("iconStroke")}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
        {state.iconLibrary === "phosphor" && (
          <SelectRow
            label="Weight"
            value={state.iconWeight}
            onChange={set("iconWeight")}
            options={ICON_WEIGHT_OPTIONS}
          />
        )}
      </ControlGroup>
    </>
  )
}

/* ------------------------------- Icons (v2) ------------------------------- */

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

/** The Icons hero: rows of real registry icons in the current library, stroke
 *  and weight. No inspect verb — the set itself is the specimen, so the space
 *  goes to more glyphs instead of a readout. */
function IconSpecimen({ state }: { state: LabState }) {
  const library = state.iconLibrary as IconLibraryName
  const stroke = state.iconStroke
  const weight =
    library === "phosphor" ? (state.iconWeight as PhosphorWeight) : undefined

  return (
    <Hero inset={false}>
      <IconScope
        library={library}
        weight={weight}
        stroke={stroke}
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

export function IconsSectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <IconSpecimen state={state} />
      <ControlGroup>
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set("iconLibrary")}
          options={ICON_LIBRARY_OPTIONS}
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
            options={ICON_WEIGHT_OPTIONS}
          />
        )}
      </ControlGroup>
    </>
  )
}

export function ShapeSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <div className="flex flex-col gap-[var(--lab-gap-control,0.375rem)]">
        {/* Self-demo: the row's own corners round with the value. */}
        <SliderRow
          label="Radius"
          value={state.radius}
          onChange={set("radius")}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          trackStyle={{ borderRadius: `${4 + state.radius * 10}px` }}
        />
        <SegmentedControlRow
          label="Density"
          value={state.density}
          onChange={set("density")}
          options={DENSITY_OPTIONS}
        />
      </div>
    </>
  )
}

/* corner-shape is progressive enhancement — unsupported browsers render round. */
const cornerShapeStyle = (shape: string): CSSProperties =>
  shape === "round" ? {} : ({ cornerShape: shape } as CSSProperties)

/* --- Shape roles (the shadcn-study model: base scales, roles shape) --- */

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

/** A role's ratio of the base. Items on 'auto' ride one rung below Surfaces —
 *  the invariant every rounded shadcn style follows. */
function roleRatio(state: Lab["state"], key: ShapeRoleKey): number {
  const id = state[key]
  if (id === "auto") {
    const below = Math.max(0, rungIndex(state.roleSurface) - 1)
    return SHAPE_RUNGS[below]?.ratio ?? 0
  }
  return SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
}

function rolePxLabel(px: number, ratio: number): string {
  if (ratio === Infinity) return "pill"
  return `${Math.round(px * ratio * 10) / 10}px`
}

/* Preview geometry per role: nested arcs sharing one origin, controls boldest. */
const ROLE_ARCS: Record<
  ShapeRoleKey,
  { size: number; arc: string; dot: string }
> = {
  rolePanel: { size: 64, arc: "border-fg/25", dot: "bg-fg/25" },
  roleSurface: { size: 50, arc: "border-fg/40", dot: "bg-fg/40" },
  roleControl: { size: 36, arc: "border-fg/80", dot: "bg-fg/80" },
  roleItem: { size: 22, arc: "border-fg/55", dot: "bg-fg/55" },
}

function CornerPreview({ lab }: { lab: Lab }) {
  const { state } = lab
  return (
    <Hero className="flex-row items-center gap-5">
      <div className="relative size-16 shrink-0">
        {SHAPE_ROLES.map(({ key }) => {
          const { size, arc } = ROLE_ARCS[key]
          const ratio = roleRatio(state, key)
          const radius =
            ratio === Infinity ? size : Math.min(state.radiusPx * ratio, size)
          return (
            <div
              key={key}
              className={cn("absolute top-0 left-0 border-t-2 border-l-2", arc)}
              style={{
                width: size,
                height: size,
                borderTopLeftRadius: radius,
                ...cornerShapeStyle(state.cornerShape),
              }}
            />
          )
        })}
      </div>
      <div className="flex flex-1 flex-col gap-1 text-xs text-fg-muted">
        {SHAPE_ROLES.map(({ key, label, example }) => (
          <span key={key} className="flex items-baseline gap-2">
            <span
              className={cn(
                "size-1.5 shrink-0 self-center rounded-full",
                ROLE_ARCS[key].dot,
              )}
            />
            <span>{label}</span>
            <span className="flex-1 truncate text-[10px] text-fg-muted/70">
              {example}
            </span>
            <span className="font-mono text-fg tabular-nums">
              {rolePxLabel(state.radiusPx, roleRatio(state, key))}
            </span>
          </span>
        ))}
      </div>
    </Hero>
  )
}

/** Mini specimen for a character card: its surface + control corners nested,
 *  echoing the section's corner preview. */
function CharacterGlyph({ vector }: { vector: Record<ShapeRoleKey, string> }) {
  const arc = (id: string, size: number) => {
    const ratio = SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
    return ratio === Infinity ? size : Math.min(ratio * 8, size)
  }
  return (
    <div className="relative size-6">
      <div
        className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-fg/40"
        style={{ borderTopLeftRadius: arc(vector.roleSurface, 24) }}
      />
      <div
        className="absolute top-0 left-0 size-3.5 border-t-2 border-l-2 border-fg/80"
        style={{ borderTopLeftRadius: arc(vector.roleControl, 14) }}
      />
    </div>
  )
}

const CHARACTER_OPTIONS = SHAPE_CHARACTERS.map((character) => ({
  id: character.id,
  label: character.label,
  preview: <CharacterGlyph vector={character.vector} />,
}))

/** The character whose vector matches the current roles, if any. */
function activeCharacter(state: Lab["state"]): string {
  const match = SHAPE_CHARACTERS.find((character) =>
    SHAPE_ROLES.every(({ key }) => character.vector[key] === state[key]),
  )
  return match?.id ?? ""
}

/* v2: both radius levers from the shadcn study. The base slider scales the
   whole system (--radius); Character retargets the four radius roles — the
   rung vector where a style's identity actually lives. Fine-tune exposes the
   roles directly; corner shape is its own axis. Density lives in Space. */
export function ShapeSectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const autoRatio =
    SHAPE_RUNGS[Math.max(0, rungIndex(state.roleSurface) - 1)]?.ratio ?? 0
  const rungOptions = (allowAuto: boolean) => [
    ...(allowAuto
      ? [
          {
            value: "auto",
            label: `Auto · ${rolePxLabel(state.radiusPx, autoRatio)}`,
          },
        ]
      : []),
    ...SHAPE_RUNGS.map(({ id, label, ratio }) => ({
      value: id,
      label: `${label} · ${rolePxLabel(state.radiusPx, ratio)}`,
    })),
  ]
  return (
    <>
      <CornerPreview lab={lab} />
      <div className="flex flex-col gap-[var(--lab-gap-control,0.375rem)]">
        {/* Self-demo: the row's own corners wear the value, 1:1. */}
        <SliderRow
          label="Radius"
          value={state.radiusPx}
          onChange={set("radiusPx")}
          minValue={0}
          maxValue={16}
          step={0.5}
          ticks={[4, 8, 10, 12]}
          format={(v) => `${v}px`}
          trackStyle={{
            borderRadius: `${state.radiusPx}px`,
            ...cornerShapeStyle(state.cornerShape),
          }}
        />
        <OptionGridRow
          label="Character"
          value={activeCharacter(state)}
          onChange={(id) => {
            const character = SHAPE_CHARACTERS.find((c) => c.id === id)
            if (!character) return
            for (const { key } of SHAPE_ROLES) set(key)(character.vector[key])
          }}
          options={CHARACTER_OPTIONS}
          columns={3}
        />
        <DetailRow
          label="Roles"
          summary={SHAPE_ROLES.map(({ key }) =>
            rolePxLabel(state.radiusPx, roleRatio(state, key)),
          ).join(" · ")}
        >
          {SHAPE_ROLES.map(({ key, label }) => (
            <SelectRow
              key={key}
              label={label}
              value={state[key]}
              onChange={set(key)}
              options={rungOptions(key === "roleItem")}
            />
          ))}
        </DetailRow>
        <SegmentedControlRow
          label="Corners"
          value={state.cornerShape}
          onChange={set("cornerShape")}
          options={CORNER_SHAPE_OPTIONS}
        />
      </div>
    </>
  )
}

/* -------------------------------- Space (v2) -------------------------------- */

/* v2: Space owns the spatial system, on Shape's base-times-recipe model — the
   unit scales everything, density picks the gap/inset recipe, control size
   moves the height ladder. All three resolve in the hero's specimen. */

type SpaceProbeId = "field" | "actions"

const spacePx = (n: number) => Math.round(n * 2) / 2

function spaceRecipe(state: LabState) {
  const unit = state.spacingUnit
  const factor = DENSITY_FACTORS[state.density] ?? 1
  return {
    unit,
    controlH: spacePx((CONTROL_SIZE_UNITS[state.controlSize] ?? 8) * unit),
    padX: spacePx(2.5 * unit * factor),
    itemGap: spacePx(unit * factor),
    gap: spacePx(2 * unit * factor),
    inset: spacePx(3 * unit * factor),
  }
}

/** A working mini form wearing the resolved recipe — control heights, the
 *  stack gap and the card inset all derive from unit × density × size, with
 *  radii read from Shape's roles. Hover peeks a row's box recipe, click pins;
 *  at rest the readout is the recipe itself. */
function SpaceHero({ state }: { state: LabState }) {
  const { inspected, pinned, probeProps } = useInspect<SpaceProbeId>()
  const r = spaceRecipe(state)
  const controlRadius = controlRadiusPx(state)
  const surfaceRatio = roleRatio(state, "roleSurface")
  const surfaceRadius =
    surfaceRatio === Infinity ? 999 : state.radiusPx * surfaceRatio
  const probeClass = (id: SpaceProbeId) =>
    cn(
      "-m-1 cursor-interactive rounded-lg p-1 text-left focus-reset transition-colors focus-visible:focus-ring",
      pinned === id && "bg-muted",
    )
  const readout = inspected
    ? inspected === "field"
      ? { label: "Field", detail: `h ${r.controlH}px · pad ${r.padX}px` }
      : { label: "Actions", detail: `h ${r.controlH}px · gap ${r.itemGap}px` }
    : {
        label: DENSITY_OPTIONS.find((o) => o.value === state.density)?.label,
        detail: `${r.unit}px unit · gap ${r.gap}px · inset ${r.inset}px`,
      }

  return (
    <Hero>
      <div
        className="flex flex-col border border-border/45 bg-card"
        style={{ gap: r.gap, padding: r.inset, borderRadius: surfaceRadius }}
      >
        <button
          type="button"
          aria-label="Inspect field"
          {...probeProps("field")}
          className={probeClass("field")}
        >
          <span
            className="flex w-full items-center border border-border-field bg-field text-[0.8125rem] text-fg-muted"
            style={{
              height: r.controlH,
              paddingInline: r.padX,
              borderRadius: controlRadius,
            }}
          >
            you@example.com
          </span>
        </button>
        <button
          type="button"
          aria-label="Inspect actions"
          {...probeProps("actions")}
          className={probeClass("actions")}
        >
          <span className="flex items-center" style={{ gap: r.itemGap }}>
            <span
              className="flex items-center bg-primary text-[0.8125rem] font-medium text-fg-on-primary"
              style={{
                height: r.controlH,
                paddingInline: r.padX,
                borderRadius: controlRadius,
              }}
            >
              Save
            </span>
            <span
              className="flex items-center text-[0.8125rem] font-medium text-fg-muted"
              style={{
                height: r.controlH,
                paddingInline: r.padX,
                borderRadius: controlRadius,
              }}
            >
              Cancel
            </span>
          </span>
        </button>
      </div>
      <HeroInspector label={readout.label} detail={readout.detail} />
    </Hero>
  )
}

export function SpaceSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SpaceHero state={state} />
      <SliderRow
        label="Unit"
        value={state.spacingUnit}
        onChange={set("spacingUnit")}
        minValue={3}
        maxValue={6}
        step={0.25}
        ticks={[3.5, 4, 5]}
        format={(v) => `${v}px`}
      />
      <ControlGroup>
        <SegmentedControlRow
          label="Density"
          value={state.density}
          onChange={set("density")}
          options={DENSITY_OPTIONS}
        />
        <SegmentedControlRow
          label="Controls"
          value={state.controlSize}
          onChange={set("controlSize")}
          options={CONTROL_SIZE_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        Density tightens gaps and insets at the same control size; Controls
        moves the height ladder. The unit scales both.
      </GroupCaption>
    </>
  )
}

export function EffectsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <OptionGridRow
        label="Shadows"
        value={state.shadows}
        onChange={set("shadows")}
        options={SHADOW_OPTIONS}
        columns={4}
      />
      <GroupCaption>
        One family sets the card, control and overlay shadows together.
      </GroupCaption>
      <ControlGroup>
        <SelectRow
          label="Cursor"
          value={state.cursorInteractive}
          onChange={set("cursorInteractive")}
          options={CURSOR_OPTIONS}
        />
        <SelectRow
          label="Disabled cursor"
          value={state.cursorDisabled}
          onChange={set("cursorDisabled")}
          options={CURSOR_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}

/* Two real buttons — one enabled, one disabled — each wearing the cursor the
   current selection maps to. Hovering them shows the real thing; the drawn
   cursor keeps the answer visible without a mouse. */
function CursorHeroV2({ state }: { state: LabState }) {
  const specimens = [
    {
      label: "Interactive",
      cursor: state.cursorInteractive,
      glyph: CURSOR_INTERACTIVE_OPTIONS.find(
        (o) => o.value === state.cursorInteractive,
      )?.illustration,
      isDisabled: false,
    },
    {
      label: "Disabled",
      cursor: state.cursorDisabled,
      glyph: CURSOR_DISABLED_OPTIONS.find(
        (o) => o.value === state.cursorDisabled,
      )?.illustration,
      isDisabled: true,
    },
  ]
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      {specimens.map(({ label, cursor, glyph, isDisabled }) => (
        <div key={label} className="relative" style={{ cursor }}>
          <Button
            variant="secondary"
            isDisabled={isDisabled}
            style={{ cursor }}
          >
            Button
          </Button>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 **:[svg]:size-5"
          >
            {glyph}
          </span>
        </div>
      ))}
    </Hero>
  )
}

/* v2: shadows moved into Surfaces — the recipe and the shadow family are one
   decision there. The Cursor section keeps only the cursors. */
export function EffectsSectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <CursorHeroV2 state={state} />
      <ControlGroup>
        <SelectRow
          label="Interactive"
          value={state.cursorInteractive}
          onChange={set("cursorInteractive")}
          options={CURSOR_INTERACTIVE_OPTIONS}
          layout="grid"
        />
        <SelectRow
          label="Disabled"
          value={state.cursorDisabled}
          onChange={set("cursorDisabled")}
          options={CURSOR_DISABLED_OPTIONS}
          layout="grid"
        />
      </ControlGroup>
    </>
  )
}

/* -------------------------------- Focus (v2) ------------------------------- */

/* Color sits on its own above both blocks — it's the one axis both categories
   draw from, so owning it from Controls would have been a lie. Everything
   below it is per-category, and a row only appears when the chosen style
   actually reads it: no dead knobs. Fields react to any focus (RAC's
   isFocusVisible skips mouse-focused inputs, so a keyboard-only ring leaves
   them blank); menu items highlight, no ring. */

const FOCUS_COLOR_VARS = {
  accent: "var(--accent-700)",
  neutral: "var(--neutral-700)",
} as const

const focusColorVar = (state: LabState): string =>
  FOCUS_COLOR_VARS[state.focusColor as keyof typeof FOCUS_COLOR_VARS] ??
  FOCUS_COLOR_VARS.accent

const mix = (base: string, pct: number) =>
  `color-mix(in oklab, ${base} ${pct}%, transparent)`

/** The keyboard ring as a box-shadow stack — the gap paints in bg like the
 *  real focus-ring utility (ring-offset-bg), so it follows any radius. */
function focusRingShadow(state: LabState, style = state.focusStyle): string {
  const width = state.focusWidth
  const base = focusColorVar(state)
  const color = style === "halo" ? mix(base, state.focusHaloStrength) : base
  switch (state.focusOffset) {
    case "inset":
      return `inset 0 0 0 ${width}px ${color}`
    case "flush":
      return `0 0 0 ${width}px ${color}`
    default: {
      const gap = state.focusGap
      return `0 0 0 ${gap}px var(--color-bg), 0 0 0 ${gap + width}px ${color}`
    }
  }
}

/** The field's focus layer: border swap plus the style's shadow — the exact
 *  keyboard ring, a muted halo of the same color, or the border alone. */
function focusFieldStyle(
  state: LabState,
  style = state.focusInputStyle,
): CSSProperties {
  const base = focusColorVar(state)
  return {
    borderColor: base,
    borderWidth: style === "border" ? state.focusInputBorderWidth : undefined,
    boxShadow:
      style === "ring"
        ? focusRingShadow(state)
        : style === "halo"
          ? `0 0 0 ${state.focusInputSpread}px ${mix(base, state.focusInputStrength)}`
          : undefined,
  }
}

/** One focused specimen per block — the secondary button is the neutral read
 *  of the ring, where the recipe has to work without a strong fill behind it. */
function ControlFocusHero({ state }: { state: LabState }) {
  return (
    <Hero className="items-center py-5">
      <span
        className={cn(SPECIMEN_BUTTON, "border bg-neutral text-fg-on-neutral")}
        style={{
          borderRadius: controlRadiusPx(state),
          boxShadow: focusRingShadow(state),
        }}
      >
        Get started
      </span>
    </Hero>
  )
}

function InputFocusHero({ state }: { state: LabState }) {
  return (
    <Hero className="items-center py-5">
      <span
        className={cn(
          SPECIMEN_FIELD,
          "max-w-48 border border-border-field bg-field text-fg",
        )}
        style={{
          borderRadius: controlRadiusPx(state),
          ...focusFieldStyle(state),
        }}
      >
        you@example.com
        <span className="ml-px inline-block h-4 w-px animate-pulse bg-fg" />
      </span>
    </Hero>
  )
}

export function FocusSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      {/* Untitled on purpose: the shared ink opens the chapter, the way a
          settings panel puts the general row above its named sections. */}
      <ControlGroup>
        <SegmentedControlRow
          label="Color"
          value={state.focusColor}
          onChange={set("focusColor")}
          options={FOCUS_COLOR_OPTIONS}
        />
      </ControlGroup>
      <GroupTitle>Controls</GroupTitle>
      <ControlGroup>
        <ControlFocusHero state={state} />
        <SelectRow
          label="Style"
          value={state.focusStyle}
          onChange={set("focusStyle")}
          options={FOCUS_CONTROL_STYLE_OPTIONS}
        />
        <StepperRow
          label="Width"
          value={state.focusWidth}
          onChange={set("focusWidth")}
          minValue={1}
          maxValue={6}
          unit="px"
        />
        {state.focusStyle === "halo" && (
          <StepperRow
            label="Strength"
            value={state.focusHaloStrength}
            onChange={set("focusHaloStrength")}
            minValue={10}
            maxValue={100}
            step={5}
            unit="%"
          />
        )}
        <SegmentedControlRow
          label="Offset"
          value={state.focusOffset}
          onChange={set("focusOffset")}
          options={FOCUS_OFFSET_OPTIONS}
        />
        {state.focusOffset === "gap" && (
          <StepperRow
            label="Gap"
            value={state.focusGap}
            onChange={set("focusGap")}
            minValue={1}
            maxValue={6}
            unit="px"
          />
        )}
      </ControlGroup>
      <GroupTitle>Inputs</GroupTitle>
      <ControlGroup>
        <InputFocusHero state={state} />
        <SelectRow
          label="Style"
          value={state.focusInputStyle}
          onChange={set("focusInputStyle")}
          options={FOCUS_INPUT_STYLE_OPTIONS}
        />
        {state.focusInputStyle === "halo" && (
          <>
            <StepperRow
              label="Spread"
              value={state.focusInputSpread}
              onChange={set("focusInputSpread")}
              minValue={1}
              maxValue={8}
              unit="px"
            />
            <StepperRow
              label="Strength"
              value={state.focusInputStrength}
              onChange={set("focusInputStrength")}
              minValue={10}
              maxValue={100}
              step={5}
              unit="%"
            />
          </>
        )}
        {state.focusInputStyle === "border" && (
          <StepperRow
            label="Width"
            value={state.focusInputBorderWidth}
            onChange={set("focusInputBorderWidth")}
            minValue={1}
            maxValue={4}
            unit="px"
          />
        )}
      </ControlGroup>
    </>
  )
}

/* --------------------------- Buttons / Inputs (v2) -------------------------- */

/* v2: Components splits into per-family sections. Each section owns one synced
   group's axes and opens on live specimens — real hover, real focus — with the
   control radius read from the Shape section's role system. */

/** The Controls role's resolved radius — what 'auto' means for a control. */
function controlRadiusPx(state: LabState): number {
  const ratio = roleRatio(state, "roleControl")
  return ratio === Infinity ? 999 : state.radiusPx * ratio
}

function buttonRadiusPx(state: LabState): number {
  switch (state.buttonRadius) {
    case "sharp":
      return 0
    case "round":
      return state.radiusPx
    case "pill":
      return 999
    default:
      return controlRadiusPx(state)
  }
}

/* Style families (Aug 2026 survey) — each reshapes every fill variant at
   once; quiet stays flat, as it does in every system with an aesthetic axis
   (Radix classic, Untitled UI, Primer, Geist all converge on this). */
const BUTTON_STYLE_LOOKS = {
  flat: {
    primary: "bg-primary text-fg-on-primary",
    secondary: "border border-border-field bg-neutral text-fg-on-neutral",
  },
  outline: {
    primary:
      "bg-primary text-fg-on-primary shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
    secondary:
      "border border-border-field bg-neutral text-fg-on-neutral shadow-[0_1px_0_rgb(0_0_0/0.08)]",
  },
  raised: {
    primary:
      "bg-primary bg-linear-to-b from-white/15 to-black/15 text-fg-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
    secondary:
      "border border-border-field bg-neutral bg-linear-to-b from-white/8 to-black/8 text-fg-on-neutral shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  elevated: {
    primary:
      "bg-primary text-fg-on-primary shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
    secondary:
      "bg-neutral text-fg-on-neutral shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
  },
} as const

const buttonStyleLook = (state: LabState) =>
  BUTTON_STYLE_LOOKS[state.buttonStyle as keyof typeof BUTTON_STYLE_LOOKS] ??
  BUTTON_STYLE_LOOKS.flat

/* Quiet gains a background on hover in every surveyed system, whatever the
   fill variants do — so both dim and lighten resolve to a fill for it. */
function buttonHoverFx(state: LabState, tier: "fill" | "quiet"): string {
  if (state.buttonHover === "none") return ""
  if (tier === "quiet") return "hover:bg-highlight"
  return state.buttonHover === "lighten"
    ? "hover:brightness-110"
    : "hover:brightness-95"
}

/* Press is uniform across variants (the Linear precedent). */
function buttonPressFx(state: LabState, tier: "fill" | "quiet"): string {
  switch (state.buttonPress) {
    case "dim":
      return tier === "quiet" ? "active:bg-inverse/15" : "active:brightness-90"
    case "scale":
      return "active:scale-[0.97]"
    case "push":
      return "active:translate-y-px"
    default:
      return ""
  }
}

const SPECIMEN_FX =
  "cursor-interactive focus-reset transition-[background-color,border-color,color,box-shadow,filter,scale,translate] focus-visible:focus-ring"

const GROUP_SELECTED_LOOKS: Record<string, string> = {
  fill: "bg-selected text-fg-on-selected",
  chip: "bg-bg text-fg shadow-sm",
  inverse: "bg-inverse text-fg-inverse",
}

/** The synced group's toggle side — one working single-select group, laid out
 *  per the group axes. Separator only matters when attached. */
function GroupSpecimen({ state }: { state: LabState }) {
  const [view, setView] = useState("list")
  const radius = buttonRadiusPx(state)
  const duration = `${state.buttonTransition}ms`
  const selected =
    GROUP_SELECTED_LOOKS[state.groupSelected] ?? GROUP_SELECTED_LOOKS.fill
  const layout = state.groupLayout

  const segment = (id: string, label: string, className?: string) => (
    <button
      key={id}
      type="button"
      aria-pressed={view === id}
      onClick={() => setView(id)}
      className={cn(
        "flex h-7 items-center px-3 text-xs font-medium",
        SPECIMEN_FX,
        view === id
          ? cn(selected, buttonPressFx(state, "fill"))
          : cn("text-fg-muted hover:text-fg", buttonPressFx(state, "quiet")),
        className,
      )}
      style={{ transitionDuration: duration }}
    >
      {label}
    </button>
  )
  const segments = [
    ["list", "List"],
    ["grid", "Grid"],
    ["board", "Board"],
  ] as const

  if (layout === "gapped")
    return (
      <div className="flex items-center gap-2">
        {segments.map(([id, label]) =>
          segment(
            id,
            label,
            cn(
              "rounded-(--seg-radius)",
              view !== id && "border border-border-field bg-neutral",
            ),
          ),
        )}
      </div>
    )

  if (layout === "container")
    return (
      <div
        className="flex items-center gap-0.5 bg-muted p-0.5"
        style={{ borderRadius: radius >= 999 ? 999 : radius }}
      >
        {segments.map(([id, label]) =>
          segment(id, label, "rounded-(--seg-radius)"),
        )}
      </div>
    )

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden border border-border-field bg-neutral",
        state.groupSeparator === "auto" && "divide-x divide-border-field",
      )}
      style={{ borderRadius: radius }}
    >
      {segments.map(([id, label], i) => (
        <span key={id} className="flex items-stretch">
          {state.groupSeparator === "divider" && i > 0 && (
            <span className="my-1.5 w-px bg-border-field" />
          )}
          {segment(id, label)}
        </span>
      ))}
    </div>
  )
}

/** Live specimens of the synced group: the fill variants and Quiet wearing
 *  one style, plus a working toggle group. Hover and press demo for real. */
function ButtonsHero({ state }: { state: LabState }) {
  const look = buttonStyleLook(state)
  const radius = buttonRadiusPx(state)
  const segRadius = radius >= 999 ? 999 : Math.max(radius - 3, 0)
  const duration = `${state.buttonTransition}ms`

  const specimen = (tier: "primary" | "secondary" | "quiet", label: string) => (
    <button
      type="button"
      className={cn(
        "flex h-8 items-center px-3.5 text-[0.8125rem] font-medium",
        SPECIMEN_FX,
        tier === "quiet" ? "text-fg" : look[tier],
        buttonHoverFx(state, tier === "quiet" ? "quiet" : "fill"),
        buttonPressFx(state, tier === "quiet" ? "quiet" : "fill"),
      )}
      style={{ borderRadius: radius, transitionDuration: duration }}
    >
      {label}
    </button>
  )

  return (
    <Hero>
      <div
        className="flex flex-col items-center gap-3 py-4"
        style={{ "--seg-radius": `${segRadius}px` } as CSSProperties}
      >
        <div className="flex items-center gap-2">
          {specimen("primary", "Get started")}
          {specimen("secondary", "Preview")}
          {specimen("quiet", "Docs")}
        </div>
        <GroupSpecimen state={state} />
      </div>
    </Hero>
  )
}

export function ButtonsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <ButtonsHero state={state} />
      <OptionGridRow
        label="Style"
        value={state.buttonStyle}
        onChange={set("buttonStyle")}
        options={BUTTON_STYLES}
      />
      <ControlGroup>
        <SegmentedControlRow
          label="Radius"
          value={state.buttonRadius}
          onChange={set("buttonRadius")}
          options={RADIUS_PARAM_OPTIONS}
        />
        <SegmentedControlRow
          label="Hover"
          value={state.buttonHover}
          onChange={set("buttonHover")}
          options={BUTTON_HOVER_OPTIONS}
        />
        <SegmentedControlRow
          label="Press"
          value={state.buttonPress}
          onChange={set("buttonPress")}
          options={BUTTON_PRESS_OPTIONS}
        />
      </ControlGroup>
      <ControlGroup>
        <SegmentedControlRow
          label="Group"
          value={state.groupLayout}
          onChange={set("groupLayout")}
          options={GROUP_LAYOUT_OPTIONS}
        />
      </ControlGroup>
      <DetailRow label="Advanced">
        <ParamRow label="Selected segment">
          <MiniSegmented
            ariaLabel="Selected segment treatment"
            value={state.groupSelected}
            onChange={set("groupSelected")}
            options={GROUP_SELECTED_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Group separator">
          <MiniSegmented
            ariaLabel="Group separator"
            value={state.groupSeparator}
            onChange={set("groupSeparator")}
            options={GROUP_SEPARATOR_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Transition">
          <MiniSegmented
            ariaLabel="Transition duration"
            value={state.buttonTransition}
            onChange={set("buttonTransition")}
            options={BUTTON_TRANSITION_OPTIONS}
          />
        </ParamRow>
      </DetailRow>
      <GroupCaption>
        Style reshapes the fill variants; Quiet and Link stay flat. Toggle
        Button follows Button.
      </GroupCaption>
    </>
  )
}

/** Style → what the field paints. Radius only where the style rounds. */
function inputLook(
  styleId: string,
  radius: number,
): { className: string; style: CSSProperties } {
  switch (styleId) {
    case "line":
      return { className: "border-b border-border-field", style: {} }
    case "filled-line-bottom":
      return {
        className: "border-b border-border-field bg-neutral",
        style: {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        },
      }
    case "filled":
      return { className: "bg-neutral", style: { borderRadius: radius } }
    default:
      return {
        className: "border border-border-field bg-field",
        style: { borderRadius: radius },
      }
  }
}

const INPUT_FIELD = cn(
  SPECIMEN_FIELD,
  "gap-2 transition-colors outline-none focus-visible:focus-ring",
)

/** A working mini form in the chosen style — a real input plus a select
 *  trigger, because the style is a family decision, not one component's. */
function InputsHero({ state }: { state: LabState }) {
  const radius = controlRadiusPx(state)
  const look = inputLook(state.inputStyle, radius)

  return (
    <Hero>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg">Email</span>
        <input
          type="text"
          placeholder="you@example.com"
          className={cn(
            INPUT_FIELD,
            look.className,
            "placeholder:text-fg-muted",
          )}
          style={look.style}
        />
      </label>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg">Role</span>
        <button
          type="button"
          className={cn(INPUT_FIELD, look.className, "cursor-interactive")}
          style={look.style}
        >
          <span className="flex-1 truncate text-left text-fg">
            Product designer
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </button>
      </div>
    </Hero>
  )
}

export function InputsSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <InputsHero state={state} />
      <OptionGridRow
        label="Style"
        value={state.inputStyle}
        onChange={set("inputStyle")}
        options={INPUT_STYLES}
      />
    </>
  )
}

export function ComponentsSectionBody({ lab }: { lab: Lab }) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const clusters = CLUSTERS.map((cluster) => ({
    ...cluster,
    items: cluster.items.filter((item) => item.name.toLowerCase().includes(q)),
  })).filter((cluster) => cluster.items.length > 0)

  return (
    <>
      <FilterRow
        value={query}
        onChange={setQuery}
        placeholder="Filter components..."
      />
      <DisclosureGroup className="flex flex-col gap-[var(--lab-gap-control,0.375rem)]">
        {clusters.map((cluster) => (
          <div
            key={cluster.label}
            className="flex flex-col gap-[var(--lab-gap-control,0.375rem)]"
          >
            <GroupTitle>{cluster.label}</GroupTitle>
            {cluster.items.map((item) => (
              <div key={item.name}>{item.render(lab)}</div>
            ))}
            {cluster.caption && <GroupCaption>{cluster.caption}</GroupCaption>}
          </div>
        ))}
        {clusters.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-fg-muted">
            No components match “{query}”.
          </p>
        )}
      </DisclosureGroup>
      <GroupCaption>
        A representative slice — the real panel lists every component with
        styles, in these clusters.
      </GroupCaption>
    </>
  )
}
