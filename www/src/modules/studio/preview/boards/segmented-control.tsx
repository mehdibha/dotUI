"use client"

import { useState } from "react"

import { MonitorIcon, MoonIcon, SunIcon } from "@/registry/icons"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { useStyles } from "@/registry/ui/segmented-control/styles"

import { Board, BoardSection, stateProps, useReplay, useSteps } from "./board"
import type { StateName } from "./board"
import { StateGrid } from "./buttons-parts"

/* --------------------------------- States --------------------------------- */

const CONTENT = {
  text: ["Day", "Week", "Month"],
  icon: [
    <SunIcon key="sun" />,
    <MoonIcon key="moon" />,
    <MonitorIcon key="monitor" />,
  ],
}

// The second item is selected; hover lands on another, focus on the selected one.
const STATE_ITEM: Partial<Record<StateName, number>> = { hover: 2, focus: 1 }

/** A segmented control drawn from its own slots, so states can be frozen. */
function FrozenControl({
  state,
  content,
}: {
  state: StateName
  content: keyof typeof CONTENT
}) {
  const { root, item, indicator, itemContent } = useStyles()()
  return (
    <div data-rac="" className={root()}>
      {CONTENT[content].map((child, i) => {
        const states: StateName[] = []
        if (i === 1) states.push("selected")
        if (i === STATE_ITEM[state]) states.push(state)
        if (state === "disabled") states.push("disabled")
        return (
          <span key={i} {...stateProps(...states)} className={item()}>
            {i === 1 && <span className={indicator()} />}
            <span className={itemContent()}>{child}</span>
          </span>
        )
      })}
    </div>
  )
}

const STATES: { id: StateName; label: string }[] = [
  { id: "rest", label: "Rest" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
]

function States() {
  return (
    <StateGrid
      columns={[
        { id: "text", label: "Text" },
        { id: "icon", label: "Icon" },
      ]}
      rows={STATES.map(({ id, label }) => ({
        id,
        label,
        render: (_, column) => (
          <FrozenControl state={id} content={column as keyof typeof CONTENT} />
        ),
      }))}
    />
  )
}

/* --------------------------------- Motion --------------------------------- */

const RANGES = ["day", "week", "month", "year"]
const THEMES = ["light", "dark", "system"]

/** Live while idle; walks the selection while Motion is edited. */
function MotionLoop() {
  const motion = useReplay("segmentedMotion")
  const { running } = motion
  const step = useSteps(motion, 900)
  const [range, setRange] = useState("week")
  const [theme, setTheme] = useState("dark")
  const pick = (ids: string[], offset: number, own: string) =>
    running ? [ids[(step + offset) % ids.length] ?? own] : [own]
  return (
    <div inert={running} className="flex flex-col items-center gap-6">
      <SegmentedControl
        aria-label="Range"
        selectedKeys={pick(RANGES, 1, range)}
        onSelectionChange={(keys) => setRange(String([...keys][0] ?? range))}
      >
        <SegmentedControlItem id="day">Day</SegmentedControlItem>
        <SegmentedControlItem id="week">Week</SegmentedControlItem>
        <SegmentedControlItem id="month">Month</SegmentedControlItem>
        <SegmentedControlItem id="year">Year</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl
        aria-label="Theme"
        selectedKeys={pick(THEMES, 2, theme)}
        onSelectionChange={(keys) => setTheme(String([...keys][0] ?? theme))}
      >
        <SegmentedControlItem id="light" aria-label="Light">
          <SunIcon />
        </SegmentedControlItem>
        <SegmentedControlItem id="dark" aria-label="Dark">
          <MoonIcon />
        </SegmentedControlItem>
        <SegmentedControlItem id="system" aria-label="System">
          <MonitorIcon />
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

/* ---------------------------------- Board --------------------------------- */

export default function SegmentedControlBoard() {
  return (
    <Board id="segmented-control">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] [&>section>div]:flex-1">
        <BoardSection title="States" className="lg:p-6">
          <States />
        </BoardSection>
        <BoardSection title="Motion">
          <MotionLoop />
        </BoardSection>
      </div>
    </Board>
  )
}
