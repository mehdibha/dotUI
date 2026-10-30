"use client"

/* Buttons — one recipe shared by toggles, groups, segmented, pagination. */

import { useMemo } from "react"

import { ComponentParamsProvider } from "@/lib/styles"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useToggleStyles } from "@/registry/ui/toggle-button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { StudioState } from "../axes"
import { SEPARATOR_OPTIONS } from "../axes/button-groups.meta"
import {
  CASE_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
  SECONDARY_OPTIONS,
} from "../axes/buttons.meta"
import { CURRENT_OPTIONS } from "../axes/pagination.meta"
import {
  SELECTED_OPTIONS as CHIP_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control.meta"
import { SELECTED_OPTIONS as TOGGLE_OPTIONS } from "../axes/toggles.meta"
import { DialGlyph, DialSelect } from "../dial"
import { designSystemOf } from "../resolve"
import type { RowMap } from "../row-host"
import { useStudio } from "../use-studio"

/* The button vars a pick writes (Pill corners), set where specimens render. */
const LOCAL_VARS = ["--studio-btn-radius", "--studio-btn-xs-radius"]

/** Specimens drawn by the registry's own recipes in one design system. */
export function System({
  ds,
  children,
}: {
  ds: DesignSystem
  children: React.ReactNode
}) {
  const style = Object.fromEntries(
    LOCAL_VARS.flatMap((name) =>
      ds.tokens[name] ? [[name, ds.tokens[name]]] : [],
    ),
  ) as React.CSSProperties
  return (
    <ComponentParamsProvider params={ds.componentParams} density="default">
      <span className="flex items-center gap-1.5" style={style}>
        {children}
      </span>
    </ComponentParamsProvider>
  )
}

/** `options`, each with `glyph` drawn in its own design system. */
function useGlyphs<T extends { value: string }>(
  key: keyof StudioState,
  options: readonly T[],
  glyph: React.ReactNode,
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
    glyph: <System ds={ds}>{glyph}</System>,
  }))
}

export function PrimaryButton() {
  const styles = useButtonStyles()
  return (
    <span data-button="" className={styles({ variant: "primary", size: "xs" })}>
      Save
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

function ButtonSecondaryRow() {
  return (
    <DialSelect
      axis="buttonSecondary"
      label="Secondary"
      options={SECONDARY_OPTIONS}
    />
  )
}

function ButtonRadiusRow() {
  return (
    <DialSelect axis="buttonRadius" label="Corners" options={RADIUS_OPTIONS} />
  )
}

function ButtonPressRow() {
  return <DialSelect axis="buttonPress" label="Press" options={PRESS_OPTIONS} />
}

function ButtonCaseRow() {
  return <DialSelect axis="buttonCase" label="Case" options={CASE_OPTIONS} />
}

function ToggleSelectedRow() {
  const options = useGlyphs(
    "toggleSelected",
    TOGGLE_OPTIONS,
    <SelectedToggle />,
  )
  return <DialSelect axis="toggleSelected" label="Selected" options={options} />
}

function GroupSeparatorRow() {
  return (
    <DialSelect
      axis="groupSeparator"
      label="Seam"
      options={SEPARATOR_OPTIONS}
    />
  )
}

function SegmentedSelectedRow() {
  return (
    <DialSelect
      axis="segmentedSelected"
      label="Segmented chip"
      options={CHIP_OPTIONS}
    />
  )
}

function SegmentedTrackRow() {
  return (
    <DialSelect axis="segmentedTrack" label="Track" options={TRACK_OPTIONS} />
  )
}

const CURRENT_ROW = CURRENT_OPTIONS.map((option) => ({
  ...option,
  glyph: (
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
