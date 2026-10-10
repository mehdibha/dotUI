"use client"

/* Color — its rows are the specimen, drawn by the engine the preview runs in
   the panel's own mode. Brand and Neutral sit on the main page; the Color &
   surfaces page holds the semantics, Primary, the surfaces and control inks. */

import { STEPS, toOklch } from "@dotui/colors"
import type { Mode, StepName } from "@dotui/colors"

import { VIVIDNESS_RANGE } from "../axes/color"
import {
  CONTROL_EDGE_OPTIONS,
  SELECTED_WASH_OPTIONS,
  SOLID_INK_OPTIONS,
} from "../axes/color.meta"
import {
  DialColor,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialToggle,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import type { RowMap } from "../family-page"
import { usePanelMode } from "../panel-mode"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
  { key: "selectionSeed", palette: "selection", label: "Selection" },
] as const

/* The rungs each edge mixes, per mode (the hairline steps down in dark). */
const EDGE_STEPS: Record<string, Record<Mode, [StepName, StepName]>> = {
  soft: { light: ["200", "300"], dark: ["100", "200"] },
  firm: { light: ["400", "400"], dark: ["400", "400"] },
  strong: { light: ["700", "700"], dark: ["700", "700"] },
}

const WASH: Record<string, [string, StepName]> = {
  neutral: ["neutral", "300"],
  brand: ["accent", "100"],
}

/** A palette rung in the panel's mode. */
function useStep() {
  const { m, mode } = usePanelMode()
  const step = (palette: string, name: StepName) =>
    m.scales[palette]?.[name] ?? m.background
  return { m, mode, step }
}

/* ---------------------------------- Rows ----------------------------------- */

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

/** The semantic solids, the selection one read the way the engine paints it. */
function useSemantics(state: Effective) {
  const { m } = usePanelMode(state)
  const selection =
    m.scales.selection?.["700"] ??
    m.scales[state.selectionColor]?.[
      state.selectionColor === "neutral" ? "950" : "700"
    ]
  return SEMANTIC_SEEDS.map((seed) => ({
    ...seed,
    color:
      (seed.palette === "selection"
        ? selection
        : m.scales[seed.palette]?.["700"]) ?? m.background,
  }))
}

/* Each dot but the last is cut where the next one overlaps it (12px dots,
   4px overlap, 1.5px gap), so the stack reads on any row tint. */
const STACK_CUTOUT =
  "radial-gradient(circle at 14px 50%, #0000 7.5px, #000 8px)"

/** The four semantic colors, stacked. */
export function SemanticsPreview({ state }: { state: Effective }) {
  const semantics = useSemantics(state)
  return (
    <span className="flex -space-x-1">
      {semantics.map(({ key, color }, i) => (
        <span
          key={key}
          className="size-3 shrink-0 rounded-full"
          style={{
            background: color,
            mask: i < semantics.length - 1 ? STACK_CUTOUT : undefined,
          }}
        />
      ))}
    </span>
  )
}

function SemanticsRow() {
  const { state, effective, set } = useStudio()
  const semantics = useSemantics(effective)
  const custom = SEMANTIC_SEEDS.some(({ key }) => state[key] !== "")
  return (
    <DialTrigger
      label="Semantics"
      holds={SEMANTIC_SEEDS.map(({ key }) => key)}
      swatch
      value={
        <>
          {custom && <ModifiedDot />}
          <SemanticsPreview state={effective} />
        </>
      }
    >
      <DialPopover>
        {semantics.map(({ key, label, color }) => (
          <DialColor
            key={key}
            label={label}
            value={state[key]}
            derived={color}
            onChange={set(key)}
          />
        ))}
      </DialPopover>
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
          preview: (
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

function SelectedWashRow() {
  const { step } = useStep()
  return (
    <DialSelect
      axis="selectedWash"
      label="Selected wash"
      options={SELECTED_WASH_OPTIONS.map((option) => {
        const [palette, name] = WASH[option.value] ?? ["neutral", "300"]
        return {
          ...option,
          preview: (
            <span
              className="h-3.5 w-6 shrink-0 rounded-[4px]"
              style={{ backgroundColor: step(palette, name) }}
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
  ...Object.fromEntries(SEMANTIC_SEEDS.map(({ key }) => [key, SemanticsRow])),
  controlEdge: ControlEdgeRow,
  selectedWash: SelectedWashRow,
}
