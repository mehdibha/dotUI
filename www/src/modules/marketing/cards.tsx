import { startTransition, useCallback, useState } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { CardsGrid } from "@/components/showcase/cards-grid"
import { DEFAULTS } from "@/modules/create/preset/defaults"
import { PresetSwitcher } from "@/modules/marketing/preset-switcher"
import { SkeletonRail } from "@/modules/marketing/skeleton-cards"
import { PRESETS } from "@/modules/presets/presets-data"

export function Cards() {
  const [selected, setSelected] = useState(0)
  const preset = PRESETS[selected]?.designSystem ?? DEFAULTS

  // Re-theming the grid re-renders every styled component in it; as a transition
  // that render is interruptible and doesn't block the click.
  const handleSelect = useCallback((index: number) => {
    startTransition(() => setSelected(index))
  }, [])

  return (
    <div className="relative flex flex-col [--rail-gap:--spacing(5)]">
      {/* Preset wash: the whole section sits on the selected preset's own
          background — the resolved --color-bg from the shared scoped
          stylesheet, per light/dark mode — spanning the full viewport width
          (broken out of the landing container). The outer div fades the top
          edge, the inner div fades the bottom; nested masks instead of
          mask-composite for browser compatibility. --preset-wash-bg is
          registered as a <color> in styles.css so it tweens on preset switch. */}
      <DesignSystemProvider scoped color={preset.color}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[calc(50%-50vw)] -top-56 bottom-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,black_24rem)]"
        >
          <div className="size-full bg-(--preset-wash-bg) [mask-image:linear-gradient(to_bottom,black_calc(100%-24rem),transparent)] [--preset-wash-bg:var(--color-bg)] motion-safe:transition-[--preset-wash-bg] motion-safe:duration-700" />
        </div>
      </DesignSystemProvider>
      <PresetSwitcher selected={selected} onSelect={handleSelect} />
      {/* Below lg (no rails) the grid left-aligns to the container padding
          (--crop-pl mirrors it for the crop mask math) and crops only on the
          right; on lg it fills the container and the rails hang off its sides,
          clipped at the viewport by the page root. */}
      {/* The bottom fade can't live on this wrapper: a mask clips painting to
          the element's border box, which would erase the rails hanging outside
          it — so the grid and each rail carry their own copy (same geometry:
          the rails span the wrapper's height). Below lg the wrapper breaks out
          of the container padding for the same reason: the grid overflows to
          the viewport edge there, and a container-width mask would crop it
          short of its own right-edge fade. */}
      <div className="relative -mx-4 pl-(--crop-pl) [--crop-pl:--spacing(4)] [--mask-clear:45px] [--mask-solid:180px] sm:-mx-6 sm:[--crop-pl:--spacing(6)] lg:mx-0 lg:pl-0">
        <SkeletonRail side="left" />
        <div className="[mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))]">
          <DesignSystemProvider
            scoped
            params={preset.componentParams}
            tokens={preset.tokens}
            density={preset.density}
            color={preset.color}
            icons={preset.icons}
          >
            <CardsGrid className="relative z-20 w-[max(52rem,150vw)] max-w-none [zoom:0.8] [mask-image:linear-gradient(to_right,black_calc(125vw_-_1.25*var(--crop-pl)_-_1.25*var(--edge-fade)),transparent_calc(125vw_-_1.25*var(--crop-pl)))] [--edge-fade:2.5rem] lg:w-full lg:[zoom:1] lg:[mask-image:none]" />
          </DesignSystemProvider>
        </div>
        <SkeletonRail side="right" />
      </div>
    </div>
  )
}

export default Cards
