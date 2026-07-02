import { useState } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { CardsGrid } from '@/components/showcase/cards-grid'
import { DEFAULTS } from '@/modules/create/preset'
import { PresetSwitcher } from '@/modules/marketing/preset-switcher'
import { SkeletonRail } from '@/modules/marketing/skeleton-cards'
import { PRESETS } from '@/modules/presets/presets-data'

export function Cards() {
  const [selected, setSelected] = useState(0)
  const preset = PRESETS[selected]?.designSystem ?? DEFAULTS

  return (
    <div className="flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
      <PresetSwitcher selected={selected} onSelect={setSelected} />
      <div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] [--mask-clear:0px] [--mask-solid:120px]">
        <SkeletonRail side="left" />
        <DesignSystemProvider
          scoped
          params={preset.componentParams}
          tokens={preset.tokens}
          density={preset.density}
          color={preset.color}
        >
          {/* Below `lg` there are no rails, so the grid itself bleeds past both
              edges and fades out on its own — the same outer-edge fade the
              skeleton rails give large screens — and is zoomed to 80% so the
              desktop-sized cards read at phone scale. The grid is wider than the
              viewport, so the fade stops are anchored to the visible edges
              rather than element percentages, which would put the fade in the
              off-screen bleed. `zoom` scales rem/px but leaves vw at its real
              size, so every vw term here is pre-divided by the 0.8 zoom:
              150vw ≙ 120vw real (the bleed), 62.5vw ≙ 50vw real (the viewport
              edge in the mask's `50% ± edge` stops). */}
          <CardsGrid className="relative z-20 w-[max(52rem,150vw)] max-w-none shrink-0 [zoom:0.8] [mask-image:linear-gradient(to_right,transparent_calc(50%-62.5vw),black_calc(50%-62.5vw+var(--edge-fade)),black_calc(50%+62.5vw-var(--edge-fade)),transparent_calc(50%+62.5vw))] [--edge-fade:2.5rem] lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink lg:[zoom:1] lg:[mask-image:none]" />
        </DesignSystemProvider>
        <SkeletonRail side="right" />
      </div>
    </div>
  )
}

export default Cards
