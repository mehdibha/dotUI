"use client"

/* Buttons — the family's page: Button sets the look, a real system's recipe
   copied whole, and the toggles, groups and segmented control below stay
   coherent with it. Color is a leaf of Color's Primary. */

import { ComponentParamsProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/button/styles"

import { SEPARATOR_OPTIONS } from "../axes/button-groups"
import { RADIUS_OPTIONS, STYLE_OPTIONS } from "../axes/buttons"
import {
  SELECTED_OPTIONS as SEGMENT_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control"
import { SELECTED_OPTIONS as TOGGLE_OPTIONS } from "../axes/toggles"
import {
  DialGap,
  DialList,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import { CardGrid } from "../patterns"
import { GroupTitle } from "../rows"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/* One stable selection per style, so the registry's style cache hits. */
const STYLE_PARAMS = Object.fromEntries(
  STYLE_OPTIONS.map(({ value }) => [value, { button: { style: value } }]),
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
    <ComponentParamsProvider params={STYLE_PARAMS[style] ?? STYLE_PARAMS.flat}>
      <Specimen tiny={tiny} />
    </ComponentParamsProvider>
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
  card,
}: {
  selected: string
  track: string
  card?: boolean
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 rounded-[5px] p-[2px]",
        track === "outline" ? "border border-border" : "bg-muted",
        card && "mx-auto my-1.5",
      )}
    >
      {["A", "B", "C"].map((letter, i) => (
        <span
          key={letter}
          className={cn(
            "flex items-center rounded-[3px] font-medium text-fg-muted",
            card ? "h-5 px-2 text-[11px]" : "h-3 px-1 text-[8px]",
            i === 0 && CHIP[selected],
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

/* --------------------------------- Section --------------------------------- */

export function ButtonsPreview({ state }: { state: StudioState }) {
  return <StyleSpecimen style={state.buttonStyle} tiny />
}

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialList
        label="Style"
        value={state.buttonStyle}
        onChange={set("buttonStyle")}
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: <StyleSpecimen style={option.value} />,
        }))}
      />
      <DialGap />
      <DialSelect
        label="Radius"
        value={state.buttonRadius}
        onChange={set("buttonRadius")}
        options={RADIUS_OPTIONS.map((option) => ({
          ...option,
          preview: <RadiusGlyph radius={option.value} />,
        }))}
      />
      <GroupTitle>Toggles & groups</GroupTitle>
      <DialSelect
        label="Toggles"
        value={state.toggleSelected}
        onChange={set("toggleSelected")}
        options={TOGGLE_OPTIONS.map((option) => ({
          ...option,
          preview: <ToggleGlyph look={option.value} />,
        }))}
      />
      <DialSelect
        label="Groups"
        value={state.groupSeparator}
        onChange={set("groupSeparator")}
        options={SEPARATOR_OPTIONS.map((option) => ({
          ...option,
          preview: <GroupGlyph separator={option.value} />,
        }))}
      />
      <DialTrigger
        label="Segmented"
        value={
          <>
            <span className="truncate">
              {optionLabel(SEGMENT_OPTIONS, state.segmentedSelected)}
            </span>
            <SegmentedGlyph
              selected={state.segmentedSelected}
              track={state.segmentedTrack}
            />
          </>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Selected"
            columns={3}
            value={state.segmentedSelected}
            onChange={set("segmentedSelected")}
            options={SEGMENT_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: (
                <SegmentedGlyph
                  selected={option.value}
                  track={state.segmentedTrack}
                  card
                />
              ),
            }))}
          />
          <DialSegmented
            label="Track"
            value={state.segmentedTrack}
            onChange={set("segmentedTrack")}
            options={TRACK_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
