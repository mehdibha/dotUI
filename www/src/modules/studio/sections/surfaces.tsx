"use client"

/* Surfaces — on the main page, a few looks that set how cards separate from
   the page, then Custom. On the Surfaces page, each setting on its own:
   layers, edge, shadow, overlays, the app shell, each mode's page tone and
   the control edges. */

import type { Mode, StepName, Theme } from "@dotui/colors"

import { effective } from "../axes"
import type { Effective } from "../axes"
import { DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import { STYLE_OPTIONS } from "../axes/style.meta"
import {
  cardRung,
  pickSurfaceLook,
  shadowCss,
  surfaceColorCss,
  surfaceLookOf,
  surfaceRecipe,
} from "../axes/surfaces"
import type { PerMode, SurfaceColor, SurfaceLookId } from "../axes/surfaces"
import {
  EDGE_OPTIONS,
  LAYERS_OPTIONS,
  LOOK_OPTIONS,
  OVERLAY_OPTIONS,
  SHADOW_OPTIONS,
  SHELL_OPTIONS,
} from "../axes/surfaces.meta"
import {
  DialLink,
  DialPopover,
  DialSelect,
  DialSlider,
  DialTrigger,
} from "../dial"
import { usePanelMode } from "../panel-mode"
import type { RowMap } from "../row-host"
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
function SurfaceGlyph({ state, theme }: { state: Effective; theme: Theme }) {
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
        const rim = recipe.card.shadow.filter((layer) => layer.inset)
        const drop = GLYPH_SHADOWS[Math.min(cardRung(state), 4)]
        return (
          <span
            key={mode}
            className="relative block h-5"
            style={{ background: step("25") }}
          >
            <span
              className="absolute inset-1 rounded-[3px] border"
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

/** The main page's Surfaces: a look sets layers, edge and shadow; Custom
 *  opens the page. The look the Style draws stands for the Style, so picking
 *  it keeps following; a Style that draws none of them gets its own entry. */
export function SurfacesRow() {
  const { state, setState } = useStudio()
  const { theme } = usePanelMode()
  const lookOf = (id: SurfaceLookId) =>
    effective(pickSurfaceLook(state, id)).values
  const drawn = surfaceLookOf(lookOf("style"))
  const pick = (id: SurfaceLookId) => (id === drawn ? "style" : id)
  const saved = surfaceLookOf(state)
  const options = LOOK_OPTIONS.filter(
    (option) => option.value !== "style" || !drawn,
  ).map((option) => ({
    ...option,
    label:
      option.value === "style"
        ? (STYLE_OPTIONS.find((o) => o.value === state.style)?.label ??
          option.label)
        : option.label,
    glyph: (
      <SurfaceGlyph
        state={lookOf(pick(option.value as SurfaceLookId))}
        theme={theme}
      />
    ),
  }))
  return (
    <DialSelect
      label="Surfaces"
      value={saved === "style" ? (drawn ?? "style") : (saved ?? "Custom")}
      options={options}
      onChange={(id) =>
        setState(pickSurfaceLook(state, pick(id as SurfaceLookId)))
      }
    >
      <DialLink page="surfaces" label="Custom" value={null} />
    </DialSelect>
  )
}

const LayersRow = () => (
  <DialSelect axis="surfaceLayers" label="Layers" options={LAYERS_OPTIONS} />
)

function EdgeRow() {
  const { state } = useStudio()
  const { theme } = usePanelMode()
  return (
    <DialSelect
      axis="surfaceEdge"
      label="Edge"
      options={EDGE_OPTIONS.map((option) => {
        const values = effective({ ...state, surfaceEdge: option.value }).values
        return {
          ...option,
          glyph: <SurfaceGlyph state={values} theme={theme} />,
        }
      })}
    />
  )
}

const ShadowRow = () => (
  <DialSelect axis="surfaceShadow" label="Shadow" options={SHADOW_OPTIONS} />
)

/** Each mode's page tone. */
function PageRow() {
  const { state, effective: values, set } = useStudio()
  return (
    <DialTrigger
      label="Page"
      holds={["lightBg", "darkBg"]}
      value={`${formatPage("light")(values.lightBg)} · ${formatPage("dark")(values.darkBg)}`}
    >
      <DialPopover className="w-72">
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

function OverlaysRow() {
  const { state, set } = useStudio()
  return (
    <DialSelect
      axis="translucentOverlays"
      label="Overlays"
      value={state.translucentOverlays ? "translucent" : "solid"}
      onChange={(value) => set("translucentOverlays")(value === "translucent")}
      options={OVERLAY_OPTIONS}
    />
  )
}

function ShellRow() {
  return (
    <DialSelect axis="shellTone" label="App shell" options={SHELL_OPTIONS} />
  )
}

export const ROWS: RowMap = {
  surfaceLayers: LayersRow,
  surfaceEdge: EdgeRow,
  surfaceShadow: ShadowRow,
  lightBg: PageRow,
  darkBg: PageRow,
  translucentOverlays: OverlaysRow,
  shellTone: ShellRow,
}
