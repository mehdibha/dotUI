"use client"

/* Typography — the three font roles, each row set in its own face so the row
   is the specimen. Heading reads Auto on the body font until pinned. */

import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"
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
import type { Studio } from "../state"

/** A font role as a dial row: label, the family in its own typeface, the
 *  searchable list under it. With `derived`, '' reads Auto on that family
 *  and a reset appears once pinned. */
function FontRow({
  label,
  value,
  derived,
  categories,
  onChange,
  onReset,
}: {
  label: string
  value: string
  /** The family followed while `value` is ''. */
  derived?: string
  categories: FontCategory[]
  onChange: (family: string) => void
  onReset?: () => void
}) {
  const auto = derived !== undefined && value === ""
  const resolved = value || derived || ""
  useLoadedFamilies([resolved])
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
          {onReset && !auto && (
            <RacButton
              aria-label={`Reset ${label} to auto`}
              onPress={onReset}
              className="pointer-events-auto flex size-5 cursor-interactive items-center justify-center rounded-md text-fg/60 focus-reset hover:text-fg focus-visible:focus-ring pointer-coarse:size-7"
            >
              <RotateCcwIcon className="size-3.5" />
            </RacButton>
          )}
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
      <PanelPopoverTitle.Provider value={label}>
        <FontListPopover categories={categories} />
      </PanelPopoverTitle.Provider>
    </Select>
  )
}

export function TypeSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <FontRow
        label="Body"
        value={state.bodyFont}
        categories={["sans-serif", "serif"]}
        onChange={set("bodyFont")}
      />
      <FontRow
        label="Heading"
        value={state.headingFont}
        derived={state.bodyFont}
        categories={["sans-serif", "serif", "display", "handwriting"]}
        onChange={set("headingFont")}
        onReset={() => set("headingFont")("")}
      />
      <FontRow
        label="Mono"
        value={state.monoFont}
        categories={["mono"]}
        onChange={set("monoFont")}
      />
    </>
  )
}
