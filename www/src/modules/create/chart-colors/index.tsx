'use client'

import { useMemo } from 'react'

import { toHex, toOklch } from '@dotui/colors'

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
 * The categorical chart palette. The engine generates `--chart-1..8` from the
 * theme's seeds (CVD-gated); picking a color here writes an explicit
 * `--chart-N` token override, and "Match theme" deletes the overrides so the
 * generated palette shows through again.
 */
const CHART_SLOTS = Array.from({ length: 8 }, (_, i) => ({
  token: `--chart-${i + 1}`,
  label: `Chart ${i + 1}`,
  index: i,
}))

/** Collapsed-card summary: the eight live chart colors as swatches. */
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
  const { designSystem, setDesignSystem, setToken } = useDesignSystem()
  const tokens = designSystem.tokens ?? {}
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  // The engine emits oklch(); resolve to hex so the picker can parse it.
  const generated = useMemo(
    () =>
      resolveColorConfig(config).charts.categorical.map((color) =>
        toHex(toOklch(color)),
      ),
    [config],
  )

  const hasOverrides = CHART_SLOTS.some((slot) => tokens[slot.token])

  return (
    <div className="-mt-6 flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        Charts read this palette via <code>var(--chart-N)</code>. The engine
        generates it from your theme; pick a color to override a slot.
      </p>

      <div className="flex flex-col gap-1.5">
        <span className="pl-1 text-xs font-medium text-fg-muted">
          Generated palette
        </span>
        <div className="flex overflow-hidden rounded-md">
          {generated.map((color, i) => (
            <div
              key={CHART_SLOTS[i]?.token ?? i}
              className="h-5 flex-1"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CHART_SLOTS.map((slot) => {
          const override = tokens[slot.token]
          const pickerValue = override?.startsWith('#')
            ? override
            : (generated[slot.index] ?? '#808080')
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
        isDisabled={!hasOverrides}
        onPress={() => {
          setDesignSystem((prev) => {
            const next = { ...prev.tokens }
            for (const slot of CHART_SLOTS) delete next[slot.token]
            return { ...prev, tokens: next }
          })
        }}
      >
        Match theme colors
      </Button>
    </div>
  )
}
