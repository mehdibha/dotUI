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
import {
  DialGap,
  DialGlyph,
  DialList,
  DialSegmented,
  DialSelect,
} from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { RowMap } from "../family-page"
import { designSystemOf } from "../resolve"
import type { Effective, Studio } from "../state"

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

function Buttons({ secondaryOnly }: { secondaryOnly?: boolean }) {
  return (
    <>
      {!secondaryOnly && <ButtonSpecimen variant="primary" label="Save" />}
      <ButtonSpecimen variant="secondary" label="Cancel" />
    </>
  )
}

/** A toggle off and on; `on` alone for an option's specimen. */
function Toggles({ on }: { on?: boolean }) {
  const styles = useToggleStyles()
  const toggle = (selected: boolean) => (
    <span
      key={String(selected)}
      data-button=""
      data-icon-only=""
      data-selected={selected || undefined}
      className={styles({ variant: "secondary", size: "xs", isIconOnly: true })}
    >
      B
    </span>
  )
  return on ? toggle(true) : [toggle(false), toggle(true)]
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

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { state, effective, designSystem } = studio
  const styles = useSystems(state, "buttonStyle", STYLE_OPTIONS)
  const secondaries = useSystems(state, "buttonSecondary", SECONDARY_OPTIONS)
  const toggles = useSystems(state, "toggleSelected", TOGGLE_OPTIONS)
  const seams = useSystems(state, "groupSeparator", SEPARATOR_OPTIONS)
  return (
    <>
      <FamilyHero>
        <HeroMember name="Button">
          <System ds={designSystem}>
            <Buttons />
          </System>
        </HeroMember>
        <HeroMember name="Toggle button">
          <System ds={designSystem}>
            <Toggles />
          </System>
        </HeroMember>
        <HeroMember name="Group">
          <System ds={designSystem}>
            <GroupSpecimen />
          </System>
        </HeroMember>
        <HeroMember name="Segmented control">
          <SegmentedGlyph
            chip={effective.segmentedSelected}
            track={effective.segmentedTrack}
          />
        </HeroMember>
        <HeroMember name="Pagination">
          <DialGlyph>
            <CurrentGlyph current={effective.paginationCurrent} />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="buttonStyle"
        label="Style"
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <System ds={styles[option.value]!}>
              <Buttons />
            </System>
          ),
        }))}
      />
      <DialGap />
      <DialSelect
        axis="buttonSecondary"
        label="Secondary"
        rowPreview={false}
        options={SECONDARY_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <System ds={secondaries[option.value]!}>
              <Buttons secondaryOnly />
            </System>
          ),
        }))}
      />
      <DialSelect
        axis="buttonRadius"
        label="Corners"
        rowPreview={false}
        options={RADIUS_OPTIONS.map((option) => ({
          ...option,
          preview: <CornerGlyph corners={option.value} />,
        }))}
      />
      <UsesRow axis="buttonColor" label="Primary" />
      <UsesRow axis="labelWeight" label="Label" />
      <UsesRow axis="motion" label="Motion" />
      <More keys={["buttonPress", "buttonCase"]}>
        <DialSegmented
          axis="buttonPress"
          label="Press"
          options={PRESS_OPTIONS}
        />
        <DialSegmented axis="buttonCase" label="Case" options={CASE_OPTIONS} />
      </More>
      <MemberSection id="toggle" title="Toggles">
        <DialSelect
          axis="toggleSelected"
          label="Selected"
          options={TOGGLE_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <System ds={toggles[option.value]!}>
                <Toggles on />
              </System>
            ),
          }))}
        />
      </MemberSection>
      <MemberSection id="group" title="Groups">
        <More keys={["groupSeparator"]}>
          <DialSelect
            axis="groupSeparator"
            label="Seam"
            options={SEPARATOR_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <System ds={seams[option.value]!}>
                  <GroupSpecimen />
                </System>
              ),
            }))}
          />
        </More>
      </MemberSection>
      <MemberSection id="segmented" title="Segmented">
        <DialSelect
          axis="segmentedSelected"
          label="Chip"
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
        <More keys={["segmentedTrack"]}>
          <DialSegmented
            axis="segmentedTrack"
            label="Track"
            options={TRACK_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="pagination" title="Pagination">
        <More keys={["paginationCurrent"]}>
          <DialSelect
            axis="paginationCurrent"
            label="Current page"
            options={CURRENT_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <CurrentGlyph current={option.value} />
                </DialGlyph>
              ),
            }))}
          />
        </More>
      </MemberSection>
    </>
  )
}

export const ROWS: RowMap = {}
