"use client"

/* Buttons — Button's style, a real system's recipe copied whole, with the
   toggles, groups, segmented control and pagination that share it. */

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/button/styles"

import { SEPARATOR_OPTIONS } from "../axes/button-groups"
import { RADIUS_OPTIONS, STYLE_OPTIONS } from "../axes/buttons"
import { CURRENT_OPTIONS } from "../axes/pagination"
import {
  SELECTED_OPTIONS as SEGMENT_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control"
import { SELECTED_OPTIONS as TOGGLE_OPTIONS } from "../axes/toggles"
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
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/* One stable context per style, so the registry's style cache hits. */
const STYLE_CONTEXT = Object.fromEntries(
  STYLE_OPTIONS.map(({ value }) => [
    value,
    { params: { button: { style: value } }, density: "default" as const },
  ]),
)

function Specimen({ tiny }: { tiny?: boolean }) {
  const styles = useStyles()
  if (tiny)
    return (
      <span
        className={styles({
          variant: "primary",
          size: "xs",
          className: "h-4 px-1.5 text-[9px]",
        })}
      >
        Save
      </span>
    )
  return (
    <>
      <span className={styles({ variant: "primary", size: "xs" })}>Save</span>
      <span className={styles({ variant: "secondary", size: "xs" })}>
        Cancel
      </span>
    </>
  )
}

/** Buttons drawn by the registry's own recipe for one style. */
function StyleSpecimen({ style, tiny }: { style: string; tiny?: boolean }) {
  return (
    <DesignSystemContext.Provider
      value={STYLE_CONTEXT[style] ?? STYLE_CONTEXT.flat!}
    >
      <Specimen tiny={tiny} />
    </DesignSystemContext.Provider>
  )
}

const CORNER: Record<string, string> = {
  auto: "rounded-[4px] border-dashed",
  sharp: "rounded-none",
  round: "rounded-[5px]",
  pill: "rounded-full",
}

/** A button's outline at one corner; Auto is dashed, it follows Shape. */
function RadiusGlyph({ radius }: { radius: string }) {
  return (
    <span
      className={cn("h-4 w-7 shrink-0 border border-fg/40", CORNER[radius])}
    />
  )
}

const TOGGLE_LOOK: Record<string, string> = {
  fill: "bg-selected text-fg-on-selected",
  chip: "bg-bg text-fg shadow-sm ring-1 ring-border-control",
  inverse: "bg-inverse text-fg-inverse",
}

/** A selected toggle wearing one look. */
function ToggleGlyph({ look }: { look: string }) {
  return (
    <span
      className={cn(
        "flex h-4 shrink-0 items-center rounded-[4px] px-1.5 text-[9px] font-semibold",
        TOGGLE_LOOK[look],
      )}
    >
      Aa
    </span>
  )
}

/** Three attached segments, divided as the separator says. */
function GroupGlyph({ separator }: { separator: string }) {
  const divider =
    separator === "divider"
      ? "border-l border-fg/30"
      : separator === "auto"
        ? "border-l border-fg/12"
        : ""
  return (
    <span className="flex h-4 shrink-0 overflow-hidden rounded-[4px] border border-fg/30">
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn("w-2.5", i > 0 && divider)} />
      ))}
    </span>
  )
}

const CHIP: Record<string, string> = {
  raised: "bg-bg text-fg shadow-sm ring-1 ring-border-control",
  flat: "bg-selected text-fg-on-selected",
  inverse: "bg-inverse text-fg-inverse",
}

/** A three-segment control: the chip against its track. */
function SegmentedGlyph({
  selected,
  track,
}: {
  selected: string
  track: string
}) {
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
            i === 0 && CHIP[selected],
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

function CurrentGlyph({ current }: { current: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {current === "filled" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
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
  return <StyleSpecimen style={state.buttonStyle} tiny />
}

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Button">
          <StyleSpecimen style={effective.buttonStyle} />
        </HeroMember>
        <HeroMember name="Toggle button">
          <ToggleGlyph look={effective.toggleSelected} />
        </HeroMember>
        <HeroMember name="Group">
          <GroupGlyph separator={effective.groupSeparator} />
        </HeroMember>
        <HeroMember name="Segmented control">
          <SegmentedGlyph
            selected={effective.segmentedSelected}
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
          preview: <StyleSpecimen style={option.value} />,
        }))}
      />
      <DialGap />
      <DialSelect
        axis="buttonRadius"
        label="Radius"
        options={RADIUS_OPTIONS.map((option) => ({
          ...option,
          preview: <RadiusGlyph radius={option.value} />,
        }))}
      />
      <UsesRow axis="buttonColor" label="Color" />
      <UsesRow axis="roleControl" label="Control corners" />
      <MemberSection id="toggle" title="Toggles">
        <DialSelect
          axis="toggleSelected"
          label="Selected"
          options={TOGGLE_OPTIONS.map((option) => ({
            ...option,
            preview: <ToggleGlyph look={option.value} />,
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
              preview: <GroupGlyph separator={option.value} />,
            }))}
          />
        </More>
      </MemberSection>
      <MemberSection id="segmented" title="Segmented">
        <More keys={["segmentedSelected", "segmentedTrack"]}>
          <DialSelect
            axis="segmentedSelected"
            label="Chip"
            options={SEGMENT_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <SegmentedGlyph
                  selected={option.value}
                  track={effective.segmentedTrack}
                />
              ),
            }))}
          />
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
