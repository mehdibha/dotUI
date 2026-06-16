'use client'

import { ChevronDownIcon } from 'lucide-react'

import type { AlgorithmId, ColorKnobs } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'

type SetKnob = <K extends keyof ColorKnobs>(
  key: K,
  value: ColorKnobs[K],
) => void

const PRESERVE_OFF = 'off'

interface OklchSliderDef {
  key: 'chromaMult' | 'minChroma' | 'hueTorsion'
  label: string
  minValue: number
  maxValue: number
  step: number
  /** Mirrors the kernel oklch producer's default for this knob. */
  fallback: number
}

const OKLCH_SLIDERS: ReadonlyArray<OklchSliderDef> = [
  {
    key: 'chromaMult',
    label: 'Chroma',
    minValue: 0,
    maxValue: 2,
    step: 0.05,
    fallback: 1,
  },
  {
    key: 'minChroma',
    label: 'Min chroma',
    minValue: 0,
    maxValue: 0.2,
    step: 0.005,
    fallback: 0.11,
  },
  {
    key: 'hueTorsion',
    label: 'Hue shift',
    minValue: -40,
    maxValue: 40,
    step: 1,
    fallback: 0,
  },
]

function KnobSlider({
  label,
  value,
  minValue,
  maxValue,
  step,
  onChange,
}: {
  label: string
  value: number
  minValue: number
  maxValue: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <Slider
      aria-label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? minValue))}
    >
      <div className="flex items-center justify-between text-xs">
        <Label>{label}</Label>
        <SliderOutput className="text-fg-muted" />
      </div>
      <SliderControl />
    </Slider>
  )
}

function KnobSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: ReadonlyArray<{ id: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
    >
      <Label className="text-xs">{label}</Label>
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((option) => (
            <ListBoxItem key={option.id} id={option.id}>
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/** Algorithm-gated tuning knobs for the active producer. Array knobs (ratios/tones) land later. */
export function ColorKnobsControls({
  algorithm,
  knobs,
  steps,
  onChange,
}: {
  algorithm: AlgorithmId
  knobs: ColorKnobs
  steps: string[]
  onChange: SetKnob
}) {
  if (algorithm === 'oklch' || algorithm === 'tailwind') {
    return (
      <div className="flex flex-col gap-3">
        {OKLCH_SLIDERS.map((def) => (
          <KnobSlider
            key={def.key}
            label={def.label}
            value={knobs[def.key] ?? def.fallback}
            minValue={def.minValue}
            maxValue={def.maxValue}
            step={def.step}
            onChange={(value) => onChange(def.key, value)}
          />
        ))}
        <KnobSelect
          label="Chroma mode"
          value={knobs.chromaMode ?? 'consistent'}
          options={[
            { id: 'consistent', label: 'Consistent' },
            { id: 'max', label: 'Vivid (gamut cusp)' },
          ]}
          onChange={(value) =>
            onChange('chromaMode', value as 'consistent' | 'max')
          }
        />
        <KnobSelect
          label="Pin seed lightness at"
          value={knobs.preserveSeedAt ?? PRESERVE_OFF}
          options={[
            { id: PRESERVE_OFF, label: 'Off (array-driven)' },
            ...steps.map((s) => ({ id: s, label: s })),
          ]}
          onChange={(value) =>
            onChange(
              'preserveSeedAt',
              value === PRESERVE_OFF ? undefined : value,
            )
          }
        />
      </div>
    )
  }

  if (algorithm === 'contrast') {
    return (
      <div className="flex flex-col gap-3">
        <KnobSelect
          label="Contrast formula"
          value={knobs.formula ?? 'wcag2'}
          options={[
            { id: 'wcag2', label: 'WCAG 2' },
            { id: 'apca', label: 'APCA' },
          ]}
          onChange={(value) => onChange('formula', value as 'wcag2' | 'apca')}
        />
        <KnobSlider
          label="Saturation"
          value={knobs.saturation ?? 100}
          minValue={0}
          maxValue={100}
          step={1}
          onChange={(value) => onChange('saturation', value)}
        />
      </div>
    )
  }

  // material: a per-step tone-array editor lands in a later pass.
  return null
}
