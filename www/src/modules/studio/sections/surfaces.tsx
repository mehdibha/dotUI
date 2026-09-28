"use client"

/* Surfaces — one row under Color. Its popover leads with the styles, each
   saying what it looks like; under a hairline, the settings a style is made
   of and each mode's page. */

import { useState } from "react"

import type { StepName, Theme } from "@dotui/colors"

import { DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import {
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
import type { Mode, PerMode, SurfaceColor } from "../axes/surfaces"
import {
  DialPicker,
  DialPickList,
  DialPopover,
  DialSeparator,
  DialSlider,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import type { Studio, StudioState } from "../state"

/** The row's specimen: a card on the page, light beside dark, in the
 *  system's own neutral. */
function SurfaceGlyph({ state, theme }: { state: StudioState; theme: Theme }) {
  const recipe = surfaceRecipe(state)
  return (
    <span className="grid w-10 shrink-0 grid-cols-2 overflow-hidden rounded border border-fg/15">
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
            className="relative block h-5"
            style={{ background: color(recipe.page) }}
          >
            <span
              className="absolute inset-x-1 top-1 h-3 rounded-[3px] border"
              style={{
                background: color(recipe.card.bg),
                borderColor: color(recipe.card.edge),
              }}
            />
          </span>
        )
      })}
    </span>
  )
}

const PAGE_NAMES: Record<Mode, Record<number, string>> = {
  light: { 100: "White", 99: "Off-white" },
  dark: { 0: "Black", 2: "Near-black", 9: "Soft", 16: "Dim" },
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
  // The style the edits started from names the row while they differ.
  const [from, setFrom] = useState<string>()
  const { style, exact } = surfaceStyle(state, from)
  if (exact && style.id !== from) setFrom(style.id)
  const edit = (patch: Parameters<typeof withSurface>[1]) =>
    setState(withSurface(state, patch))
  return (
    <DialTrigger
      label="Surfaces"
      chevron={false}
      value={
        <>
          {!exact && <ModifiedDot />}
          <span className="truncate">{style.label}</span>
          <SurfaceGlyph state={state} theme={theme} />
        </>
      }
    >
      <DialPopover className="w-80">
        <DialPickList
          label="Style"
          value={exact ? style.id : undefined}
          modified={exact ? undefined : style.id}
          onChange={(id) => {
            const next = SURFACE_STYLES.find((s) => s.id === id)
            if (next) edit(next.values)
          }}
          options={SURFACE_STYLES.map((s) => ({
            value: s.id,
            label: s.label,
            description: s.description,
          }))}
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
          options={SHADOW_OPTIONS.map((o) => ({
            ...o,
            disabled: o.value === "flat" && !flatAllowed(state),
          }))}
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
          onChange={set("lightBg")}
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
