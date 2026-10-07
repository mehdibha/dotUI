"use client"

/* Typography — the three font roles, each row set in its own face so the row
   is the specimen. Heading reads Auto on the body font until pinned. */

import { memo, useMemo } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Select } from "@/registry/ui/select"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import {
  DIAL_CHEVRON,
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DIAL_VALUE,
} from "../dial"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import type { Studio, StudioState } from "../state"

const HEADING_CATEGORIES: FontCategory[] = [
  "sans-serif",
  "serif",
  "display",
  "handwriting",
]
const BODY_CATEGORIES: FontCategory[] = ["sans-serif", "serif"]
const MONO_CATEGORIES: FontCategory[] = ["mono"]

/** A font role as a dial row: label, the family in its own typeface, the
 *  searchable list under it. With `derived`, '' reads Auto on that family. */
const FontRow = memo(function FontRow({
  label,
  value,
  derived,
  categories,
  onChange,
}: {
  label: string
  value: string
  /** The family followed while `value` is ''. */
  derived?: string
  categories: FontCategory[]
  onChange: (family: string) => void
}) {
  const auto = derived !== undefined && value === ""
  const resolved = value || derived || ""
  useLoadedFamilies([resolved])
  // The Select's collection: one element, so a new value doesn't rebuild
  // its hundreds of hidden items.
  const list = useMemo(
    () => (
      <PanelPopoverTitle.Provider value={label}>
        <FontListPopover categories={categories} onPreview={onChange} />
      </PanelPopoverTitle.Provider>
    ),
    [label, categories, onChange],
  )
  return (
    <Select
      className="w-full"
      selectedKey={value || null}
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
          {auto && <span className={DIAL_VALUE}>Auto ·</span>}
          <span
            className="truncate text-[13px] font-medium text-fg/70"
            style={{ fontFamily: fontStack(resolved) }}
          >
            {resolved}
          </span>
          <ChevronDownIcon className={DIAL_CHEVRON} />
        </span>
      </div>
      {list}
    </Select>
  )
})

/** Beside the title: Aa in the heading face. */
export function TypePreview({ state }: { state: StudioState }) {
  const heading = state.headingFont || state.bodyFont
  useLoadedFamilies([heading])
  return (
    <span
      className="text-[15px]/none font-semibold"
      style={{ fontFamily: fontStack(heading) }}
    >
      Aa
    </span>
  )
}

export function TypeSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <FontRow
        label="Heading"
        value={state.headingFont}
        derived={state.bodyFont}
        categories={HEADING_CATEGORIES}
        onChange={set("headingFont")}
      />
      <FontRow
        label="Body"
        value={state.bodyFont}
        categories={BODY_CATEGORIES}
        onChange={set("bodyFont")}
      />
      <FontRow
        label="Mono"
        value={state.monoFont}
        categories={MONO_CATEGORIES}
        onChange={set("monoFont")}
      />
    </>
  )
}
