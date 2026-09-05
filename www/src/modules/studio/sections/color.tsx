"use client"

/* Color — the only hero-less chapter: its rows are the specimen. The seeds
   and axes land on `ColorConfig` through the axis module; here they resolve
   through the same engine the preview runs, in the panel's own display mode,
   so every swatch and derived "Auto" value is what ships. */

import { useMemo } from "react"
import {
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "starter-themes"

import { STEPS, toHex, toOklch, wcag2 } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import { cn } from "@/registry/lib/utils"
import type { ColorConfig } from "@/registry/theme"
import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import {
  BORDER_JOBS,
  buildColorConfig,
  COLOR_DEFAULTS,
  GUARANTEE_OPTIONS,
} from "../axes/color"
import type { LabMode } from "../axes/color"
import {
  DetailRow,
  MiniSliderRow,
  PaletteDot,
  PickerPopoverContent,
  SwatchDots,
} from "../patterns"
import {
  ColorPickerRow,
  ControlGroup,
  MiniSegmented,
  MiniSwitch,
  NeutralPickerRow,
  ParamRow,
  ROW,
  ROW_LABEL,
  ROW_VALUE,
  SegmentedControlRow,
} from "../rows"
import type { Lab, LabState } from "../state"

/* ------------------------------ Config bridge ------------------------------ */

const COLOR_KEYS = Object.keys(
  COLOR_DEFAULTS,
) as (keyof typeof COLOR_DEFAULTS)[]

/** The state's recipe, reference-stable on its values so the engine runs
 *  once per color edit (never for edits in other sections). */
function useColorConfig(state: LabState): ColorConfig {
  const key = JSON.stringify(COLOR_KEYS.map((k) => state[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildColorConfig(state), [key])
}

/** One mode's engine half — how other sections (Surfaces) read the mode
 *  pair without owning color state. */
export function useModeTheme(state: LabState, mode?: LabMode) {
  const theme = resolveColorConfigCached(useColorConfig(state))
  return mode ? theme[mode.polarity] : null
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

function cssToHex(css: string): string {
  return toHex(toOklch(css))
}

/** A mode's background as CSS without running the engine — for the swatches
 *  in summaries and mode rows (at dot size CIELAB L* on a neutral axis is
 *  indistinguishable from the engine's). */
function modeBgCss(mode: LabMode): string {
  return `lab(${mode.bg}% 0 0)`
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
        className="shrink-0 text-fg-warning hover:text-fg-warning"
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

/* -------------------------------- Mode editor ------------------------------- */

/** One mode's block inside the Modes panel: identity row over its two
 *  parameters. */
function ModeEditor({
  mode,
  onChange,
}: {
  mode: LabMode
  onChange: (mode: LabMode) => void
}) {
  const PolarityIcon = mode.polarity === "light" ? SunIcon : MoonIcon
  const light = mode.polarity === "light"
  return (
    <div className="flex flex-col border-t border-bg/50 pt-1 first:border-t-0 first:pt-0">
      <div className="flex h-9 items-center gap-2 px-2">
        <span
          className="size-3.5 shrink-0 rounded-full ring-1 ring-border/60 ring-inset"
          style={{ backgroundColor: modeBgCss(mode) }}
        />
        <span className="truncate text-xs font-medium text-fg">
          {mode.name}
        </span>
        <PolarityIcon className="size-3 shrink-0 text-fg-muted" />
      </div>
      <MiniSliderRow
        label="Background"
        value={mode.bg}
        onChange={(bg) => onChange({ ...mode, bg })}
        minValue={light ? 90 : 0}
        maxValue={light ? 100 : 20}
        step={0.5}
        format={(v) => (!light && v === 0 ? "OLED" : `L* ${v.toFixed(1)}`)}
      />
      <ParamRow label="High contrast">
        <MiniSwitch
          ariaLabel={`High contrast for ${mode.name}`}
          value={mode.contrast === "high"}
          onChange={(on) =>
            onChange({ ...mode, contrast: on ? "high" : "default" })
          }
        />
      </ParamRow>
    </div>
  )
}

/* -------------------------------- Auto rows -------------------------------- */

/** A seed row that reads “Auto” (showing the engine's derived color) until
 *  overridden — the panel face of absent-means-default. Reset returns to Auto. */
function AutoColorRow({
  label,
  value,
  derived,
  onChange,
  onReset,
}: {
  label: string
  /** '' = Auto. */
  value: string
  /** The engine's derived color while Auto (any CSS color). */
  derived: string
  onChange: (hex: string) => void
  onReset: () => void
}) {
  return (
    <ColorPicker
      value={value || cssToHex(derived)}
      onChange={(c) => onChange(c.toString("hex"))}
    >
      {({ color }) => (
        <div
          data-row=""
          className={cn(ROW, "flex items-center gap-0.5", value && "pr-1.5")}
        >
          <Button
            variant="quiet"
            className="flex h-full min-w-0 flex-1 items-center justify-between gap-3 rounded-none px-4 font-normal"
          >
            <span className={ROW_LABEL}>{label}</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <span className={cn(ROW_VALUE, value && "font-mono uppercase")}>
                {value ? color.toString("hex") : "Auto"}
              </span>
              <ColorSwatch className="size-5 rounded-full" />
            </span>
          </Button>
          {value !== "" && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Reset ${label} to auto`}
              onPress={onReset}
              className="shrink-0 text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          <PickerPopoverContent />
        </div>
      )}
    </ColorPicker>
  )
}

/** AutoColorRow on the tile geometry (ColorPickerRow's tile layout) — for the
 *  semantic seeds, three up. Reset appears in the corner once overridden. */
function AutoColorTile({
  label,
  value,
  derived,
  onChange,
  onReset,
}: {
  label: string
  value: string
  derived: string
  onChange: (hex: string) => void
  onReset: () => void
}) {
  return (
    <ColorPicker
      value={value || cssToHex(derived)}
      onChange={(c) => onChange(c.toString("hex"))}
    >
      {({ color }) => (
        <div className="relative">
          <Button
            variant="quiet"
            className="flex h-auto w-full items-center justify-between gap-2 rounded-xl bg-muted p-2.5 text-left font-normal hover:bg-highlight pressed:bg-highlight"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={ROW_LABEL}>{label}</span>
              <span
                className={cn(
                  ROW_VALUE,
                  "text-xs",
                  value && "font-mono uppercase",
                )}
              >
                {value ? color.toString("hex") : "Auto"}
              </span>
            </span>
            <ColorSwatch className="size-5 shrink-0 rounded-full" />
          </Button>
          {value !== "" && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Reset ${label} to auto`}
              onPress={onReset}
              className="absolute top-1 right-1 text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          <PickerPopoverContent />
        </div>
      )}
    </ColorPicker>
  )
}

/* --------------------------------- Section --------------------------------- */

const CHARACTER_KEYS = ["vividness", "hueShift"] as const

const CONTRAST_KEYS = ["guarantees", "preserveSeed", "borderContrast"] as const

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
] as const

/** Collapsed-row summary: the brand seed and where primary actions draw from. */
export function colorSummary(state: LabState): string {
  const primary = state.primary === "accent" ? "Accent" : "Neutral"
  return `${state.brand.toUpperCase()} · ${primary} primary`
}

export function ColorSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const modes = state.modes
  const config = useColorConfig(state)
  const theme = resolveColorConfigCached(config)
  const borderSeeds = useBorderSeeds(config)
  // Swatches read in the panel's own mode, so what the rows show is what the
  // page around them renders.
  const { resolvedTheme } = useTheme()
  const m = theme[resolvedTheme === "dark" ? "dark" : "light"]

  const solid = (palette: string) => m.scales[palette]?.["700"] ?? m.background
  const selectionDerived =
    m.scales.selection?.["700"] ??
    (state.primary === "accent" ? solid("accent") : solid("neutral"))

  const characterModified = CHARACTER_KEYS.some(
    (key) => state[key] !== COLOR_DEFAULTS[key],
  )
  const contrastModified = CONTRAST_KEYS.some(
    (key) => state[key] !== COLOR_DEFAULTS[key],
  )

  const updateMode = (next: LabMode) =>
    set("modes")(modes.map((mode) => (mode.id === next.id ? next : mode)))

  const setBorderContrast = (on: boolean) => {
    set("borderContrast")(on)
    for (const { key, job } of BORDER_JOBS) set(key)(on ? borderSeeds[job] : 0)
  }

  return (
    <>
      {/* Palette first: the base seeds, then the semantic set three up. */}
      <ControlGroup>
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set("brand")}
        />
        <NeutralPickerRow
          value={{ hue: state.neutralHue, tint: state.neutralTint }}
          onChange={(neutral) => {
            set("neutralHue")(neutral.hue)
            set("neutralTint")(neutral.tint)
          }}
          brandHue={toOklch(state.brand).h}
          ramp={STEPS.map((step) => m.scales.neutral?.[step] ?? m.background)}
        />
      </ControlGroup>
      <div className="grid grid-cols-3 gap-1.5">
        {SEMANTIC_SEEDS.map(({ key, palette, label }) => (
          <AutoColorTile
            key={key}
            label={label}
            value={state[key]}
            derived={solid(palette)}
            onChange={set(key)}
            onReset={() => set(key)("")}
          />
        ))}
      </div>
      <div className="flex justify-end pr-2 empty:hidden">
        <ContrastWarnings
          warnings={theme.report.warnings}
          delta={theme.report.seedDelta.accent ?? 0}
          pinned={state.preserveSeed}
        />
      </div>
      {/* Then the role decisions the palette feeds. */}
      <ControlGroup>
        <SegmentedControlRow
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
        <AutoColorRow
          label="Selection"
          value={state.selectionSeed}
          derived={selectionDerived}
          onChange={set("selectionSeed")}
          onReset={() => set("selectionSeed")("")}
        />
      </ControlGroup>
      <DetailRow
        label="Modes"
        summary={
          <span className="flex items-center gap-1.5">
            <span className={ROW_VALUE}>
              {modes
                .map((mode) =>
                  mode.contrast === "high" ? `${mode.name} HC` : mode.name,
                )
                .join(" · ")}
            </span>
            <SwatchDots colors={modes.map(modeBgCss)} />
          </span>
        }
      >
        {modes.map((mode) => (
          <ModeEditor key={mode.id} mode={mode} onChange={updateMode} />
        ))}
      </DetailRow>
      <DetailRow
        label="Character"
        summary={characterModified ? "Custom" : "Default"}
      >
        <MiniSliderRow
          label="Vividness"
          value={state.vividness}
          onChange={set("vividness")}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
        />
        <MiniSliderRow
          label="Hue shift"
          value={state.hueShift}
          onChange={set("hueShift")}
          minValue={0}
          maxValue={3}
          step={0.1}
          format={(v) => `${v.toFixed(1)}×`}
        />
      </DetailRow>
      <DetailRow
        label="Contrast guarantees"
        summary={contrastModified ? "Custom" : "Default"}
      >
        <ParamRow label="Guarantees">
          <MiniSegmented
            ariaLabel="Contrast guarantees"
            value={state.guarantees}
            onChange={set("guarantees")}
            options={GUARANTEE_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Pin brand seed">
          <MiniSwitch
            ariaLabel="Pin exact brand color"
            value={state.preserveSeed}
            onChange={set("preserveSeed")}
          />
        </ParamRow>
        <ParamRow label="Custom borders">
          <MiniSwitch
            ariaLabel="Custom border contrast"
            value={state.borderContrast}
            onChange={setBorderContrast}
          />
        </ParamRow>
        {state.borderContrast &&
          BORDER_JOBS.map(({ key, job, label, maxValue }) => (
            <MiniSliderRow
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
      </DetailRow>
    </>
  )
}
