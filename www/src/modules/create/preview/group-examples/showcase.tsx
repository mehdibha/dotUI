import { CardsGrid } from "@/components/marketing/showcase/cards-grid";

// The "Showcase" preview view: the same masonry of real-world cards as the
// landing page, rendered inside the /create preview iframe so the user's whole
// design system (colors, radius, density, typography, per-component params) can be
// judged at a glance on realistic UI. Unlike the landing composition there are no
// skeleton rails or edge fade — just the centered grid, with fewer columns to suit
// the narrower preview pane.
export default function ShowcaseExamples() {
	return (
		<div className="w-full p-4 sm:p-6">
			<CardsGrid className="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 xl:columns-3" />
		</div>
	);
}
