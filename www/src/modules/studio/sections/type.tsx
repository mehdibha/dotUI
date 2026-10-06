"use client"

/* Typography — the three font roles, each row set in its own face so the row
   is the specimen (Heading is Same as body until pinned), then the title
   recipe, the UI text size, the weight of action labels and the case of
   section labels. */

import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Select } from "@/registry/ui/select"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import {
  LABEL_WEIGHT_OPTIONS,
  SECTION_LABEL_OPTIONS,
  TITLE_OPTIONS,
  TITLE_VOICE,
  UI_TEXT_OPTIONS,
} from "../axes/type"
import {
  DIAL_CHEVRON,
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGap,
  DialSegmented,
  DialSelect,
} from "../dial"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import type { Effective, Studio } from "../state"
import { ChipButton } from "../use-axis"

/** A font role as a dial row: label, the family in its own typeface, the
 *  searchable list under it. With `follow`, the row reads "Same as body"
 *  while it follows, and offers the way back once pinned. */
function FontRow({
  label,
  value,
  resolved,
  follow,
  categories,
  onChange,
}: {
  label: string
  value: string
  /** The family the row shows (the followed one while following). */
  resolved: string
  follow?: { id: string; label: string }
  categories: FontCategory[]
  onChange: (family: string) => void
}) {
  const following = follow?.id === value
  useLoadedFamilies([resolved])
  return (
    <Select
      className="w-full"
      selectedKey={following ? null : value}
      onSelectionChange={(key) => onChange(key as string)}
      aria-label={label}
    >
      <div className={cn(DIAL_ROW, "relative pr-0")}>
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
              {follow.label}
            </ChipButton>
          )}
          {following && (
            <span className="shrink-0 text-[13px] font-medium text-fg/50">
              {follow.label} ·
            </span>
          )}
          <span
            className="truncate text-[13px] font-medium text-fg/70"
            style={{ fontFamily: fontStack(resolved) }}
          >
            {resolved}
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

export function TypeSection({ studio }: { studio: Studio }) {
  const { state, effective, set } = studio
  return (
    <>
      <FontRow
        label="Heading"
        value={state.headingFont}
        resolved={effective.headingFont}
        follow={SAME_AS_BODY}
        categories={["sans-serif", "serif", "display", "handwriting"]}
        onChange={set("headingFont")}
      />
      <FontRow
        label="Body"
        value={state.bodyFont}
        resolved={state.bodyFont}
        categories={["sans-serif", "serif"]}
        onChange={set("bodyFont")}
      />
      <FontRow
        label="Mono"
        value={state.monoFont}
        resolved={state.monoFont}
        categories={["mono"]}
        onChange={set("monoFont")}
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
                fontFamily: fontStack(effective.headingFont),
                ...titleSpecimen(option.value),
              }}
            >
              Aa
            </span>
          ),
        }))}
      />
      <DialGap />
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
      <DialSegmented
        axis="uiTextSize"
        label="UI text size"
        options={UI_TEXT_OPTIONS}
      />
      <DialSegmented
        axis="sectionLabels"
        label="Section labels"
        options={SECTION_LABEL_OPTIONS}
      />
    </>
  )
}
