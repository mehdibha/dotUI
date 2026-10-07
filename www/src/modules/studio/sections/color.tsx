"use client"

/* Color — its rows are the specimen, drawn by the engine the preview runs in
   the panel's own mode. The palettes lead — Brand, Neutral, Surfaces — then
   Semantics, Primary and the control inks. */

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
  DialGap,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import { usePanelMode } from "../panel-mode"
import { PaletteDot } from "../patterns"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"
import { PrimaryRow } from "./primary"
import { SurfacesRow } from "./surfaces"

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
      chevron={false}
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

function SemanticsRow() {
  const { state, set } = useStudio()
  const { m, step } = useStep()
  const semantic = (palette: string) =>
    palette === "selection"
      ? (m.scales.selection?.["700"] ??
        m.scales[state.selectionColor]?.[
          state.selectionColor === "neutral" ? "950" : "700"
        ] ??
        m.background)
      : step(palette, "700")
  const custom = SEMANTIC_SEEDS.some(({ key }) => state[key] !== "")
  return (
    <DialTrigger
      label="Semantics"
      holds={SEMANTIC_SEEDS.map(({ key }) => key)}
      value={
        <>
          <span className="flex items-center gap-1">
            {SEMANTIC_SEEDS.map(({ key, palette }) => (
              <PaletteDot key={key} color={semantic(palette)} />
            ))}
          </span>
          {custom ? "Custom" : "Auto"}
        </>
      }
    >
      <DialPopover>
        {SEMANTIC_SEEDS.map(({ key, palette, label }) => (
          <DialColor
            key={key}
            label={label}
            value={state[key]}
            derived={semantic(palette)}
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
      label="Selected"
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

/* --------------------------------- Section --------------------------------- */

/** The decisions on the page: the two seeds every color derives from, and the
 *  surfaces they paint. */
export function ColorPrimary() {
  return (
    <>
      <Row axis="brand" />
      <Row axis="neutralHue" />
      <SurfacesRow />
    </>
  )
}

/** Beside the title: the brand over the neutral it sits on. */
export function ColorPreview({ state }: { state: Effective }) {
  const { m } = usePanelMode(state)
  const dots = [m.scales.neutral?.["900"], m.scales.accent?.["700"]]
  return (
    <span className="flex items-center -space-x-1">
      {dots.map((color, i) => (
        <span
          key={i}
          className="size-3 rounded-full ring-2 ring-(--panel-surface)"
          style={{ backgroundColor: color ?? m.background }}
        />
      ))}
    </span>
  )
}

export function ColorSection() {
  return (
    <>
      <Row axis="successSeed" />
      <DialGap />
      <PrimaryRow />
      <Row axis="controlEdge" />
      <Row axis="selectedWash" />
    </>
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
