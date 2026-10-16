"use client"

/* Motion: the global tempo, each component's own Motion and the popover and
   tooltip entrances. Component pages host their rows. */

import { followersOf } from "../axes"
import { COMPONENT_MOTION_KEYS } from "../axes/motion"
import type { ComponentMotionKey } from "../axes/motion"
import {
  COMPONENT_MOTION_OPTIONS,
  ENTRANCE_OPTIONS,
  MOTION_OPTIONS,
  SAME_AS_MOTION,
} from "../axes/motion.meta"
import {
  DialAction,
  DialPickList,
  DialPopover,
  PICK_POPOVER,
  DialSelect,
  DialSeparator,
  DialTrigger,
} from "../dial"
import type { RowMap } from "../family-page"
import type { AxisKey } from "../use-axis"
import { useStudio } from "../use-studio"
import { COMPONENTS } from "./components"

const COMPONENT_ROW_OPTIONS = [SAME_AS_MOTION, ...COMPONENT_MOTION_OPTIONS]

const tempoLabel = (value: string) =>
  COMPONENT_MOTION_OPTIONS.find((option) => option.value === value)?.label ??
  value

/** The component whose page a Motion key's row sits on. */
const componentOf = (key: string) =>
  COMPONENTS.find(
    ({ rows, hosts }) =>
      rows.some(([row]) => row === key) && !hosts?.includes(key as AxisKey),
  )?.label

/** The global tempo; its popover names the components on their own. */
function MotionRow() {
  const { state, set, setState } = useStudio()
  const custom = followersOf(state, "motion")
  return (
    <DialTrigger
      axis="motion"
      label="Motion"
      value={
        <span className="truncate">
          {tempoLabel(state.motion)}
          {custom.length > 0 && ` · ${custom.length} custom`}
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
        {custom.length > 0 && (
          <>
            <DialSeparator />
            {custom.map((key) => {
              const tempo = String(state[key])
              return (
                <div
                  key={key}
                  className="flex h-7 items-center justify-between gap-3 px-1 text-[13px] font-medium"
                >
                  <span className="text-fg/85">{componentOf(key)}</span>
                  <span className="text-fg/60">{tempoLabel(tempo)}</span>
                </div>
              )
            })}
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
              Reset all
            </DialAction>
          </>
        )}
      </DialPopover>
    </DialTrigger>
  )
}

const componentRow = (key: ComponentMotionKey) =>
  function ComponentMotionRow() {
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
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, componentRow(key)]),
  ),
}
