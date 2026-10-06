"use client"

/* Surfaces — one row under Color. Its popover leads with the styles, each
   drawn and described; under a hairline, the settings a style is made of and
   each mode's page. */

import { useState } from "react"

import type { StepName, Theme } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import { cn } from "@/registry/lib/utils"

import { buildColorConfig, DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import {
  cardRung,
  EDGE_OPTIONS,
  flatAllowed,
  GLASS_OPTIONS,
  LAYERS_OPTIONS,
  SHADOW_OPTIONS,
  surfaceColorCss,
  surfaceRecipe,
  SURFACE_STYLES,
  surfaceStyle,
  withSurface,
} from "../axes/surfaces"
import type {
  Mode,
  PerMode,
  SurfaceColor,
  SurfaceStyle,
} from "../axes/surfaces"
import {
  DialPicker,
  DialPickList,
  DialPopover,
  DialSeparator,
  DialSlider,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import { selectionKey, useCurrent } from "../selection"
import type { Studio, StudioState } from "../state"

/* The card's shadow at glyph scale, by Tailwind rung (none, xs, sm, md, lg),
   drawn heavier than life so it reads at this size. */
const GLYPH_SHADOWS = [
  "0 0 #0000",
  "0 0.5px 1px rgb(0 0 0 / 0.18)",
  "0 1px 2px rgb(0 0 0 / 0.22)",
  "0 1.5px 3px rgb(0 0 0 / 0.28)",
  "0 2px 4px rgb(0 0 0 / 0.32)",
]

/** A card on the page, light beside dark, in the system's own neutral. */
function SurfaceGlyph({
  state,
  theme,
  large,
}: {
  state: StudioState
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
                boxShadow: GLYPH_SHADOWS[Math.min(cardRung(state), 4)],
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

export function SurfacesRow({
  studio,
  theme,
}: {
  studio: Studio
  theme: Theme
}) {
  const { state, set, setState } = studio
  // The light page Grouped took, given back when Layers leaves it — kept per
  // design system; editing a view keeps its key.
  const { doc, view } = useCurrent()
  const key = doc ? `system:${doc.id}` : selectionKey(view)
  const [memory, setMemory] = useState<{ key: string; page?: number }>()
  const before = memory?.key === key ? memory.page : undefined
  const { style, exact } = surfaceStyle(state)
  const commit = (next: ReturnType<typeof withSurface>) => {
    setMemory({ key, page: next.before })
    setState(next.state)
  }
  const edit = (patch: Parameters<typeof withSurface>[1]) =>
    commit(withSurface(state, patch, before))
  return (
    <DialTrigger
      label="Surfaces"
      swatch
      value={
        <>
          {!exact && <ModifiedDot />}
          <span className="truncate">{style.label}</span>
          <SurfaceGlyph state={state} theme={theme} />
        </>
      }
    >
      <DialPopover className="w-80">
        <StyleList
          state={state}
          theme={theme}
          before={before}
          onChange={edit}
        />
        <DialSeparator />
        <DialPicker
          label="Layers"
          value={state.surfaceLayers}
          onChange={(surfaceLayers) => edit({ surfaceLayers })}
          options={LAYERS_OPTIONS}
        />
        <DialPicker
          label="Edge"
          value={state.surfaceEdge}
          onChange={(surfaceEdge) => edit({ surfaceEdge })}
          options={EDGE_OPTIONS}
        />
        <DialPicker
          label="Shadow"
          value={state.surfaceShadow}
          onChange={(surfaceShadow) => edit({ surfaceShadow })}
          options={SHADOW_OPTIONS.map((o) =>
            o.value === "flat" && !flatAllowed(state)
              ? {
                  ...o,
                  disabled: true,
                  description: "Needs an edge, a tone or a gray page",
                }
              : o,
          )}
        />
        <DialPicker
          label="Overlays"
          value={state.surfaceGlass ? "glass" : "solid"}
          onChange={(value) => set("surfaceGlass")(value === "glass")}
          options={GLASS_OPTIONS}
        />
        <DialSlider
          label="Light page"
          value={state.lightBg}
          onChange={(lightBg) =>
            commit(withSurface({ ...state, lightBg }, {}, before))
          }
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
  before,
  onChange,
}: {
  state: StudioState
  theme: Theme
  before: number | undefined
  onChange: (values: SurfaceStyle["values"]) => void
}) {
  const { style, exact } = surfaceStyle(state)
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
        const preview = withSurface(state, s.values, before).state
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
                preview.lightBg === state.lightBg
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
