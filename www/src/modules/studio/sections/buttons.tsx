"use client"

/* Buttons — the family: Button sets the look that Toggle, Group and
   Segmented control reuse. Style opens the button recipe whole — the family
   cards, then radius, hover, press and how fast they settle. Color is a leaf
   of Color's Primary. */

import { cn } from "@/registry/lib/utils"

import { SEPARATOR_OPTIONS } from "../axes/button-groups"
import {
  HOVER_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
  STYLE_OPTIONS,
} from "../axes/buttons"
import {
  SELECTED_OPTIONS as SEGMENT_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control"
import { SELECTED_OPTIONS as TOGGLE_OPTIONS } from "../axes/toggles"
import {
  DialGap,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import { ButtonMotion, SegmentedControlMotion } from "../motion-controls"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/* Each family's shadow recipe, as the registry's button styles.ts draws it. */
const FLAT = { primary: "", secondary: "" }
const FAMILY: Record<string, { primary: string; secondary: string }> = {
  flat: FLAT,
  outline: {
    primary: "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
    secondary: "shadow-[0_1px_0_rgb(0_0_0/0.08)]",
  },
  raised: {
    primary:
      "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
    secondary:
      "bg-linear-to-b from-white/8 to-black/8 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  elevated: {
    primary: "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
    secondary:
      "border-transparent shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
  },
}

/** A primary button in one family; on a card, a secondary beside it. */
function ButtonGlyph({ style, card }: { style: string; card?: boolean }) {
  const family = FAMILY[style] ?? FLAT
  const size = card ? "h-6 px-2.5 text-[11px]" : "h-4 px-1.5 text-[9px]"
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5",
        card && "justify-center py-1.5",
      )}
    >
      <span
        className={cn(
          "flex items-center rounded-md bg-primary font-semibold text-fg-on-primary",
          size,
          family.primary,
        )}
      >
        Save
      </span>
      {card && (
        <span
          className={cn(
            "flex items-center rounded-md border border-border-control bg-neutral font-medium text-fg-on-neutral",
            size,
            family.secondary,
          )}
        >
          Cancel
        </span>
      )}
    </span>
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
  return <ButtonGlyph style={state.buttonStyle} />
}

export function ButtonsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialTrigger
        label="Style"
        value={
          <>
            <span className="truncate">
              {optionLabel(STYLE_OPTIONS, state.buttonStyle)}
            </span>
            <ButtonGlyph style={state.buttonStyle} />
          </>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Style"
            value={state.buttonStyle}
            onChange={set("buttonStyle")}
            options={STYLE_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: <ButtonGlyph style={option.value} card />,
            }))}
          />
          <DialGap />
          <DialSegmented
            label="Radius"
            value={state.buttonRadius}
            onChange={set("buttonRadius")}
            options={RADIUS_OPTIONS}
          />
          <DialSegmented
            label="Hover"
            value={state.buttonHover}
            onChange={set("buttonHover")}
            options={HOVER_OPTIONS}
          />
          <DialSegmented
            label="Press"
            value={state.buttonPress}
            onChange={set("buttonPress")}
            options={PRESS_OPTIONS}
          />
          <ButtonMotion label="Transition" studio={studio} />
        </DialPopover>
      </DialTrigger>
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
          <SegmentedControlMotion label="Transition" studio={studio} />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
