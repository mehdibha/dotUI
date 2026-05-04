import { ScrollFade } from "@/registry/ui/scroll-fade";

const filters = [
	"Overview",
	"Accessibility",
	"Styling",
	"Composition",
	"Animation",
	"Validation",
	"Internationalization",
	"Performance",
	"Testing",
	"Release notes",
	"Migration",
	"Changelog",
];

export default function Demo() {
	return (
		<ScrollFade className="w-full max-w-md rounded-lg border bg-bg p-3">
			<div className="flex w-max gap-2">
				{filters.map((filter) => (
					<span key={filter} className="rounded-md border bg-muted px-3 py-1.5 text-sm">
						{filter}
					</span>
				))}
			</div>
		</ScrollFade>
	);
}
