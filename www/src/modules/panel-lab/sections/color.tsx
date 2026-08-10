"use client"

/* Color — modes as a user-defined list of named schemes (1..n) instead of a
   hardcoded light/dark pair. A mode = the same seeds resolved
   under different conditions — polarity, background lightness, contrast
   level. One mode → no switcher at all (light-only sites); extras (Dim,
   OLED, High contrast) come from an archetype menu. The hero previews the
   active mode; the Modes row manages the set. Still engine-real: each mode
   resolves through @dotui/colors with its own background/guarantee settings. */

import { useContext, useMemo, useState } from "react"
import {
  MoonIcon,
  PlusIcon,
  RotateCcwIcon,
  SunIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { STEPS, toHex, toOklch, wcag2 } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import { cn } from "@/registry/lib/utils"
import type { ColorConfig } from "@/registry/theme"
import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
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
  RowOverlayPlacementContext,
  SegmentedControlRow,
} from "@/modules/control-lab/rows"

import {
  DetailRow,
  PaletteDot,
  PickerPopoverContent,
  SwatchDots,
} from "../patterns"
import type { Lab, LabState } from "../state"

/**
 * A color mode — one named scheme in the user's set (1..n), not a light/dark
 * boolean. A mode is the same seeds resolved under different conditions:
 * polarity (ramp direction + prefers-color-scheme bucket), background
 * lightness, and a contrast level.
 */
export interface LabMode {
  id: string
  name: string
  polarity: "light" | "dark"
  /** Background L*; 0 on a dark mode = OLED black. */
  bg: number
  contrast: "default" | "high"
}

const DEFAULT_MODES: LabMode[] = [
  {
    id: "light",
    name: "Light",
    polarity: "light",
    bg: 99,
    contrast: "default",
  },
  { id: "dark", name: "Dark", polarity: "dark", bg: 2, contrast: "default" },
]

/* Mirrors ColorConfig: '' on a seed means Auto (absent from the config), 0 on
   a border means unmeasured. Mode edits must replace the array (never mutate)
   so reference-diffing sees them. */
export const COLOR_DEFAULTS = {
  brand: "#635BFF",
  primary: "neutral",
  neutralHue: null as number | null,
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  selectionSeed: "",
  modes: DEFAULT_MODES,
  defaultMode: "light",
  vividness: 1,
  hueShift: 1,
  neutralTint: 1,
  preserveSeed: false,
  guarantees: "default",
  borderContrast: false,
  border400: 0,
  border500: 0,
  border600: 0,
}

/* ------------------------------ Config bridge ------------------------------ */

/** The color-global slice of lab state that every mode shares. */
const SHARED_KEYS = [
  "brand",
  "primary",
  "neutralHue",
  "successSeed",
  "warningSeed",
  "dangerSeed",
  "selectionSeed",
  "vividness",
  "hueShift",
  "neutralTint",
  "preserveSeed",
  "guarantees",
  "borderContrast",
  "border400",
  "border500",
  "border600",
] as const
type SharedColorState = Pick<LabState, (typeof SHARED_KEYS)[number]>

/**
 * Shared slice + one mode → ColorConfig. The seeds and global axes are
 * common; the mode contributes its background (on its polarity's half) and,
 * for high contrast, a strict guarantee policy with raised border floors.
 */
function buildModeConfig(state: SharedColorState, mode: LabMode): ColorConfig {
  const {
    brand,
    primary,
    neutralHue,
    successSeed,
    warningSeed,
    dangerSeed,
    selectionSeed,
    vividness,
    hueShift,
    neutralTint,
    preserveSeed,
    guarantees,
    borderContrast,
    border400,
    border500,
    border600,
  } = state
  const high = mode.contrast === "high"
  return {
    v: 2,
    seeds: {
      accent: brand,
      success: successSeed || undefined,
      warning: warningSeed || undefined,
      danger: dangerSeed || undefined,
      selection: selectionSeed || undefined,
    },
    background:
      mode.polarity === "light"
        ? { light: Math.min(100, Math.max(90, mode.bg)) }
        : { dark: mode.bg === 0 ? "oled" : Math.min(20, mode.bg) },
    vividness: vividness === 1 ? undefined : vividness,
    hueShift: hueShift === 1 ? undefined : hueShift,
    neutralTint: neutralTint === 1 ? undefined : neutralTint,
    neutralHue: neutralHue ?? undefined,
    preserveSeed: preserveSeed || undefined,
    guaranteePolicy: high
      ? "strict"
      : guarantees === "relaxed" || guarantees === "strict"
        ? guarantees
        : undefined,
    primary: primary === "accent" ? "accent" : undefined,
    borders: high
      ? { "*": { "400": 2, "500": 3, "600": 4.5 } }
      : borderContrast
        ? {
            "*": {
              "400": border400 > 0 ? border400 : undefined,
              "500": border500 > 0 ? border500 : undefined,
              "600": border600 > 0 ? border600 : undefined,
            },
          }
        : undefined,
  }
}

/** Shared slice + one mode, resolved to that mode's engine half — how other
 *  sections (Surfaces) read the mode set without owning color state. */
export function useModeTheme(state: LabState, mode?: LabMode) {
  const sharedKey = JSON.stringify(SHARED_KEYS.map((key) => state[key]))
  const shared = useMemo(
    (): SharedColorState =>
      Object.fromEntries(
        SHARED_KEYS.map((key) => [key, state[key]]),
      ) as SharedColorState,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sharedKey],
  )
  const config = useMemo(
    () => (mode ? buildModeConfig(shared, mode) : null),
    [shared, mode],
  )
  if (!config || !mode) return null
  return resolveColorConfigCached(config)[mode.polarity]
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
 *  in summaries and mode rows (the real value is engine-derived, but at dot
 *  size CIELAB L* on a neutral axis is indistinguishable). */
function modeBgCss(mode: LabMode): string {
  return `lab(${mode.bg}% 0 0)`
}

/* ------------------------------ Mode archetypes ----------------------------- */

/** The 20% of modes that cover 80% of real systems — added, then tweaked. */
const MODE_ARCHETYPES: {
  key: string
  note: string
  mode: Omit<LabMode, "id">
}[] = [
  {
    key: "light",
    note: "White canvas",
    mode: { name: "Light", polarity: "light", bg: 99, contrast: "default" },
  },
  {
    key: "dark",
    note: "Near-black canvas",
    mode: { name: "Dark", polarity: "dark", bg: 2, contrast: "default" },
  },
  {
    key: "dim",
    note: "Lifted dark, easy on OLED smear",
    mode: { name: "Dim", polarity: "dark", bg: 15, contrast: "default" },
  },
  {
    key: "oled",
    note: "Pure black canvas",
    mode: { name: "OLED", polarity: "dark", bg: 0, contrast: "default" },
  },
  {
    key: "light-hc",
    note: "AA text everywhere, strong borders",
    mode: { name: "Light HC", polarity: "light", bg: 100, contrast: "high" },
  },
  {
    key: "dark-hc",
    note: "AA text everywhere, strong borders",
    mode: { name: "Dark HC", polarity: "dark", bg: 0, contrast: "high" },
  },
]

const MAX_MODES = 6

/** Unique id + display name for an added archetype ("Dark", "Dark 2", …). */
function instantiate(
  archetype: Omit<LabMode, "id">,
  existing: LabMode[],
): LabMode {
  let name = archetype.name
  let n = 2
  while (existing.some((mode) => mode.name === name)) {
    name = `${archetype.name} ${n}`
    n += 1
  }
  let id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  while (existing.some((mode) => mode.id === id)) id = `${id}-x`
  return { ...archetype, id, name }
}

/* ----------------------------- Contrast status ----------------------------- */

/** The report as a passive indicator: nothing when guarantees pass, a warning
 *  glyph opening the details on hover when they don't. Diagnostics, not
 *  content — the section leads with the controls. */
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

/** One mode's block inside the Modes panel: identity row (polarity glyph,
 *  name, default badge, remove) over its two parameters. */
function ModeEditor({
  mode,
  isDefault,
  removable,
  onChange,
  onMakeDefault,
  onRemove,
}: {
  mode: LabMode
  isDefault: boolean
  removable: boolean
  onChange: (mode: LabMode) => void
  onMakeDefault: () => void
  onRemove: () => void
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
        <span className="ml-auto flex shrink-0 items-center gap-0.5">
          {isDefault ? (
            <span className="rounded-full bg-bg/50 px-2 py-0.5 text-[10px] font-medium text-fg-muted">
              Default
            </span>
          ) : (
            <Button size="xs" variant="quiet" onPress={onMakeDefault}>
              Make default
            </Button>
          )}
          {removable && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Remove ${mode.name} mode`}
              onPress={onRemove}
              className="text-fg-muted"
            >
              <XIcon />
            </Button>
          )}
        </span>
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

/** The add-mode entry: a quiet row opening the archetype menu. */
function AddModeRow({
  disabled,
  onAdd,
}: {
  disabled: boolean
  onAdd: (archetype: Omit<LabMode, "id">) => void
}) {
  return (
    <div className="border-t border-bg/50 pt-1">
      <Menu>
        <Button
          variant="quiet"
          size="sm"
          isDisabled={disabled}
          className="w-full justify-start gap-2 px-2 text-xs font-normal text-fg-muted"
        >
          <PlusIcon className="size-3.5" />
          {disabled ? `Up to ${MAX_MODES} modes` : "Add mode"}
        </Button>
        <Popover placement={useContext(RowOverlayPlacementContext)}>
          <MenuContent>
            {MODE_ARCHETYPES.map(({ key, note, mode }) => (
              <MenuItem
                key={key}
                id={key}
                textValue={mode.name}
                onAction={() => onAdd(mode)}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="size-4 shrink-0 rounded-full ring-1 ring-border/60 ring-inset"
                    style={{ backgroundColor: `lab(${mode.bg}% 0 0)` }}
                  />
                  <span className="flex flex-col">
                    <span>{mode.name}</span>
                    <span className="text-xs text-fg-muted">{note}</span>
                  </span>
                </span>
              </MenuItem>
            ))}
          </MenuContent>
        </Popover>
      </Menu>
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
 *  semantic seeds, two up. Reset appears in the corner once overridden. */
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

/* ------------------------------- Mini slider ------------------------------- */

/** A continuous axis at sub-row scale: label left, compact drag pill + value
 *  right — the engine's sliders in the mini-control language. */
function MiniSliderRow({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  format,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
  format: (value: number) => string
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-3 px-2">
      <span className="truncate text-xs text-fg-muted">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <Slider
          aria-label={label}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          onChange={(v) => onChange(v as number)}
          className="relative w-24"
        >
          <SliderControl>
            <SliderTrack className="relative h-5 overflow-hidden rounded-md bg-bg/50">
              <SliderFill className="absolute inset-y-0 left-0 bg-highlight" />
            </SliderTrack>
            <SliderThumb className="absolute top-1/2 z-10 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/25" />
          </SliderControl>
        </Slider>
        <span className="w-14 text-right font-mono text-xs text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </span>
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

const GUARANTEE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "relaxed", label: "Relaxed" },
  { value: "strict", label: "Strict" },
]

const FINE_KEYS = [
  "vividness",
  "hueShift",
  "preserveSeed",
  "guarantees",
  "borderContrast",
] as const

const SEMANTIC_SEEDS = [
  { key: "successSeed", palette: "success", label: "Success" },
  { key: "warningSeed", palette: "warning", label: "Warning" },
  { key: "dangerSeed", palette: "danger", label: "Danger" },
] as const

const BORDER_JOBS = [
  { key: "border400", job: "400", label: "Border · subtle", maxValue: 3 },
  { key: "border500", job: "500", label: "Border · interactive", maxValue: 4 },
  { key: "border600", job: "600", label: "Border · emphasized", maxValue: 8 },
] as const

export function ColorSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const modes = state.modes
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0]

  // Resolve ONLY the active mode — mode swatches elsewhere derive from bg
  // directly, so switching or editing another mode never pays an engine run
  // for schemes nobody is looking at. The shared slice memoizes on its own
  // values, so edits to other sections never rebuild the config.
  // JSON key: SHARED_KEYS is a const tuple, so the string is order-stable.
  const sharedKey = JSON.stringify(SHARED_KEYS.map((key) => state[key]))
  const shared = useMemo(
    (): SharedColorState =>
      Object.fromEntries(
        SHARED_KEYS.map((key) => [key, state[key]]),
      ) as SharedColorState,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sharedKey],
  )
  const activeConfig = useMemo(
    () => (active ? buildModeConfig(shared, active) : null),
    [shared, active],
  )
  const theme = activeConfig ? resolveColorConfigCached(activeConfig) : null
  const borderSeeds = useBorderSeeds(
    activeConfig ?? { v: 2, seeds: { accent: state.brand } },
  )

  if (!active || !theme) return null
  const m = theme[active.polarity]

  const solid = (palette: string) => m.scales[palette]?.["700"] ?? m.background
  const selectionDerived =
    m.scales.selection?.["700"] ??
    (state.primary === "accent" ? solid("accent") : solid("neutral"))

  const fineModified = FINE_KEYS.some(
    (key) => state[key] !== COLOR_DEFAULTS[key],
  )

  const setModes = set("modes")
  const updateMode = (next: LabMode) =>
    setModes(modes.map((mode) => (mode.id === next.id ? next : mode)))
  const addMode = (archetype: Omit<LabMode, "id">) => {
    const mode = instantiate(archetype, modes)
    setModes([...modes, mode])
    setActiveId(mode.id)
  }
  const removeMode = (id: string) => {
    const rest = modes.filter((mode) => mode.id !== id)
    setModes(rest)
    if (state.defaultMode === id && rest[0]) set("defaultMode")(rest[0].id)
    if (activeId === id) setActiveId(null)
  }

  const setBorderContrast = (on: boolean) => {
    set("borderContrast")(on)
    for (const { key, job } of BORDER_JOBS) set(key)(on ? borderSeeds[job] : 0)
  }

  return (
    <>
      {/* Palette first: the base seeds, then the semantic set two up. */}
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
            {modes.length > 3 ? (
              <span className={ROW_VALUE}>{modes.length} modes</span>
            ) : (
              <span className={ROW_VALUE}>
                {modes.map((mode) => mode.name).join(" · ")}
              </span>
            )}
            <SwatchDots colors={modes.map(modeBgCss)} />
          </span>
        }
      >
        {modes.map((mode) => (
          <ModeEditor
            key={mode.id}
            mode={mode}
            isDefault={state.defaultMode === mode.id}
            removable={modes.length > 1}
            onChange={updateMode}
            onMakeDefault={() => set("defaultMode")(mode.id)}
            onRemove={() => removeMode(mode.id)}
          />
        ))}
        <AddModeRow disabled={modes.length >= MAX_MODES} onAdd={addMode} />
      </DetailRow>
      <DetailRow
        label="Fine-tune"
        summary={fineModified ? "Custom" : "Default"}
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
