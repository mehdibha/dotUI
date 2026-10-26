"use client"

/* Motion: on the main page, a link showing the tempo. On the Motion page,
   the tempos and Speed as tiles that move by their own timing, then the way
   to each component's own Motion, which edits on that component's page. */

import { followersOf } from "../axes"
import type { Effective } from "../axes"
import {
  COMPONENT_MOTION_KEYS,
  legTiming,
  MOTION_VALUES,
  SPEED,
  tableOf,
} from "../axes/motion"
import {
  ENTRANCE_OPTIONS,
  MOTION_OPTIONS,
  SAME_AS_MOTION,
  SPEED_OPTIONS,
} from "../axes/motion.meta"
import {
  DialAction,
  DialLink,
  DialPopover,
  DialSelect,
  DialSeparator,
  DialTrigger,
} from "../dial"
import { EaseTrace, useFlip } from "../preview/boards/motion-parts"
import type { Timing } from "../preview/boards/motion-parts"
import type { RowMap } from "../row-host"
import { DialTiles } from "../tiles"
import type { AxisKey } from "../use-axis"
import { useStudio } from "../use-studio"
import { COMPONENTS } from "./components"

const COMPONENT_ROW_OPTIONS = [SAME_AS_MOTION, ...MOTION_OPTIONS]

const tempoLabel = (value: string) =>
  MOTION_OPTIONS.find((option) => option.value === value)?.label ?? value

/** Every component's own Motion, in the panel's order, with the page it
 *  sits on. */
const COMPONENT_MOTION = COMPONENTS.flatMap(({ id, label, rows, hosts }) =>
  rows
    .map(([key]) => key)
    .filter(
      (key) =>
        (key === "chartMotion" ||
          COMPONENT_MOTION_KEYS.includes(key as never)) &&
        !hosts?.includes(key),
    )
    .map((key) => ({ key, page: id, label })),
)

const COMPONENT_KEYS = COMPONENT_MOTION.map(({ key }) => key)

/** The main page's link: the tempo, and Custom once anything on the page
 *  leaves it. */
export function MotionPreview({ state }: { state: Effective }) {
  // Following is saved state: effective values read through it.
  const saved = useStudio().state
  const custom =
    state.motionSpeed !== "default" || followersOf(saved, "motion").length > 0
  return (
    <span className="truncate">
      {tempoLabel(state.motion)}
      {custom && " · Custom"}
    </span>
  )
}

/** The Motion page's way to each component's own Motion, and back to the
 *  global tempo for all of them. */
export function ComponentMotionRow() {
  const { state, setState } = useStudio()
  const custom = followersOf(state, "motion").filter((key) =>
    COMPONENT_KEYS.includes(key as AxisKey),
  )
  return (
    <DialTrigger
      label="Components"
      value={
        custom.length > 0 ? `${custom.length} custom` : SAME_AS_MOTION.label
      }
    >
      <DialPopover>
        {COMPONENT_MOTION.map(({ key, page, label }) => (
          <DialLink
            key={key}
            page={page}
            label={label}
            // Only a component on its own names its tempo.
            value={
              state[key] === SAME_AS_MOTION.value
                ? null
                : tempoLabel(String(state[key]))
            }
          />
        ))}
        {custom.length > 0 && (
          <>
            <DialSeparator />
            <DialAction
              onPress={() =>
                setState({
                  ...state,
                  ...Object.fromEntries(
                    custom.map((key) => [key, SAME_AS_MOTION.value]),
                  ),
                })
              }
            >
              Reset all to Motion
            </DialAction>
          </>
        )}
      </DialPopover>
    </DialTrigger>
  )
}

/** How a tempo glides (a thumb, an indicator) at a speed, rounded like
 *  the shipped vars. */
function glideOf(motion: string, speed: string): Timing {
  const { ms, ease } = legTiming(tableOf(motion).travel.enter)
  return { ms: Math.round((ms * (SPEED[speed] ?? 1)) / 10) * 10, ease }
}

/* One window for every curve, so lengths compare; a spring's tail is long
   but flat. */
const SPAN_MS = 500

/** One tempo at one speed: its glide as a curve, a dot running it. */
function Tempo({
  motion,
  speed,
  on,
}: {
  motion: string
  speed: string
  on: boolean
}) {
  return (
    <EaseTrace
      timing={glideOf(motion, speed)}
      span={SPAN_MS}
      on={on}
      className="h-11 w-[calc(100%-2rem)] text-fg/70"
    />
  )
}

const FLIP_MS = 1100

/** The tempos laid out in place, each moving by its own timing. */
function MotionTilesRow() {
  const { state } = useStudio()
  const on = useFlip(FLIP_MS)
  return (
    <DialTiles
      axis="motion"
      label="Style"
      options={MOTION_VALUES.map((value) => ({
        value,
        label: tempoLabel(value),
        // Curves don't name themselves.
        caption: tempoLabel(value),
        tile: (
          <Tempo motion={value} speed={String(state.motionSpeed)} on={on} />
        ),
      }))}
    />
  )
}

/** Speed side by side, on the current tempo. */
function SpeedRow() {
  const { state } = useStudio()
  const on = useFlip(FLIP_MS)
  return (
    <DialTiles
      axis="motionSpeed"
      label="Speed"
      columns={3}
      options={SPEED_OPTIONS.map(({ value, label }) => ({
        value,
        label,
        caption: label,
        tile: <Tempo motion={String(state.motion)} speed={value} on={on} />,
      }))}
    />
  )
}

const ownRow = (key: AxisKey) =>
  function OwnMotionRow() {
    return (
      <DialSelect axis={key} label="Motion" options={COMPONENT_ROW_OPTIONS} />
    )
  }

const entranceRow = (key: "popoverEntrance" | "tooltipEntrance") =>
  function EntranceRow() {
    return <DialSelect axis={key} label="Entrance" options={ENTRANCE_OPTIONS} />
  }

export const ROWS: RowMap = {
  motion: MotionTilesRow,
  motionSpeed: SpeedRow,
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(COMPONENT_KEYS.map((key) => [key, ownRow(key)])),
}
