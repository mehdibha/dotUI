'use client'

import { toHex, toOklch, type Theme } from '@dotui/colors'

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
 * The categorical chart palette, inside the Colors section. The engine
 * generates `--chart-1..8` per mode from the theme's seeds (CVD-gated);
 * picking a color writes an explicit `--chart-N` token override (both
 * modes), and "Match theme" deletes the overrides so the generated palettes
 * show through again.
 */
const CHART_SLOTS = Array.from({ length: 8 }, (_, i) => ({
  token: `--chart-${i + 1}`,
  label: `Chart ${i + 1}`,
  index: i,
}))

/** The eight live chart colors as swatches (reads the cascade, so overrides show). */
export function ChartSwatchStrip() {
  return (
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
  )
}

function ModeStrip({ label, colors }: { label: string; colors: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-[10px] tracking-widest text-fg-muted uppercase">
        {label}
      </span>
      <div className="flex flex-1 overflow-hidden rounded-md">
        {colors.map((color, i) => (
          <div
            key={CHART_SLOTS[i]?.token ?? i}
            className="h-5 flex-1"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

export function ChartColorsSection({ theme }: { theme: Theme }) {
  const { designSystem, setDesignSystem, setToken } = useDesignSystem()
  const tokens = designSystem.tokens ?? {}

  // The engine emits oklch(); resolve to hex so the picker can parse it.
  const generated = theme.charts.light.categorical.map((color) =>
    toHex(toOklch(color)),
  )
  const hasOverrides = CHART_SLOTS.some((slot) => tokens[slot.token])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        Charts read this palette via <code>var(--chart-N)</code> — generated per
        mode from your theme. Pick a color to override a slot in both modes.
      </p>

      <div className="flex flex-col gap-1.5">
        <ModeStrip label="Light" colors={theme.charts.light.categorical} />
        <ModeStrip label="Dark" colors={theme.charts.dark.categorical} />
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
