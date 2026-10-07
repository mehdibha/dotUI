"use client"

/* Surfaces — one row under Color. Its popover leads with the styles, each
   drawn and described; under a hairline, the settings a style is made of and
   each mode's page. */

import type { StepName, Theme } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import { cn } from "@/registry/lib/utils"

import { effective } from "../axes"
import { buildColorConfig, DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
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
  SURFACE_STYLES,
  surfaceStyle,
} from "../axes/surfaces.meta"
import type { SurfaceStyle } from "../axes/surfaces.meta"
import {
  DialPicker,
  DialPickList,
  DialPopover,
  DialSeparator,
  DialSlider,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import type { Effective, Studio, StudioState } from "../state"

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

export function SurfacesRow({
  studio,
  theme,
}: {
  studio: Studio
  theme: Theme
}) {
  const { state, effective: values, set, setState } = studio
  const { style, exact } = surfaceStyle(state)
  const edit = (patch: SurfaceStyle["values"] | Partial<StudioState>) =>
    setState({ ...state, ...patch })
  return (
    <DialTrigger
      label="Surfaces"
      holds={SURFACE_KEYS}
      chevron={false}
      value={
        <>
          {!exact && <ModifiedDot />}
          <span className="truncate">{style.label}</span>
          <SurfaceGlyph state={values} theme={theme} />
        </>
      }
    >
      <DialPopover className="w-80">
        <StyleList state={state} theme={theme} onChange={edit} />
        <DialSeparator />
        <DialPicker
          axis="surfaceLayers"
          label="Layers"
          options={LAYERS_OPTIONS}
        />
        <DialPicker
          axis="surfaceEdge"
          label="Edge"
          options={EDGE_OPTIONS.map((option) => ({
            ...option,
            visual: (
              <SurfaceGlyph
                large
                state={
                  effective({ ...state, surfaceEdge: option.value }).values
                }
                theme={theme}
              />
            ),
          }))}
        />
        <DialPicker
          axis="surfaceShadow"
          label="Shadow"
          options={SHADOW_OPTIONS}
        />
        <DialPicker
          label="Overlays"
          value={state.surfaceGlass ? "glass" : "solid"}
          onChange={(value) => set("surfaceGlass")(value === "glass")}
          options={GLASS_OPTIONS}
        />
        <DialPicker
          axis="shellTone"
          label="App shell"
          options={SHELL_OPTIONS}
        />
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

/** The styles, each drawn as picking it would land. Mounted only while the
 *  popover is open, so the Grouped preview's color solve runs on demand. */
function StyleList({
  state,
  theme,
  onChange,
}: {
  state: StudioState
  theme: Theme
  onChange: (values: SurfaceStyle["values"]) => void
}) {
  const { style, exact } = surfaceStyle(state)
  const page = effective(state).values.lightBg
  return (
    <DialPickList
      label="Style"
      value={exact ? style.id : undefined}
      modified={exact ? undefined : style.id}
      onChange={(id) => {
        const next = SURFACE_STYLES.find((s) => s.id === id)
        if (next) onChange(next.values)
      }}
      options={SURFACE_STYLES.map((s) => {
        const preview = effective({ ...state, ...s.values }).values
        return {
          value: s.id,
          label: s.label,
          note: s.credits,
          description: s.description,
          visual: (
            <SurfaceGlyph
              large
              state={preview}
              theme={
                preview.lightBg === page
                  ? theme
                  : resolveColorConfigCached(buildColorConfig(preview))
              }
            />
          ),
        }
      })}
    />
  )
}
