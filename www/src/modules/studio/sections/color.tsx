"use client"

/* Color — its rows are the specimen. The seeds and axes land on
   `ColorConfig` through the axis module; here they resolve through the same
   engine the preview runs, in the panel's own display mode, so every swatch
   and derived "Auto" value is what ships. The palettes lead — Brand, Neutral,
   Semantics — then Primary; Vividness sits under Brand, its seed. */

import { useMemo } from "react"
import { useTheme } from "starter-themes"

import { STEPS, toOklch } from "@dotui/colors"
import type { Mode } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import { buildColorConfig, COLOR_DEFAULTS } from "../axes/color"
import type { ColorMode } from "../axes/color"
import {
  DialColor,
  DialGap,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Studio, StudioState } from "../state"
import { PrimaryRow } from "./primary"
import { Semantics } from "./semantics"

/* ------------------------------ Config bridge ------------------------------ */

/* Modes live under Surfaces but feed the same recipe. */
const COLOR_KEYS = [
  ...Object.keys(COLOR_DEFAULTS),
  "modes",
] as (keyof StudioState)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: StudioState): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** One mode's engine half — how other sections (Surfaces) read the mode
 *  pair without owning color state. */
export function useModeTheme(state: StudioState, mode?: ColorMode) {
  const theme = resolveColorConfigCached(useColorConfig(state))
  return mode ? theme[mode.polarity] : null
}

/** The resolved theme in the panel's own mode, so what the rows show is what
 *  the page around them renders. */
function usePanelMode(state: StudioState) {
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  const mode: Mode = resolvedTheme === "dark" ? "dark" : "light"
  return { theme, mode, m: theme[mode] }
}

/* --------------------------------- Section --------------------------------- */

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
  const { m, mode } = usePanelMode(studio.state)
  return (
    <>
      <Semantics studio={studio} m={m} mode={mode} />
      <DialGap />
      <PrimaryRow studio={studio} m={m} />
    </>
  )
}
