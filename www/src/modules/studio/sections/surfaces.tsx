"use client"

/* Surfaces — one row under Color: the styles, drawn in the system's own
   neutral light beside dark, then the settings a style is made of and each
   mode's page. */

import { useState } from "react"

import type { StepName, Theme } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"

import { DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import {
  EDGE_OPTIONS,
  flatAllowed,
  LAYERS_OPTIONS,
  SHADOW_OPTIONS,
  shadowCss,
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
  SurfaceLook,
  SurfacePalette,
} from "../axes/surfaces"
import {
  DialGap,
  DialPopover,
  DialSegmented,
  DialSlider,
  DialToggle,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/** A mode's neutral rungs and hairline, as the registry paints them. */
function palette(theme: Theme, mode: Mode): SurfacePalette {
  const m = theme[mode]
  const step = (s: string) => m.scales.neutral?.[s as StepName] ?? m.background
  const [a, b] = mode === "light" ? ["200", "300"] : ["100", "200"]
  return {
    step,
    hairline: `color-mix(in oklab, ${step(a)} 50%, ${step(b)})`,
  }
}

/** Shadow offsets at the glyph's scale, dark enough to read at its size. */
const scaleOffset = (offset: string, k: number) =>
  offset.replace(/(-?[\d.]+)px/g, (_, n) => `${Number(n) * k}px`)
const boost = (color: SurfaceColor): SurfaceColor =>
  color.kind === "shade"
    ? { kind: "shade", alpha: Math.min(color.alpha * 3, 0.5) }
    : color

function lookStyle(
  look: SurfaceLook,
  p: SurfacePalette,
  mode: Mode,
  k: number,
) {
  const color = (pair: PerMode<SurfaceColor>) => surfaceColorCss(pair[mode], p)
  return {
    background: color(look.bg),
    borderColor: color(look.edge),
    boxShadow: shadowCss(
      look.shadow.map((layer) => ({
        offset: scaleOffset(layer.offset, k),
        color: {
          light: boost(layer.color.light),
          dark: boost(layer.color.dark),
        },
      })),
      color,
    ),
  }
}

/** One mode of the recipe: a card on the page, a popover over it. */
function Half({
  state,
  theme,
  mode,
  mini,
}: {
  state: StudioState
  theme: Theme
  mode: Mode
  mini?: boolean
}) {
  const recipe = surfaceRecipe(state)
  const p = palette(theme, mode)
  const ink = { background: p.step(mode === "light" ? "300" : "400") }
  const k = mini ? 0.3 : 0.6
  return (
    <span
      className={cn("relative block", mini ? "h-5" : "h-16")}
      style={{ background: surfaceColorCss(recipe.page[mode], p) }}
    >
      <span
        className={cn(
          "absolute flex flex-col gap-1 border",
          mini
            ? "inset-x-1 top-1 h-3 rounded-[3px]"
            : "inset-x-2 top-2 h-9 rounded-[5px] p-1.5",
        )}
        style={lookStyle(recipe.card, p, mode, k)}
      >
        {!mini && (
          <>
            <span className="h-1 w-1/2 rounded-full" style={ink} />
            <span className="h-1 w-1/3 rounded-full" style={ink} />
          </>
        )}
      </span>
      {!mini && (
        <span
          className="absolute right-2 bottom-1.5 flex h-8 w-[52%] flex-col gap-1 rounded-[5px] border p-1"
          style={lookStyle(recipe.popover, p, mode, k)}
        >
          <span className="h-1.5 w-2/3 rounded-full" style={ink} />
          <span className="h-1.5 w-1/2 rounded-full" style={ink} />
        </span>
      )}
    </span>
  )
}

/** The recipe drawn light beside dark. */
function SurfaceGlyph({
  state,
  theme,
  mini,
}: {
  state: StudioState
  theme: Theme
  mini?: boolean
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 grid-cols-2 overflow-hidden border border-fg/15",
        mini ? "w-10 rounded" : "w-full rounded-md",
      )}
    >
      <Half state={state} theme={theme} mode="light" mini={mini} />
      <Half state={state} theme={theme} mode="dark" mini={mini} />
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
          <SurfaceGlyph state={state} theme={theme} mini />
        </>
      }
    >
      <DialPopover className="w-80">
        <CardGrid
          label="Style"
          value={exact ? style.id : undefined}
          onChange={(id) => {
            const next = SURFACE_STYLES.find((s) => s.id === id)
            if (next) edit(next.values)
          }}
          options={SURFACE_STYLES.map((s) => ({
            id: s.id,
            label: s.label,
            children: (
              <span className="flex flex-col gap-2">
                <SurfaceGlyph state={{ ...state, ...s.values }} theme={theme} />
                <span className="truncate text-xs text-fg/50">{s.hint}</span>
              </span>
            ),
          }))}
        />
        <DialGap />
        <DialSegmented
          label="Layers"
          value={state.surfaceLayers}
          onChange={(surfaceLayers) => edit({ surfaceLayers })}
          options={LAYERS_OPTIONS}
        />
        <DialSegmented
          label="Edge"
          value={state.surfaceEdge}
          onChange={(surfaceEdge) => edit({ surfaceEdge })}
          options={EDGE_OPTIONS}
        />
        <DialSegmented
          label="Shadow"
          value={state.surfaceShadow}
          onChange={(surfaceShadow) => edit({ surfaceShadow })}
          options={SHADOW_OPTIONS.map((o) => ({
            ...o,
            disabled: o.value === "flat" && !flatAllowed(state),
          }))}
        />
        <DialToggle
          label="Glass"
          value={state.surfaceGlass}
          onChange={set("surfaceGlass")}
        />
        <DialGap />
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
