'use client'

import { useMemo } from 'react'
import {
  ChevronDownIcon,
  PaletteIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { STEPS } from '@dotui/colors'

import { FONT_HEADING_VAR, FONT_MONO_VAR, FONT_SANS_VAR } from '@/lib/fonts'
import { resolveColorConfigCached } from '@/lib/resolve-color'
import * as icons from '@/registry/__generated__/icons'
import {
  IconLibraryContext,
  IconWeightContext,
} from '@/registry/icons/create-icon'
import { iconLibraries, phosphorWeights } from '@/registry/icons/icon-map'
import type { IconLibraryName, PhosphorWeight } from '@/registry/icons/icon-map'
import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_STATUS_SEEDS,
  PALETTE_ORDER,
} from '@/registry/theme'
import type { PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'

import { ContrastReadout } from '../colors/contrast'
import { ColorFineTuneControls, useBorderSeeds } from '../colors/knobs'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import {
  ICON_STROKE_WIDTH_VAR,
  ICON_WEIGHT_VAR,
  STROKE_DEFAULTS,
} from '../iconography'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { FontPicker, useTypography } from '../typography'
import { InlineRow, Segmented, ValueSlider } from './primitives'
import type { Control, Section } from './types'

/* ----------------------------------------------------------------------------
 * Every control writes into the existing DesignSystem state and maps to a token
 * the preview already consumes (color, fonts, radius, density, cursor, shadows,
 * component params). Nothing here invents an axis — new axes are product
 * decisions made outside this file.
 * -------------------------------------------------------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = (v: string) => setToken(name, v)
  return [value, set] as const
}

/** The resolved color theme for the mode the panel is currently viewed in. */
function useResolvedScales() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const theme = useMemo(() => resolveColorConfigCached(config), [config])
  const { resolvedTheme } = useTheme()
  return {
    config,
    theme,
    scales: resolvedTheme === 'dark' ? theme.dark.scales : theme.light.scales,
  }
}

/* ------------------------------- Color ---------------------------------- */

/** Picker fallbacks for seeds the default config leaves absent (engine-derived). */
const SEED_FALLBACKS: Record<keyof PaletteSeeds, string> = {
  accent: DEFAULT_COLOR_CONFIG.seeds.accent,
  neutral: '#808080',
  // Absent by default (selection mirrors primary); a blue stands in for the picker.
  selection: '#0072f5',
  ...DEFAULT_STATUS_SEEDS,
}

/**
 * A color seed field bound to one palette seed. The label lives inside the
 * field; `compact` drops the hex readout for tight grids (it's in the popover).
 */
export function SeedField({
  seed,
  label,
  compact,
}: {
  seed: keyof PaletteSeeds
  label: string
  compact?: boolean
}) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value = config.seeds[seed] ?? SEED_FALLBACKS[seed]
  return (
    <ColorPicker
      value={value}
      onChange={(c) => setColorSeed(seed, c.toString('hex'))}
    >
      {({ color }) => (
        <>
          <Button size="sm" className="w-full justify-start gap-2 pl-2.5">
            <ColorSwatch className="shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left text-xs font-normal text-fg-muted">
              {label}
            </span>
            {!compact && (
              <span className="shrink-0 font-mono text-xs text-fg">
                {color.toString('hex')}
              </span>
            )}
          </Button>
          <Popover>
            <DialogContent className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider
                  orientation="vertical"
                  colorSpace="hsb"
                  channel="hue"
                  className="h-auto self-stretch"
                />
              </div>
              <ColorField aria-label="Hex" className="w-full">
                <Input size="sm" className="w-full" />
              </ColorField>
            </DialogContent>
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}

/** The chapter opener: the live accent and neutral ramps, current mode. */
function ColorRampsVisual() {
  const { scales } = useResolvedScales()
  return (
    <div className="flex flex-col gap-1">
      {(['accent', 'neutral'] as const).map((palette) => {
        const scale = scales[palette]
        if (!scale) return null
        return (
          <div
            key={palette}
            className="flex h-5 overflow-hidden rounded-md"
            title={palette}
          >
            {STEPS.map((step) => (
              <div
                key={step}
                className="flex-1"
                style={{ backgroundColor: scale[step] }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function StatusColorsWidget() {
  const status: Array<{ seed: keyof PaletteSeeds; label: string }> = [
    { seed: 'success', label: 'Success' },
    { seed: 'warning', label: 'Warning' },
    { seed: 'danger', label: 'Danger' },
    { seed: 'info', label: 'Info' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2">
      {status.map((s) => (
        <SeedField key={s.seed} seed={s.seed} label={s.label} compact />
      ))}
    </div>
  )
}

/** Fine-tune axes + contrast readout + every generated ramp, tucked away. */
function ColorEngineWidget() {
  const { config, theme, scales } = useResolvedScales()
  const borderSeeds = useBorderSeeds(config, theme)
  return (
    <Disclosure>
      <DisclosureTrigger className="text-xs text-fg-muted">
        Fine-tune & ramps
      </DisclosureTrigger>
      <DisclosurePanel>
        <div className="flex flex-col gap-4 pt-2">
          <ColorFineTuneControls
            seedDelta={theme.report.seedDelta.accent}
            borderSeeds={borderSeeds}
          />
          <ContrastReadout report={theme.report} />
          <div className="flex flex-col gap-1">
            {PALETTE_ORDER.map((palette) => {
              const scale = scales[palette]
              if (!scale) return null
              return (
                <div
                  key={palette}
                  className="flex overflow-hidden rounded"
                  title={palette}
                >
                  {STEPS.map((step) => (
                    <div
                      key={step}
                      className="h-4 flex-1"
                      style={{ backgroundColor: scale[step] }}
                      title={`--${palette}-${step}`}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

function GrayStrategyWidget() {
  // Maps to the engine's neutralTint axis: 0 is pure gray, default whisper-tints
  // the neutral toward the brand hue.
  const { designSystem, setColorAxis } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <InlineRow label="Gray">
      <Segmented
        ariaLabel="Gray strategy"
        value={config.neutralTint === 0 ? 'pure' : 'tinted'}
        onChange={(v) =>
          setColorAxis('neutralTint', v === 'pure' ? 0 : undefined)
        }
        options={[
          { value: 'pure', label: 'Pure' },
          { value: 'tinted', label: 'Tinted' },
        ]}
      />
    </InlineRow>
  )
}

function PrimarySourceWidget() {
  const { designSystem, setColorPrimary } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <InlineRow label="Primary">
      <Segmented
        ariaLabel="Primary color"
        value={config.primary ?? 'neutral'}
        onChange={(v) => setColorPrimary(v === 'accent' ? 'accent' : undefined)}
        options={[
          { value: 'neutral', label: 'Neutral' },
          { value: 'accent', label: 'Accent' },
        ]}
      />
    </InlineRow>
  )
}

/* ----------------------------- Typography ------------------------------- */

function HeadingFontWidget() {
  const { bodyFamily, headingFamily, setHeading } = useTypography()
  return (
    <FontPicker
      label="Heading"
      categories={['sans-serif', 'serif', 'display', 'handwriting']}
      selectedKey={headingFamily ?? bodyFamily}
      onChange={setHeading}
    />
  )
}

function BodyFontWidget() {
  const { bodyFamily, setBody } = useTypography()
  return (
    <FontPicker
      label="Body"
      categories={['sans-serif', 'serif']}
      selectedKey={bodyFamily}
      onChange={setBody}
    />
  )
}

function MonoFontWidget() {
  const { monoFamily, setMono } = useTypography()
  return (
    <FontPicker
      label="Mono"
      categories={['mono']}
      selectedKey={monoFamily}
      onChange={setMono}
    />
  )
}

/* -------------------------------- Icons --------------------------------- */

function useIconography() {
  const { designSystem, setIconLibrary, setToken } = useDesignSystem()
  const library = designSystem.icons ?? 'lucide'

  const strokeDefault = STROKE_DEFAULTS[library]
  const strokeParsed = Number.parseFloat(
    designSystem.tokens[ICON_STROKE_WIDTH_VAR] ?? '',
  )
  const strokeValue = Number.isFinite(strokeParsed)
    ? strokeParsed
    : (strokeDefault ?? 2)

  const weightToken = designSystem.tokens[ICON_WEIGHT_VAR]
  const weight = phosphorWeights.includes(weightToken as PhosphorWeight)
    ? (weightToken as PhosphorWeight)
    : 'regular'

  return {
    library,
    setIconLibrary,
    setToken,
    strokeDefault,
    strokeValue,
    weight,
  }
}

/** The chapter opener: a live strip of the selected library's icons. */
function IconStripVisual() {
  const { library, strokeValue, weight } = useIconography()
  return (
    <div
      className="flex items-center gap-2 overflow-hidden [mask-image:linear-gradient(to_right,black_80%,transparent)] text-fg-muted [&_svg]:size-4 [&_svg]:shrink-0"
      style={
        { [ICON_STROKE_WIDTH_VAR]: String(strokeValue) } as React.CSSProperties
      }
    >
      <IconLibraryContext.Provider value={library}>
        <IconWeightContext.Provider value={weight}>
          {Object.entries(icons)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(0, 16)
            .map(([name, IconComponent]) => (
              <IconComponent key={name} />
            ))}
        </IconWeightContext.Provider>
      </IconLibraryContext.Provider>
    </div>
  )
}

function IconLibraryWidget() {
  const {
    library,
    setIconLibrary,
    setToken,
    strokeDefault,
    strokeValue,
    weight,
  } = useIconography()
  return (
    <div className="flex flex-col gap-3">
      <Select
        aria-label="Icon library"
        className="w-full"
        selectedKey={library}
        onSelectionChange={(k) => setIconLibrary(k as IconLibraryName)}
      >
        <Button
          size="sm"
          className="h-auto w-full justify-start gap-2 py-1.5 pl-2.5"
        >
          <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <span className="text-xs font-normal text-fg-muted">Library</span>
            <SelectValue className="w-full truncate text-left" />
          </div>
          <ChevronDownIcon data-icon-end="" className="text-fg-muted" />
        </Button>
        <Popover>
          <ListBox>
            {iconLibraries.map((lib) => (
              <ListBoxItem key={lib.name} id={lib.name}>
                {lib.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      {/* Stroke width — only for stroke-based libraries (filled sets have no strokes). */}
      {strokeDefault !== undefined && (
        <ValueSlider
          label="Stroke"
          value={strokeValue}
          min={1}
          max={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
          onChange={(v) => setToken(ICON_STROKE_WIDTH_VAR, String(v))}
        />
      )}

      {/* Weight — only for libraries whose components take a weight prop (phosphor). */}
      {library === 'phosphor' && (
        <Select
          aria-label="Icon weight"
          className="w-full"
          selectedKey={weight}
          onSelectionChange={(k) => setToken(ICON_WEIGHT_VAR, k as string)}
        >
          <Button
            size="sm"
            className="h-auto w-full justify-start gap-2 py-1.5 pl-2.5"
          >
            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <span className="text-xs font-normal text-fg-muted">Weight</span>
              <SelectValue className="w-full truncate text-left capitalize" />
            </div>
            <ChevronDownIcon data-icon-end="" className="text-fg-muted" />
          </Button>
          <Popover>
            <ListBox>
              {phosphorWeights.map((w) => (
                <ListBoxItem key={w} id={w} className="capitalize">
                  {w}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      )}
    </div>
  )
}

/* ---------------------------- Shape & space ------------------------------ */

function useRadiusFactor() {
  const [value, set] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const parsed = Number.parseFloat(value)
  return [Number.isFinite(parsed) ? parsed : 1, set] as const
}

/** The chapter opener: three tiles wearing the live radius at three scales. */
function RadiusVisual() {
  const [factor] = useRadiusFactor()
  return (
    <div className="flex items-end gap-2">
      {[
        { size: 'size-8', radius: 6 },
        { size: 'size-10', radius: 10 },
        { size: 'size-12', radius: 16 },
      ].map(({ size, radius }) => (
        <div
          key={radius}
          className={`${size} border bg-neutral transition-[border-radius]`}
          style={{ borderRadius: Math.min(radius * factor, 32) }}
        />
      ))}
    </div>
  )
}

function RadiusFactorWidget() {
  const [factor, set] = useRadiusFactor()
  return (
    <ValueSlider
      label="Radius"
      value={factor}
      min={0}
      max={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      onChange={(v) => set(String(v))}
    />
  )
}

function DensityWidget() {
  const { designSystem, setDensity } = useDesignSystem()
  return (
    <InlineRow label="Density">
      <Segmented
        ariaLabel="Density"
        size="xs"
        value={designSystem.density}
        onChange={setDensity}
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'default', label: 'Default' },
          { value: 'comfortable', label: 'Cozy' },
        ]}
      />
    </InlineRow>
  )
}

/* ------------------------------- Details --------------------------------- */

/** One free-form box-shadow token; empty clears it back to the theme default. */
function ShadowField({ varName, label }: { varName: string; label: string }) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[varName] ?? ''
  return (
    <TextField
      value={value}
      onChange={(v) => setToken(varName, v === '' ? undefined : v)}
      aria-label={`${label} shadow`}
    >
      <InputGroup>
        <InputGroupAddon>
          <span className="w-14 shrink-0 text-left text-xs text-fg-muted">
            {label}
          </span>
        </InputGroupAddon>
        <Input
          size="sm"
          className="w-full font-mono text-xs"
          placeholder="theme default"
        />
      </InputGroup>
    </TextField>
  )
}

function ShadowsWidget() {
  return (
    <div className="flex flex-col gap-2">
      <ShadowField varName="--shadow-overlay" label="Overlay" />
      <ShadowField varName="--shadow-card" label="Card" />
      <ShadowField varName="--shadow-control" label="Control" />
    </div>
  )
}

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
]

/** Cursor select — hover the field to feel the cursor it maps to. */
function CursorWidget({
  label,
  varName,
  fallback,
}: {
  label: string
  varName: string
  fallback: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label={`${label} cursor`}
    >
      <Button
        size="sm"
        className="w-full justify-start gap-2 pl-2.5"
        style={{ cursor: value }}
      >
        <span className="w-14 shrink-0 text-left text-xs font-normal text-fg-muted">
          {label}
        </span>
        <SelectValue className="min-w-0 flex-1 truncate text-left" />
        <ChevronDownIcon data-icon-end="" className="text-fg-muted" />
      </Button>
      <Popover>
        <ListBox>
          {CURSORS.map((c) => (
            <ListBoxItem key={c} id={c}>
              {c}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/* ----------------------------------------------------------------------------
 * The schema — the chapters of the story scroll, in reading order. The
 * Components section (per-component param editors) is rendered separately by
 * the panel: it's a registry-driven list, not a fixed set of controls.
 * -------------------------------------------------------------------------- */

const c = (control: Control): Control => control

export const SECTIONS: Section[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    Visual: ColorRampsVisual,
    controls: [
      c({
        id: 'brand-color',
        label: 'Brand color',
        keywords: ['accent', 'primary', 'hue'],
        Widget: () => <SeedField seed="accent" label="Brand" />,
      }),
      c({
        id: 'base-color',
        label: 'Base / gray',
        keywords: ['neutral', 'gray', 'grey'],
        Widget: () => <SeedField seed="neutral" label="Base" />,
      }),
      c({
        id: 'gray-strategy',
        label: 'Gray strategy',
        keywords: ['pure', 'tinted', 'neutral'],
        Widget: GrayStrategyWidget,
      }),
      c({
        id: 'primary-color',
        label: 'Primary color',
        keywords: ['primary', 'button', 'brand'],
        Widget: PrimarySourceWidget,
      }),
      c({
        id: 'status-colors',
        label: 'Status colors',
        keywords: ['success', 'warning', 'danger', 'info', 'error'],
        Widget: StatusColorsWidget,
      }),
      c({
        id: 'selection-color',
        label: 'Selection',
        keywords: ['focus', 'ring', 'checked', 'accent'],
        Widget: () => <SeedField seed="selection" label="Selection" />,
      }),
      c({
        id: 'color-engine',
        label: 'Ramps & contrast',
        keywords: ['scale', 'palette', 'wcag', 'fine-tune'],
        Widget: ColorEngineWidget,
      }),
    ],
  },
  {
    id: 'typography',
    label: 'Type',
    icon: TypeIcon,
    controls: [
      c({
        id: 'heading-font',
        label: 'Heading font',
        keywords: ['heading', 'title', 'display'],
        Widget: HeadingFontWidget,
      }),
      c({
        id: 'body-font',
        label: 'Body font',
        keywords: ['text', 'sans'],
        Widget: BodyFontWidget,
      }),
      c({
        id: 'mono-font',
        label: 'Mono font',
        keywords: ['code', 'monospace'],
        Widget: MonoFontWidget,
      }),
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    icon: SmileIcon,
    Visual: IconStripVisual,
    controls: [
      c({
        id: 'icon-library',
        label: 'Icon library',
        keywords: ['lucide', 'phosphor', 'tabler', 'remix', 'stroke', 'weight'],
        Widget: IconLibraryWidget,
      }),
    ],
  },
  {
    id: 'shape',
    label: 'Shape & space',
    icon: ShapesIcon,
    Visual: RadiusVisual,
    controls: [
      c({
        id: 'radius-factor',
        label: 'Radius',
        keywords: ['corner', 'rounding', 'radius'],
        Widget: RadiusFactorWidget,
      }),
      c({
        id: 'density',
        label: 'Density',
        keywords: ['compact', 'comfortable', 'spacing', 'scale'],
        Widget: DensityWidget,
      }),
    ],
  },
  {
    id: 'details',
    label: 'Details',
    icon: SlidersHorizontalIcon,
    controls: [
      c({
        id: 'shadows',
        label: 'Shadows',
        keywords: ['shadow', 'elevation', 'box-shadow', 'depth'],
        Widget: ShadowsWidget,
      }),
      c({
        id: 'cursor-interactive',
        label: 'Interactive cursor',
        keywords: ['cursor', 'pointer', 'hover'],
        Widget: () => (
          <CursorWidget
            label="Cursor"
            varName={CURSOR_INTERACTIVE_VAR}
            fallback={DEFAULT_CURSOR_INTERACTIVE}
          />
        ),
      }),
      c({
        id: 'cursor-disabled',
        label: 'Disabled cursor',
        keywords: ['cursor', 'disabled', 'not-allowed'],
        Widget: () => (
          <CursorWidget
            label="Disabled"
            varName={CURSOR_DISABLED_VAR}
            fallback={DEFAULT_CURSOR_DISABLED}
          />
        ),
      }),
    ],
  },
]

/* --------------------------- Chapter status ------------------------------ */

const TYPE_VARS = [FONT_HEADING_VAR, FONT_SANS_VAR, FONT_MONO_VAR]
const ICON_VARS = [ICON_STROKE_WIDTH_VAR, ICON_WEIGHT_VAR]
const SHAPE_VARS = [RADIUS_FACTOR_VAR]
const DETAIL_VARS = [
  '--shadow-overlay',
  '--shadow-card',
  '--shadow-control',
  CURSOR_INTERACTIVE_VAR,
  CURSOR_DISABLED_VAR,
]

function stripTokens(
  tokens: Record<string, string>,
  vars: string[],
): Record<string, string> {
  const next = { ...tokens }
  for (const v of vars) delete next[v]
  return next
}

/**
 * Whether a chapter deviates from the default system, and the way back.
 * Defaults are the absent state (`undefined` color/icons, empty tokens), so
 * modified = the chapter's slice is present.
 */
export function useSectionStatus(sectionId: string): {
  modified: boolean
  reset: () => void
} {
  const { designSystem, setDesignSystem } = useDesignSystem()
  const hasVar = (vars: string[]) =>
    vars.some((v) => designSystem.tokens[v] !== undefined)
  const stripVars = (vars: string[]) => () =>
    setDesignSystem((prev) => ({
      ...prev,
      tokens: stripTokens(prev.tokens, vars),
    }))

  switch (sectionId) {
    case 'color':
      return {
        modified: designSystem.color !== undefined,
        reset: () => setDesignSystem((prev) => ({ ...prev, color: undefined })),
      }
    case 'typography':
      return { modified: hasVar(TYPE_VARS), reset: stripVars(TYPE_VARS) }
    case 'icons':
      return {
        modified: designSystem.icons !== undefined || hasVar(ICON_VARS),
        reset: () =>
          setDesignSystem((prev) => ({
            ...prev,
            icons: undefined,
            tokens: stripTokens(prev.tokens, ICON_VARS),
          })),
      }
    case 'shape':
      return {
        modified: designSystem.density !== 'default' || hasVar(SHAPE_VARS),
        reset: () =>
          setDesignSystem((prev) => ({
            ...prev,
            density: 'default',
            tokens: stripTokens(prev.tokens, SHAPE_VARS),
          })),
      }
    case 'details':
      return { modified: hasVar(DETAIL_VARS), reset: stripVars(DETAIL_VARS) }
    case 'components':
      return {
        modified: Object.keys(designSystem.componentParams).length > 0,
        reset: () =>
          setDesignSystem((prev) => ({ ...prev, componentParams: {} })),
      }
    default:
      return { modified: false, reset: () => {} }
  }
}

export const ALL_CONTROLS: Control[] = SECTIONS.flatMap((s) => s.controls)

/** Section a control lives in — for the command palette's jump target. */
export function sectionOfControl(controlId: string): Section | undefined {
  return SECTIONS.find((s) => s.controls.some((ctrl) => ctrl.id === controlId))
}
