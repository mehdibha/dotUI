"use client"

/* Surfaces — one row on the Color & surfaces page: the settings the Style
   paints them with, and each mode's page. */

import type { StepName, Theme } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"

import { effective } from "../axes"
import { DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import {
  cardRung,
  shadowCss,
  surfaceColorCss,
  surfaceRecipe,
} from "../axes/surfaces"
import type { Mode, PerMode, SurfaceColor } from "../axes/surfaces"
import {
  EDGE_OPTIONS,
  GLASS_OPTIONS,
  LAYERS_OPTIONS,
  SHADOW_OPTIONS,
  SHELL_OPTIONS,
} from "../axes/surfaces.meta"
import { DialPopover, DialSelect, DialSlider, DialTrigger } from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import { usePanelMode } from "../panel-mode"
import type { Effective } from "../state"
import { valueLabel } from "../use-axis"
import { useStudio } from "../use-studio"

/* The card's shadow at glyph scale, by Tailwind rung (none, xs, sm, md, lg),
   drawn heavier than life so it reads at this size. */
const GLYPH_SHADOWS = [
  "0 0 #0000",
  "0 0.5px 1px rgb(0 0 0 / 0.18)",
  "0 1px 2px rgb(0 0 0 / 0.22)",
  "0 1.5px 3px rgb(0 0 0 / 0.28)",
  "0 2px 4px rgb(0 0 0 / 0.32)",
]

/* The card's edge at glyph scale: Bevel's rim is a shadow, Ledge's lip a
   heavier bottom. */
const GLYPH_STROKE: Record<string, string> = {
  bevel: "0",
  ledge: "1px 1px 2px",
}

/** A card on the page, light beside dark, in the system's own neutral. */
function SurfaceGlyph({
  state,
  theme,
  large,
}: {
  state: Effective
  theme: Theme
  large?: boolean
}) {
  const recipe = surfaceRecipe(state)
  return (
    <span
      className={cn(
        "grid shrink-0 grid-cols-2 overflow-hidden border border-fg/15",
        large ? "w-16 rounded-md" : "w-10 rounded",
      )}
    >
      {(["light", "dark"] as const).map((mode) => {
        const m = theme[mode]
        const step = (s: string) =>
          m.scales.neutral?.[s as StepName] ?? m.background
        const [a, b] = mode === "light" ? ["200", "300"] : ["100", "200"]
        const hairline = `color-mix(in oklab, ${step(a)} 50%, ${step(b)})`
        const color = (pair: PerMode<SurfaceColor>) =>
          surfaceColorCss(pair[mode], { step, hairline })
        const rim = recipe.card.shadow.filter((layer) => layer.inset)
        const drop = GLYPH_SHADOWS[Math.min(cardRung(state), 4)]
        return (
          <span
            key={mode}
            className={cn("relative block", large ? "h-10" : "h-5")}
            style={{ background: step("25") }}
          >
            <span
              className={cn(
                "absolute border",
                large
                  ? "inset-x-1.5 inset-y-2 rounded-[4px]"
                  : "inset-x-1 inset-y-1 rounded-[3px]",
              )}
              style={{
                background: color(recipe.card.bg),
                borderColor: color(recipe.card.edge),
                borderWidth: GLYPH_STROKE[state.surfaceEdge],
                boxShadow: rim.length
                  ? `${shadowCss(rim, color)}, ${drop}`
                  : drop,
              }}
            />
          </span>
        )
      })}
    </span>
  )
}

const PAGE_NAMES: Record<Mode, Record<number, string>> = {
  light: { 100: "White", 99: "Off-white", 96: "Gray" },
  dark: { 0: "Black", 2: "Near-black", 16: "Dim" },
}

const formatPage = (mode: Mode) => (v: number) =>
  PAGE_NAMES[mode][v] ?? `L* ${v.toFixed(1)}`

const SURFACE_KEYS = [
  "surfaceLayers",
  "surfaceEdge",
  "surfaceShadow",
  "surfaceGlass",
  "shellTone",
  "lightBg",
  "darkBg",
]

export function SurfacesRow() {
  const { state, effective: values, set } = useStudio()
  const { theme } = usePanelMode()
  return (
    <DialTrigger
      label="Surfaces"
      holds={SURFACE_KEYS}
      swatch
      value={
        <>
          <span className="truncate">
            {valueLabel("surfaceEdge", values.surfaceEdge)} ·{" "}
            {valueLabel("surfaceShadow", values.surfaceShadow)}
          </span>
          <SurfaceGlyph state={values} theme={theme} />
        </>
      }
    >
      <DialPopover className="w-72">
        <DialSelect
          axis="surfaceLayers"
          label="Layers"
          options={LAYERS_OPTIONS}
        />
        <DialSelect
          axis="surfaceEdge"
          label="Edge"
          options={EDGE_OPTIONS.map((option) => {
            const values = effective({
              ...state,
              surfaceEdge: option.value,
            }).values
            return {
              ...option,
              preview: <SurfaceGlyph large state={values} theme={theme} />,
              glyph: <SurfaceGlyph state={values} theme={theme} />,
            }
          })}
        />
        <DialSelect
          axis="surfaceShadow"
          label="Shadow"
          options={SHADOW_OPTIONS}
        />
        <Row axis="surfaceGlass" />
        <Row axis="shellTone" />
        <DialSlider
          axis="lightBg"
          label="Light page"
          minValue={LIGHT_BG_RANGE.min}
          maxValue={LIGHT_BG_RANGE.max}
          step={LIGHT_BG_RANGE.step}
          format={formatPage("light")}
        />
        <DialSlider
          label="Dark page"
          value={state.darkBg}
          onChange={set("darkBg")}
          minValue={DARK_BG_RANGE.min}
          maxValue={DARK_BG_RANGE.max}
          step={DARK_BG_RANGE.step}
          format={formatPage("dark")}
        />
      </DialPopover>
    </DialTrigger>
  )
}

function GlassRow() {
  const { state, set } = useStudio()
  return (
    <DialSelect
      axis="surfaceGlass"
      label="Overlays"
      value={state.surfaceGlass ? "glass" : "solid"}
      onChange={(value) => set("surfaceGlass")(value === "glass")}
      options={GLASS_OPTIONS}
    />
  )
}

function ShellRow() {
  return (
    <DialSelect axis="shellTone" label="App shell" options={SHELL_OPTIONS} />
  )
}

export const ROWS: RowMap = {
  surfaceLayers: SurfacesRow,
  surfaceEdge: SurfacesRow,
  surfaceShadow: SurfacesRow,
  lightBg: SurfacesRow,
  darkBg: SurfacesRow,
  surfaceGlass: GlassRow,
  shellTone: ShellRow,
}
