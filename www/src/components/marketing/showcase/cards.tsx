import { CardsGrid } from "@/components/marketing/showcase/cards-grid";
import { SkeletonRail } from "@/components/marketing/showcase/skeleton-cards";

export function Cards() {
	return (
		// Flex row: [left rail | gap | capped real grid | gap | right rail]. The rails
		// grow to fill whatever horizontal space the centered, max-width grid leaves
		// (a thin peek on small screens, wide rails on large ones). The `gap-4` between
		// the grid and rails matches the gap between cards. The bottom is masked so the
		// whole showcase — real cards and skeletons alike — fades into the next section.
		<div className="relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_520px),transparent_calc(100%_-_180px))] [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
			<SkeletonRail side="left" />
			{/* The real showcase cards, centered. On large screens it's capped at
			    `--grid-max` and centered, with the extra space going to the skeleton
			    rails beside it. Below `lg` there are no rails: the grid is deliberately
			    wider than the viewport (`max(52rem, 120vw)`) and centered, so the middle
			    column reads normally while the outer two bleed off both edges and get
			    darkened by the overlay below. */}
			<CardsGrid className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink xl:columns-4" />
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
	);
}

export default Cards;
