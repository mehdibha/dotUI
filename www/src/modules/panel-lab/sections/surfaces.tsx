"use client"

/* Surfaces — the delineation axis (issue #590): how elevated surfaces separate
   from the page. The 7-system border survey showed hairline, shadow and dark
   bg-elevation are traded against each other, never independent — so the
   section's primary control is a recipe, with strength/elevation/material as
   the only loose levers. The hero renders both modes at once, engine-true:
   a recipe that looks right in light and wrong in dark is the axis's whole
   failure mode, so the two tiles are read together, never toggled. */

import { useMemo } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import {
  ControlGroup,
  GroupCaption,
  OptionGridRow,
  SwitchRow,
  SegmentedControlRow,
} from "@/modules/control-lab/rows"
import type { OptionGridItem } from "@/modules/control-lab/rows"
import type { SegmentedRowOption } from "@/modules/control-lab/rows"

import { HeroModes } from "../hero"
import type { Lab, LabState } from "../state"
import { useModeTheme } from "./color"

/* Defaults are the study's recommended direction, not today's solid
   neutral-400. */
export const SURFACE_DEFAULTS = {
  surfaceDelineation: "hairline",
  surfaceHairline: "default",
  surfaceDarkElevate: true,
  shadows: "soft",
  overlayMaterial: "solid",
}

/* Delineation recipes (issue #590, the 7-system border survey). Hairline,
   shadow role and dark elevation are traded against each other in every
   surveyed system, so they move as one recipe, never as independent knobs.
   References: Hairline ≈ shadcn/coss, Adaptive ≈ Spectrum S2/Geist
   (shadow-only light, hairline dark), Shadow ≈ HeroUI/Astryx, Outline ≈ Linear
   (solid near-bg step + heavy shadow). */
const SURFACE_RECIPES = [
  { id: "hairline", label: "Hairline" },
  { id: "adaptive", label: "Adaptive" },
  { id: "shadow", label: "Shadow" },
  { id: "outline", label: "Outline" },
] as const

type SurfaceRecipeId = (typeof SURFACE_RECIPES)[number]["id"]

/** Hairline ink strength — fg alpha, the survey's observed 5–12% band. */
const HAIRLINE_OPTIONS: SegmentedRowOption[] = [
  { value: "subtle", label: "Subtle" },
  { value: "default", label: "Default" },
  { value: "strong", label: "Strong" },
]

const HAIRLINE_ALPHA: Record<string, number> = {
  subtle: 6,
  default: 9,
  strong: 13,
}

/** Overlay material for menus, popovers and tooltips. */
const OVERLAY_OPTIONS: SegmentedRowOption[] = [
  { value: "solid", label: "Solid" },
  { value: "glass", label: "Glass" },
]

/* Shadow family presets — one decision that sets the overlay, card and control
   shadows together, previewed as actual shadowed tiles. */
function ShadowTile({ boxShadow }: { boxShadow?: string }) {
  return (
    <span
      className="h-9 w-full max-w-14 rounded-md bg-highlight"
      style={boxShadow ? { boxShadow } : undefined}
    />
  )
}

const SHADOW_OPTIONS: OptionGridItem[] = [
  { id: "none", label: "None", preview: <ShadowTile /> },
  {
    id: "crisp",
    label: "Crisp",
    preview: <ShadowTile boxShadow="0 1px 2px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: "soft",
    label: "Soft",
    preview: <ShadowTile boxShadow="0 6px 16px -4px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: "floating",
    label: "Floating",
    preview: <ShadowTile boxShadow="0 14px 32px -6px rgb(0 0 0 / 0.65)" />,
  },
]

/* ------------------------------- Recipe model ------------------------------ */

/** One resolved surface treatment: what the tile actually paints. */
interface SurfaceLook {
  bg: string
  borderColor?: string
  boxShadow?: string
  backdropFilter?: string
}

/** Shadow family → css per surface class, scaled up for dark (a shadow that
 *  reads on white disappears on near-black). */
function shadowCss(
  family: string,
  kind: "card" | "floating",
  dark: boolean,
): string | undefined {
  const a = (light: number) => (dark ? Math.min(light * 2.2, 0.7) : light)
  if (family === "none") return undefined
  if (family === "crisp")
    return kind === "card"
      ? `0 1px 2px rgb(0 0 0 / ${a(0.08)})`
      : `0 1px 2px rgb(0 0 0 / ${a(0.16)})`
  if (family === "floating")
    return kind === "card"
      ? `0 2px 6px rgb(0 0 0 / ${a(0.08)})`
      : `0 14px 32px -6px rgb(0 0 0 / ${a(0.3)})`
  // soft (default)
  return kind === "card"
    ? `0 1px 3px rgb(0 0 0 / ${a(0.06)})`
    : `0 8px 24px -6px rgb(0 0 0 / ${a(0.24)})`
}

/**
 * The recipe resolver — the axis's semantics in one place. `ink` is the mode's
 * strongest neutral (the fg side), `step` the 200 rung; a hairline is ink at
 * the strength alpha, composited over the surface (the survey's consensus).
 */
function surfaceLook(
  state: LabState,
  kind: "card" | "floating",
  dark: boolean,
  scales: Record<string, Record<string, string> | undefined>,
  background: string,
): SurfaceLook {
  const recipe = state.surfaceDelineation as SurfaceRecipeId
  const neutral = scales.neutral ?? {}
  const surface = neutral["50"] ?? background
  const ink = neutral["950"] ?? background
  const step = neutral["200"] ?? background
  const alpha = HAIRLINE_ALPHA[state.surfaceHairline] ?? 9
  const hairline = `color-mix(in srgb, ${ink} ${alpha}%, transparent)`

  const elevated =
    dark && state.surfaceDarkElevate && kind === "floating"
      ? `color-mix(in oklab, ${surface} 50%, ${neutral["100"] ?? surface})`
      : surface
  const glass = kind === "floating" && state.overlayMaterial === "glass"

  const look: SurfaceLook = {
    bg: glass ? `color-mix(in srgb, ${elevated} 72%, transparent)` : elevated,
    backdropFilter: glass ? "blur(6px)" : undefined,
    boxShadow: shadowCss(state.shadows, kind, dark),
  }

  if (recipe === "hairline") look.borderColor = hairline
  else if (recipe === "adaptive") {
    if (dark) look.borderColor = hairline
  } else if (recipe === "outline") {
    look.borderColor =
      kind === "floating"
        ? step
        : `color-mix(in srgb, ${ink} ${HAIRLINE_ALPHA.subtle}%, transparent)`
  }
  // 'shadow': no border on any surface — separation is shadow + elevation.
  return look
}

/* ---------------------------------- Hero ----------------------------------- */

/** One mode's stack: the page carrying a card, and a floating menu straddling
 *  the card's edge so the treatment is read against both surfaces at once. */
function SurfaceTile({
  label,
  icon: Icon,
  dark,
  state,
  scales,
  background,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  dark: boolean
  state: LabState
  scales: Record<string, Record<string, string> | undefined>
  background: string
}) {
  const fg = scales.neutral?.["900"] ?? background
  const accent = scales.accent?.["700"] ?? background
  const card = surfaceLook(state, "card", dark, scales, background)
  const menu = surfaceLook(state, "floating", dark, scales, background)
  const border = (look: SurfaceLook) =>
    look.borderColor
      ? { border: `1px solid ${look.borderColor}` }
      : { border: "1px solid transparent" }

  return (
    <div
      className="flex-1 overflow-hidden rounded-xl border border-border/45"
      style={{ backgroundColor: background, color: fg }}
    >
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="flex items-center gap-1.5 opacity-60">
          <Icon className="size-3" />
          <span className="text-[10px] font-medium">{label}</span>
        </span>
      </div>
      <div className="relative mx-3 mt-2 mb-3 h-24">
        <div
          className="absolute inset-x-0 top-0 h-14 rounded-lg p-2"
          style={{
            backgroundColor: card.bg,
            boxShadow: card.boxShadow,
            ...border(card),
          }}
        >
          <span className="block h-1.5 w-1/2 rounded-full bg-current opacity-70" />
          <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-current opacity-25" />
          <span
            aria-hidden
            className="absolute top-2 right-2 size-4 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
        <div
          className="absolute top-8 right-4 flex w-20 flex-col gap-1 rounded-md p-1.5"
          style={{
            backgroundColor: menu.bg,
            boxShadow: menu.boxShadow,
            backdropFilter: menu.backdropFilter,
            ...border(menu),
          }}
        >
          <span className="flex h-3.5 items-center rounded-sm bg-current/10 px-1">
            <span className="block h-1 w-3/4 rounded-full bg-current opacity-60" />
          </span>
          <span className="block h-1 w-1/2 rounded-full bg-current opacity-25" />
          <span className="block h-1 w-2/3 rounded-full bg-current opacity-25" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Recipe glyphs ------------------------------ */

/** A recipe's mini specimen: a dark page tile with one floating surface —
 *  dark is where the recipes actually diverge. Adaptive shows both halves. */
function Glyph({
  border,
  bg,
  shadow,
}: {
  border?: string
  bg: string
  shadow?: string
}) {
  return (
    <span
      className="size-9 rounded-md p-1.5"
      style={{ backgroundColor: "#141517" }}
    >
      <span
        className="block size-full rounded-[5px]"
        style={{
          backgroundColor: bg,
          border: border ? `1px solid ${border}` : undefined,
          boxShadow: shadow,
        }}
      />
    </span>
  )
}

const RECIPE_PREVIEWS: Record<SurfaceRecipeId, React.ReactNode> = {
  hairline: <Glyph bg="#1e1f22" border="rgba(255,255,255,0.16)" />,
  adaptive: (
    <span className="relative size-9 overflow-hidden rounded-md">
      <span
        className="absolute inset-y-0 left-0 w-1/2 p-1.5 pr-0"
        style={{ backgroundColor: "#fafafa" }}
      >
        <span
          className="block size-full rounded-l-[5px]"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 5px rgb(0 0 0 / 0.18)",
          }}
        />
      </span>
      <span
        className="absolute inset-y-0 right-0 w-1/2 p-1.5 pl-0"
        style={{ backgroundColor: "#141517" }}
      >
        <span
          className="block size-full rounded-r-[5px]"
          style={{
            backgroundColor: "#1e1f22",
            borderBlock: "1px solid rgba(255,255,255,0.16)",
            borderRight: "1px solid rgba(255,255,255,0.16)",
          }}
        />
      </span>
    </span>
  ),
  shadow: <Glyph bg="#26272b" shadow="0 4px 10px rgb(0 0 0 / 0.55)" />,
  outline: (
    <Glyph bg="#191a1d" border="#3c3e44" shadow="0 4px 10px rgb(0 0 0 / 0.4)" />
  ),
}

const RECIPE_OPTIONS: OptionGridItem[] = SURFACE_RECIPES.map((recipe) => ({
  id: recipe.id,
  label: recipe.label,
  preview: RECIPE_PREVIEWS[recipe.id],
}))

/* --------------------------------- Section --------------------------------- */

export function SurfacesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const modes = state.modes
  const lightMode = useMemo(
    () => modes.find((mode) => mode.polarity === "light"),
    [modes],
  )
  const darkMode = useMemo(
    () => modes.find((mode) => mode.polarity === "dark"),
    [modes],
  )
  const light = useModeTheme(state, lightMode)
  const darkTheme = useModeTheme(state, darkMode)

  return (
    <>
      <HeroModes>
        {light && lightMode && (
          <SurfaceTile
            label={lightMode.name}
            icon={SunIcon}
            dark={false}
            state={state}
            scales={light.scales}
            background={light.background}
          />
        )}
        {darkTheme && darkMode && (
          <SurfaceTile
            label={darkMode.name}
            icon={MoonIcon}
            dark
            state={state}
            scales={darkTheme.scales}
            background={darkTheme.background}
          />
        )}
      </HeroModes>
      <OptionGridRow
        label="Delineation"
        value={state.surfaceDelineation}
        onChange={set("surfaceDelineation")}
        options={RECIPE_OPTIONS}
        columns={4}
      />
      <GroupCaption>
        One recipe for every elevated edge — card, popover, menu, modal.
        Adaptive is shadow-only in light and grows the hairline in dark.
      </GroupCaption>
      <ControlGroup>
        {state.surfaceDelineation !== "shadow" && (
          <SegmentedControlRow
            label="Hairline"
            value={state.surfaceHairline}
            onChange={set("surfaceHairline")}
            options={HAIRLINE_OPTIONS}
          />
        )}
        <SwitchRow
          label="Dark elevation"
          description="Lift popovers and menus to a lighter surface than the card in dark mode."
          value={state.surfaceDarkElevate}
          onChange={set("surfaceDarkElevate")}
        />
      </ControlGroup>
      <OptionGridRow
        label="Shadows"
        value={state.shadows}
        onChange={set("shadows")}
        options={SHADOW_OPTIONS}
        columns={4}
      />
      <SegmentedControlRow
        label="Overlays"
        value={state.overlayMaterial}
        onChange={set("overlayMaterial")}
        options={OVERLAY_OPTIONS}
      />
      <GroupCaption>
        One material for menus, popovers and tooltips together.
      </GroupCaption>
    </>
  )
}
