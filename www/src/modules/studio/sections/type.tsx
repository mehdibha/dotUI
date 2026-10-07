"use client"

/* Typography: the hero sets every role in its own face and size. */

import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Select } from "@/registry/ui/select"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import { densityTier } from "../axes/space.meta"
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
import { FamilyHero, HeroMember, More, UsesRow } from "../family-page"
import type { RowMap } from "../family-page"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import type { Effective, Studio } from "../state"
import { ChipButton } from "../use-axis"
import type { AxisKey } from "../use-axis"

/** A font role as a dial row, its family set in its own face. */
function FontRow({
  axis,
  label,
  value,
  resolved,
  follow,
  categories,
  onChange,
}: {
  axis: AxisKey
  label: string
  value: string
  /** The face the row is set in (the followed one while following). */
  resolved: string
  follow?: { id: string; label: string }
  categories: FontCategory[]
  onChange: (family: string) => void
}) {
  const following = follow?.id === value
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

const SAME_AS_BODY = { id: "same", label: "Same as body" }

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

/** Control text in px: density's rung unless a size is pinned. */
const uiPx = (state: Effective) =>
  state.uiTextSize === "auto"
    ? densityTier(state.density).text
    : Number(state.uiTextSize)

/** Field values: the control text, or one rung above it. */
const fieldPx = (state: Effective) =>
  state.fieldTextSize === "same"
    ? uiPx(state)
    : densityTier(state.density).text + 2

function FieldSpecimen({ px }: { px: number }) {
  return (
    <span
      className="flex h-7 w-14 items-center rounded-md border border-fg/20 px-1.5 text-fg/80"
      style={{ fontSize: px }}
    >
      Aa
    </span>
  )
}

/* --------------------------------- Section --------------------------------- */

const MORE_KEYS = [
  "monoFont",
  "readingFont",
  "uiTextSize",
  "fieldTextSize",
  "labelWeight",
  "sectionLabels",
] as const

export function TypeSection({ studio }: { studio: Studio }) {
  const { state, effective, set } = studio
  useLoadedFamilies([
    effective.headingFont,
    effective.bodyFont,
    effective.readingFont,
    effective.monoFont,
  ])
  const face = (family: string) => ({ fontFamily: fontStack(family) })
  return (
    <>
      <FamilyHero>
        <HeroMember name="Titles">
          <span
            className="text-[17px]/none"
            style={{
              ...face(effective.headingFont),
              ...titleSpecimen(effective.titleStyle),
            }}
          >
            Title
          </span>
        </HeroMember>
        <HeroMember name="Body">
          <span className="text-[14px]/none" style={face(effective.bodyFont)}>
            Body
          </span>
        </HeroMember>
        <HeroMember name="Reading">
          <span
            className="text-[15px]/none"
            style={face(effective.readingFont)}
          >
            Reading
          </span>
        </HeroMember>
        <HeroMember name="Mono">
          <span className="text-[13px]/none" style={face(effective.monoFont)}>
            Mono
          </span>
        </HeroMember>
        <HeroMember name="Section labels">
          <SectionLabel
            labels={effective.sectionLabels}
            mono={effective.monoFont}
          />
        </HeroMember>
        <HeroMember name="Field text">
          <FieldSpecimen px={fieldPx(effective)} />
        </HeroMember>
      </FamilyHero>
      <FontRow
        axis="headingFont"
        label="Heading"
        value={state.headingFont}
        resolved={effective.headingFont}
        follow={SAME_AS_BODY}
        categories={["sans-serif", "serif", "display", "handwriting"]}
        onChange={set("headingFont")}
      />
      <FontRow
        axis="bodyFont"
        label="Body"
        value={state.bodyFont}
        resolved={state.bodyFont}
        categories={["sans-serif", "serif"]}
        onChange={set("bodyFont")}
      />
      <DialSelect
        axis="titleStyle"
        label="Titles"
        options={TITLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <span
              className="text-[13px] text-fg/80"
              style={{
                ...face(effective.headingFont),
                ...titleSpecimen(option.value),
              }}
            >
              Aa
            </span>
          ),
        }))}
      />
      <DialGap />
      <UsesRow axis="density" label="Density" />
      <More keys={MORE_KEYS}>
        <FontRow
          axis="monoFont"
          label="Mono"
          value={state.monoFont}
          resolved={state.monoFont}
          categories={["mono"]}
          onChange={set("monoFont")}
        />
        <FontRow
          axis="readingFont"
          label="Reading"
          value={state.readingFont}
          resolved={effective.readingFont}
          follow={SAME_AS_BODY}
          categories={["serif", "sans-serif"]}
          onChange={set("readingFont")}
        />
        <DialSegmented
          axis="uiTextSize"
          label="UI text size"
          options={UI_TEXT_OPTIONS}
        />
        <DialSegmented
          axis="fieldTextSize"
          label="Field text"
          options={FIELD_TEXT_OPTIONS}
        />
        <DialSelect
          axis="labelWeight"
          label="Label weight"
          options={LABEL_WEIGHT_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <span
                className="text-[13px] text-fg/80"
                style={{ fontWeight: WEIGHTS[option.value] }}
              >
                Aa
              </span>
            ),
          }))}
        />
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
      </More>
    </>
  )
}

export const ROWS: RowMap = {}
