"use client"

/* Motion: on the main page, a link showing the tempo. On the Motion page,
   the tempos as tiles that move by their own timing, Duration, then every
   component's own motion in folders, their rows hosted from the
   component's page. */

import { DEFAULT_STATE, followersOf } from "../axes"
import type { Effective } from "../axes"
import {
  COMPONENT_MOTION_KEYS,
  componentTiming,
  DURATION_RANGE,
  legTiming,
  MOTION_VALUES,
  stretch,
  tableOf,
} from "../axes/motion"
import type { ComponentMotionKey } from "../axes/motion"
import {
  ENTRANCE_OPTIONS,
  MOTION_OPTIONS,
  SAME_AS_MOTION,
} from "../axes/motion.meta"
import { DialAction, DialSelect, DialSlider } from "../dial"
import { DialFolder } from "../folder"
import { CurveGraph, EaseTrace, useFlip } from "../preview/boards/motion-parts"
import type { Timing } from "../preview/boards/motion-parts"
import { Row } from "../row-host"
import type { RowMap } from "../row-host"
import { DialTiles } from "../tiles"
import { valueLabel } from "../use-axis"
import type { AxisKey } from "../use-axis"
import { useStudio } from "../use-studio"
import { COMPONENTS } from "./components"

const COMPONENT_ROW_OPTIONS = [SAME_AS_MOTION, ...MOTION_OPTIONS]

const tempoLabel = (value: string) =>
  MOTION_OPTIONS.find((option) => option.value === value)?.label ?? value

const isMotionKey = (key: string) => /(Motion|Entrance)$/.test(key)

/** Each component's own motion rows, in the panel's order: those whose
 *  home is its page. */
const FOLDERS = COMPONENTS.flatMap(({ id, label, rows, hosts }) => {
  const own = rows.filter(([key]) => isMotionKey(key) && !hosts?.includes(key))
  return own.length > 0 ? [{ id, label, rows: own }] : []
})

const COMPONENT_KEYS = FOLDERS.flatMap(({ rows }) => rows.map(([key]) => key))

/** The main page's link: the tempo, and Custom once anything on the page
 *  leaves it. */
export function MotionPreview({ state }: { state: Effective }) {
  // Following is saved state: effective values read through it.
  const saved = useStudio().state
  const custom =
    state.motionDuration !== 1 || followersOf(saved, "motion").length > 0
  return (
    <span className="truncate">
      {tempoLabel(state.motion)}
      {custom && " · Custom"}
    </span>
  )
}

const isTimed = (key: string): key is ComponentMotionKey =>
  (COMPONENT_MOTION_KEYS as string[]).includes(key)

/** Every component's own motion, a folder each: its curve as it ships,
 *  then its rows; and back to the global tempo for all of them. */
export function ComponentMotionRow() {
  const { state, effective, setState } = useStudio()
  const on = useFlip(FLIP_MS)
  const changed = COMPONENT_KEYS.filter(
    (key) => state[key] !== DEFAULT_STATE[key],
  )
  return (
    <>
      {FOLDERS.map(({ id, label, rows }) => {
        const own = rows.filter(([key]) => changed.includes(key))
        return (
          <DialFolder
            key={id}
            label={label}
            // Only a component on its own says what it sets.
            value={own.map(([key]) => valueLabel(key, state[key])).join(" · ")}
          >
            {rows
              .map(([key]) => key)
              .filter(isTimed)
              .map((key) => (
                <CurveGraph
                  key={key}
                  timing={componentTiming(key, effective)}
                  on={on}
                  className="h-24 rounded-lg tint-5"
                />
              ))}
            {rows.map(([key, name]) => (
              <Row key={key} axis={key} label={name} />
            ))}
          </DialFolder>
        )
      })}
      {changed.length > 0 && (
        <DialAction
          onPress={() =>
            setState({
              ...state,
              ...Object.fromEntries(
                changed.map((key) => [key, DEFAULT_STATE[key]]),
              ),
            })
          }
        >
          Reset all to Motion
        </DialAction>
      )}
    </>
  )
}

/** How a tempo glides (a thumb, an indicator) at a duration factor,
 *  rounded like the shipped vars. */
function glideOf(motion: string, factor: number): Timing {
  const { ms, ease } = legTiming(tableOf(motion).travel.enter)
  return { ms: stretch(ms, factor), ease }
}

/* One window for every curve, so lengths compare; a spring's tail is long
   but flat. */
const SPAN_MS = 500

/** One tempo: its glide as a curve, a dot running it. */
function Tempo({
  motion,
  factor,
  on,
}: {
  motion: string
  factor: number
  on: boolean
}) {
  return (
    <EaseTrace
      timing={glideOf(motion, factor)}
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
        tile: <Tempo motion={value} factor={state.motionDuration} on={on} />,
      }))}
    />
  )
}

const factor = (value: number) => `${Number(value.toFixed(2))}×`

const DurationRow = () => (
  <DialSlider
    axis="motionDuration"
    label="Duration"
    minValue={DURATION_RANGE.min}
    maxValue={DURATION_RANGE.max}
    step={DURATION_RANGE.step}
    format={factor}
  />
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
  motion: MotionTilesRow,
  motionDuration: DurationRow,
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(
    COMPONENT_KEYS.filter((key) => key.endsWith("Motion")).map((key) => [
      key,
      ownRow(key),
    ]),
  ),
}
