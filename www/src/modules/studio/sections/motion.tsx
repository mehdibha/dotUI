"use client"

/* Motion: on the main page, the global tempo, then Custom. On the Motion
   page, Speed and the way to each component's own Motion, which edits on
   that component's page. */

import { followersOf } from "../axes"
import { COMPONENT_MOTION_KEYS } from "../axes/motion"
import {
  ENTRANCE_OPTIONS,
  MOTION_OPTIONS,
  SAME_AS_MOTION,
  SPEED_OPTIONS,
} from "../axes/motion.meta"
import {
  DialAction,
  DialLink,
  DialPickList,
  DialPopover,
  PICK_POPOVER,
  DialSelect,
  DialSeparator,
  DialTrigger,
} from "../dial"
import type { RowMap } from "../row-host"
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

/** The global tempo; anything set on the Motion page reads Custom. */
function MotionRow() {
  const { state, set } = useStudio()
  const custom =
    state.motionSpeed !== "default" || followersOf(state, "motion").length > 0
  return (
    <DialTrigger
      axis="motion"
      label="Motion"
      value={
        <span className="truncate">
          {tempoLabel(state.motion)}
          {custom && " · Custom"}
        </span>
      }
    >
      <DialPopover className={PICK_POPOVER}>
        <DialPickList
          label="Motion"
          value={state.motion}
          onChange={set("motion")}
          options={MOTION_OPTIONS}
        />
        <DialSeparator />
        {/* Inset like the tempos above it. */}
        <DialLink
          page="motion"
          label="Custom"
          value={null}
          className="px-2.5"
        />
      </DialPopover>
    </DialTrigger>
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

const SpeedRow = () => (
  <DialSelect axis="motionSpeed" label="Speed" options={SPEED_OPTIONS} />
)

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
  motion: MotionRow,
  motionSpeed: SpeedRow,
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(COMPONENT_KEYS.map((key) => [key, ownRow(key)])),
}
