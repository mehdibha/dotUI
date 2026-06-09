"use client";

import { useMemo, useState } from "react";

import { CardsGrid } from "@/components/marketing/showcase/cards-grid";
import { ShowcaseCustomizer } from "@/components/marketing/showcase/showcase-customizer";
import { SkeletonRail } from "@/components/marketing/showcase/skeleton-cards";
import { useMounted } from "@/hooks/use-mounted";
import { DesignSystemProvider } from "@/modules/core/styles";
import { encodePreset } from "@/modules/create/preset";
import { DEFAULT_COLOR_CONFIG } from "@/registry/theme";

import type { Density } from "@/registry/types";

// Theme contract: every `--radius-*` token is `calc(<rem> * var(--radius-factor))`,
// so scaling this one global var rounds (or sharpens) the whole design system.
const RADIUS_FACTOR_VAR = "--radius-factor";
const DEFAULT_ACCENT = DEFAULT_COLOR_CONFIG.seeds.accent;
const DEFAULT_RADIUS = 1;
const DEFAULT_DENSITY: Density = "default";

// A miniature design-system editor sits just before the cards. Its accent / radius /
// density controls drive a local `DesignSystem` scoped (via the provider's `scoped` prop)
// to the real grid below: color + radius re-theme the grid's wrapper (which clones the
// page's token closure) and density is React context — so the preview re-themes the cards
// alone, leaving the controls (and the rest of the page) on the site's default theme. It
// mounts on the client only (the provider's effects are layout-effects), so the grid renders
// identically on the server and pre-hydration.
export function Cards() {
	const mounted = useMounted();
	const [accent, setAccent] = useState(DEFAULT_ACCENT);
	const [radius, setRadius] = useState(DEFAULT_RADIUS);
	const [density, setDensity] = useState<Density>(DEFAULT_DENSITY);

	const isDirty = accent !== DEFAULT_ACCENT || radius !== DEFAULT_RADIUS || density !== DEFAULT_DENSITY;

	// Only diverge from the baked defaults once the user actually changes something:
	// an untouched preview emits no tokens and no color, so it renders the exact
	// default theme (no redundant ramp regeneration, no `:root` writes).
	const tokens = useMemo(() => {
		const next: Record<string, string> = {};
		if (radius !== DEFAULT_RADIUS) next[RADIUS_FACTOR_VAR] = String(radius);
		return next;
	}, [radius]);
	const color = useMemo(
		() =>
			accent !== DEFAULT_ACCENT
				? { ...DEFAULT_COLOR_CONFIG, seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent } }
				: undefined,
		[accent],
	);

	// Deep-link the "Open in editor" CTA into /create pre-seeded with the current tweaks
	// (encodePreset returns undefined when nothing diverges, keeping it clean).
	const editorHref = useMemo(() => {
		if (!isDirty) return "/create";
		const preset = encodePreset({ componentParams: {}, tokens, density, color });
		return preset ? `/create?preset=${preset}` : "/create";
	}, [isDirty, tokens, density, color]);

	// The centered, capped real grid — `CardsGrid` (shared with the /create preview),
	// sized as a flex item that bleeds past the rails on small screens, caps at
	// `--grid-max` on large ones, and bumps to 4-up at xl.
	const realGrid = (
		<CardsGrid className="relative z-20 w-[max(52rem,120vw)] max-w-none shrink-0 lg:w-full lg:max-w-(--grid-max) lg:min-w-0 lg:shrink xl:columns-4" />
	);

	return (
		<div className="flex flex-col [--grid-max:1500px] [--rail-gap:--spacing(4)] [--rail-peek:2.5rem] sm:[--rail-peek:3.5rem] md:[--rail-peek:5rem] lg:[--rail-peek:7rem]">
			{/* The mini-editor toolbar, just before the cards. Server-rendered (it's plain
			    react-aria components) so it's there on first paint — no pop-in. Only the
			    provider below is client-gated, since its theme effects are layout-effects.
			    The empty rails mirror the cards' flex layout so the toolbar's slot lines up
			    with the real grid: left-aligned to it on `lg`, centered on small screens. */}
			<div className="mb-3 flex justify-center gap-4 sm:mb-4">
				<div aria-hidden="true" className="hidden shrink-0 grow basis-(--rail-peek) lg:block" />
				<div className="flex w-full shrink-0 justify-center px-3 lg:max-w-(--grid-max) lg:min-w-0 lg:shrink lg:justify-start lg:px-0">
					<ShowcaseCustomizer
						accent={accent}
						onAccentChange={setAccent}
						radius={radius}
						onRadiusChange={setRadius}
						density={density}
						onDensityChange={setDensity}
						editorHref={editorHref}
					/>
				</div>
				<div aria-hidden="true" className="hidden shrink-0 grow basis-(--rail-peek) lg:block" />
			</div>

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
				{/* `scoped` confines the whole theme — color, radius and density — to this
				    provider's subtree, so only the real grid re-themes (not the toolbar/page). */}
				{mounted ? (
					<DesignSystemProvider scoped density={density} tokens={tokens} color={color}>
						{realGrid}
					</DesignSystemProvider>
				) : (
					realGrid
				)}
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
	);
}

export default Cards;
