"use client"

/* Color — its rows are the specimen. The seeds and axes land on
   `ColorConfig` through the axis module; here they resolve through the same
   engine the preview runs, in the panel's own display mode, so every swatch
   and derived "Auto" value is what ships. The palettes lead — Brand, Neutral,
   Semantics — then Primary; Vividness sits under Brand, its seed. */

import { useMemo } from "react"
import { useTheme } from "starter-themes"

import { STEPS, toOklch } from "@dotui/colors"
import type { Mode, StepName } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import {
  buildColorConfig,
  COLOR_DEFAULTS,
  VIVIDNESS_RANGE,
} from "../axes/color"
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
import { More } from "../family-page"
import type { RowMap } from "../family-page"
import { PaletteDot } from "../patterns"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Effective, Studio } from "../state"
import { PrimaryRow } from "./primary"
import { SurfacesRow } from "./surfaces"

/* ------------------------------ Config bridge ------------------------------ */

const COLOR_KEYS = Object.keys(COLOR_DEFAULTS) as (keyof Effective)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: Effective): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** The resolved theme in the panel's own mode, so what the rows show is what
 *  the page around them renders. */
function usePanelMode(state: Effective) {
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  const mode: Mode = resolvedTheme === "dark" ? "dark" : "light"
  return { theme, mode, m: theme[mode] }
}

/* --------------------------------- Section --------------------------------- */

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
  { key: "selectionSeed", palette: "selection", label: "Selection" },
] as const

/** The decisions on the page: the two seeds every other color derives from,
 *  and the surfaces they paint. */
export function ColorPrimary({ studio }: { studio: Studio }) {
  const { state, set, setState } = studio
  const { theme, m } = usePanelMode(studio.effective)
  const neutral = { hue: state.neutralHue, tint: state.neutralTint }
  const brandHue = toOklch(state.brand).h
  const ramp = STEPS.map((step) => m.scales.neutral?.[step] ?? m.background)
  return (
    <>
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
      <DialTrigger
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
      <SurfacesRow studio={studio} theme={theme} />
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

/** Semantics, primary, the control edge and the selected wash. */
export function ColorSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const { m, mode } = usePanelMode(studio.effective)
  const step = (palette: string, name: StepName) =>
    m.scales[palette]?.[name] ?? m.background

  const solid = (palette: string) => step(palette, "700")
  const semantic = (palette: string) =>
    palette === "selection"
      ? (m.scales.selection?.["700"] ??
        m.scales[state.selectionColor]?.[
          state.selectionColor === "neutral" ? "950" : "700"
        ] ??
        m.background)
      : solid(palette)
  const semanticsCustom = SEMANTIC_SEEDS.some(({ key }) => state[key] !== "")
  return (
    <>
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
            {semanticsCustom ? "Custom" : "Auto"}
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
      <DialGap />
      <PrimaryRow studio={studio} m={m} />
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
      <More keys={["selectedWash"]}>
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
      </More>
    </>
  )
}

export const ROWS: RowMap = {}
