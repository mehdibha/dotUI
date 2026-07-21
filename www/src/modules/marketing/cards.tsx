import { startTransition, useCallback, useState } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { CardsGrid } from '@/components/showcase/cards-grid'
import { DEFAULTS } from '@/modules/create/preset'
import { PresetSwitcher } from '@/modules/marketing/preset-switcher'
import { SkeletonRail } from '@/modules/marketing/skeleton-cards'
import { PRESETS } from '@/modules/presets/presets-data'

export function Cards() {
  const [selected, setSelected] = useState(0)
  const preset = PRESETS[selected]?.designSystem ?? DEFAULTS

  // Re-theming the grid re-renders every styled component in it; as a transition
  // that render is interruptible and doesn't block the click.
  const handleSelect = useCallback((index: number) => {
    startTransition(() => setSelected(index))
  }, [])

  return (
    <div className="relative flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(5)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
      {/* Preset wash: the whole section sits on the selected preset's own
          background — the resolved --color-bg from the shared scoped
          stylesheet, per light/dark mode — spanning the full viewport width.
          The outer div fades the top edge, the inner div fades the bottom;
          nested masks instead of mask-composite for browser compatibility.
          --preset-wash-bg is registered as a <color> in styles.css so it
          tweens on preset switch. */}
      <DesignSystemProvider scoped color={preset.color}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-56 bottom-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,black_24rem)]"
        >
          <div className="size-full bg-(--preset-wash-bg) [mask-image:linear-gradient(to_bottom,black_calc(100%-24rem),transparent)] [--preset-wash-bg:var(--color-bg)] motion-safe:transition-[--preset-wash-bg] motion-safe:duration-700" />
        </div>
      </DesignSystemProvider>
      <PresetSwitcher selected={selected} onSelect={handleSelect} />
      {/* Below lg (no rails) the grid left-aligns to the header logo's padding
          (--crop-pl mirrors the header's pl-4 md:pl-6) and crops only on the
          right; lg+ recenters between the rails. */}
      <div className="relative flex justify-start gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] pl-(--crop-pl) [--crop-pl:--spacing(4)] [--mask-clear:45px] [--mask-solid:180px] md:[--crop-pl:--spacing(6)] lg:justify-center lg:pl-0">
        <SkeletonRail side="left" />
        <DesignSystemProvider
          scoped
          params={preset.componentParams}
          tokens={preset.tokens}
          density={preset.density}
          color={preset.color}
          icons={preset.icons}
        >
          <CardsGrid className="relative z-20 w-[max(52rem,150vw)] max-w-none shrink-0 [zoom:0.8] [mask-image:linear-gradient(to_right,black_calc(125vw_-_1.25*var(--crop-pl)_-_1.25*var(--edge-fade)),transparent_calc(125vw_-_1.25*var(--crop-pl)))] [--edge-fade:2.5rem] lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink lg:[zoom:1] lg:[mask-image:none]" />
        </DesignSystemProvider>
        <SkeletonRail side="right" />
      </div>
    </div>
  )
}

export default Cards
