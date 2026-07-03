import { startTransition, useCallback, useState } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  type ColorConfig,
} from '@/registry/theme'
import { CardsGrid } from '@/components/showcase/cards-grid'
import { DEFAULTS } from '@/modules/create/preset'
import { PresetSwitcher } from '@/modules/marketing/preset-switcher'
import { SkeletonRail } from '@/modules/marketing/skeleton-cards'
import { PRESETS } from '@/modules/presets/presets-data'

// The preset's canvas color (`--color-bg` = neutral-50 / its dark reverse),
// resolved in JS because the switcher's tab lives outside the scoped provider.
// Memoized per preset — resolving runs the full ramp kernel.
const canvasBgCache = new Map<string, { light: string; dark: string }>()
function canvasBg(id: string, color: ColorConfig | undefined) {
  let bg = canvasBgCache.get(id)
  if (!bg) {
    const resolved = resolveColorConfig(color ?? DEFAULT_COLOR_CONFIG)
    bg = {
      light: resolved.light.neutral?.['50'] ?? '',
      dark: resolved.dark.neutral?.['50'] ?? '',
    }
    canvasBgCache.set(id, bg)
  }
  return bg
}

export function Cards() {
  const [selected, setSelected] = useState(0)
  const preset = PRESETS[selected]?.designSystem ?? DEFAULTS
  const bg = canvasBg(PRESETS[selected]?.id ?? 'default', preset.color)

  // Re-theming the grid re-renders every styled component in it; as a transition
  // that render is interruptible and doesn't block the click.
  const handleSelect = useCallback((index: number) => {
    startTransition(() => setSelected(index))
  }, [])

  return (
    <div
      className="flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] [--window-bg:var(--window-bg-light)] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem] dark:[--window-bg:var(--window-bg-dark)]"
      style={
        {
          '--window-bg-light': bg.light,
          '--window-bg-dark': bg.dark,
        } as React.CSSProperties
      }
    >
      <PresetSwitcher selected={selected} onSelect={handleSelect} />
      <div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] pt-4 [--mask-clear:45px] [--mask-solid:180px] sm:pt-6">
        {/* The full-bleed "window" pane the active tab opens into, painted in
            the preset's own background. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-t border-border bg-(--window-bg) transition-colors duration-300"
        />
        <SkeletonRail side="left" />
        <DesignSystemProvider
          scoped
          params={preset.componentParams}
          tokens={preset.tokens}
          density={preset.density}
          color={preset.color}
        >
          <CardsGrid className="relative z-20 w-[max(52rem,150vw)] max-w-none shrink-0 [zoom:0.8] [mask-image:linear-gradient(to_right,transparent_calc(50%-62.5vw),black_calc(50%-62.5vw+var(--edge-fade)),black_calc(50%+62.5vw-var(--edge-fade)),transparent_calc(50%+62.5vw))] [--edge-fade:2.5rem] lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink lg:[zoom:1] lg:[mask-image:none]" />
        </DesignSystemProvider>
        <SkeletonRail side="right" />
      </div>
    </div>
  )
}

export default Cards
