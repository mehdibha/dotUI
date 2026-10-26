"use client"

/* Motion: on the main page, a link showing the tempo. On the Motion page,
   the tempos with what each does, Duration, then every component, each
   opening its own Motion page: presets named for what they do to it, or
   Custom, over the timing they ship. Component pages link their Motion row
   to the same page. */

import { useContext, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { ChevronRightIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { SearchField } from "@/registry/ui/search-field"

import { followersOf } from "../axes"
import type { Effective } from "../axes"
import {
  componentTiming,
  CUSTOM_MS_RANGE,
  customFrom,
  customKeys,
  DURATION_RANGE,
} from "../axes/motion"
import type { ComponentMotionKey } from "../axes/motion"
import {
  EASE_OPTIONS,
  ENTRANCE_OPTIONS,
  MOTION_OPTIONS,
  presetOptions,
} from "../axes/motion.meta"
import type { ChapterPage } from "../chapters"
import { DialChoices } from "../choices"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DialGap,
  DialLink,
  DialSelect,
  DialSlider,
} from "../dial"
import { CurveGraph, useFlip } from "../preview/boards/motion-parts"
import { Row, useRowLabel } from "../row-host"
import type { RowMap } from "../row-host"
import { PanelNav } from "../rows"
import type { AxisKey } from "../use-axis"
import { useStudio } from "../use-studio"

/** Each component with a Motion of its own: its key, and the page that
 *  holds it under the component's id. */
const COMPONENTS: [key: ComponentMotionKey, id: string, label: string][] = [
  ["accordionMotion", "accordion", "Accordion"],
  ["buttonMotion", "button", "Button"],
  ["calendarMotion", "calendar", "Calendar"],
  ["checkboxMotion", "checkbox", "Checkbox"],
  ["dialogMotion", "dialog", "Dialog"],
  ["fieldMotion", "field", "Field"],
  ["linkMotion", "link", "Link"],
  ["popoverMotion", "popover", "Popover"],
  ["progressMotion", "progress", "Progress"],
  ["segmentedMotion", "segmented-control", "Segmented control"],
  ["sidebarMotion", "sidebar", "Sidebar"],
  ["sliderMotion", "slider", "Slider"],
  ["switchMotion", "switch", "Switch"],
  ["tableMotion", "table", "Table"],
  ["tabsMotion", "tabs", "Tabs"],
  ["toastMotion", "toast", "Toast"],
  ["tooltipMotion", "tooltip", "Tooltip"],
]

/** An overlay's entrance, kept on its component's page and shown here too. */
const ENTRANCES: Partial<Record<ComponentMotionKey, AxisKey>> = {
  dialogMotion: "dialogEntrance",
  popoverMotion: "popoverEntrance",
  tooltipMotion: "tooltipEntrance",
}

const pageOf = (key: ComponentMotionKey) =>
  `${COMPONENTS.find(([k]) => k === key)?.[1]}-motion`

const tempoLabel = (value: string) =>
  MOTION_OPTIONS.find((option) => option.value === value)?.label ?? value

/** A component's motion as its rows name it: its preset, or Custom. */
const presetLabel = (key: ComponentMotionKey, value: unknown) =>
  presetOptions(key).find((option) => option.value === value)?.label ??
  String(value)

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

/** Every component on a surface, found by name, each opening its page. */
export function ComponentMotionRow() {
  const { state, effective } = useStudio()
  const open = useContext(PanelNav)
  const [query, setQuery] = useState("")
  const found = COMPONENTS.filter(([, , label]) =>
    label.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <div className="flex flex-col gap-1.5 rounded-lg tint-5 p-1.5">
      <SearchField
        aria-label="Search components"
        value={query}
        onChange={setQuery}
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search components…" />
        </InputGroup>
      </SearchField>
      <div className="flex flex-col">
        {found.map(([key, id, label]) => (
          <RacButton
            key={key}
            data-page-link={`${id}-motion`}
            onPress={() => open(`${id}-motion`)}
            className={cn(
              DIAL_PRESS,
              "flex h-8 items-center justify-between gap-3 rounded-md pr-1 pl-1.5",
            )}
          >
            <span className={DIAL_LABEL}>{label}</span>
            <span
              className={cn(
                "flex min-w-0 items-center gap-2 text-[13px] font-medium",
                // A component on its own reads stronger than one following.
                state[key] === "same" ? "text-fg/45" : "text-fg/80",
              )}
            >
              <span className="truncate">
                {presetLabel(key, effective[key])}
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-fg/40" />
            </span>
          </RacButton>
        ))}
        {found.length === 0 && (
          <p className="px-1.5 py-2 text-[13px] text-fg/50">
            No component matches.
          </p>
        )}
      </div>
    </div>
  )
}

const MotionStyleRow = () => (
  <DialChoices axis="motion" label="Style" options={MOTION_OPTIONS} />
)

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

/** On a component's page, its Motion: a link to the page that times it. */
const linkRow = (key: ComponentMotionKey) =>
  function MotionLinkRow() {
    const { effective } = useStudio()
    return (
      <DialLink
        page={pageOf(key)}
        label={useRowLabel("Motion")}
        value={
          <span className="truncate">{presetLabel(key, effective[key])}</span>
        }
      />
    )
  }

/** The presets, then Custom. The one the Style draws reads as following
 *  it, and picking it follows again; Custom starts from the timing shown. */
function PresetsRow({ motionKey: key }: { motionKey: ComponentMotionKey }) {
  const { state, effective, setState } = useStudio()
  const style = effective.motion
  return (
    <DialChoices
      axis={key}
      label="Preset"
      onChange={(value) =>
        setState({
          ...state,
          ...(value === "custom"
            ? { [key]: "custom", ...customFrom(key, effective) }
            : { [key]: value === style ? "same" : value }),
        })
      }
      options={presetOptions(key).map((option) => ({
        ...option,
        aside: option.value === style && (
          <span className="text-[11px] font-normal text-fg/45">Style</span>
        ),
      }))}
    />
  )
}

const MS = {
  minValue: CUSTOM_MS_RANGE.min,
  maxValue: CUSTOM_MS_RANGE.max,
  step: CUSTOM_MS_RANGE.step,
  format: (ms: number) => `${ms}ms`,
}

/** A Custom control: live under Custom, else the preset's value, read only. */
function Locked({
  motionKey,
  children,
}: {
  motionKey: ComponentMotionKey
  children: (custom: boolean, shown: Record<string, unknown>) => React.ReactNode
}) {
  const { effective } = useStudio()
  const custom = effective[motionKey] === "custom"
  const shown = customFrom(motionKey, effective)
  if (custom) return children(true, shown)
  return (
    <div inert className="opacity-50">
      {children(false, shown)}
    </div>
  )
}

const customDurationRow = (key: ComponentMotionKey) =>
  function CustomDurationRow() {
    const { duration } = customKeys(key)
    return (
      <Locked motionKey={key}>
        {(custom, shown) =>
          custom ? (
            <DialSlider axis={duration} label="Duration" {...MS} />
          ) : (
            <DialSlider
              label="Duration"
              value={Number(shown[duration])}
              onChange={() => {}}
              {...MS}
            />
          )
        }
      </Locked>
    )
  }

const customEaseRow = (key: ComponentMotionKey) =>
  function CustomEaseRow() {
    const { ease } = customKeys(key)
    return (
      <Locked motionKey={key}>
        {(custom, shown) => (
          <DialSelect
            axis={ease}
            label="Easing"
            options={EASE_OPTIONS}
            {...(!custom && { value: String(shown[ease]) })}
          />
        )}
      </Locked>
    )
  }

const FLIP_MS = 1100

/** The timing the component ships, drawn. */
function Curve({ motionKey }: { motionKey: ComponentMotionKey }) {
  const { effective } = useStudio()
  const on = useFlip(FLIP_MS)
  return (
    <CurveGraph
      timing={componentTiming(motionKey, effective)}
      on={on}
      className="h-24 rounded-lg tint-5"
    />
  )
}

/** Each component's Motion page, under the Motion page. */
export const MOTION_PAGES: ChapterPage[] = COMPONENTS.map(
  ([key, id, label]) => {
    const { duration, ease } = customKeys(key)
    const entrance = ENTRANCES[key]
    return {
      id: `${id}-motion`,
      label: `${label} motion`,
      parent: "motion",
      owners: [key, duration, ease],
      rows: [
        { name: "Preset", key },
        { name: "Duration", key: duration },
        { name: "Easing", key: ease },
      ],
      Body: function ComponentMotionPage() {
        return (
          <>
            {entrance && (
              <>
                <Row axis={entrance} label="Entrance" />
                <DialGap />
              </>
            )}
            <PresetsRow motionKey={key} />
            <DialGap />
            <Curve motionKey={key} />
            <Row axis={duration} label="Duration" />
            <Row axis={ease} label="Easing" />
          </>
        )
      },
    }
  },
)

const entranceRow = (key: "popoverEntrance" | "tooltipEntrance") =>
  function EntranceRow() {
    return <DialSelect axis={key} label="Entrance" options={ENTRANCE_OPTIONS} />
  }

export const ROWS: RowMap = {
  motion: MotionStyleRow,
  motionDuration: DurationRow,
  popoverEntrance: entranceRow("popoverEntrance"),
  tooltipEntrance: entranceRow("tooltipEntrance"),
  ...Object.fromEntries(
    COMPONENTS.flatMap(([key]) => {
      const { duration, ease } = customKeys(key)
      return [
        [key, linkRow(key)],
        [duration, customDurationRow(key)],
        [ease, customEaseRow(key)],
      ]
    }),
  ),
}
