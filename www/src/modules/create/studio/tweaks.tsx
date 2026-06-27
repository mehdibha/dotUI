'use client'

import {
  AccessibilityIcon,
  BlendIcon,
  ChevronDownIcon,
  MousePointerClickIcon,
  SparklesIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { Segmented, ValueSlider } from '../panel/primitives'
import type { Section } from '../panel/types'
import { useDesignSystem } from '../preset'

/* ----------------------------------------------------------------------------
 * New experimental axes that extend the builder toward "recreate anything".
 *
 * Like the panel lab's invented tokens, these write `--ds-*` CSS vars through
 * the existing token channel — honest stubs (hollow binding dot) until a preview
 * component consumes them, at which point they go live with no rewiring. They
 * exist to prove the *shape* of a complete builder: surface texture, brand
 * expression, accessibility posture and interaction feedback are all axes two
 * real design systems would disagree on.
 * -------------------------------------------------------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

function SelectToken({
  varName,
  fallback,
  options,
  ariaLabel,
}: {
  varName: string
  fallback: string
  options: { id: string; label: string }[]
  ariaLabel: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label={ariaLabel}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((o) => (
            <ListBoxItem key={o.id} id={o.id}>
              {o.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function SegToken({
  varName,
  fallback,
  options,
  ariaLabel,
}: {
  varName: string
  fallback: string
  options: { value: string; label: string }[]
  ariaLabel: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Segmented
      ariaLabel={ariaLabel}
      value={value}
      onChange={set}
      options={options}
    />
  )
}

function SliderToken({
  varName,
  fallback,
  min,
  max,
  step,
  format,
  ariaLabel,
}: {
  varName: string
  fallback: string
  min: number
  max: number
  step: number
  format: (v: number) => string
  ariaLabel: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <ValueSlider
      ariaLabel={ariaLabel}
      value={Number.parseFloat(value) || Number.parseFloat(fallback)}
      min={min}
      max={max}
      step={step}
      format={format}
      onChange={(v) => set(String(v))}
    />
  )
}

function BoolToken({
  varName,
  fallback,
}: {
  varName: string
  fallback: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Switch
      isSelected={value === 'true'}
      onChange={(s) => set(String(s))}
      aria-label="Toggle"
    />
  )
}

/* ------------------------------- Sections -------------------------------- */

export const STUDIO_EXTRA_SECTIONS: Section[] = [
  {
    id: 'brand',
    label: 'Brand expression',
    domain: 'brand',
    icon: SparklesIcon,
    controls: [
      {
        id: 'accent-fill',
        label: 'Accent fill',
        description: 'Solid, a brand gradient, or a soft mesh.',
        domain: 'brand',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        keywords: ['gradient', 'mesh'],
        Widget: () => (
          <SegToken
            varName="--ds-accent-fill"
            fallback="solid"
            ariaLabel="Accent fill"
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'gradient', label: 'Gradient' },
              { value: 'mesh', label: 'Mesh' },
            ]}
          />
        ),
      },
      {
        id: 'gradient-angle',
        label: 'Gradient angle',
        domain: 'brand',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SliderToken
            varName="--ds-gradient-angle"
            fallback="135"
            min={0}
            max={360}
            step={15}
            format={(v) => `${v}°`}
            ariaLabel="Gradient angle"
          />
        ),
      },
      {
        id: 'brand-emphasis',
        label: 'Brand emphasis',
        description: 'How loudly the accent shows up across the UI.',
        domain: 'brand',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-brand-emphasis"
            fallback="balanced"
            ariaLabel="Brand emphasis"
            options={[
              { value: 'reserved', label: 'Reserved' },
              { value: 'balanced', label: 'Balanced' },
              { value: 'loud', label: 'Loud' },
            ]}
          />
        ),
      },
      {
        id: 'mark-radius',
        label: 'Logo-mark radius',
        domain: 'brand',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SliderToken
            varName="--ds-mark-radius"
            fallback="6"
            min={0}
            max={20}
            step={1}
            format={(v) => `${v}px`}
            ariaLabel="Logo-mark radius"
          />
        ),
      },
    ],
  },
  {
    id: 'surface',
    label: 'Surface & texture',
    domain: 'surface',
    icon: BlendIcon,
    controls: [
      {
        id: 'translucency',
        label: 'Translucency',
        description: 'Frost behind menus, popovers and sheets.',
        domain: 'surface',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        keywords: ['glass', 'blur', 'frosted'],
        Widget: () => (
          <SliderToken
            varName="--ds-surface-translucency"
            fallback="0"
            min={0}
            max={100}
            step={5}
            format={(v) => `${v}%`}
            ariaLabel="Translucency"
          />
        ),
      },
      {
        id: 'surface-tint',
        label: 'Surface tint',
        description: 'Tint panels neutral, cool, warm, or toward the brand.',
        domain: 'surface',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SelectToken
            varName="--ds-surface-tint"
            fallback="none"
            ariaLabel="Surface tint"
            options={[
              { id: 'none', label: 'Neutral' },
              { id: 'cool', label: 'Cool' },
              { id: 'warm', label: 'Warm' },
              { id: 'brand', label: 'Brand-tinted' },
            ]}
          />
        ),
      },
      {
        id: 'grain',
        label: 'Grain / noise',
        description: 'Subtle film grain over backgrounds.',
        domain: 'surface',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SliderToken
            varName="--ds-grain"
            fallback="0"
            min={0}
            max={100}
            step={5}
            format={(v) => `${v}%`}
            ariaLabel="Grain"
          />
        ),
      },
      {
        id: 'bg-pattern',
        label: 'Background pattern',
        domain: 'surface',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-bg-pattern"
            fallback="none"
            ariaLabel="Background pattern"
            options={[
              { value: 'none', label: 'None' },
              { value: 'dots', label: 'Dots' },
              { value: 'grid', label: 'Grid' },
            ]}
          />
        ),
      },
      {
        id: 'separators',
        label: 'Separators',
        domain: 'surface',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-separator"
            fallback="hairline"
            ariaLabel="Separators"
            options={[
              { value: 'hairline', label: 'Hairline' },
              { value: 'solid', label: 'Solid' },
              { value: 'none', label: 'None' },
            ]}
          />
        ),
      },
    ],
  },
  {
    id: 'a11y',
    label: 'Accessibility',
    domain: 'a11y',
    icon: AccessibilityIcon,
    controls: [
      {
        id: 'contrast-target',
        label: 'Contrast target',
        description: 'Minimum text-on-surface ratio the generator must hit.',
        domain: 'a11y',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        keywords: ['wcag', 'aa', 'aaa'],
        Widget: () => (
          <SegToken
            varName="--ds-contrast-target"
            fallback="aa"
            ariaLabel="Contrast target"
            options={[
              { value: 'aa', label: 'AA' },
              { value: 'aaa', label: 'AAA' },
            ]}
          />
        ),
      },
      {
        id: 'focus-style',
        label: 'Focus style',
        description: 'How keyboard focus is drawn.',
        domain: 'a11y',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-focus-style"
            fallback="ring"
            ariaLabel="Focus style"
            options={[
              { value: 'ring', label: 'Ring' },
              { value: 'solid', label: 'Solid' },
              { value: 'glow', label: 'Glow' },
            ]}
          />
        ),
      },
      {
        id: 'link-underline',
        label: 'Link underline',
        domain: 'a11y',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-link-underline"
            fallback="hover"
            ariaLabel="Link underline"
            options={[
              { value: 'always', label: 'Always' },
              { value: 'hover', label: 'Hover' },
              { value: 'none', label: 'None' },
            ]}
          />
        ),
      },
      {
        id: 'min-tap',
        label: 'Min tap target',
        description: 'Floor on the hit area of interactive controls.',
        domain: 'a11y',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SliderToken
            varName="--ds-min-tap"
            fallback="36"
            min={24}
            max={48}
            step={2}
            format={(v) => `${v}px`}
            ariaLabel="Min tap target"
          />
        ),
      },
      {
        id: 'reduce-transparency',
        label: 'Honor reduce-transparency',
        domain: 'a11y',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <BoolToken varName="--ds-reduce-transparency" fallback="true" />
        ),
      },
    ],
  },
  {
    id: 'states',
    label: 'Interaction states',
    domain: 'states',
    icon: MousePointerClickIcon,
    controls: [
      {
        id: 'hover-effect',
        label: 'Hover effect',
        description: 'What interactive surfaces do on hover.',
        domain: 'states',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        keywords: ['lift', 'glow', 'tint'],
        Widget: () => (
          <SegToken
            varName="--ds-hover-effect"
            fallback="tint"
            ariaLabel="Hover effect"
            options={[
              { value: 'none', label: 'None' },
              { value: 'tint', label: 'Tint' },
              { value: 'lift', label: 'Lift' },
              { value: 'glow', label: 'Glow' },
            ]}
          />
        ),
      },
      {
        id: 'press-depth',
        label: 'Press depth',
        description: 'How far controls sink when pressed.',
        domain: 'states',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SliderToken
            varName="--ds-press-depth"
            fallback="1"
            min={0}
            max={4}
            step={0.5}
            format={(v) => `${v}px`}
            ariaLabel="Press depth"
          />
        ),
      },
      {
        id: 'selection-color',
        label: 'Selection color',
        domain: 'states',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-selection"
            fallback="brand"
            ariaLabel="Selection color"
            options={[
              { value: 'brand', label: 'Brand' },
              { value: 'neutral', label: 'Neutral' },
            ]}
          />
        ),
      },
      {
        id: 'transition-curve',
        label: 'Transition curve',
        description: 'The personality of every animation.',
        domain: 'states',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        Widget: () => (
          <SegToken
            varName="--ds-ease"
            fallback="smooth"
            ariaLabel="Transition curve"
            options={[
              { value: 'snappy', label: 'Snappy' },
              { value: 'smooth', label: 'Smooth' },
              { value: 'spring', label: 'Spring' },
            ]}
          />
        ),
      },
    ],
  },
]
