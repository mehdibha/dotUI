"use client"

/* Motion: the global tempo, each component's own Motion and the popover and
   tooltip entrances. Component pages host their rows. */

import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { followersOf } from "../axes"
import {
  COMPONENT_MOTION_KEYS,
  springProgress,
  springSettleMs,
  tableOf,
} from "../axes/motion"
import type { ComponentMotionKey } from "../axes/motion"
import {
  COMPONENT_MOTION_OPTIONS,
  ENTRANCE_OPTIONS,
  MOTION_COMPONENTS,
  MOTION_OPTIONS,
  SAME_AS_MOTION,
} from "../axes/motion.meta"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGlyph,
  DialPickList,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSeparator,
  DialTrigger,
} from "../dial"
import type { RowMap } from "../family-page"
import { useStudio } from "../use-studio"

/** The anchored layers' entrance curve under a table; None is a step. */
function MotionGlyph({ motion }: { motion: string }) {
  const { curve } = tableOf(motion).anchored.enter
  const p = (x: number, y: number) => `${2 + x * 12} ${14 - y * 12}`
  let d: string
  if (motion === "none") d = `M${p(0, 0)} L${p(0, 1)} L${p(1, 1)}`
  else if (curve.type === "easing") {
    const [x1, y1, x2, y2] = curve.ease
    d = `M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`
  } else {
    const ms = springSettleMs(curve)
    d = Array.from({ length: 25 }, (_, i) => {
      const v = springProgress(((i / 24) * ms) / 1000, curve)
      return `${i ? "L" : "M"}${p(i / 24, v)}`
    }).join(" ")
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const glyph = (motion: string) => (
  <DialGlyph>
    <MotionGlyph motion={motion} />
  </DialGlyph>
)

const TEMPO_OPTIONS = MOTION_OPTIONS.map((option) => ({
  ...option,
  visual: glyph(option.value),
}))

// "Same as motion" wears the glyph of the tempo it resolves to.
const COMPONENT_ROW_OPTIONS = [
  SAME_AS_MOTION,
  ...COMPONENT_MOTION_OPTIONS.map((option) => ({
    ...option,
    preview: glyph(option.value),
  })),
]

const tempoLabel = (value: string) =>
  COMPONENT_MOTION_OPTIONS.find((option) => option.value === value)?.label ??
  value

/** The global tempo; its popover names the components on their own. */
function MotionRow() {
  const { state, set, setState } = useStudio()
  const custom = followersOf(state, "motion")
  return (
    <DialTrigger
      axis="motion"
      label="Motion"
      value={
        <>
          <span className="truncate">
            {tempoLabel(state.motion)}
            {custom.length > 0 && ` · ${custom.length} custom`}
          </span>
          {glyph(state.motion)}
        </>
      }
    >
      <DialPopover>
        <DialPickList
          label="Motion"
          value={state.motion}
          onChange={set("motion")}
          options={TEMPO_OPTIONS}
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
                  <span className="text-fg/85">
                    {MOTION_COMPONENTS[key as ComponentMotionKey]}
                  </span>
                  <span className="flex items-center gap-2 text-fg/60">
                    {tempoLabel(tempo)}
                    {glyph(tempo)}
                  </span>
                </div>
              )
            })}
            <RacButton
              onPress={() =>
                setState({
                  ...state,
                  ...Object.fromEntries(
                    custom.map((key) => [key, SAME_AS_MOTION.value]),
                  ),
                })
              }
              className={cn(DIAL_ROW, DIAL_PRESS, "mt-1 justify-center")}
            >
              <span className={DIAL_LABEL}>Reset all</span>
            </RacButton>
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
    return (
      <DialSegmented axis={key} label="Entrance" options={ENTRANCE_OPTIONS} />
    )
  }

export const ROWS: RowMap = {
  motion: MotionRow,
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, componentRow(key)]),
  ),
}
