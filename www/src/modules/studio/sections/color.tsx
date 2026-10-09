"use client"

/* Color — its rows are the specimen. The seeds and axes land on
   `ColorConfig` through the axis module; here they resolve through the same
   engine the preview runs, in the panel's own display mode, so every swatch
   and derived "Auto" value is what ships. The palettes lead — Brand, Neutral,
   Semantics — then Primary; Vividness sits under Brand, its seed. */

import { useContext, useMemo } from "react"
import { useTheme } from "starter-themes"

import { STEPS, toOklch } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import {
  buildColorConfig,
  COLOR_DEFAULTS,
  VIVIDNESS_RANGE,
} from "../axes/color"
import {
  DialColor,
  DialGap,
  DialLink,
  DialSlider,
  DialToggle,
  DialTrigger,
  ModifiedDot,
} from "../dial"
import {
  neutralFamily,
  NeutralPickerPopover,
  NeutralStrip,
  PanelNav,
} from "../rows"
import type { ChapterPage, Studio, StudioState } from "../state"
import { PrimaryRow } from "./primary"
import { SurfacesRow } from "./surfaces"

/* ------------------------------ Config bridge ------------------------------ */

const COLOR_KEYS = Object.keys(COLOR_DEFAULTS) as (keyof StudioState)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: StudioState): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** The resolved theme in the panel's own mode, so what the rows show is what
 *  the page around them renders. */
function usePanelMode(state: StudioState) {
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  return {
    theme,
    m: theme[resolvedTheme === "dark" ? "dark" : "light"],
  }
}

/* --------------------------------- Section --------------------------------- */

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
  { key: "selectionSeed", palette: "selection", label: "Selection" },
] as const

/** The decisions on the page: the two seeds every other color derives from,
 *  and the surfaces they paint. */
export function ColorPrimary({ studio }: { studio: Studio }) {
  const { state, set, setState } = studio
  const { theme, m } = usePanelMode(state)
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
              minValue={VIVIDNESS_RANGE.min}
              maxValue={VIVIDNESS_RANGE.max}
              step={VIVIDNESS_RANGE.step}
              format={(v) => `${v.toFixed(2)}×`}
            />
          </>
        }
      />
      <DialTrigger
        label="Neutral"
        swatch
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
      <SurfacesRow studio={studio} theme={theme} />
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

function useSemantics(state: StudioState) {
  const { m } = usePanelMode(state)
  const selection =
    m.scales.selection?.["700"] ??
    m.scales[state.selectionColor]?.[
      state.selectionColor === "neutral" ? "950" : "700"
    ]
  return SEMANTIC_SEEDS.map((seed) => ({
    ...seed,
    color:
      (seed.palette === "selection"
        ? selection
        : m.scales[seed.palette]?.["700"]) ?? m.background,
  }))
}

/* Each dot but the last is cut where the next one overlaps it (12px dots,
   4px overlap, 1.5px gap), so the stack reads on any row tint. */
const STACK_CUTOUT =
  "radial-gradient(circle at 14px 50%, #0000 7.5px, #000 8px)"

/** The four semantic colors, stacked. */
export function SemanticsPreview({ state }: { state: StudioState }) {
  const semantics = useSemantics(state)
  return (
    <span className="flex -space-x-1">
      {semantics.map(({ key, color }, i) => (
        <span
          key={key}
          className="size-3 shrink-0 rounded-full"
          style={{
            background: color,
            mask: i < semantics.length - 1 ? STACK_CUTOUT : undefined,
          }}
        />
      ))}
    </span>
  )
}

function SemanticsPage({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return useSemantics(state).map(({ key, label, color }) => (
    <DialColor
      key={key}
      label={label}
      value={state[key]}
      derived={color}
      onChange={set(key)}
    />
  ))
}

export const COLOR_PAGES: ChapterPage[] = [
  {
    id: "semantics",
    label: "Semantics",
    Preview: SemanticsPreview,
    Body: SemanticsPage,
  },
]

/** Semantics and primary. */
export function ColorSection({ studio }: { studio: Studio }) {
  const { state } = studio
  const { m } = usePanelMode(state)
  const open = useContext(PanelNav)
  const custom = SEMANTIC_SEEDS.some(({ key }) => state[key] !== "")
  return (
    <>
      <DialLink
        label="Semantics"
        onPress={() => open("semantics")}
        value={
          <>
            {custom && <ModifiedDot />}
            <SemanticsPreview state={state} />
          </>
        }
      />
      <DialGap />
      <PrimaryRow studio={studio} m={m} />
    </>
  )
}
