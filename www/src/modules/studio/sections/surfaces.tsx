"use client"

/* Surfaces — on the main page, a link to the Surfaces page showing the look.
   On the page, by object: cards, menus and dialogs, the page, then buttons
   and inputs. */

import type { Mode, StepName, Theme } from "@dotui/colors"

import { effective } from "../axes"
import type { Effective } from "../axes"
import { DARK_BG_RANGE, LIGHT_BG_RANGE } from "../axes/color"
import {
  cardRung,
  looksUnder,
  pickSurfaceLook,
  shadowCss,
  surfaceColorCss,
  surfaceLookOf,
  surfaceRecipe,
} from "../axes/surfaces"
import type { PerMode, SurfaceColor, SurfaceLookId } from "../axes/surfaces"
import {
  DARK_LAYERS_OPTIONS,
  LOOK_OPTIONS,
  OVERLAY_EDGE_OPTIONS,
  OVERLAY_OPTIONS,
  OVERLAY_SHADOW_OPTIONS,
  SHADOW_COLOR_OPTIONS,
  SHADOW_OPTIONS,
  SHELL_OPTIONS,
} from "../axes/surfaces.meta"
import { DialLink, DialSegmented, DialSelect, DialSlider } from "../dial"
import { usePanelMode } from "../panel-mode"
import type { RowMap } from "../row-host"
import { DialTiles } from "../tiles"
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

const MODES = ["light", "dark"] as const

/** A mode's surface colors, solved from the system's own neutral. */
function paletteOf(theme: Theme, mode: Mode) {
  const m = theme[mode]
  const step = (s: string) => m.scales.neutral?.[s as StepName] ?? m.background
  const [a, b] = mode === "light" ? ["200", "300"] : ["100", "200"]
  const hairline = `color-mix(in oklab, ${step(a)} 50%, ${step(b)})`
  return {
    step,
    color: (pair: PerMode<SurfaceColor>) =>
      surfaceColorCss(pair[mode], { step, hairline }),
  }
}

/** A card on the page, light beside dark, in the system's own neutral. */
function SurfaceGlyph({ state, theme }: { state: Effective; theme: Theme }) {
  const recipe = surfaceRecipe(state)
  return (
    <span className="grid w-10 shrink-0 grid-cols-2 overflow-hidden rounded border border-fg/15">
      {MODES.map((mode) => {
        const { step, color } = paletteOf(theme, mode)
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

/** A card under a menu on the page, light beside dark, at the size they
 *  ship: a look's tile. */
function SurfaceScene({ state, theme }: { state: Effective; theme: Theme }) {
  const { card, popover, stroke } = surfaceRecipe(state)
  // The theme's page is the current system's; a look can move the light one
  // (Grouped's gray), so relight it to the look's own.
  const page = (mode: Mode, step: (s: string) => string) =>
    mode === "light" && typeof state.lightBg === "number"
      ? `lab(from ${step("25")} ${state.lightBg} a b)`
      : step("25")
  return (
    <span className="absolute inset-0 grid grid-cols-2">
      {MODES.map((mode) => {
        const { step, color } = paletteOf(theme, mode)
        const layer = (
          look: typeof card,
          width: string,
        ): React.CSSProperties => ({
          background: color(look.bg),
          borderColor: color(look.edge),
          borderWidth: width,
          boxShadow: shadowCss(look.shadow, color),
        })
        return (
          <span
            key={mode}
            className="relative block"
            style={{ background: page(mode, step) }}
          >
            <span
              className="absolute top-2.5 left-3 h-9 w-14 rounded-[5px] border-solid"
              style={layer(card, stroke.card)}
            />
            <span
              className="absolute top-7 left-9 h-6 w-10 rounded-[4px] border-solid"
              style={layer(popover, stroke.overlay)}
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

/** The main page's Surfaces: the look and its shadow, opening the page. */
export function SurfacesRow() {
  const { effective: values } = useStudio()
  const { theme } = usePanelMode()
  const look = LOOK_OPTIONS.find((o) => o.value === surfaceLookOf(values))
  const shadow = SHADOW_OPTIONS.find((o) => o.value === values.surfaceShadow)
  return (
    <DialLink
      page="surfaces"
      label="Surfaces"
      value={
        <>
          <SurfaceGlyph state={values} theme={theme} />
          <span className="truncate">
            {look?.label}
            {values.surfaceShadow !== "flat" && ` · ${shadow?.label}`}
          </span>
        </>
      }
    />
  )
}

/** How cards meet the page: one look sets their tone and edge. */
function LookRow() {
  const { state, setState, effective: values } = useStudio()
  const { theme } = usePanelMode()
  const current = surfaceLookOf(values)
  const listed = looksUnder(state.style)
  return (
    <DialTiles
      axis="surfaceLayers"
      label="Look"
      value={current}
      onChange={(id) => setState(pickSurfaceLook(state, id as SurfaceLookId))}
      options={LOOK_OPTIONS.filter(
        (o) => o.value === current || listed.includes(o.value),
      ).map((option) => ({
        ...option,
        tile: (
          <SurfaceScene
            state={
              effective(pickSurfaceLook(state, option.value as SurfaceLookId))
                .values
            }
            theme={theme}
          />
        ),
      }))}
    />
  )
}

const ShadowColorRow = () => (
  <DialSegmented
    axis="shadowColor"
    label="Shadow color"
    options={SHADOW_COLOR_OPTIONS}
  />
)

/* Pickers open under their row, clear of the preview. */
const UNDER = "bottom end"

const ShadowRow = () => (
  <DialSelect
    axis="surfaceShadow"
    label="Shadow"
    options={SHADOW_OPTIONS}
    placement={UNDER}
  />
)

const OverlayEdgeRow = () => (
  <DialSelect
    axis="overlayEdge"
    label="Border"
    options={OVERLAY_EDGE_OPTIONS}
    placement={UNDER}
  />
)

const OverlayShadowRow = () => (
  <DialSelect
    axis="overlayShadow"
    label="Shadow"
    options={OVERLAY_SHADOW_OPTIONS}
    placement={UNDER}
  />
)

function OverlaysRow() {
  const { state, set } = useStudio()
  return (
    <DialSelect
      axis="translucentOverlays"
      label="Background"
      value={state.translucentOverlays ? "translucent" : "solid"}
      onChange={(value) => set("translucentOverlays")(value === "translucent")}
      options={OVERLAY_OPTIONS}
      placement={UNDER}
    />
  )
}

const LightPageRow = () => (
  <DialSlider
    axis="lightBg"
    label="Light"
    minValue={LIGHT_BG_RANGE.min}
    maxValue={LIGHT_BG_RANGE.max}
    step={LIGHT_BG_RANGE.step}
    format={formatPage("light")}
  />
)

function DarkPageRow() {
  const { state, set } = useStudio()
  return (
    <DialSlider
      label="Dark"
      value={state.darkBg}
      onChange={set("darkBg")}
      minValue={DARK_BG_RANGE.min}
      maxValue={DARK_BG_RANGE.max}
      step={DARK_BG_RANGE.step}
      format={formatPage("dark")}
    />
  )
}

const DarkLayersRow = () => (
  <DialSegmented
    axis="darkLayers"
    label="Dark layers"
    options={DARK_LAYERS_OPTIONS}
  />
)

const ShellRow = () => (
  <DialSelect
    axis="shellTone"
    label="Sidebar"
    options={SHELL_OPTIONS}
    placement={UNDER}
  />
)

export const ROWS: RowMap = {
  // The look writes the cards' tone and edge together.
  surfaceLayers: LookRow,
  surfaceEdge: LookRow,
  surfaceShadow: ShadowRow,
  shadowColor: ShadowColorRow,
  overlayEdge: OverlayEdgeRow,
  overlayShadow: OverlayShadowRow,
  translucentOverlays: OverlaysRow,
  darkLayers: DarkLayersRow,
  lightBg: LightPageRow,
  darkBg: DarkPageRow,
  shellTone: ShellRow,
}
