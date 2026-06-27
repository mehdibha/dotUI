import { CardsGrid } from '@/components/showcase/cards-grid'
import { SkeletonRail } from '@/components/showcase/skeleton-cards'

// The landing showcase: the shared `CardsGrid` centered and capped, flanked by
// skeleton rails and faded into the next section at the bottom.
export function Cards() {
  return (
    <div className="flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
      {/* Flex row: [left rail | gap | capped real grid | gap | right rail]. The rails
			    grow to fill whatever horizontal space the centered, max-width grid leaves
			    (a thin peek on small screens, wide rails on large ones). The `gap-4` between
			    the grid and rails matches the gap between cards. The bottom is masked so the
			    whole showcase — real cards and skeletons alike — fades into the next section.
			    The fade has to swallow the ragged column bottoms, whose spread tracks the
			    column count: the 3-column layout (everything below `xl`) is much taller and
			    raggier, so it needs a deeper, taller fade than the shorter 4-column `xl` grid
			    — hence the `--mask-*` distances-from-bottom shrink at `xl`. `--mask-solid` is
			    where content is still fully opaque; `--mask-clear` where it's fully gone.
			    `--mask-clear` is deliberately set *above* where the next section's "Built on
			    modern tools" row is pulled up to (its `-mt-*` in `index.tsx`), so that row sits
			    on solid-dark background — no faint card fragments behind it — and the cards only
			    start fading back in above it. */}
      <div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_var(--mask-solid)),transparent_calc(100%_-_var(--mask-clear)))] [--mask-clear:420px] [--mask-solid:980px] xl:[--mask-clear:370px] xl:[--mask-solid:880px]">
        <SkeletonRail side="left" />
        {/* The centered, capped real grid (shared with the /create preview), sized as
				    a flex item that bleeds past the rails on small screens, caps at
				    `--grid-max` on large ones, and bumps to 4-up at xl. Kept interactive on purpose: the
				    showcase is a live playground, so visitors can poke the cards. */}
        <CardsGrid className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink" />
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
