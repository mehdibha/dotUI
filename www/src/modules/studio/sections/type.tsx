"use client"

/* Typography — the three font roles, each row set in its own face so the row
   is the specimen. Heading matches Font until pinned. */

import { Button as RacButton } from "react-aria-components"

import { fontStack } from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"
import { cn } from "@/registry/lib/utils"
import { Label } from "@/registry/ui/field"
import { Select } from "@/registry/ui/select"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { useLoadedFamilies } from "@/modules/studio/fonts"

import { DIAL_LABEL, DIAL_PRESS, DIAL_ROW } from "../dial"
import { FontListPopover, PanelPopoverTitle } from "../rows"
import type { Studio, StudioState } from "../state"

/** A font role as a dial row: label, the family in its own typeface, the
 *  searchable list under it. `children` sit above the list. */
function FontRow({
  label,
  value,
  derived,
  categories,
  onChange,
  children,
}: {
  label: string
  value: string
  /** The family followed while `value` is ''. */
  derived?: string
  categories: FontCategory[]
  onChange: (family: string) => void
  children?: React.ReactNode
}) {
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
        <span className="pointer-events-none relative flex min-w-0 items-center gap-2 pr-3">
          <span
            className="truncate text-[13px] font-medium text-fg/60"
            style={{ fontFamily: fontStack(resolved) }}
          >
            {resolved}
          </span>
        </span>
      </div>
      <PanelPopoverTitle.Provider value={label}>
        <FontListPopover categories={categories}>{children}</FontListPopover>
      </PanelPopoverTitle.Provider>
    </Select>
  )
}

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
        categories={["sans-serif", "serif", "display", "handwriting"]}
        onChange={set("headingFont")}
      >
        <Switch
          size="sm"
          isSelected={state.headingFont === ""}
          onChange={(match) => set("headingFont")(match ? "" : state.bodyFont)}
        >
          <Label className="flex-1">Match font</Label>
          <SwitchControl />
        </Switch>
      </FontRow>
      <FontRow
        label="Font"
        value={state.bodyFont}
        categories={["sans-serif", "serif"]}
        onChange={set("bodyFont")}
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
