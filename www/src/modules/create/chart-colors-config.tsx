'use client'

import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

import { useDesignSystem } from './preset'

/**
 * The categorical chart palette. Each slot derives from a theme hue by default
 * (emitted as `var(--chart-N)` in the registry theme) so charts track the brand;
 * picking a color here writes an explicit `--chart-N` token override. "Match
 * theme" restores the derived default.
 *
 * NOTE: the derived defaults are OKLCH, which the color picker can't parse, so
 * the picker seeds from `fallback` (a close hex) while the live swatch always
 * shows the real `var(--chart-N)`. Engine-level accent hue-rotation + a count
 * knob are the planned refinement (docs/plans/2026-06-13-charts/001).
 */
const CHART_SLOTS = [
  {
    token: '--chart-1',
    label: 'Chart 1',
    palette: 'accent',
    fallback: '#6366f1',
  },
  {
    token: '--chart-2',
    label: 'Chart 2',
    palette: 'success',
    fallback: '#22c55e',
  },
  {
    token: '--chart-3',
    label: 'Chart 3',
    palette: 'warning',
    fallback: '#f59e0b',
  },
  {
    token: '--chart-4',
    label: 'Chart 4',
    palette: 'danger',
    fallback: '#ef4444',
  },
  {
    token: '--chart-5',
    label: 'Chart 5',
    palette: 'info',
    fallback: '#3b82f6',
  },
] as const

/** Collapsed-card summary: the five live chart colors as swatches. */
export function ChartColorsSummary() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] tracking-widest text-fg-muted uppercase">
        Categorical palette
      </span>
      <div className="flex items-center gap-1.5">
        {CHART_SLOTS.map((slot) => (
          <div
            key={slot.token}
            className="size-7 flex-1 rounded-md border"
            style={{ backgroundColor: `var(${slot.token})` }}
            title={slot.token}
          />
        ))}
      </div>
    </div>
  )
}

export function ChartColorsConfig() {
  const { designSystem, setToken } = useDesignSystem()
  const tokens = designSystem.tokens ?? {}

  return (
    <div className="-mt-6 flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        Charts read this palette via <code>var(--chart-N)</code>. By default
        each color follows a theme hue; pick a color to override it.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {CHART_SLOTS.map((slot) => {
          const override = tokens[slot.token]
          const pickerValue = override?.startsWith('#')
            ? override
            : slot.fallback
          return (
            <ColorPicker
              key={slot.token}
              value={pickerValue}
              onChange={(color) => setToken(slot.token, color.toString('hex'))}
            >
              {({ color }) => (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>{slot.label}</Label>
                    <Button className="justify-start pl-2.5">
                      <span
                        className="size-4 shrink-0 rounded-sm border"
                        style={{ backgroundColor: `var(${slot.token})` }}
                      />
                      <span className="truncate">{color.toString('hex')}</span>
                    </Button>
                  </div>
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
                      <ColorSwatch className="sr-only" />
                    </DialogContent>
                  </Popover>
                </>
              )}
            </ColorPicker>
          )
        })}
      </div>

      <Button
        variant="quiet"
        size="sm"
        className="self-start"
        onPress={() => {
          for (const slot of CHART_SLOTS) {
            setToken(slot.token, `var(--${slot.palette}-500)`)
          }
        }}
      >
        Match theme colors
      </Button>
    </div>
  )
}
