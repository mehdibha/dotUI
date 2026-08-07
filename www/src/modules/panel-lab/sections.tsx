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
  CloudIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"
import { DisclosureGroup } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import * as registryIcons from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  ControlGroup,
  FontPickerRow,
  GroupCaption,
  SelectRow,
  SliderRow,
  OptionGridRow,
} from "@/modules/control-lab/rows"
import {
  ICON_STROKE_WIDTH_VAR,
  STROKE_DEFAULTS,
} from "@/modules/create/iconography"
import { useLoadedFamilies } from "@/modules/create/typography"

import {
  BUTTON_STYLES,
  CLUSTERS,
  CORNER_SHAPE_OPTIONS,
  CURSOR_DISABLED_OPTIONS,
  CURSOR_INTERACTIVE_OPTIONS,
  CURSOR_OPTIONS,
  DENSITY_OPTIONS,
  FOCUS_COLOR_OPTIONS,
  FOCUS_INPUT_OPTIONS,
  FOCUS_OFFSET_OPTIONS,
  FOCUS_STYLE_OPTIONS,
  FOCUS_WIDTH_OPTIONS,
  HOVER_PARAM_OPTIONS,
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
import {
  ClusterHeader,
  DetailRow,
  FilterRow,
  SegmentedControlRow,
  TypeSpecimen,
} from "./patterns"

export function TypographySectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <TypeSpecimen heading={state.headingFont} body={state.bodyFont} />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={["sans-serif", "serif", "display", "handwriting"]}
          selectedKey={state.headingFont}
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

/* Fixed rhythm: v2's type axes are the three families — sizes and weights are
   the hero's constants until rhythm axes land (drafts #563/#565). */
const TYPE_ROLES: Record<
  TypeProbeId,
  { label: string; px: number; weight: number }
> = {
  heading: { label: "Heading", px: 24, weight: 600 },
  body: { label: "Body", px: 15, weight: 400 },
  ui: { label: "UI label", px: 13, weight: 500 },
  code: { label: "Code", px: 12, weight: 400 },
}

/** Every text role the system ships, live in the chosen faces — heading, body,
 *  UI labels and code. Probes follow the hero contract: hover peeks a role's
 *  recipe, click pins it. */
function TypeHeroV2({ state }: { state: LabState }) {
  const { inspected, pinned, probeProps } = useInspect<TypeProbeId>()
  useLoadedFamilies([state.headingFont, state.bodyFont, state.monoFont])

  const family = (id: TypeProbeId) =>
    id === "heading"
      ? state.headingFont
      : id === "code"
        ? state.monoFont
        : state.bodyFont
  const probeClass = (id: TypeProbeId) =>
    cn(
      "-mx-1 cursor-interactive rounded-md px-1 text-left focus-reset transition-colors focus-visible:focus-ring",
      pinned === id && "bg-muted",
    )
  const role = inspected ? TYPE_ROLES[inspected] : null

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
            fontFamily: fontStack(state.headingFont),
            fontSize: TYPE_ROLES.heading.px,
            fontWeight: TYPE_ROLES.heading.weight,
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
            fontFamily: fontStack(state.bodyFont),
            fontSize: TYPE_ROLES.body.px,
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
              fontFamily: fontStack(state.bodyFont),
              fontSize: TYPE_ROLES.ui.px,
              fontWeight: TYPE_ROLES.ui.weight,
            }}
          >
            Get started
          </span>
        </button>
        <span
          className="flex h-7 shrink-0 items-center rounded-full border border-border-field px-3.5 text-fg"
          style={{
            fontFamily: fontStack(state.bodyFont),
            fontSize: TYPE_ROLES.ui.px,
            fontWeight: TYPE_ROLES.ui.weight,
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
              fontFamily: fontStack(state.monoFont),
              fontSize: TYPE_ROLES.code.px,
            }}
          >
            v2.4.0
          </span>
        </button>
      </div>
      {inspected && role && (
        <HeroInspector
          label={role.label}
          detail={`${family(inspected)} · ${role.px}px · ${role.weight}`}
        />
      )}
    </Hero>
  )
}

export function TypographySectionBodyV2({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <TypeHeroV2 state={state} />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={["sans-serif", "serif", "display", "handwriting"]}
          selectedKey={state.headingFont}
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

export function SpaceSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Density"
        value={state.density}
        onChange={set("density")}
        options={DENSITY_OPTIONS}
      />
    </ControlGroup>
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

/* One recipe, three category treatments. The recipe (style · width · offset ·
   color) is the user's axis; how a category wears it is derived: controls take
   the keyboard-only ring, fields add an always-on border layer (RAC's
   isFocusVisible skips mouse-focused inputs, so a ring alone leaves them
   blank), menu items highlight instead of ringing. */

const FOCUS_COLOR_VARS: Record<string, string> = {
  accent: "var(--accent-700)",
  neutral: "var(--neutral-700)",
}

const focusColorVar = (state: LabState) =>
  FOCUS_COLOR_VARS[state.focusColor] ?? FOCUS_COLOR_VARS.accent

/** The keyboard ring as a box-shadow stack — the gap paints in bg like the
 *  real focus-ring utility (ring-offset-bg), so it follows any radius. */
function focusRingShadow(state: LabState): string {
  const width = Number(state.focusWidth) || 2
  const base = focusColorVar(state)
  const color =
    state.focusStyle === "halo"
      ? `color-mix(in oklab, ${base} 45%, transparent)`
      : base
  switch (state.focusOffset) {
    case "inset":
      return `inset 0 0 0 ${width}px ${color}`
    case "flush":
      return `0 0 0 ${width}px ${color}`
    default:
      return `0 0 0 2px var(--color-bg), 0 0 0 ${2 + width}px ${color}`
  }
}

/** The field's focus layer: border swap plus the Inputs treatment — the exact
 *  keyboard ring, or a subdued halo of the same color. */
function focusFieldStyle(state: LabState): CSSProperties {
  const base = focusColorVar(state)
  return {
    borderColor: base,
    boxShadow:
      state.focusInputs === "match"
        ? focusRingShadow(state)
        : `0 0 0 2px color-mix(in oklab, ${base} 30%, transparent)`,
  }
}

type FocusProbeId = "control" | "field" | "item"

/** The three category treatments worn at once — a focused button, field and
 *  menu item — so one recipe change reads across all of them. */
function FocusHero({ state }: { state: LabState }) {
  const { inspected, pinned, probeProps } = useInspect<FocusProbeId>()
  const radius = controlRadiusPx(state)
  const probeClass = (id: FocusProbeId) =>
    cn(
      "cursor-interactive rounded-lg p-1.5 text-left focus-reset transition-colors focus-visible:focus-ring",
      pinned === id && "bg-muted",
    )
  const readouts: Record<FocusProbeId, { label: string; detail: string }> = {
    control: {
      label: "Controls",
      detail: `${Number(state.focusWidth) || 2}px ${state.focusColor} · ${state.focusOffset} · keyboard only`,
    },
    field: {
      label: "Fields",
      detail:
        state.focusInputs === "match"
          ? "border + keyboard ring · any focus"
          : "border + muted halo · any focus",
    },
    item: { label: "Menu items", detail: "highlight · no ring" },
  }
  const readout = inspected ? readouts[inspected] : null

  return (
    <Hero>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Inspect control focus"
          {...probeProps("control")}
          className={probeClass("control")}
        >
          <span
            className="flex h-8 items-center bg-primary px-3.5 text-[0.8125rem] font-medium text-fg-on-primary"
            style={{ borderRadius: radius, boxShadow: focusRingShadow(state) }}
          >
            Get started
          </span>
        </button>
        <button
          type="button"
          aria-label="Inspect menu item focus"
          {...probeProps("item")}
          className={cn(probeClass("item"), "min-w-0")}
        >
          <span className="flex h-8 items-center rounded-md bg-highlight px-3 text-[0.8125rem] text-fg-on-highlight">
            Duplicate…
          </span>
        </button>
      </div>
      <button
        type="button"
        aria-label="Inspect field focus"
        {...probeProps("field")}
        className={probeClass("field")}
      >
        <span
          className="flex h-8 w-full items-center border border-border-field bg-field px-2.5 text-[0.8125rem] text-fg"
          style={{ borderRadius: radius, ...focusFieldStyle(state) }}
        >
          you@example.com
          <span className="ml-px inline-block h-4 w-px animate-pulse bg-fg" />
        </span>
      </button>
      {readout && (
        <HeroInspector label={readout.label} detail={readout.detail} />
      )}
    </Hero>
  )
}

export function FocusSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <FocusHero state={state} />
      <OptionGridRow
        label="Style"
        value={state.focusStyle}
        onChange={set("focusStyle")}
        options={FOCUS_STYLE_OPTIONS}
        columns={2}
      />
      <ControlGroup>
        <SegmentedControlRow
          label="Width"
          value={state.focusWidth}
          onChange={set("focusWidth")}
          options={FOCUS_WIDTH_OPTIONS}
        />
        <SegmentedControlRow
          label="Offset"
          value={state.focusOffset}
          onChange={set("focusOffset")}
          options={FOCUS_OFFSET_OPTIONS}
        />
        <SegmentedControlRow
          label="Color"
          value={state.focusColor}
          onChange={set("focusColor")}
          options={FOCUS_COLOR_OPTIONS}
        />
        <SegmentedControlRow
          label="Inputs"
          value={state.focusInputs}
          onChange={set("focusInputs")}
          options={FOCUS_INPUT_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        One recipe for every control. Fields react to any focus; menu items
        highlight instead of ringing.
      </GroupCaption>
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

/** Style → surface classes; `dim` is the style's own read of the dim hover. */
const BUTTON_LOOKS = {
  solid: { base: "bg-primary text-fg-on-primary", dim: "hover:brightness-90" },
  soft: { base: "bg-neutral text-fg-on-neutral", dim: "hover:brightness-90" },
  outline: {
    base: "border border-border-field text-fg",
    dim: "hover:bg-highlight",
  },
  quiet: { base: "text-fg", dim: "hover:bg-highlight" },
} as const

const buttonLook = (state: LabState) =>
  BUTTON_LOOKS[state.buttonStyle as keyof typeof BUTTON_LOOKS] ??
  BUTTON_LOOKS.solid

function buttonHoverFx(state: LabState): string {
  if (state.buttonHover === "dim") return buttonLook(state).dim
  if (state.buttonHover === "lift")
    return "hover:-translate-y-px hover:shadow-md"
  return ""
}

/** Live specimens of the synced group — a Button and a working Toggle Button
 *  pair wearing one style. Hovering demos the hover axis for real. */
function ButtonsHero({ state }: { state: LabState }) {
  const [view, setView] = useState<"list" | "grid">("list")
  const look = buttonLook(state)
  const radius = buttonRadiusPx(state)
  const segRadius = radius >= 999 ? 999 : Math.max(radius - 3, 0)
  const fx = buttonHoverFx(state)
  // Quiet's base has no surface, so its selected toggle segment needs one.
  const selectedSegment =
    state.buttonStyle === "quiet" ? "bg-highlight text-fg" : look.base

  return (
    <Hero>
      <div className="flex items-center justify-center gap-3 py-4">
        <button
          type="button"
          className={cn(
            "flex h-8 cursor-interactive items-center px-3.5 text-[0.8125rem] font-medium focus-reset transition-[background-color,filter,translate,box-shadow] duration-150 focus-visible:focus-ring",
            look.base,
            fx,
          )}
          style={{ borderRadius: radius }}
        >
          Get started
        </button>
        <div
          className="flex items-center gap-0.5 bg-muted p-0.5"
          style={{ borderRadius: radius >= 999 ? 999 : radius }}
        >
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "flex h-7 cursor-interactive items-center px-3 text-xs font-medium focus-reset transition-[background-color,filter,color] duration-150 focus-visible:focus-ring",
                view === v
                  ? cn(selectedSegment, fx)
                  : "text-fg-muted hover:text-fg",
              )}
              style={{ borderRadius: segRadius }}
            >
              {v === "list" ? "List" : "Grid"}
            </button>
          ))}
        </div>
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
          options={HOVER_PARAM_OPTIONS}
        />
      </ControlGroup>
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

const INPUT_FIELD =
  "flex h-8 w-full min-w-0 items-center gap-2 px-2.5 text-[0.8125rem] transition-colors outline-none focus-visible:focus-ring"

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
            <ClusterHeader label={cluster.label} />
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
