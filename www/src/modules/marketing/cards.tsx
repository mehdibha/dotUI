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
    <div className="flex flex-col [--container-max:1440px] [--container-pad:--spacing(4)] [--gutter:calc((100%_-_min(100%,var(--container-max)))/2_+_var(--container-pad))] [--rail-gap:--spacing(4)] sm:[--container-pad:--spacing(6)] lg:[--container-pad:--spacing(10)] 3xl:[--container-max:1536px]">
      <PresetSwitcher selected={selected} onSelect={handleSelect} />
      <div className="relative flex gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] pl-(--gutter) [--mask-clear:45px] [--mask-solid:180px] md:pl-0">
        <SkeletonRail side="left" />
        <div className="relative z-20 min-w-0 flex-1 max-lg:overflow-hidden max-lg:[mask-image:linear-gradient(to_right,black_calc(100%_-_2.5rem),transparent)]">
          <DesignSystemProvider
            scoped
            params={preset.componentParams}
            tokens={preset.tokens}
            density={preset.density}
            color={preset.color}
          >
            <CardsGrid className="w-[max(52rem,150vw)] max-w-none [zoom:0.8] lg:w-full lg:[zoom:1]" />
          </DesignSystemProvider>
        </div>
        <SkeletonRail side="right" />
      </div>
    </div>
  )
}

export default Cards
