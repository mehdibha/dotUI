import { useState } from 'react'

import { Playground } from '@/components/playground'
import { Slider, SliderControl } from '@/ui/slider'
import { Switch } from '@/ui/switch'

const SWATCH = 'oklch(0.62 0.13 250)'
const DARK_L = 0.22
const LIGHT_L = 0.96
const MID_L = (DARK_L + LIGHT_L) / 2

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function SimultaneousContrast() {
  const [morph, setMorph] = useState(0)
  const [bridge, setBridge] = useState(false)

  const leftL = lerp(DARK_L, MID_L, morph)
  const rightL = lerp(LIGHT_L, MID_L, morph)

  const reset = () => {
    setMorph(0)
    setBridge(false)
  }

  return (
    <Playground question="Is the same color the same color?" onReset={reset}>
      <div className="relative flex h-56 overflow-hidden rounded-lg border">
        <div
          className="flex flex-1 items-center justify-center"
          style={{ backgroundColor: `oklch(${leftL} 0 0)` }}
        >
          <div
            className="size-18 rounded-lg"
            style={{ backgroundColor: SWATCH }}
          />
        </div>
        <div
          className="flex flex-1 items-center justify-center"
          style={{ backgroundColor: `oklch(${rightL} 0 0)` }}
        >
          <div
            className="size-18 rounded-lg"
            style={{ backgroundColor: SWATCH }}
          />
        </div>
        {bridge && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-8 w-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: SWATCH }}
          />
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-muted">Surround lightness</span>
            <span className="font-mono text-xs text-fg-muted">
              {Math.round(morph * 100)}%
            </span>
          </div>
          <Slider
            aria-label="Surround lightness"
            value={morph}
            onChange={(v) => setMorph(v as number)}
            minValue={0}
            maxValue={1}
            step={0.01}
          >
            <SliderControl />
          </Slider>
        </div>

        <Switch isSelected={bridge} onChange={setBridge} size="sm">
          Bridge the swatches
        </Switch>

        <p className="text-sm text-fg-muted">
          Both swatches are{' '}
          <code className="font-mono text-[0.8rem]">oklch(0.62 0.13 250)</code>{' '}
          — always.
        </p>
      </div>
    </Playground>
  )
}
