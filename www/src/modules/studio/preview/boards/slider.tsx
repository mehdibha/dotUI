"use client"

import { Fragment } from "react"

import { cn } from "@/registry/lib/utils"
import { Label } from "@/registry/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import type { SliderProps } from "@/registry/ui/slider"
import { useStyles } from "@/registry/ui/slider/styles"

import {
  Board,
  BoardSection,
  CAPTION,
  stateProps,
  useReplay,
  useSteps,
} from "./board"
import { SPLIT } from "./selection-parts"
import type { Attrs } from "./selection-parts"

/** The slider's own slots on plain markup, its thumb at 60%. */
function FrozenSlider(attrs: Attrs) {
  const { control, track, fill, thumb } = useStyles()()
  return (
    <span data-slider="" className="flex w-full">
      <span {...attrs} className={control({ orientation: "horizontal" })}>
        <span {...attrs} className={track({ orientation: "horizontal" })}>
          <span
            {...attrs}
            className={fill()}
            style={{ position: "absolute", insetBlock: 0, width: "60%" }}
          />
        </span>
        <span
          {...attrs}
          className={thumb({ orientation: "horizontal" })}
          style={{
            position: "absolute",
            left: "60%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </span>
    </span>
  )
}

const DRAGGING = { ...stateProps("hover"), "data-dragging": "true" }

const STATES = [
  { label: "Rest", attrs: stateProps() },
  { label: "Hover", attrs: stateProps("hover") },
  { label: "Dragging", attrs: DRAGGING },
  { label: "Focus", attrs: stateProps("focus") },
  { label: "Disabled", attrs: stateProps("disabled") },
]

function States() {
  return (
    <div
      inert
      className="grid w-full max-w-sm grid-cols-[auto_minmax(0,1fr)] items-center gap-x-8 gap-y-5"
    >
      {STATES.map(({ label, attrs }) => (
        <Fragment key={label}>
          <span className={CAPTION}>{label}</span>
          <FrozenSlider {...attrs} />
        </Fragment>
      ))}
    </div>
  )
}

const LOOP = [stateProps(), stateProps("hover"), DRAGGING, stateProps("hover")]

/** The thumb hovered, grabbed and let go, so its ring's timing shows. */
function MotionLoop() {
  const motion = useReplay("sliderMotion")
  const step = useSteps(motion, 700)
  if (!motion.running)
    return (
      <Slider aria-label="Volume" defaultValue={60} className="w-full max-w-56">
        <SliderControl />
      </Slider>
    )
  return (
    <div inert className="flex w-full max-w-56">
      <FrozenSlider {...(LOOP[step % LOOP.length] ?? {})} />
    </div>
  )
}

/** Tick marks under the track, the end labels flush with its ends. */
function Ticks({ labels }: { labels: string[] }) {
  return (
    <div aria-hidden className="relative h-8">
      {labels.map((label, i) => {
        const at = (i / (labels.length - 1)) * 100
        return (
          <span
            key={label}
            className={cn(
              "absolute top-0 flex flex-col gap-1",
              i === 0
                ? "items-start"
                : i === labels.length - 1
                  ? "-translate-x-full items-end"
                  : "-translate-x-1/2 items-center",
            )}
            style={{ left: `${at}%` }}
          >
            <span className="h-1.5 w-px bg-border-control" />
            <span className={cn(CAPTION, "tabular-nums")}>{label}</span>
          </span>
        )
      })}
    </div>
  )
}

function Example({
  label,
  ticks,
  ...props
}: SliderProps & { label: string; ticks?: string[] }) {
  return (
    <Slider className="w-full" {...props}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <SliderOutput />
      </div>
      <SliderControl />
      {ticks && <Ticks labels={ticks} />}
    </Slider>
  )
}

function Variants() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-12 gap-y-8 sm:grid-cols-2">
      <Example label="Volume" defaultValue={60} />
      <Example
        label="Price"
        defaultValue={[240, 640]}
        maxValue={1000}
        step={10}
        formatOptions={{ style: "currency", currency: "USD" }}
      />
      <Example
        label="Brush hardness"
        defaultValue={0.5}
        maxValue={1}
        step={0.25}
        formatOptions={{ style: "percent" }}
        ticks={["0%", "25%", "50%", "75%", "100%"]}
      />
      <Example
        label="Bass"
        defaultValue={-4}
        minValue={-12}
        maxValue={12}
        step={2}
        formatOptions={{ signDisplay: "exceptZero" }}
        ticks={["-12", "-6", "0", "+6", "+12"]}
        isDisabled
      />
    </div>
  )
}

export default function SliderBoard() {
  return (
    <Board id="slider">
      <div className={SPLIT}>
        <BoardSection title="States">
          <States />
        </BoardSection>
        <BoardSection title="Motion" className="max-sm:py-8">
          <MotionLoop />
        </BoardSection>
      </div>
      <BoardSection title="Variants">
        <Variants />
      </BoardSection>
    </Board>
  )
}
