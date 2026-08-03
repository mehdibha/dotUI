"use client"

/* Color v2 — the enhanced working section, read against v1 (color-ideal.tsx,
   frozen). Same engine-true contract, three UX moves:

   1. Faster exploration — a brand pool row for one-tap seed changes, and the
      hero's inspect readout copies the hex on tap.
   2. Fine-tune split by intent — Character (how it looks: vividness, hue
      shift, gray tint) vs Contrast (how it holds up: guarantees, pin,
      borders), each with an honest summary. Contrast surfaces the report's
      actual warning list instead of hiding it in a tooltip.
   3. Backgrounds move out — surfaces are their own section (SurfacesSection-
      Body below) with their own reset, so recoloring never nukes a background
      choice and vice versa. Still no tokens view: the engine's output stays
      visual — ramps you can inspect, not a table. */

import { useState } from "react"
import { CheckIcon, TriangleAlertIcon } from "lucide-react"

import { STEPS, toOklch, wcag2 } from "@dotui/colors"
import type { ModeOutput, StepName, Theme } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  ColorPickerRow,
  ControlGroup,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  ParamRow,
  ROW,
  ROW_VALUE,
  SliderRow,
} from "@/modules/control-lab/rows"

import {
  AutoColorRow,
  BORDER_JOBS,
  cssToHex,
  GUARANTEE_OPTIONS,
  MiniAutoColorRow,
  MiniSliderRow,
  ModeSwitch,
  SEMANTIC_SEEDS,
  useBorderSeeds,
  useLabConfig,
} from "../color-ideal"
import { ACCENT_POOL, DEFAULTS, PRIMARY_OPTIONS } from "../data"
import type { Lab } from "../data"
import { DetailRow, SegmentedControlRow, SwatchDots } from "../patterns"

type Mode = "light" | "dark"

/* ---------------------------------- Hero ----------------------------------- */

/** Tap-to-copy hex readout; keyed by hex so a new inspection resets the flash. */
function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="cursor-interactive uppercase focus-reset focus-visible:focus-ring"
      onClick={() => {
        void navigator.clipboard.writeText(hex)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? "Copied" : hex}
    </button>
  )
}

const HERO_PALETTES = ["accent", "neutral"] as const

/** v1's engine hero with one addition: the inspected hex copies on tap. */
function EngineHero({
  lab,
  theme,
  mode,
  onModeChange,
}: {
  lab: Lab
  theme: Theme
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  const { state, set } = lab
  const [inspect, setInspect] = useState<{
    palette: string
    step: StepName
  } | null>(null)

  const m = theme[mode]
  const bg = toOklch(m.background)
  const warnings = theme.report.warnings.length
  const delta = theme.report.seedDelta.accent ?? 0
  const inspected = inspect ? m.scales[inspect.palette]?.[inspect.step] : null

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between gap-3">
        <span
          className="flex min-w-0 items-center gap-1.5 text-xs text-fg-muted"
          title={theme.report.warnings.join("\n") || undefined}
        >
          {warnings === 0 ? (
            <CheckIcon className="size-3 shrink-0" />
          ) : (
            <TriangleAlertIcon className="size-3 shrink-0 text-fg-warning" />
          )}
          <span className="truncate">
            {warnings === 0
              ? "Contrast guarantees pass"
              : `${warnings} contrast warning${warnings === 1 ? "" : "s"}`}
          </span>
        </span>
        <ModeSwitch mode={mode} onChange={onModeChange} />
      </div>

      {HERO_PALETTES.map((palette) => (
        <div key={palette} className="flex h-5 overflow-hidden rounded-md">
          {STEPS.map((step) => {
            const selected =
              inspect?.palette === palette && inspect.step === step
            return (
              <button
                key={step}
                type="button"
                aria-label={`Inspect ${palette} ${step}`}
                aria-pressed={selected}
                className={cn(
                  "flex-1 cursor-interactive focus-reset focus-visible:z-10 focus-visible:focus-ring",
                  selected && "z-10 rounded-[3px] ring-2 ring-bg ring-inset",
                )}
                style={{ backgroundColor: m.scales[palette]?.[step] }}
                onClick={() => setInspect(selected ? null : { palette, step })}
              />
            )
          })}
        </div>
      ))}

      {inspect && inspected && (
        <div className="flex items-center justify-between gap-3 font-mono text-xs text-fg-muted tabular-nums">
          <span>
            {inspect.palette} · {inspect.step}
          </span>
          <span className="flex items-center gap-3">
            <CopyHex key={cssToHex(inspected)} hex={cssToHex(inspected)} />
            <span>{wcag2(toOklch(inspected), bg).toFixed(2)}:1 vs bg</span>
          </span>
        </div>
      )}

      {state.preserveSeed ? (
        <p className="text-xs text-fg-muted">
          Brand pinned verbatim — any contrast cost is priced in the report.
        </p>
      ) : delta >= 0.005 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-fg-muted">
          <span className="truncate">
            Brand snapped ΔE {delta.toFixed(3)} for contrast
          </span>
          <Button
            size="xs"
            variant="quiet"
            className="shrink-0"
            onPress={() => set("preserveSeed")(true)}
          >
            Pin exact
          </Button>
        </div>
      ) : null}
    </div>
  )
}

/* -------------------------------- Brand pool -------------------------------- */

const BRAND_POOL = [...ACCENT_POOL, "#EF4444", "#14B8A6"]

/** One-tap brand seeds under the Brand row — exploration without the picker. */
function BrandPoolRow({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div data-row="" className={cn(ROW, "flex h-9 items-center gap-2.5 px-4")}>
      {BRAND_POOL.map((hex) => {
        const selected = value.toLowerCase() === hex.toLowerCase()
        return (
          <button
            key={hex}
            type="button"
            aria-label={`Set brand to ${hex}`}
            aria-pressed={selected}
            onClick={() => onChange(hex)}
            className={cn(
              "size-5 cursor-interactive rounded-full focus-reset focus-visible:focus-ring",
              selected && "ring-2 ring-fg/35 ring-offset-2 ring-offset-muted",
            )}
            style={{ backgroundColor: hex }}
          />
        )
      })}
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

const CHARACTER_KEYS = ["vividness", "hueShift", "grayTintAmount"] as const
const CONTRAST_KEYS = [
  "preserveSeed",
  "guarantees",
  "borderContrast",
  "border400",
  "border500",
  "border600",
] as const

export function ColorSectionV2Body({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [mode, setMode] = useState<Mode>("light")

  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)
  const borderSeeds = useBorderSeeds(config)
  const m = theme[mode]
  const warnings = theme.report.warnings

  const solid = (palette: string) => m.scales[palette]?.["700"] ?? m.background
  const selectionDerived =
    m.scales.selection?.["700"] ??
    (state.primary === "accent" ? solid("accent") : solid("neutral"))

  const semanticModified =
    SEMANTIC_SEEDS.some(({ key }) => state[key] !== "") ||
    state.selectionSeed !== ""
  const characterModified = CHARACTER_KEYS.some(
    (key) => state[key] !== DEFAULTS[key],
  )
  const contrastModified = CONTRAST_KEYS.some(
    (key) => state[key] !== DEFAULTS[key],
  )

  const setBorderContrast = (on: boolean) => {
    set("borderContrast")(on)
    for (const { key, job } of BORDER_JOBS) set(key)(on ? borderSeeds[job] : 0)
  }

  return (
    <>
      <EngineHero lab={lab} theme={theme} mode={mode} onModeChange={setMode} />
      <ControlGroup>
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set("brand")}
        />
        <BrandPoolRow value={state.brand} onChange={set("brand")} />
        <AutoColorRow
          label="Gray"
          value={state.graySeed}
          derived={m.scales.neutral?.["500"] ?? m.background}
          onChange={set("graySeed")}
          onReset={() => set("graySeed")("")}
        />
        <SegmentedControlRow
          label="Primary"
          value={state.primary}
          onChange={set("primary")}
          options={PRIMARY_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        One required seed. Every Auto row derives from it — override any, reset
        back anytime.
      </GroupCaption>
      <DetailRow
        label="Semantic colors"
        summary={
          <span className="flex items-center gap-1.5">
            {semanticModified ? null : <span className={ROW_VALUE}>Auto</span>}
            <SwatchDots
              colors={SEMANTIC_SEEDS.map(({ palette }) => solid(palette))}
            />
          </span>
        }
      >
        {SEMANTIC_SEEDS.map(({ key, palette, label }) => (
          <MiniAutoColorRow
            key={key}
            label={label}
            value={state[key]}
            derived={solid(palette)}
            onChange={set(key)}
            onReset={() => set(key)("")}
          />
        ))}
        <MiniAutoColorRow
          label="Selection"
          value={state.selectionSeed}
          derived={selectionDerived}
          onChange={set("selectionSeed")}
          onReset={() => set("selectionSeed")("")}
        />
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
        <MiniSliderRow
          label="Gray tint"
          value={state.grayTintAmount}
          onChange={set("grayTintAmount")}
          minValue={0}
          maxValue={4}
          step={0.1}
          format={(v) => (v === 0 ? "Pure" : `${v.toFixed(1)}×`)}
        />
      </DetailRow>
      <DetailRow
        label="Contrast"
        summary={
          warnings.length > 0 ? (
            <span className="flex items-center gap-1.5 text-fg-warning">
              <TriangleAlertIcon className="size-3" />
              {warnings.length}
            </span>
          ) : contrastModified ? (
            "Custom"
          ) : (
            "Pass"
          )
        }
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
        {warnings.length > 0 && (
          <div className="flex flex-col gap-1 px-2 pt-1 pb-1.5">
            {warnings.map((warning) => (
              <p
                key={warning}
                className="flex items-start gap-1.5 text-xs/relaxed text-fg-muted"
              >
                <TriangleAlertIcon className="mt-0.5 size-3 shrink-0 text-fg-warning" />
                <span>{warning}</span>
              </p>
            ))}
          </div>
        )}
      </DetailRow>
    </>
  )
}

/* -------------------------------- Surfaces ---------------------------------- */

/** One mode's surface stack: the app background with a card resting on it. */
function SurfaceTile({ label, m }: { label: string; m: ModeOutput }) {
  const n = m.scales.neutral
  return (
    <div
      className="flex flex-1 flex-col gap-2 rounded-lg border border-border/45 p-2.5"
      style={{ backgroundColor: m.background }}
    >
      <span className="text-[11px] font-medium" style={{ color: n?.["800"] }}>
        {label}
      </span>
      <div
        className="flex flex-col gap-1.5 rounded-md border p-2"
        style={{ backgroundColor: n?.["50"], borderColor: n?.["200"] }}
      >
        <span
          className="h-1.5 w-12 rounded-full"
          style={{ backgroundColor: n?.["300"] }}
        />
        <span
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: n?.["200"] }}
        />
      </div>
    </div>
  )
}

/** Backgrounds as their own section: both modes previewed at once, one slider
 *  per mode. Split out of Color so each has its own reset scope. */
export function SurfacesSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const theme = resolveColorConfigCached(useLabConfig(state))
  return (
    <>
      <div className="flex gap-2 rounded-xl bg-muted p-2">
        <SurfaceTile label="Light" m={theme.light} />
        <SurfaceTile label="Dark" m={theme.dark} />
      </div>
      <SliderRow
        label="Light background"
        value={state.bgLight}
        onChange={set("bgLight")}
        minValue={90}
        maxValue={100}
        step={0.5}
        format={(v) => `L* ${v.toFixed(1)}`}
      />
      <SliderRow
        label="Dark background"
        value={state.bgDark}
        onChange={set("bgDark")}
        minValue={0}
        maxValue={20}
        step={0.5}
        format={(v) => (v === 0 ? "OLED" : `L* ${v.toFixed(1)}`)}
      />
      <GroupCaption>
        Every surface — cards, fields, popovers — resteps from the background
        you set. Dark at 0 is true OLED black.
      </GroupCaption>
    </>
  )
}
