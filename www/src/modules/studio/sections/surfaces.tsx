"use client"

/* Surfaces — how cards and floating layers separate from the page. Style
   opens five cards, each the recipe drawn twice, light beside dark: dark
   behavior is part of a style (shadows die on near-black), so the pick shows
   both modes instead of asking for them separately. Depth is the one
   intensity lever; Glass the popover material. Page tint and shadow character
   fold under More. */

import { cn } from "@/registry/lib/utils"

import {
  CANVAS_OPTIONS,
  DEPTH_OPTIONS,
  SHADOW_OPTIONS,
  shadowCss,
  STRATEGY_OPTIONS,
  surfaceColorCss,
  surfaceRecipe,
} from "../axes/surfaces"
import type {
  Mode,
  PerMode,
  SurfaceColor,
  SurfaceLook,
  SurfacePalette,
} from "../axes/surfaces"
import {
  DialFolder,
  DialPopover,
  DialSegmented,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/* The glyph's own neutral ramp, one per mode: grays at the registry's rung
   lightness, so a style reads the same whichever neutral the system runs. */
const gray = (l: number) => `oklch(${l} 0 0)`
const GLYPH_PALETTE: PerMode<SurfacePalette> = {
  light: {
    step: (s) =>
      gray(
        { "25": 1, "50": 0.985, "100": 0.965, "200": 0.925, "300": 0.87 }[s] ??
          0.71,
      ),
    hairline: gray(0.9),
    ink: gray(0.15),
  },
  dark: {
    step: (s) =>
      gray(
        { "25": 0.13, "50": 0.17, "100": 0.21, "200": 0.26, "300": 0.32 }[s] ??
          0.42,
      ),
    hairline: gray(0.235),
    ink: gray(0.98),
  },
}

/** Shadow offsets at the glyph's scale. */
const scaleOffset = (offset: string, k: number) =>
  offset.replace(/(-?[\d.]+)px/g, (_, n) => `${Number(n) * k}px`)

function lookStyle(look: SurfaceLook, mode: Mode, k: number) {
  const palette = GLYPH_PALETTE[mode]
  const color = (pair: PerMode<SurfaceColor>) =>
    surfaceColorCss(pair[mode], palette)
  return {
    background: color(look.bg),
    borderColor: color(look.edge),
    boxShadow: shadowCss(
      look.shadow.map((layer) => ({
        ...layer,
        offset: scaleOffset(layer.offset, k),
      })),
      color,
    ),
  }
}

/** One mode of the recipe: a card on the page with a popover over it. */
function Half({
  state,
  mode,
  mini,
}: {
  state: StudioState
  mode: Mode
  mini?: boolean
}) {
  const recipe = surfaceRecipe(state)
  const palette = GLYPH_PALETTE[mode]
  const bar = {
    background: surfaceColorCss({ kind: "ink", alpha: 0.18 }, palette),
  }
  const k = mini ? 0.3 : 0.7
  return (
    <span
      className={cn("relative block", mini ? "h-5" : "h-16")}
      style={{ background: surfaceColorCss(recipe.page[mode], palette) }}
    >
      <span
        className={cn(
          "absolute flex flex-col gap-1 border",
          mini
            ? "inset-x-1 top-1 h-3 rounded-[3px]"
            : "inset-x-2 top-2 h-9 rounded-[5px] p-1.5",
        )}
        style={lookStyle(recipe.card, mode, k)}
      >
        {!mini && (
          <>
            <span className="h-1 w-1/2 rounded-full" style={bar} />
            <span className="h-1 w-1/3 rounded-full" style={bar} />
          </>
        )}
      </span>
      {!mini && (
        <span
          className="absolute right-2 bottom-1.5 flex h-8 w-[52%] flex-col gap-1 rounded-[5px] border p-1"
          style={lookStyle(recipe.popover, mode, k)}
        >
          <span className="h-1.5 w-2/3 rounded-full" style={bar} />
          <span className="h-1.5 w-1/2 rounded-full" style={bar} />
        </span>
      )}
    </span>
  )
}

/** The recipe drawn light beside dark. */
function StyleGlyph({ state, mini }: { state: StudioState; mini?: boolean }) {
  return (
    <span
      className={cn(
        "grid shrink-0 grid-cols-2 overflow-hidden border border-fg/15",
        mini ? "w-10 rounded" : "w-full rounded-md",
      )}
    >
      <Half state={state} mode="light" mini={mini} />
      <Half state={state} mode="dark" mini={mini} />
    </span>
  )
}

/* --------------------------------- Section --------------------------------- */

const strategyLabel = (value: string) =>
  STRATEGY_OPTIONS.find((o) => o.value === value)?.label ?? value

export function surfacesSummary(state: StudioState): string {
  return strategyLabel(state.surfaceStrategy)
}

export function SurfacesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const depth = Math.max(
    0,
    DEPTH_OPTIONS.findIndex((o) => o.value === state.surfaceDepth),
  )
  return (
    <>
      <DialTrigger
        label="Style"
        value={
          <>
            <span className="truncate">
              {strategyLabel(state.surfaceStrategy)}
            </span>
            <StyleGlyph state={state} mini />
          </>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Style"
            value={state.surfaceStrategy}
            onChange={set("surfaceStrategy")}
            options={STRATEGY_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: (
                <StyleGlyph
                  state={{ ...state, surfaceStrategy: option.value }}
                />
              ),
            }))}
          />
        </DialPopover>
      </DialTrigger>
      <DialSlider
        label="Depth"
        value={depth}
        onChange={(i) => set("surfaceDepth")(DEPTH_OPTIONS[i]!.value)}
        minValue={0}
        maxValue={DEPTH_OPTIONS.length - 1}
        step={1}
        format={(i) => DEPTH_OPTIONS[Math.round(i)]?.label ?? ""}
      />
      <DialToggle
        label="Glass"
        value={state.surfaceMaterial === "glass"}
        onChange={(on) => set("surfaceMaterial")(on ? "glass" : "solid")}
      />
      <DialFolder title="More" defaultOpen={false}>
        <DialSegmented
          label="Page"
          value={state.surfaceCanvas}
          onChange={set("surfaceCanvas")}
          options={CANVAS_OPTIONS}
        />
        <DialSegmented
          label="Shadow"
          value={state.surfaceShadow}
          onChange={set("surfaceShadow")}
          options={SHADOW_OPTIONS}
        />
      </DialFolder>
    </>
  )
}
