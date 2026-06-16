'use client'

import { useMemo } from 'react'

import { toHex } from '@dotui/colors'

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
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

import { useDesignSystem } from '../preset'

/**
 * The categorical chart palette. Each slot derives from a theme hue by default
 * (emitted as `var(--chart-N)` in the registry theme) so charts track the brand;
 * picking a color here writes an explicit `--chart-N` token override, and "Match
 * theme" restores the derived default.
 *
 * The picker can't parse the OKLCH ramps, so we resolve each slot's current
 * theme hue to hex (`toHex`) to seed the picker accurately; the live swatch
 * always reflects the real `var(--chart-N)`.
 */
const CHART_SLOTS = [
  { token: '--chart-1', label: 'Chart 1', palette: 'accent' },
  { token: '--chart-2', label: 'Chart 2', palette: 'success' },
  { token: '--chart-3', label: 'Chart 3', palette: 'warning' },
  { token: '--chart-4', label: 'Chart 4', palette: 'danger' },
  { token: '--chart-5', label: 'Chart 5', palette: 'info' },
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
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  // Resolve each slot's theme hue (its palette's mid step) to hex so the picker
  // seeds from the color the chart actually shows by default.
  const derived = useMemo(() => {
    const resolved = resolveColorConfig(config)
    const out: Record<string, string> = {}
    for (const slot of CHART_SLOTS) {
      const ramp = resolved.light[slot.palette] as
        | Record<string, string>
        | undefined
      const value = ramp?.['500']
      out[slot.token] = value ? toHex(value) : '#808080'
    }
    return out
  }, [config])

  return (
    <div className="-mt-6 flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        Charts read this palette via <code>var(--chart-N)</code>. Each color
        follows a theme hue by default; pick a color to override it.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {CHART_SLOTS.map((slot) => {
          const override = tokens[slot.token]
          const pickerValue = override?.startsWith('#')
            ? override
            : derived[slot.token]
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
