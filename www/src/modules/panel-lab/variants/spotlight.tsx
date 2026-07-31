'use client'

/* Spotlight — command-first: search is the primary way into the panel. The
   whole schema is flattened into one searchable registry of working controls;
   an empty query shows a curated Essentials set plus section shortcut chips.
   Question: can search replace information architecture at 30 controls? */

import { useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { Button as RacButton } from 'react-aria-components'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'
import {
  ColorPickerRow,
  FontPickerRow,
  GroupCaption,
  ROW,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StyleGridRow,
} from '@/modules/control-lab/rows'

import {
  CHROMA_OPTIONS,
  CLUSTERS,
  COLOR_KEYS,
  COMPONENT_KEYS,
  CONTRAST_OPTIONS,
  CURSOR_OPTIONS,
  DEFAULTS,
  DENSITY_OPTIONS,
  EFFECT_KEYS,
  GRAY_TINT_OPTIONS,
  ICON_KEYS,
  ICON_LIBRARY_OPTIONS,
  ICON_WEIGHT_OPTIONS,
  PRIMARY_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_KEYS,
  TYPE_KEYS,
} from '../data'
import type { Lab, LabState } from '../data'
import { ClusterHeader } from '../patterns'

interface Entry {
  id: string
  section: string
  /** Search haystack beyond the section name: synonyms, values, aliases. */
  keywords: string
  keys: (keyof LabState)[]
  node: React.ReactNode
}

const ALL_KEYS: (keyof LabState)[] = [
  ...COLOR_KEYS,
  ...TYPE_KEYS,
  ...ICON_KEYS,
  ...SHAPE_KEYS,
  ...EFFECT_KEYS,
  ...COMPONENT_KEYS,
]

const SECTION_CHIPS = [
  'Color',
  'Typography',
  'Icons',
  'Shape',
  'Effects',
  'Components',
]

const ESSENTIALS = [
  'brand',
  'gray',
  'headingFont',
  'radius',
  'density',
  'Button',
]

const COMPONENT_KEYWORDS: Record<string, string> = {
  Button: 'button solid soft outline quiet hover radius components',
  Input: 'input text field form outline line filled components',
  Checkbox: 'checkbox radius form components',
  Card: 'card surface tasnim components',
  Badge: 'badge tag chip radius surface components',
  Modal: 'modal dialog overlay backdrop blur opacity radius components',
  Tooltip: 'tooltip overlay surface translucid radius components',
  Menu: 'menu dropdown list highlight components',
  Loader: 'loader spinner ring loading feedback components',
}

const COMPONENT_PARAM_KEYS: Record<string, (keyof LabState)[]> = {
  Button: ['buttonStyle', 'buttonRadius', 'buttonHover'],
  Input: ['inputStyle'],
  Checkbox: ['checkboxRadius'],
  Card: ['cardStyle'],
  Badge: ['badgeRadius'],
  Modal: ['modalStyle', 'modalBlur', 'modalBackdrop', 'modalRadius'],
  Tooltip: ['tooltipSurface', 'tooltipRadius'],
  Menu: ['menuHighlight'],
  Loader: ['loaderStyle'],
}

export function SpotlightFrame({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [query, setQuery] = useState('')

  /* Weight is a phosphor-only axis — it enters the registry conditionally. */
  const weightEntry: Entry[] =
    state.iconLibrary === 'phosphor'
      ? [
          {
            id: 'iconWeight',
            section: 'Icons',
            keywords: 'icon weight phosphor thin light bold fill duotone',
            keys: ['iconWeight'],
            node: (
              <SelectRow
                label="Weight"
                value={state.iconWeight}
                onChange={set('iconWeight')}
                options={ICON_WEIGHT_OPTIONS}
              />
            ),
          },
        ]
      : []

  const entries: Entry[] = [
    {
      id: 'brand',
      section: 'Color',
      keywords: 'brand accent seed hue primary',
      keys: ['brand'],
      node: (
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set('brand')}
        />
      ),
    },
    {
      id: 'gray',
      section: 'Color',
      keywords: 'gray grey neutral seed',
      keys: ['gray'],
      node: (
        <ColorPickerRow
          label="Gray"
          value={state.gray}
          onChange={set('gray')}
        />
      ),
    },
    {
      id: 'grayTint',
      section: 'Color',
      keywords: 'gray grey tint pure tinted neutral',
      keys: ['grayTint'],
      node: (
        <SegmentedRow
          label="Gray tint"
          value={state.grayTint}
          onChange={set('grayTint')}
          options={GRAY_TINT_OPTIONS}
        />
      ),
    },
    {
      id: 'primary',
      section: 'Color',
      keywords: 'primary neutral accent solid buttons',
      keys: ['primary'],
      node: (
        <SegmentedRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={PRIMARY_OPTIONS}
        />
      ),
    },
    {
      id: 'success',
      section: 'Color',
      keywords: 'success green semantic status',
      keys: ['success'],
      node: (
        <ColorPickerRow
          label="Success"
          value={state.success}
          onChange={set('success')}
        />
      ),
    },
    {
      id: 'warning',
      section: 'Color',
      keywords: 'warning yellow amber semantic status',
      keys: ['warning'],
      node: (
        <ColorPickerRow
          label="Warning"
          value={state.warning}
          onChange={set('warning')}
        />
      ),
    },
    {
      id: 'danger',
      section: 'Color',
      keywords: 'danger red error destructive semantic status',
      keys: ['danger'],
      node: (
        <ColorPickerRow
          label="Danger"
          value={state.danger}
          onChange={set('danger')}
        />
      ),
    },
    {
      id: 'info',
      section: 'Color',
      keywords: 'info blue semantic status',
      keys: ['info'],
      node: (
        <ColorPickerRow
          label="Info"
          value={state.info}
          onChange={set('info')}
        />
      ),
    },
    {
      id: 'selection',
      section: 'Color',
      keywords: 'selection highlight semantic',
      keys: ['selection'],
      node: (
        <ColorPickerRow
          label="Selection"
          value={state.selection}
          onChange={set('selection')}
        />
      ),
    },
    {
      id: 'contrast',
      section: 'Color',
      keywords: 'contrast fine-tune engine low high',
      keys: ['contrast'],
      node: (
        <SegmentedRow
          label="Contrast"
          value={state.contrast}
          onChange={set('contrast')}
          options={CONTRAST_OPTIONS}
        />
      ),
    },
    {
      id: 'chroma',
      section: 'Color',
      keywords: 'chroma saturation muted vivid fine-tune engine',
      keys: ['chroma'],
      node: (
        <SegmentedRow
          label="Chroma"
          value={state.chroma}
          onChange={set('chroma')}
          options={CHROMA_OPTIONS}
        />
      ),
    },
    {
      id: 'headingFont',
      section: 'Typography',
      keywords: 'heading font typeface family display title',
      keys: ['headingFont'],
      node: (
        <FontPickerRow
          label="Heading"
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          selectedKey={state.headingFont}
          onChange={set('headingFont')}
        />
      ),
    },
    {
      id: 'bodyFont',
      section: 'Typography',
      keywords: 'body font typeface family text',
      keys: ['bodyFont'],
      node: (
        <FontPickerRow
          label="Body"
          categories={['sans-serif', 'serif']}
          selectedKey={state.bodyFont}
          onChange={set('bodyFont')}
        />
      ),
    },
    {
      id: 'monoFont',
      section: 'Typography',
      keywords: 'mono monospace code font typeface family',
      keys: ['monoFont'],
      node: (
        <FontPickerRow
          label="Mono"
          categories={['mono']}
          selectedKey={state.monoFont}
          onChange={set('monoFont')}
        />
      ),
    },
    {
      id: 'iconLibrary',
      section: 'Icons',
      keywords: 'icon library set lucide phosphor tabler remix',
      keys: ['iconLibrary'],
      node: (
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set('iconLibrary')}
          options={ICON_LIBRARY_OPTIONS}
        />
      ),
    },
    {
      id: 'iconStroke',
      section: 'Icons',
      keywords: 'icon stroke width thickness',
      keys: ['iconStroke'],
      node: (
        <SliderRow
          label="Stroke"
          value={state.iconStroke}
          onChange={set('iconStroke')}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
      ),
    },
    ...weightEntry,
    {
      id: 'radius',
      section: 'Shape',
      keywords: 'radius corner rounding round sharp',
      keys: ['radius'],
      node: (
        <SliderRow
          label="Radius"
          value={state.radius}
          onChange={set('radius')}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          trackStyle={{ borderRadius: `${4 + state.radius * 10}px` }}
        />
      ),
    },
    {
      id: 'density',
      section: 'Shape',
      keywords: 'density spacing compact cozy comfortable',
      keys: ['density'],
      node: (
        <SegmentedRow
          label="Density"
          value={state.density}
          onChange={set('density')}
          options={DENSITY_OPTIONS}
        />
      ),
    },
    {
      id: 'shadows',
      section: 'Effects',
      keywords: 'shadow elevation depth crisp soft floating',
      keys: ['shadows'],
      node: (
        <StyleGridRow
          label="Shadows"
          value={state.shadows}
          onChange={set('shadows')}
          options={SHADOW_OPTIONS}
          columns={4}
        />
      ),
    },
    {
      id: 'cursorInteractive',
      section: 'Effects',
      keywords: 'cursor pointer interactive hover',
      keys: ['cursorInteractive'],
      node: (
        <SelectRow
          label="Cursor"
          value={state.cursorInteractive}
          onChange={set('cursorInteractive')}
          options={CURSOR_OPTIONS}
        />
      ),
    },
    {
      id: 'cursorDisabled',
      section: 'Effects',
      keywords: 'cursor disabled not-allowed',
      keys: ['cursorDisabled'],
      node: (
        <SelectRow
          label="Disabled cursor"
          value={state.cursorDisabled}
          onChange={set('cursorDisabled')}
          options={CURSOR_OPTIONS}
        />
      ),
    },
    ...CLUSTERS.flatMap((cluster) =>
      cluster.items.map((item) => ({
        id: item.name,
        section: cluster.label,
        keywords: COMPONENT_KEYWORDS[item.name] ?? item.name,
        keys: COMPONENT_PARAM_KEYS[item.name] ?? [],
        node: item.render(lab),
      })),
    ),
  ]

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  const searching = tokens.length > 0
  const results = searching
    ? entries.filter((entry) =>
        tokens.every((token) =>
          `${entry.keywords} ${entry.section}`.toLowerCase().includes(token),
        ),
      )
    : []
  const essentials = entries.filter((entry) => ESSENTIALS.includes(entry.id))
  const all = lab.section(ALL_KEYS)

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Search hero — styled always-on so it reads as the way in. */}
      <div className="shrink-0 p-3 pb-2">
        <SearchField
          value={query}
          onChange={setQuery}
          aria-label="Search controls"
        >
          <InputGroup
            className={cn(
              ROW,
              'h-12 border-0 shadow-none inset-ring-2 inset-ring-accent/50',
            )}
          >
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input
              placeholder="Search any control…"
              className="text-[0.8125rem]"
            />
            <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
              <Button variant="quiet" isIconOnly>
                <XIcon aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </SearchField>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-3 *:shrink-0">
        {searching &&
          results.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-1 pt-1 first:pt-0">
              <span className="flex items-center gap-1.5 px-1 text-[10px] font-medium tracking-wider text-fg-muted/70 uppercase">
                {entry.section}
                {entry.keys.some((key) => state[key] !== DEFAULTS[key]) && (
                  <span
                    aria-label="Modified"
                    className="size-1 rounded-full bg-accent"
                  />
                )}
              </span>
              {entry.node}
            </div>
          ))}
        {searching && results.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-10">
            <p className="text-center text-xs text-fg-muted">
              No control matches “{query}”.
            </p>
            <Button
              size="xs"
              variant="quiet"
              onPress={() => setQuery('')}
              className="text-fg-muted"
            >
              Clear search
            </Button>
          </div>
        )}
        {!searching && (
          <>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {SECTION_CHIPS.map((chip) => (
                <RacButton
                  key={chip}
                  onPress={() => setQuery(chip.toLowerCase())}
                  className="flex h-7 cursor-interactive items-center rounded-full bg-muted px-3 text-xs text-fg-muted focus-reset transition-colors hover:bg-highlight hover:text-fg focus-visible:focus-ring"
                >
                  {chip}
                </RacButton>
              ))}
            </div>
            <ClusterHeader label="Essentials" />
            {essentials.map((entry) => (
              <div key={entry.id}>{entry.node}</div>
            ))}
            <GroupCaption>
              The six decisions that set a system's look. Everything else is one
              search away — type an axis, a component, or a value.
            </GroupCaption>
          </>
        )}
      </div>

      <footer className="flex h-10 shrink-0 items-center justify-between border-t border-border/40 px-4">
        <span className="text-xs text-fg-muted">
          {searching
            ? `${results.length} of ${entries.length} controls`
            : `${entries.length} controls`}
        </span>
        {all.modified && (
          <Button
            size="xs"
            variant="quiet"
            onPress={all.onReset}
            className="text-fg-muted"
          >
            Reset all
          </Button>
        )}
      </footer>
    </div>
  )
}
