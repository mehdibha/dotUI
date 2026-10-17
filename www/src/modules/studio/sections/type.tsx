"use client"

/* Typography: each face set in itself, then the voice of titles, labels and
   control text. Font sits on the main page; Heading and Reading match it
   until pinned. */

import { useMemo } from "react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Label } from "@/registry/ui/field"
import { Select } from "@/registry/ui/select"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import type { Effective } from "../axes"
import { TITLE_VOICE } from "../axes/type"
import {
  FIELD_TEXT_OPTIONS,
  LABEL_WEIGHT_OPTIONS,
  SECTION_LABEL_OPTIONS,
  TITLE_OPTIONS,
  UI_TEXT_OPTIONS,
} from "../axes/type.meta"
import { DIAL_LABEL, DIAL_PRESS, DIAL_ROW, DialSelect } from "../dial"
import { useRowLabel } from "../row-host"
import type { RowMap } from "../row-host"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import { useStudio } from "../use-studio"

type FontKey = "headingFont" | "bodyFont" | "monoFont" | "readingFont"

/** The follow id of a role that matches Font until pinned. */
const MATCH = "same"

const HEADING_CATEGORIES: FontCategory[] = [
  "sans-serif",
  "serif",
  "display",
  "handwriting",
]
const BODY_CATEGORIES: FontCategory[] = ["sans-serif", "serif"]
const MONO_CATEGORIES: FontCategory[] = ["mono"]
const READING_CATEGORIES: FontCategory[] = ["serif", "sans-serif"]

/** A font role as a dial row, its family set in its own face. With `match`,
 *  a switch over the list follows Font or pins the family it shows. */
function FontRow({
  axis,
  label: labelProp,
  match,
  categories,
}: {
  axis: FontKey
  label: string
  match?: boolean
  categories: FontCategory[]
}) {
  const { state, effective, set } = useStudio()
  const label = useRowLabel(labelProp)
  const value = state[axis]
  const resolved = effective[axis]
  const onChange = set(axis)
  const matching = match && value === MATCH
  useLoadedFamilies([resolved])
  // The Select's collection: one element, so a new value doesn't rebuild
  // its hundreds of hidden items.
  const list = useMemo(
    () => (
      <PanelPopoverTitle.Provider value={label}>
        <FontListPopover categories={categories} onPreview={onChange}>
          {match && (
            <Switch
              size="sm"
              isSelected={matching}
              onChange={(on) => onChange(on ? MATCH : resolved)}
            >
              <Label className="flex-1">Match font</Label>
              <SwitchControl />
            </Switch>
          )}
        </FontListPopover>
      </PanelPopoverTitle.Provider>
    ),
    [label, categories, onChange, match, matching, resolved],
  )
  return (
    <Select
      className="w-full"
      selectedKey={matching ? null : value}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
    >
      <div data-axis={axis} className={cn(DIAL_ROW, "relative pr-0")}>
        <RacButton
          className={cn(DIAL_PRESS, "absolute inset-0 rounded-[inherit]")}
        >
          <span className="sr-only">{label}</span>
        </RacButton>
        <span className={cn(DIAL_LABEL, "pointer-events-none relative")}>
          {label}
        </span>
        <span
          className="pointer-events-none relative truncate pr-3 text-[13px] font-medium text-fg/60"
          style={{ fontFamily: fontStack(resolved) }}
        >
          {resolved}
        </span>
      </div>
      {list}
    </Select>
  )
}

/** Beside the title: Aa in the heading face. */
export function TypePreview({ state }: { state: Effective }) {
  useLoadedFamilies([state.headingFont])
  return (
    <span
      className="text-[15px]/none font-semibold"
      style={{ fontFamily: fontStack(state.headingFont) }}
    >
      Aa
    </span>
  )
}

const WEIGHTS: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

const TRACKING: Record<string, string> = { tight: "-0.025em", wider: "0.05em" }

function titleSpecimen(value: string): React.CSSProperties {
  const voice = TITLE_VOICE[value]
  return {
    fontWeight: WEIGHTS[voice?.weight ?? "medium"],
    letterSpacing: voice?.tracking && TRACKING[voice.tracking],
    textTransform: value === "caps" ? "uppercase" : undefined,
  }
}

const HeadingRow = () => (
  <FontRow
    axis="headingFont"
    label="Heading"
    match
    categories={HEADING_CATEGORIES}
  />
)

const BodyRow = () => (
  <FontRow axis="bodyFont" label="Font" categories={BODY_CATEGORIES} />
)

const MonoRow = () => (
  <FontRow axis="monoFont" label="Mono" categories={MONO_CATEGORIES} />
)

const ReadingRow = () => (
  <FontRow
    axis="readingFont"
    label="Reading"
    match
    categories={READING_CATEGORIES}
  />
)

function TitlesRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="titleStyle"
      label="Titles"
      options={TITLE_OPTIONS.map((option) => ({
        ...option,
        glyph: (
          <span
            className="text-[13px] text-fg/80"
            style={{
              fontFamily: fontStack(effective.headingFont),
              ...titleSpecimen(option.value),
            }}
          >
            Aa
          </span>
        ),
      }))}
    />
  )
}

const UiTextRow = () => (
  <DialSelect
    axis="uiTextSize"
    label="UI text size"
    options={UI_TEXT_OPTIONS}
  />
)

const FieldTextRow = () => (
  <DialSelect
    axis="fieldTextSize"
    label="Field text"
    options={FIELD_TEXT_OPTIONS}
  />
)

const LABEL_WEIGHT_ROW_OPTIONS = LABEL_WEIGHT_OPTIONS.map((option) => ({
  ...option,
  glyph: (
    <span
      className="text-[13px] text-fg/80"
      style={{ fontWeight: WEIGHTS[option.value] }}
    >
      Aa
    </span>
  ),
}))

const LabelWeightRow = () => (
  <DialSelect
    axis="labelWeight"
    label="Label weight"
    options={LABEL_WEIGHT_ROW_OPTIONS}
  />
)

const SectionLabelsRow = () => (
  <DialSelect
    axis="sectionLabels"
    label="Section labels"
    options={SECTION_LABEL_OPTIONS}
  />
)

export const ROWS: RowMap = {
  headingFont: HeadingRow,
  bodyFont: BodyRow,
  monoFont: MonoRow,
  readingFont: ReadingRow,
  titleStyle: TitlesRow,
  uiTextSize: UiTextRow,
  fieldTextSize: FieldTextRow,
  labelWeight: LabelWeightRow,
  sectionLabels: SectionLabelsRow,
}
