"use client"

/* Navigation: how the current location is marked in tabs, the sidebar,
   links and breadcrumbs. */

import { useMemo } from "react"

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { UPPERCASE } from "@/registry/ui/button/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import {
  WEIGHT_BOLD,
  WEIGHT_MEDIUM,
  WEIGHT_MEDIUM_SEMIBOLD,
  WEIGHT_REGULAR,
  WEIGHT_REGULAR_MEDIUM,
  WEIGHT_REGULAR_SEMIBOLD,
  WEIGHT_SEMIBOLD,
} from "@/registry/ui/segmented-control/styles"
import { useStyles as useSidebarStyles } from "@/registry/ui/sidebar/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import { parseState } from "../axes"
import type { StudioState } from "../axes"
import { ANCESTOR_OPTIONS, SEPARATOR_OPTIONS } from "../axes/breadcrumbs.meta"
import { SOURCE_OPTIONS } from "../axes/color.meta"
import { LINK_COLOR_OPTIONS, UNDERLINE_OPTIONS } from "../axes/links.meta"
import {
  CASE_OPTIONS,
  INDICATOR_OPTIONS,
  ITEM_WEIGHT_OPTIONS,
  MARKER_OPTIONS,
  PILL_OPTIONS,
  TAB_STYLE_OPTIONS,
  WEIGHT_OPTIONS,
} from "../axes/navigation.meta"
import { DialGap, DialSegmented, DialSelect } from "../dial"
import { MemberSection, Row } from "../family-page"
import type { RowMap } from "../family-page"
import { designSystemOf } from "../resolve"
import type { Effective, Studio } from "../state"
import { useStudio } from "../use-studio"

/* -------------------------------- Specimens -------------------------------- */

/* The tokens a pick writes that a specimen draws with (the shell tone, the
   pill marker's corners). */
const LOCAL_VARS = ["--color-sidebar", "--studio-sidebar-button-radius"]

/** Specimens drawn by the registry's own recipes in one design system. */
function System({
  ds,
  children,
}: {
  ds: DesignSystem
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({ params: ds.componentParams, density: "compact" as const }),
    [ds],
  )
  const style = Object.fromEntries(
    LOCAL_VARS.flatMap((name) =>
      ds.tokens[name] ? [[name, ds.tokens[name]]] : [],
    ),
  ) as React.CSSProperties
  return (
    <DesignSystemContext.Provider value={value}>
      <span className="flex items-center gap-1.5 text-fg" style={style}>
        {children}
      </span>
    </DesignSystemContext.Provider>
  )
}

/** One design system per option of `key`, over the current picks. */
function useSystems(
  state: StudioState,
  key: keyof StudioState,
  options: readonly { value: string }[],
) {
  return useMemo(
    () =>
      Object.fromEntries(
        options.map(({ value }) => [
          value,
          designSystemOf({ ...state, [key]: value } as StudioState),
        ]),
      ),
    [state, key, options],
  )
}

const TABS = ["Code", "Docs"]

/** A tab list, the first tab selected, in the system's default variant. */
function TabsSpecimen() {
  const { root, list, item, indicator } = useTabsStyles()()
  const horizontal = { orientation: "horizontal" } as const
  return (
    <span className={root(horizontal)}>
      <span data-orientation="horizontal" className={list(horizontal)}>
        {TABS.map((label, i) => (
          <span
            key={label}
            data-orientation="horizontal"
            data-selected={i === 0 || undefined}
            className={item(horizontal)}
          >
            {i === 0 && (
              <span
                data-orientation="horizontal"
                className={indicator(horizontal)}
              />
            )}
            <span className="relative z-10">{label}</span>
          </span>
        ))}
      </span>
    </span>
  )
}

/** Sidebar items on the sidebar's tone, the first current. */
function SidebarSpecimen() {
  const { menuButton } = useSidebarStyles()()
  return (
    <span className="flex w-20 flex-col gap-0.5 rounded-md bg-sidebar p-1">
      {["Inbox", "Drafts"].map((label, i) => (
        <span
          key={label}
          data-size="sm"
          data-active={i === 0 || undefined}
          className={menuButton()}
        >
          {label}
        </span>
      ))}
    </span>
  )
}

function LinkSpecimen() {
  const link = useLinkStyles()
  return (
    <span data-rac="" className={cn(link(), "text-sm")}>
      Pricing
    </span>
  )
}

const WEIGHTS: Record<string, { item: string }> = {
  regular: WEIGHT_REGULAR,
  "regular-medium": WEIGHT_REGULAR_MEDIUM,
  "regular-semibold": WEIGHT_REGULAR_SEMIBOLD,
  medium: WEIGHT_MEDIUM,
  "medium-semibold": WEIGHT_MEDIUM_SEMIBOLD,
  semibold: WEIGHT_SEMIBOLD,
  bold: WEIGHT_BOLD,
}

/** A label at rest, then current, in the registry's weight classes. */
function WeightGlyph({ weight }: { weight: string }) {
  const { item } = WEIGHTS[weight]!
  return (
    <span className="flex items-center gap-1 text-[13px]">
      <span className={cn(item, "text-fg/50")}>Aa</span>
      <span data-selected="" className={cn(item, "text-fg")}>
        Aa
      </span>
    </span>
  )
}

/** A tab label in the registry's case classes. */
function CaseGlyph({ upper }: { upper: boolean }) {
  return (
    <span className={cn("text-[13px] font-medium", upper && UPPERCASE)}>
      Tabs
    </span>
  )
}

const weightOptions = (options: typeof ITEM_WEIGHT_OPTIONS) =>
  options.map((option) => ({
    ...option,
    preview: WEIGHTS[option.value] && <WeightGlyph weight={option.value} />,
  }))

/* ---------------------------------- Rows ---------------------------------- */

function TabStyleRow() {
  const { state } = useStudio()
  const styles = useSystems(state, "tabStyle", TAB_STYLE_OPTIONS)
  return (
    <DialSelect
      axis="tabStyle"
      label="Tabs"
      rowPreview={false}
      options={TAB_STYLE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={styles[option.value]!}>
            <TabsSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function NavMarkerRow() {
  const { state } = useStudio()
  const markers = useSystems(state, "navMarker", MARKER_OPTIONS)
  return (
    <DialSelect
      axis="navMarker"
      label="Current item"
      rowPreview={false}
      options={MARKER_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={markers[option.value]!}>
            <SidebarSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function TabsColorRow() {
  return (
    <DialSegmented
      axis="tabsColor"
      label="Indicator color"
      options={SOURCE_OPTIONS}
    />
  )
}

function TabIndicatorRow() {
  const { state } = useStudio()
  const indicators = useSystems(
    { ...state, tabStyle: "line" } as StudioState,
    "tabIndicator",
    INDICATOR_OPTIONS,
  )
  return (
    <DialSelect
      axis="tabIndicator"
      label="Line indicator"
      rowPreview={false}
      options={INDICATOR_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={indicators[option.value]!}>
            <TabsSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function NavWeightRow() {
  return (
    <DialSelect
      axis="navWeight"
      label="Weight"
      options={weightOptions(WEIGHT_OPTIONS)}
    />
  )
}

function NavItemWeightRow() {
  return (
    <DialSelect
      axis="navItemWeight"
      label="Sidebar weight"
      options={weightOptions(ITEM_WEIGHT_OPTIONS)}
    />
  )
}

function NavCaseRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="navCase"
      label="Case"
      options={CASE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <CaseGlyph
            upper={
              (option.value === "same"
                ? effective.buttonCase
                : option.value) === "uppercase"
            }
          />
        ),
      }))}
    />
  )
}

function TabsPillRow() {
  const { state } = useStudio()
  const pills = useSystems(
    { ...state, tabStyle: "pill" } as StudioState,
    "tabsPill",
    PILL_OPTIONS,
  )
  return (
    <DialSelect
      axis="tabsPill"
      label="Pill fill"
      rowPreview={false}
      options={PILL_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={pills[option.value]!}>
            <TabsSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function LinkUnderlineRow() {
  const { state } = useStudio()
  const underlines = useSystems(state, "linkUnderline", UNDERLINE_OPTIONS)
  return (
    <DialSelect
      axis="linkUnderline"
      label="Underline"
      options={UNDERLINE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={underlines[option.value]!}>
            <LinkSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function LinkColorRow() {
  return (
    <DialSegmented
      axis="linkColor"
      label="Color"
      options={LINK_COLOR_OPTIONS}
    />
  )
}

function BreadcrumbSeparatorRow() {
  return (
    <DialSegmented
      axis="breadcrumbSeparator"
      label="Separator"
      options={SEPARATOR_OPTIONS}
    />
  )
}

function BreadcrumbToneRow() {
  return (
    <DialSegmented
      axis="breadcrumbTone"
      label="Ancestors"
      options={ANCESTOR_OPTIONS}
    />
  )
}

export const ROWS: RowMap = {
  tabStyle: TabStyleRow,
  navMarker: NavMarkerRow,
  tabsColor: TabsColorRow,
  tabIndicator: TabIndicatorRow,
  navWeight: NavWeightRow,
  navItemWeight: NavItemWeightRow,
  navCase: NavCaseRow,
  tabsPill: TabsPillRow,
  linkUnderline: LinkUnderlineRow,
  linkColor: LinkColorRow,
  breadcrumbSeparator: BreadcrumbSeparatorRow,
  breadcrumbTone: BreadcrumbToneRow,
}

/* --------------------------------- Section --------------------------------- */

export function NavigationPreview({ state }: { state: Effective }) {
  const ds = useMemo(
    () => designSystemOf(parseState({ tabStyle: state.tabStyle })),
    [state.tabStyle],
  )
  return (
    <System ds={ds}>
      <TabsSpecimen />
    </System>
  )
}

export function NavigationSection(_: { studio: Studio }) {
  return (
    <>
      <Row axis="tabStyle" />
      <Row axis="navMarker" />
      <Row axis="tabsColor" />
      <Row axis="tabIndicator" />
      <Row axis="navWeight" />
      <Row axis="navItemWeight" />
      <Row axis="navCase" />
      <Row axis="tabsPill" />
      <DialGap />
      <Row axis="segmentedSelected" />
      <Row axis="shellTone" />
      <Row axis="paginationCurrent" />
      <Row axis="navMotion" />
      <MemberSection id="link" title="Links">
        <Row axis="linkUnderline" />
        <Row axis="linkColor" />
      </MemberSection>
      <MemberSection id="breadcrumbs" title="Breadcrumbs">
        <Row axis="breadcrumbSeparator" />
        <Row axis="breadcrumbTone" />
      </MemberSection>
    </>
  )
}
