"use client"

/* Typography — the font roles, their weights and the size ladder. Axes are the
   ones shipped systems actually expose: three faces, one heading weight and
   tracking, a hand-tuned ladder with a heading size adjust, body leading. */

import { ChevronsUpDownIcon, RotateCcwIcon } from "lucide-react"

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  fontStack,
} from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Select } from "@/registry/ui/select"
import { useLoadedFamilies } from "@/modules/create/typography"

import { Hero } from "../hero"
import { DetailRow, MiniSliderRow } from "../patterns"
import {
  ControlGroup,
  FontListPopover,
  FontPickerRow,
  GroupTitle,
  MiniSegmented,
  ParamRow,
  ROW,
  ROW_LABEL,
  ROW_VALUE,
  SegmentedControlRow,
} from "../rows"
import type { Lab, LabState } from "../state"

export const TYPE_DEFAULTS = {
  // heading mirrors --font-heading: '' = Auto, follows body.
  headingFont: "",
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  headingWeight: "600",
  headingTracking: "normal",
  typeBase: 16,
  headingAdjust: 1,
  bodyLeading: "normal",
}

/** Collapsed-row summary: the face the system reads in, and its base size. */
export function typeSummary(state: LabState): string {
  return `${state.headingFont || state.bodyFont} · ${state.typeBase}px`
}

type TypeRoleId = "heading" | "body" | "ui" | "code"

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

/* Body-only, like Mantine/Chakra/Tailwind leading scales — headings keep the
   ladder's fixed leading. */
const LEADING_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
]

const LEADING_VALUES: Record<string, number> = {
  tight: 1.45,
  normal: 1.6,
  relaxed: 1.75,
}

/** A role's live recipe — heading and body follow the scale axes, UI and code
 *  sizes are the section's constants. */
function typeRole(state: LabState, id: TypeRoleId) {
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
 *  UI labels and code. */
export function TypeHero({ state }: { state: LabState }) {
  const heading = typeRole(state, "heading")
  const body = typeRole(state, "body")
  const ui = typeRole(state, "ui")
  const code = typeRole(state, "code")
  useLoadedFamilies([heading.family, body.family, code.family])

  return (
    <Hero>
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
      <span
        className="block text-pretty text-fg-muted"
        style={{
          fontFamily: fontStack(body.family),
          fontSize: body.px,
          lineHeight: LEADING_VALUES[state.bodyLeading],
        }}
      >
        We had left the ground, and the city lights fell away beneath us.
      </span>
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 shrink-0 items-center rounded-full bg-primary px-3.5 text-fg-on-primary"
          style={{
            fontFamily: fontStack(ui.family),
            fontSize: ui.px,
            fontWeight: ui.weight,
          }}
        >
          Get started
        </span>
        <span
          className="ml-auto flex h-6 shrink-0 items-center rounded-md bg-muted px-2 text-fg-muted"
          style={{
            fontFamily: fontStack(code.family),
            fontSize: code.px,
          }}
        >
          v2.4.0
        </span>
      </div>
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

export function TypeSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const scaleModified =
    state.typeBase !== TYPE_DEFAULTS.typeBase ||
    state.headingAdjust !== TYPE_DEFAULTS.headingAdjust ||
    state.bodyLeading !== TYPE_DEFAULTS.bodyLeading
  const scaleSummary = [
    `${state.typeBase}px`,
    adjustLabel(state.headingAdjust),
    state.bodyLeading !== TYPE_DEFAULTS.bodyLeading &&
      LEADING_OPTIONS.find((o) => o.value === state.bodyLeading)?.label,
  ]
    .filter(Boolean)
    .join(" · ")
  return (
    <>
      <ControlGroup>
        <TypeHero state={state} />
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
      <GroupTitle>Heading</GroupTitle>
      <ControlGroup>
        <SegmentedControlRow
          label="Weight"
          value={state.headingWeight}
          onChange={set("headingWeight")}
          options={WEIGHT_OPTIONS}
        />
        <SegmentedControlRow
          label="Tracking"
          value={state.headingTracking}
          onChange={set("headingTracking")}
          options={TRACKING_OPTIONS}
        />
      </ControlGroup>
      <DetailRow
        label="Scale"
        summary={scaleModified ? scaleSummary : "Default"}
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
        <ParamRow label="Body leading">
          <MiniSegmented
            ariaLabel="Body leading"
            value={state.bodyLeading}
            onChange={set("bodyLeading")}
            options={LEADING_OPTIONS}
          />
        </ParamRow>
      </DetailRow>
    </>
  )
}
