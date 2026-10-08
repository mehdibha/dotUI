"use client"

/* Typography: each face set in itself, then the voice of titles, labels and
   control text. */

import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Select } from "@/registry/ui/select"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import { TITLE_VOICE } from "../axes/type"
import {
  FIELD_TEXT_OPTIONS,
  LABEL_WEIGHT_OPTIONS,
  SECTION_LABEL_OPTIONS,
  TITLE_OPTIONS,
  UI_TEXT_OPTIONS,
} from "../axes/type.meta"
import {
  DIAL_CHEVRON,
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGap,
  DialSegmented,
  DialSelect,
} from "../dial"
import { Row, useRowLabel } from "../family-page"
import type { RowMap } from "../family-page"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import type { Effective } from "../state"
import { ChipButton } from "../use-axis"
import { useStudio } from "../use-studio"

type FontKey = "headingFont" | "bodyFont" | "monoFont" | "readingFont"

const SAME_AS_BODY = { id: "same", label: "Same as body" }

/** A font role as a dial row, its family set in its own face. */
function FontRow({
  axis,
  label: labelProp,
  follow,
  categories,
}: {
  axis: FontKey
  label: string
  follow?: { id: string; label: string }
  categories: FontCategory[]
}) {
  const { state, effective, set } = useStudio()
  const label = useRowLabel(labelProp)
  const value = state[axis]
  const resolved = effective[axis]
  const onChange = set(axis)
  const following = follow?.id === value
  useLoadedFamilies([resolved])
  return (
    <Select
      className="w-full"
      selectedKey={following ? null : value}
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
        <span className="pointer-events-none relative flex min-w-0 items-center gap-2 pr-2.5">
          {follow && !following && (
            <ChipButton onPress={() => onChange(follow.id)}>
              <span className="capitalize">{follow.id}</span>
            </ChipButton>
          )}
          <span
            className="truncate text-[13px] font-medium text-fg/70"
            style={{ fontFamily: fontStack(resolved) }}
          >
            {following ? follow.label : resolved}
          </span>
          <ChevronDownIcon className={DIAL_CHEVRON} />
        </span>
      </div>
      <PanelPopoverTitle.Provider value={label}>
        <FontListPopover categories={categories} />
      </PanelPopoverTitle.Provider>
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

/* -------------------------------- Specimens -------------------------------- */

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

/** A section label as list-box and sidebar draw it. */
function SectionLabel({ labels, mono }: { labels: string; mono: string }) {
  const sentence = labels === "sentence"
  return (
    <span
      className={cn(
        "font-medium text-fg/50",
        sentence ? "text-xs" : "tracking-wider uppercase",
        labels === "caps" && "text-[11px]",
        labels === "mono-caps" && "text-xs",
      )}
      style={labels === "mono-caps" ? { fontFamily: fontStack(mono) } : {}}
    >
      {sentence ? "Section" : "Label"}
    </span>
  )
}

/* ---------------------------------- Rows ----------------------------------- */

const HeadingRow = () => (
  <FontRow
    axis="headingFont"
    label="Heading"
    follow={SAME_AS_BODY}
    categories={["sans-serif", "serif", "display", "handwriting"]}
  />
)

const BodyRow = () => (
  <FontRow axis="bodyFont" label="Body" categories={["sans-serif", "serif"]} />
)

const MonoRow = () => (
  <FontRow axis="monoFont" label="Mono" categories={["mono"]} />
)

const ReadingRow = () => (
  <FontRow
    axis="readingFont"
    label="Reading"
    follow={SAME_AS_BODY}
    categories={["serif", "sans-serif"]}
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
        preview: (
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
  <DialSegmented
    axis="uiTextSize"
    label="UI text size"
    options={UI_TEXT_OPTIONS}
  />
)

const FieldTextRow = () => (
  <DialSegmented
    axis="fieldTextSize"
    label="Field text"
    options={FIELD_TEXT_OPTIONS}
  />
)

const LABEL_WEIGHT_ROW_OPTIONS = LABEL_WEIGHT_OPTIONS.map((option) => ({
  ...option,
  preview: (
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

function SectionLabelsRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="sectionLabels"
      label="Section labels"
      rowPreview={false}
      options={SECTION_LABEL_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <SectionLabel labels={option.value} mono={effective.monoFont} />
        ),
      }))}
    />
  )
}

/* --------------------------------- Section --------------------------------- */

export function TypeSection() {
  return (
    <>
      <Row axis="headingFont" />
      <Row axis="bodyFont" />
      <Row axis="titleStyle" />
      <DialGap />
      <Row axis="monoFont" />
      <Row axis="readingFont" />
      <Row axis="uiTextSize" />
      <Row axis="fieldTextSize" />
      <Row axis="labelWeight" />
      <Row axis="sectionLabels" />
    </>
  )
}

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
