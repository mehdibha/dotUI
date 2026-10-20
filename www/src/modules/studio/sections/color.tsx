"use client"

/* Color — its rows are the specimen, drawn by the engine the preview runs in
   the panel's own mode. Brand and Neutral sit on the main page, the control
   edge on the Surfaces page. */

import { STEPS, toOklch } from "@dotui/colors"
import type { Mode, StepName } from "@dotui/colors"

import { VIVIDNESS_RANGE } from "../axes/color"
import { CONTROL_EDGE_OPTIONS, SOLID_INK_OPTIONS } from "../axes/color.meta"
import {
  DialColor,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { usePanelMode } from "../panel-mode"
import type { RowMap } from "../row-host"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import { useStudio } from "../use-studio"

/* The rungs each edge mixes, per mode (the hairline steps down in dark). */
const EDGE_STEPS: Record<string, Record<Mode, [StepName, StepName]>> = {
  soft: { light: ["200", "300"], dark: ["100", "200"] },
  firm: { light: ["400", "400"], dark: ["400", "400"] },
  strong: { light: ["700", "700"], dark: ["700", "700"] },
}

/** A palette rung in the panel's mode. */
function useStep() {
  const { m, mode } = usePanelMode()
  const step = (palette: string, name: StepName) =>
    m.scales[palette]?.[name] ?? m.background
  return { m, mode, step }
}

function BrandRow() {
  const { state, set } = useStudio()
  return (
    <DialColor
      axis="brand"
      label="Brand"
      value={state.brand}
      onChange={set("brand")}
      footer={
        <>
          <DialToggle
            label="Keep exact"
            value={state.preserveSeed}
            onChange={set("preserveSeed")}
          />
          <DialSegmented
            axis="solidInk"
            label="Ink"
            options={SOLID_INK_OPTIONS}
          />
          <DialSlider
            label="Vividness"
            value={state.vividness}
            onChange={set("vividness")}
            minValue={VIVIDNESS_RANGE.min}
            maxValue={VIVIDNESS_RANGE.max}
            step={VIVIDNESS_RANGE.step}
            format={(v) => `${v.toFixed(2)}×`}
          />
        </>
      }
    />
  )
}

function NeutralRow() {
  const { state, setState } = useStudio()
  const { m } = usePanelMode()
  const neutral = { hue: state.neutralHue, tint: state.neutralTint }
  const brandHue = toOklch(state.brand).h
  const ramp = STEPS.map((step) => m.scales.neutral?.[step] ?? m.background)
  return (
    <DialTrigger
      axis="neutralHue"
      holds={["neutralTint"]}
      label="Neutral"
      swatch
      value={
        <>
          <span className="truncate">{neutralFamily(neutral, brandHue)}</span>
          <NeutralStrip ramp={ramp} className="h-4 w-10" />
        </>
      }
    >
      <NeutralPickerPopover
        value={neutral}
        onChange={(next) =>
          setState({ ...state, neutralHue: next.hue, neutralTint: next.tint })
        }
        brandHue={brandHue}
        ramp={ramp}
      />
    </DialTrigger>
  )
}

function ControlEdgeRow() {
  const { m, mode, step } = useStep()
  return (
    <DialSelect
      axis="controlEdge"
      label="Control edge"
      options={CONTROL_EDGE_OPTIONS.map((option) => {
        const [a, b] = EDGE_STEPS[option.value]?.[mode] ?? ["400", "400"]
        return {
          ...option,
          glyph: (
            <span
              className="h-3.5 w-6 shrink-0 rounded-[4px] border"
              style={{
                backgroundColor: m.background,
                borderColor: `color-mix(in oklab, ${step("neutral", a)} 50%, ${step("neutral", b)})`,
              }}
            />
          ),
        }
      })}
    />
  )
}

export const ROWS: RowMap = {
  brand: BrandRow,
  preserveSeed: BrandRow,
  solidInk: BrandRow,
  vividness: BrandRow,
  neutralHue: NeutralRow,
  neutralTint: NeutralRow,
  controlEdge: ControlEdgeRow,
}
