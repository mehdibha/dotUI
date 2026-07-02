import { useState } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { CardsGrid } from '@/components/showcase/cards-grid'
import { SkeletonRail } from '@/components/showcase/skeleton-cards'
import { DEFAULTS } from '@/modules/create/preset'
import { PresetSwitcher } from '@/modules/marketing/preset-switcher'
import { PRESETS } from '@/modules/presets/presets-data'

// The landing showcase: a preset selector floating over the shared `CardsGrid`,
// centered and capped, flanked by skeleton rails and faded into the next section at
// the bottom. The grid is wrapped in a *scoped* DesignSystemProvider, so picking a
// preset in the switcher re-skins only this grid and tweens the whole change —
// palette, radius, AND density: the card spacing visibly grows or tightens, the
// corners round or sharpen, the colors glide.
//
// The morph is a genuine layout tween (the rule in styles.css transitions the
// box-model + type sizes, not just paint), so the grid actually breathes — and
// because it fires only on an explicit user pick, never on a timer, that per-frame
// layout cost is a one-off ~half-second and stays smooth. The provider flags its
// subtree with `data-dotui-transition` the instant its inputs change (lib/styles.tsx)
// and the CSS rule does the rest; reduced-motion visitors get an instant snap.
export function Cards() {
  // Index 0 is the "Default" preset (page baseline) — matches SSR / first paint.
  const [selected, setSelected] = useState(0)
  // `?? DEFAULTS` never triggers (selected is always a valid PRESETS index); it just
  // satisfies noUncheckedIndexedAccess without a non-null assertion.
  const preset = PRESETS[selected]?.designSystem ?? DEFAULTS

  return (
    <div className="flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
      <PresetSwitcher selected={selected} onSelect={setSelected} />
      {/* Flex row: [left rail | gap | capped real grid | gap | right rail]. The rails
          grow to fill whatever horizontal space the centered, max-width grid leaves
          (a thin peek on small screens, wide rails on large ones). The `gap-4` between
          the grid and rails matches the gap between cards. The bottom is masked so the
          whole showcase — real cards and skeletons alike — fades into the next section.
          `cards-grid.tsx` balances every column to bottom out at roughly the same level
          (xl and below), so the fade only has to swallow that small residual spread — a
          shallow 200px fade at the very bottom is enough, no deep tail to hide.
          `--mask-solid` is where content is still fully opaque (200px up from the
          bottom); `--mask-clear` where it's fully gone (the bottom edge). The next
          section's "Built on modern tools" row is pulled up (its `-mt-*` in
          `home-page.tsx`) to sit just under this fade. */}
      <div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] [--mask-clear:0px] [--mask-solid:200px]">
        <SkeletonRail side="left" />
        {/* The centered, capped real grid (shared with the /create preview), sized as
            a flex item that bleeds past the rails on small screens, caps at
            `--grid-max` on large ones, and bumps to 4-up at xl. Kept interactive on purpose: the
            showcase is a live playground, so visitors can poke the cards. The scoped
            provider re-skins only this grid (it renders `display: contents`, so the
            grid stays the flex item and the layout is unchanged). */}
        <DesignSystemProvider
          scoped
          params={preset.componentParams}
          tokens={preset.tokens}
          density={preset.density}
          color={preset.color}
        >
          <CardsGrid className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink" />
        </DesignSystemProvider>
        <SkeletonRail side="right" />
        {/* Below `lg` (no rails) the real grid bleeds off both edges; this overlay
            fades those bleeding columns into the page background so they read as
            dark edges rather than abruptly-clipped cards. Hidden on `lg`+, where the
            rails handle their own fade. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 [background:linear-gradient(to_right,var(--color-bg),transparent_18%,transparent_82%,var(--color-bg))] lg:hidden"
        />
      </div>
    </div>
  )
}

export default Cards
