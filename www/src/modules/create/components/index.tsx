import {
  ChevronDownIcon,
  ChevronRightIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { colorTokenNames } from '@/registry/theme'
import type {
  ParamDef,
  RegistryItem,
  ScalarParamDef,
  TokenType,
} from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { Description, Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { registryUi } from '@/registry/ui/registry'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import {
  BLUR_OPTIONS,
  CURSOR_OPTIONS,
  OPACITY_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from '@/publisher/token-map'

/* ----------------------------- Data helpers ----------------------------- */

const allComponents = registryUi
  .filter((item) => item.group)
  .sort((a, b) => a.name.localeCompare(b.name))

const componentMetaMap = new Map<string, RegistryItem>(
  registryUi.map((item) => [item.name, item]),
)

const allGroups = Array.from(
  new Set(
    registryUi
      .map((item) => item.group)
      .filter((g): g is NonNullable<typeof g> => !!g),
  ),
).sort((a, b) => a.localeCompare(b))

export const GROUP_IDS = new Set<string>(allGroups)

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const COMPONENT_DISPLAY_NAMES: Record<string, string> = {
  'otp-field': 'OTP Field',
  'qr-code': 'QR Code',
}

export function getComponentDisplayName(slug: string): string {
  return COMPONENT_DISPLAY_NAMES[slug] ?? toTitleCase(slug)
}

export function getGroupDisplayName(slug: string): string {
  return toTitleCase(slug)
}

export function isGroupId(id: string): boolean {
  return GROUP_IDS.has(id)
}

function getComponentsInGroup(group: string): RegistryItem[] {
  return registryUi
    .filter((item) => item.group === group)
    .sort((a, b) => a.name.localeCompare(b.name))
}

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

/** Every component with at least one customizable param, A–Z. */
export const paramComponents = allComponents.filter(
  (comp) => paramCount(comp) >= 1,
)

/* ----------------------- Card (shared card style) ----------------------- */

const cardClass =
  'flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover focus-reset focus-visible:focus-ring'

/* ---------------------- All components flat view ---------------------- */

interface AllComponentsViewProps {
  onSelect: (componentName: string) => void
}

export function AllComponentsView({ onSelect }: AllComponentsViewProps) {
  const visibleComponents = allComponents.filter(
    (comp) => paramCount(comp) >= 1,
  )
  return (
    <div className="mt-4 flex flex-col gap-3">
      {visibleComponents.map((comp) => {
        const count = paramCount(comp)
        return (
          <ButtonPrimitives.Button
            key={comp.name}
            onPress={() => onSelect(comp.name)}
            className={cardClass}
          >
            <div className="flex items-center justify-between">
              <span>{getComponentDisplayName(comp.name)}</span>
              <ChevronRightIcon className="size-4 text-fg-muted" />
            </div>
            {count > 0 && (
              <div className="flex items-center gap-2 text-xs text-fg-muted/60">
                <span className="flex items-center gap-1">
                  <SlidersHorizontalIcon className="size-3" />
                  {count} {count === 1 ? 'param' : 'params'}
                </span>
              </div>
            )}
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}

/* -------------------- Component detail view -------------------- */

const radiusOptions = RADIUS_OPTIONS
const blurOptions = BLUR_OPTIONS
const opacityOptions = OPACITY_OPTIONS
const shadowOptions = SHADOW_OPTIONS
const cursorOptions = CURSOR_OPTIONS

const SPACING_REM_PER_UNIT = 0.25

const colorOptions = colorTokenNames('background').map((name) => ({
  label: toTitleCase(name.replace(/^color-/, '')),
  value: `--${name}`,
}))

interface ComponentDetailViewProps {
  componentName: string
  selectedParams?: Record<string, string>
  onParamChange?: (paramName: string, value: string) => void
}

export function ComponentDetailView({
  componentName,
  selectedParams,
  onParamChange,
}: ComponentDetailViewProps) {
  const meta = componentMetaMap.get(componentName)
  if (!meta) {
    return <p className="text-sm text-fg-muted">Component not found.</p>
  }

  const params = meta.params ? Object.entries(meta.params) : []

  if (params.length === 0) {
    return (
      <p className="text-sm text-fg-muted">
        No customization options available for this component.
      </p>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-5">
      {params.map(([paramName, def]) => (
        <ParamEditor
          key={paramName}
          paramName={paramName}
          def={def}
          selected={selectedParams?.[paramName]}
          onChange={(value) => onParamChange?.(paramName, value)}
        />
      ))}
    </div>
  )
}

interface ParamEditorProps {
  paramName: string
  def: ParamDef
  selected: string | undefined
  onChange: (value: string) => void
}

function ParamEditor({ paramName, def, selected, onChange }: ParamEditorProps) {
  if (def.kind === 'enum') {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">
          {toTitleCase(paramName)}
        </span>
        <Select
          aria-label={toTitleCase(paramName)}
          selectedKey={selected ?? def.default}
          onSelectionChange={(key) => onChange(key as string)}
        >
          <Button size="sm" className="w-full">
            <SelectValue />
            <ChevronDownIcon data-icon-end="" />
          </Button>
          <Popover>
            <ListBox>
              {def.values.map((value) => (
                <ListBoxItem key={value} id={value}>
                  {toTitleCase(value)}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
        {def.description && (
          <p className="text-xs text-fg-muted/60">{def.description}</p>
        )}
      </div>
    )
  }

  if (def.type === 'radius') {
    return (
      <RadiusParamSlider
        paramName={paramName}
        def={def}
        selected={selected}
        onChange={onChange}
      />
    )
  }

  if (def.type === 'spacing') {
    return (
      <SpacingParamSlider
        paramName={paramName}
        def={def}
        selected={selected}
        onChange={onChange}
      />
    )
  }

  const optionsByType = {
    blur: blurOptions,
    color: colorOptions,
    cursor: cursorOptions,
    'font-size': [],
    opacity: opacityOptions,
    shadow: shadowOptions,
  } satisfies Record<
    Exclude<TokenType, 'radius' | 'spacing'>,
    readonly { label: string; value: string }[]
  >
  const options = optionsByType[def.type]

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">
        {toTitleCase(paramName)}
      </span>
      <Select
        aria-label={toTitleCase(paramName)}
        selectedKey={selected ?? def.default}
        onSelectionChange={(key) => onChange(key as string)}
      >
        <Button size="sm" className="w-full">
          <SelectValue />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {options.map((opt) => (
              <ListBoxItem key={opt.value} id={opt.value}>
                {opt.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      {def.description && (
        <p className="text-xs text-fg-muted/60">{def.description}</p>
      )}
    </div>
  )
}

interface ScalarParamEditorProps {
  paramName: string
  def: ScalarParamDef
  selected: string | undefined
  onChange: (value: string) => void
}

function RadiusParamSlider({
  paramName,
  def,
  selected,
  onChange,
}: ScalarParamEditorProps) {
  const value = selected ?? def.default
  const selectedIndex = radiusOptions.findIndex((opt) => opt.value === value)
  const fallbackIndex = radiusOptions.findIndex(
    (opt) => opt.value === def.default,
  )
  const index =
    selectedIndex >= 0 ? selectedIndex : fallbackIndex >= 0 ? fallbackIndex : 0
  const current = radiusOptions[index] ?? radiusOptions[0]
  return (
    <div className="flex flex-col gap-2">
      <Slider
        aria-label={toTitleCase(paramName)}
        value={index}
        minValue={0}
        maxValue={radiusOptions.length - 1}
        step={1}
        onChange={(value) => {
          const rawIndex = Array.isArray(value) ? value[0] : value
          if (typeof rawIndex !== 'number') return

          const nextIndex = Math.min(
            Math.max(Math.round(rawIndex), 0),
            radiusOptions.length - 1,
          )
          const next = radiusOptions[nextIndex]
          if (next) onChange(next.value)
        }}
      >
        <div className="flex items-center justify-between">
          <Label>{toTitleCase(paramName)}</Label>
          <SliderOutput>{current?.label}</SliderOutput>
        </div>
        <SliderControl />
        {def.description && (
          <Description className="text-xs text-fg-muted/60">
            {def.description}
          </Description>
        )}
      </Slider>
    </div>
  )
}

function spacingValueToScale(value: string): number | null {
  const normalizedValue = value.trim()
  const spacingCalcMatch = normalizedValue.match(
    /^calc\(\s*(?:var\(--spacing\)\s*\*\s*(?<right>-?\d*\.?\d+)|(?<left>-?\d*\.?\d+)\s*\*\s*var\(--spacing\))\s*\)$/,
  )
  if (spacingCalcMatch?.groups) {
    const scale = Number.parseFloat(
      spacingCalcMatch.groups.right ?? spacingCalcMatch.groups.left ?? '',
    )
    if (Number.isFinite(scale)) return scale
  }

  const spacingFunctionMatch = normalizedValue.match(
    /^(?:var\()?--spacing\(\s*(?<scale>-?\d*\.?\d+)\s*\)\)?$/,
  )
  if (spacingFunctionMatch?.groups?.scale) {
    const scale = Number.parseFloat(spacingFunctionMatch.groups.scale)
    if (Number.isFinite(scale)) return scale
  }

  const numeric = Number.parseFloat(normalizedValue)
  if (!Number.isFinite(numeric)) return null

  if (normalizedValue.endsWith('rem')) return numeric / SPACING_REM_PER_UNIT
  if (normalizedValue.endsWith('px')) return numeric / 4

  return numeric
}

function scaleToSpacingValue(value: number): string {
  return `calc(var(--spacing) * ${formatSpacingScale(value)})`
}

function formatSpacingScale(value: number): string {
  return Number(value.toFixed(2)).toString()
}

function SpacingParamSlider({
  paramName,
  def,
  selected,
  onChange,
}: ScalarParamEditorProps) {
  const minValue = def.minValue ?? 0
  const maxValue = def.maxValue ?? 8
  const step = def.step ?? 0.5
  const value = spacingValueToScale(selected ?? def.default)
  const fallbackValue = spacingValueToScale(def.default)
  const currentValue = Math.min(
    Math.max(value ?? fallbackValue ?? minValue, minValue),
    maxValue,
  )

  return (
    <div className="flex flex-col gap-2">
      <Slider
        aria-label={toTitleCase(paramName)}
        value={currentValue}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        onChange={(value) => {
          const rawValue = Array.isArray(value) ? value[0] : value
          if (typeof rawValue !== 'number') return

          const nextValue = Math.min(Math.max(rawValue, minValue), maxValue)
          onChange(scaleToSpacingValue(nextValue))
        }}
      >
        <div className="flex items-center justify-between">
          <Label>{toTitleCase(paramName)}</Label>
          <SliderOutput>{formatSpacingScale(currentValue)}</SliderOutput>
        </div>
        <SliderControl />
        {def.description && (
          <Description className="text-xs text-fg-muted/60">
            {def.description}
          </Description>
        )}
      </Slider>
    </div>
  )
}

/* -------------------- Group detail view -------------------- */

interface GroupDetailViewProps {
  groupName: string
  onSelectComponent: (componentName: string) => void
}

export function GroupDetailView({
  groupName,
  onSelectComponent,
}: GroupDetailViewProps) {
  const componentsInGroup = getComponentsInGroup(groupName)

  if (componentsInGroup.length === 0) {
    return <p className="text-sm text-fg-muted">No components in this group.</p>
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <p className="text-xs text-fg-muted/80">
        Components in this group share the same visual style. Pick a component
        below to configure it.
      </p>
      <div className="flex flex-col gap-2">
        {componentsInGroup.map((comp) => {
          const count = paramCount(comp)
          return (
            <ButtonPrimitives.Button
              key={comp.name}
              onPress={() => onSelectComponent(comp.name)}
              className={cardClass}
            >
              <div className="flex items-center justify-between">
                <span>{getComponentDisplayName(comp.name)}</span>
                <ChevronRightIcon className="size-4 text-fg-muted" />
              </div>
              {count > 0 && (
                <span className="text-xs text-fg-muted/60">{count} params</span>
              )}
            </ButtonPrimitives.Button>
          )
        })}
      </div>
    </div>
  )
}
