"use client"

/* Color — its rows are the specimen. The seeds and axes land on
   `ColorConfig` through the axis module; here they resolve through the same
   engine the preview runs, in the panel's own display mode, so every swatch
   and derived "Auto" value is what ships. Brand and Neutral lead; roles,
   semantics, contrast and the two modes follow as one row each; engine
   tuning waits in Advanced. */

import { useMemo } from "react"
import { TriangleAlertIcon } from "lucide-react"
import { useTheme } from "starter-themes"

import { STEPS, toOklch, wcag2 } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import {
  BORDER_JOBS,
  buildColorConfig,
  COLOR_DEFAULTS,
  GUARANTEE_OPTIONS,
} from "../axes/color"
import type { ColorMode } from "../axes/color"
import {
  DialColor,
  DialFolder,
  DialPopover,
  DialSegmented,
  DialSlider,
  DialToggle,
  DialTrigger,
} from "../dial"
import { PaletteDot } from "../patterns"
import { neutralFamily, NeutralPickerPopover, NeutralStrip } from "../rows"
import type { Studio, StudioState } from "../state"

/* ------------------------------ Config bridge ------------------------------ */

const COLOR_KEYS = Object.keys(
  COLOR_DEFAULTS,
) as (keyof typeof COLOR_DEFAULTS)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: StudioState): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** One mode's engine half — how other sections (Surfaces) read the mode
 *  pair without owning color state. */
export function useModeTheme(state: StudioState, mode?: ColorMode) {
  const theme = resolveColorConfigCached(useColorConfig(state))
  return mode ? theme[mode.polarity] : null
}

/** The resolved theme in the panel's own mode, so what the rows show is what
 *  the page around them renders. */
function usePanelMode(state: StudioState) {
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  return {
    config,
    theme,
    m: theme[resolvedTheme === "dark" ? "dark" : "light"],
  }
}

/** WCAG of the untouched borders vs the app background — the border sliders'
 *  stable zero point, measured with any border targets stripped. */
function useBorderSeeds(config: ColorConfig) {
  return useMemo(() => {
    const { borders: _drop, ...rest } = config
    const baseline = resolveColorConfigCached(config.borders ? rest : config)
    const bg = toOklch(baseline.light.background)
    const ratio = (step: "400" | "500" | "600") => {
      const color = baseline.light.scales.neutral?.[step]
      return color ? Math.round(wcag2(toOklch(color), bg) * 100) / 100 : 1.05
    }
    return { "400": ratio("400"), "500": ratio("500"), "600": ratio("600") }
  }, [config])
}

/* ----------------------------- Contrast status ----------------------------- */

/** The report as a passive indicator: nothing when guarantees pass, a warning
 *  glyph opening the details on hover when they don't. */
function ContrastWarnings({
  warnings,
  delta,
  pinned,
}: {
  warnings: string[]
  /** The brand seed's snap price (ΔE), context for why steps moved. */
  delta: number
  pinned: boolean
}) {
  if (warnings.length === 0) return null
  return (
    <Tooltip delay={150} closeDelay={100}>
      <Button
        size="xs"
        variant="quiet"
        isIconOnly
        aria-label={`${warnings.length} contrast warning${warnings.length === 1 ? "" : "s"}`}
        className="size-5 shrink-0 text-fg-warning hover:text-fg-warning"
      >
        <TriangleAlertIcon />
      </Button>
      <TooltipContent className="max-w-64">
        <div className="flex flex-col gap-1">
          {warnings.map((warning, i) => (
            <p key={i}>{warning}</p>
          ))}
          {!pinned && delta >= 0.005 && (
            <p>Brand snapped ΔE {delta.toFixed(3)} for contrast.</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

/* --------------------------------- Section --------------------------------- */

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
  { key: "selectionSeed", palette: "selection", label: "Selection" },
] as const

const formatBg = (mode: ColorMode, v: number) =>
  mode.polarity === "dark" && v === 0 ? "OLED" : `L* ${v.toFixed(1)}`

/** The decisions on the page: the two seeds every other color derives from. */
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
        status={
          <ContrastWarnings
            warnings={theme.report.warnings}
            delta={theme.report.seedDelta.accent ?? 0}
            pinned={state.preserveSeed}
          />
        }
        footer={
          <DialToggle
            label="Keep exact"
            value={state.preserveSeed}
            onChange={set("preserveSeed")}
          />
        }
      />
      <DialTrigger
        label="Neutral"
        value={
          <>
            <span className="truncate">{neutralFamily(neutral, brandHue)}</span>
            <NeutralStrip ramp={ramp} className="h-5 w-12 rounded-md" />
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
    </>
  )
}

/** Roles, semantics, character, contrast, modes; engine tuning in Advanced. */
export function ColorSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const { config, m } = usePanelMode(state)
  const borderSeeds = useBorderSeeds(config)

  const solid = (palette: string) => m.scales[palette]?.["700"] ?? m.background
  const semantic = (palette: string) =>
    palette === "selection"
      ? (m.scales.selection?.["700"] ??
        solid(state.primary === "accent" ? "accent" : "neutral"))
      : solid(palette)
  const semanticsCustom = SEMANTIC_SEEDS.some(({ key }) => state[key] !== "")

  const updateMode = (next: ColorMode) =>
    set("modes")(state.modes.map((mode) => (mode.id === next.id ? next : mode)))

  const setBorderContrast = (on: boolean) => {
    set("borderContrast")(on)
    for (const { key, job } of BORDER_JOBS) set(key)(on ? borderSeeds[job] : 0)
  }

  return (
    <>
      <DialSegmented
        label="Primary"
        value={state.primary}
        onChange={set("primary")}
        options={[
          {
            value: "neutral",
            label: (
              <>
                <PaletteDot color={solid("neutral")} />
                Neutral
              </>
            ),
          },
          {
            value: "accent",
            label: (
              <>
                <PaletteDot color={solid("accent")} />
                Accent
              </>
            ),
          },
        ]}
      />
      <DialTrigger
        label="Semantics"
        value={
          <>
            <span className="flex items-center gap-1">
              {SEMANTIC_SEEDS.map(({ key, palette }) => (
                <PaletteDot key={key} color={semantic(palette)} />
              ))}
            </span>
            {semanticsCustom ? "Custom" : "Auto"}
          </>
        }
      >
        <DialPopover>
          {SEMANTIC_SEEDS.map(({ key, palette, label }) => (
            <DialColor
              key={key}
              label={label}
              value={state[key]}
              derived={semantic(palette)}
              onChange={set(key)}
              onReset={() => set(key)("")}
            />
          ))}
        </DialPopover>
      </DialTrigger>
      <DialSlider
        label="Vividness"
        value={state.vividness}
        onChange={set("vividness")}
        minValue={0}
        maxValue={2}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
      />
      <DialSegmented
        label="Contrast"
        value={state.guarantees}
        onChange={set("guarantees")}
        options={GUARANTEE_OPTIONS}
      />
      {state.modes.map((mode) => {
        const light = mode.polarity === "light"
        const high = mode.contrast === "high"
        return (
          <DialTrigger
            key={mode.id}
            label={mode.name}
            value={
              <span className="truncate font-mono tabular-nums">
                {formatBg(mode, mode.bg)}
                {high && " · High"}
              </span>
            }
          >
            <DialPopover>
              <DialSlider
                label="Background"
                value={mode.bg}
                onChange={(bg) => updateMode({ ...mode, bg })}
                minValue={light ? 90 : 0}
                maxValue={light ? 100 : 20}
                step={0.5}
                format={(v) => formatBg(mode, v)}
              />
              <DialToggle
                label="High contrast"
                value={high}
                onChange={(on) =>
                  updateMode({ ...mode, contrast: on ? "high" : "default" })
                }
              />
            </DialPopover>
          </DialTrigger>
        )
      })}
      <DialFolder title="Advanced" defaultOpen={false}>
        <DialSlider
          label="Hue shift"
          value={state.hueShift}
          onChange={set("hueShift")}
          minValue={0}
          maxValue={3}
          step={0.1}
          format={(v) => `${v.toFixed(1)}×`}
        />
        <DialToggle
          label="Custom borders"
          value={state.borderContrast}
          onChange={setBorderContrast}
        />
        {state.borderContrast &&
          BORDER_JOBS.map(({ key, job, label, maxValue }) => (
            <DialSlider
              key={key}
              label={label}
              value={state[key] > 0 ? state[key] : borderSeeds[job]}
              onChange={set(key)}
              minValue={1.05}
              maxValue={maxValue}
              step={0.01}
              format={(v) => `${v.toFixed(2)}:1`}
            />
          ))}
      </DialFolder>
    </>
  )
}
