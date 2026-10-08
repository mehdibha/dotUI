"use client"

/* Buttons — one recipe shared by toggles, groups, segmented, pagination. */

import { useMemo } from "react"

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useGroupStyles } from "@/registry/ui/group/styles"
import { useStyles as useToggleStyles } from "@/registry/ui/toggle-button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import { parseState } from "../axes"
import type { StudioState } from "../axes"
import { SEPARATOR_OPTIONS } from "../axes/button-groups.meta"
import {
  CASE_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
  SECONDARY_OPTIONS,
  STYLE_OPTIONS,
} from "../axes/buttons.meta"
import { CURRENT_OPTIONS } from "../axes/pagination.meta"
import {
  SELECTED_OPTIONS as CHIP_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control.meta"
import { SELECTED_OPTIONS as TOGGLE_OPTIONS } from "../axes/toggles.meta"
import { DialGap, DialGlyph, DialSegmented, DialSelect } from "../dial"
import { MemberSection, Row } from "../family-page"
import type { RowMap } from "../family-page"
import { designSystemOf } from "../resolve"
import type { Effective, Studio } from "../state"
import { useStudio } from "../use-studio"

/* -------------------------------- Specimens -------------------------------- */

/* The button vars a pick writes (Pill corners), set where specimens render. */
const LOCAL_VARS = ["--studio-btn-radius", "--studio-btn-xs-radius"]

/** Specimens drawn by the registry's own recipes in one design system. */
function System({
  ds,
  children,
}: {
  ds: DesignSystem
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({ params: ds.componentParams, density: "default" as const }),
    [ds],
  )
  const style = Object.fromEntries(
    LOCAL_VARS.flatMap((name) =>
      ds.tokens[name] ? [[name, ds.tokens[name]]] : [],
    ),
  ) as React.CSSProperties
  return (
    <DesignSystemContext.Provider value={value}>
      <span className="flex items-center gap-1.5" style={style}>
        {children}
      </span>
    </DesignSystemContext.Provider>
  )
}

/** `options`, each previewed by `specimen` drawn in its own design system. */
function useSpecimens<T extends { value: string }>(
  key: keyof StudioState,
  options: readonly T[],
  specimen: React.ReactNode,
  /** The row's specimen, when the popover's is wider. */
  glyph?: React.ReactNode,
) {
  const { state } = useStudio()
  const systems = useMemo(
    () =>
      options.map((option) => ({
        option,
        ds: designSystemOf({ ...state, [key]: option.value } as StudioState),
      })),
    [state, key, options],
  )
  return systems.map(({ option, ds }) => ({
    ...option,
    preview: <System ds={ds}>{specimen}</System>,
    ...(glyph && { glyph: <System ds={ds}>{glyph}</System> }),
  }))
}

function ButtonSpecimen({
  variant,
  label,
}: {
  variant: "primary" | "secondary"
  label: string
}) {
  const styles = useButtonStyles()
  return (
    <span data-button="" className={styles({ variant, size: "xs" })}>
      {label}
    </span>
  )
}

/** A selected toggle. */
function SelectedToggle() {
  const styles = useToggleStyles()
  return (
    <span
      data-button=""
      data-icon-only=""
      data-selected
      className={styles({ variant: "secondary", size: "xs", isIconOnly: true })}
    >
      B
    </span>
  )
}

/** Three attached buttons as the group draws their seams. */
function GroupSpecimen() {
  const { root } = useGroupStyles()()
  const styles = useButtonStyles()
  return (
    <span className={root({ orientation: "horizontal" })}>
      {["L", "C", "R"].map((letter) => (
        <span
          key={letter}
          data-button=""
          data-icon-only=""
          className={styles({
            variant: "secondary",
            size: "xs",
            isIconOnly: true,
          })}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

const CORNER: Record<string, string> = {
  same: "rounded-[4px]",
  pill: "rounded-full",
}

function CornerGlyph({ corners }: { corners: string }) {
  return (
    <span
      className={cn("h-4 w-7 shrink-0 border border-fg/40", CORNER[corners])}
    />
  )
}

const CHIP: Record<string, string> = {
  tone: "bg-selected text-fg-on-selected",
  raised: "bg-bg text-fg shadow-sm ring-1 ring-border-control",
  ring: "bg-bg text-fg ring-1 ring-border-control",
  inverse: "bg-inverse text-fg-inverse",
}

/** A three-segment control: the chip against its track. */
function SegmentedGlyph({ chip, track }: { chip: string; track: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 rounded-[5px] p-[2px]",
        track === "outline" ? "border border-border" : "bg-muted",
      )}
    >
      {["A", "B", "C"].map((letter, i) => (
        <span
          key={letter}
          className={cn(
            "flex h-3 items-center rounded-[3px] px-1 text-[8px] font-medium text-fg-muted",
            i === 0 && CHIP[chip],
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

/** The current page among quiet ones. */
function CurrentGlyph({ current }: { current: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {current === "primary" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
        />
      ) : current === "selected" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
          opacity=".25"
        />
      ) : (
        <rect
          x="8.25"
          y="8.25"
          width="7.5"
          height="7.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}

/* ---------------------------------- Rows ---------------------------------- */

function ButtonStyleRow() {
  // A style draws the secondary too (unless Secondary overrides it).
  const options = useSpecimens(
    "buttonStyle",
    STYLE_OPTIONS,
    <span className="flex gap-1">
      <ButtonSpecimen variant="secondary" label="Cancel" />
      <ButtonSpecimen variant="primary" label="Save" />
    </span>,
    <ButtonSpecimen variant="primary" label="Save" />,
  )
  return (
    <DialSelect axis="buttonStyle" label="Button style" options={options} />
  )
}

function ButtonSecondaryRow() {
  const options = useSpecimens(
    "buttonSecondary",
    SECONDARY_OPTIONS,
    <ButtonSpecimen variant="secondary" label="Cancel" />,
  )
  return (
    <DialSelect
      axis="buttonSecondary"
      label="Secondary"
      rowPreview={false}
      options={options}
    />
  )
}

const CORNER_ROW = RADIUS_OPTIONS.map((option) => ({
  ...option,
  preview: <CornerGlyph corners={option.value} />,
}))

function ButtonRadiusRow() {
  return (
    <DialSelect
      axis="buttonRadius"
      label="Corners"
      rowPreview={false}
      options={CORNER_ROW}
    />
  )
}

function ButtonPressRow() {
  return (
    <DialSegmented axis="buttonPress" label="Press" options={PRESS_OPTIONS} />
  )
}

function ButtonCaseRow() {
  return <DialSegmented axis="buttonCase" label="Case" options={CASE_OPTIONS} />
}

function ToggleSelectedRow() {
  const options = useSpecimens(
    "toggleSelected",
    TOGGLE_OPTIONS,
    <SelectedToggle />,
  )
  return <DialSelect axis="toggleSelected" label="Selected" options={options} />
}

function GroupSeparatorRow() {
  const options = useSpecimens(
    "groupSeparator",
    SEPARATOR_OPTIONS,
    <GroupSpecimen />,
  )
  return (
    <DialSelect
      axis="groupSeparator"
      rowPreview={false}
      label="Seam"
      options={options}
    />
  )
}

function SegmentedSelectedRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="segmentedSelected"
      rowPreview={false}
      label="Segmented chip"
      options={CHIP_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <SegmentedGlyph
            chip={
              option.value === "auto"
                ? effective.segmentedSelected
                : option.value
            }
            track={effective.segmentedTrack}
          />
        ),
      }))}
    />
  )
}

function SegmentedTrackRow() {
  return (
    <DialSegmented
      axis="segmentedTrack"
      label="Track"
      options={TRACK_OPTIONS}
    />
  )
}

const CURRENT_ROW = CURRENT_OPTIONS.map((option) => ({
  ...option,
  preview: (
    <DialGlyph>
      <CurrentGlyph current={option.value} />
    </DialGlyph>
  ),
}))

function PaginationCurrentRow() {
  return (
    <DialSelect
      axis="paginationCurrent"
      label="Current page"
      options={CURRENT_ROW}
    />
  )
}

export const ROWS: RowMap = {
  buttonStyle: ButtonStyleRow,
  buttonSecondary: ButtonSecondaryRow,
  buttonRadius: ButtonRadiusRow,
  buttonPress: ButtonPressRow,
  buttonCase: ButtonCaseRow,
  toggleSelected: ToggleSelectedRow,
  groupSeparator: GroupSeparatorRow,
  segmentedSelected: SegmentedSelectedRow,
  segmentedTrack: SegmentedTrackRow,
  paginationCurrent: PaginationCurrentRow,
}

/* --------------------------------- Section --------------------------------- */

export function ButtonsPreview({ state }: { state: Effective }) {
  const ds = useMemo(
    () => designSystemOf(parseState({ buttonStyle: state.buttonStyle })),
    [state.buttonStyle],
  )
  return (
    <System ds={ds}>
      <ButtonSpecimen variant="primary" label="Save" />
    </System>
  )
}

export function ButtonsSection(_: { studio: Studio }) {
  return (
    <>
      <Row axis="buttonStyle" />
      <DialGap />
      <Row axis="buttonSecondary" />
      <Row axis="buttonRadius" />
      <Row axis="buttonColor" />
      <Row axis="labelWeight" />
      <Row axis="buttonMotion" />
      <Row axis="buttonPress" />
      <Row axis="buttonCase" />
      <MemberSection id="toggle" title="Toggles">
        <Row axis="toggleSelected" />
      </MemberSection>
      <MemberSection id="group" title="Groups">
        <Row axis="groupSeparator" />
      </MemberSection>
      <MemberSection id="segmented" title="Segmented">
        <Row axis="segmentedSelected" />
        <Row axis="segmentedTrack" />
      </MemberSection>
      <MemberSection id="pagination" title="Pagination">
        <Row axis="paginationCurrent" />
      </MemberSection>
    </>
  )
}
