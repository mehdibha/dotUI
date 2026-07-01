'use client'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

import { useDesignSystem } from '../preset'

/** The hex/area/hue picker body — shared by every seed control. */
function PickerBody() {
  return (
    <Popover>
      <DialogContent className="flex flex-col gap-2">
        {/* Raw primitives so they bind to THIS ColorPicker's context rather
            than wrapping their own (which would shadow value/onChange). */}
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
  )
}

/** A compact seed swatch+hex button bound to one palette seed of the recipe. */
export function SeedButton({
  seed,
  className,
}: {
  seed: keyof PaletteSeeds
  className?: string
}) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value = config.seeds[seed] ?? DEFAULT_COLOR_CONFIG.seeds[seed]
  return (
    <ColorPicker
      value={value}
      onChange={(c) => setColorSeed(seed, c.toString('hex'))}
    >
      {({ color }) => (
        <>
          <Button
            size="sm"
            className={cn('w-full justify-start pl-2', className)}
          >
            <ColorSwatch />
            <span className="truncate font-mono text-xs">
              {color.toString('hex')}
            </span>
          </Button>
          <PickerBody />
        </>
      )}
    </ColorPicker>
  )
}

/** The oversized brand-seed control — the hero of the Start workspace. */
export function BrandSeed() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  return (
    <ColorPicker
      value={value}
      onChange={(c) => setColorSeed('accent', c.toString('hex'))}
    >
      {({ color }) => (
        <>
          <Button className="h-12 w-full justify-start gap-3 px-2.5 text-base">
            <span
              className="size-7 shrink-0 rounded-md ring-1 ring-black/10 ring-inset"
              style={{ backgroundColor: color.toString('hex') }}
            />
            <span className="flex min-w-0 flex-col items-start leading-tight">
              <span className="text-[10px] font-normal tracking-wide text-fg-muted uppercase">
                Brand color
              </span>
              <span className="truncate font-mono text-sm">
                {color.toString('hex')}
              </span>
            </span>
          </Button>
          <PickerBody />
        </>
      )}
    </ColorPicker>
  )
}
