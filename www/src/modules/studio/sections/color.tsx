"use client"

/* Color — its rows are the specimen. The seeds and axes land on
   `ColorConfig` through the axis module; here they resolve through the same
   engine the preview runs, in the panel's own display mode, so every swatch
   and derived "Auto" value is what ships. The palettes lead — Brand, Neutral,
   Semantics — then Primary; Vividness sits under Brand, its seed. */

import { useMemo } from "react"
import { useTheme } from "starter-themes"

import { STEPS, toOklch } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import { buildColorConfig, COLOR_DEFAULTS } from "../axes/color"
import {
  DialColor,
  DialGap,
  DialPopover,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { PaletteDot } from "../patterns"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Studio, StudioState } from "../state"
import { PrimaryRow } from "./primary"

/* ------------------------------ Config bridge ------------------------------ */

/* The backgrounds live under Surfaces but feed the same recipe. */
const COLOR_KEYS = [
  ...Object.keys(COLOR_DEFAULTS),
  "lightBg",
  "darkBg",
] as (keyof StudioState)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: StudioState): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** The resolved theme in the panel's own mode, so what the rows show is what
 *  the page around them renders. */
function usePanelMode(state: StudioState) {
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  return {
    theme,
    m: theme[resolvedTheme === "dark" ? "dark" : "light"],
  }
}

/* --------------------------------- Section --------------------------------- */

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
  { key: "selectionSeed", palette: "selection", label: "Selection" },
] as const

/** The decisions on the page: the two seeds every other color derives from. */
export function ColorPrimary({ studio }: { studio: Studio }) {
  const { state, set, setState } = studio
  const { m } = usePanelMode(state)
  const neutral = { hue: state.neutralHue, tint: state.neutralTint }
  const brandHue = toOklch(state.brand).h
  const ramp = STEPS.map((step) => m.scales.neutral?.[step] ?? m.background)
  return (
    <>
      <DialColor
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
            <DialSlider
              label="Vividness"
              value={state.vividness}
              onChange={set("vividness")}
              minValue={0}
              maxValue={2}
              step={0.05}
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
    </>
  )
}

/** Beside the title: the brand over the neutral it sits on. */
export function ColorPreview({ state }: { state: StudioState }) {
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

/** Semantics and primary. */
export function ColorSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const { m } = usePanelMode(state)

  const solid = (palette: string) => m.scales[palette]?.["700"] ?? m.background
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
              onReset={() => set(key)("")}
            />
          ))}
        </DialPopover>
      </DialTrigger>
      <DialGap />
      <PrimaryRow studio={studio} m={m} />
    </>
  )
}
