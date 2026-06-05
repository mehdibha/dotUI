import { cn } from "@/registry/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/registry/ui/card";
import { Skeleton } from "@/registry/ui/skeleton";

/*
 * Decorative skeleton-card rails that flank the real showcase grid on large
 * screens — the same idea as shadcn's homepage `CardsSkeletonRails`. They live
 * in the gutters beside the centered real grid and are clipped by the parent's
 * `overflow-hidden`, so they peek in from both edges and reveal more as the
 * viewport widens. Purely decorative: wrapped in a single <Skeleton isLoading>
 * (which adds `inert` + shimmer) and `aria-hidden`.
 */

// A single shimmering block. `data-skeleton` is picked up by the parent
// <Skeleton isLoading> wrapper, which paints it muted and animates it.
function Bar({ className }: { className?: string }) {
	return <div data-skeleton="block" className={cn("h-3 rounded-md", className)} />;
}

function Dot({ className }: { className?: string }) {
	return <div data-skeleton="circle" className={cn("size-8 shrink-0", className)} />;
}

function StatCard() {
	return (
		<Card size="sm">
			<CardHeader className="gap-2">
				<Bar className="h-4 w-24" />
				<Bar className="w-32" />
			</CardHeader>
			<CardContent>
				<Bar className="aspect-[1/0.55] h-auto w-full rounded-lg" />
			</CardContent>
		</Card>
	);
}

function ListCard() {
	return (
		<Card size="sm">
			<CardHeader className="gap-2">
				<Bar className="h-4 w-28" />
				<Bar className="w-40" />
			</CardHeader>
			<CardContent className="space-y-4">
				{[0, 1, 2].map((i) => (
					<div key={i} className="flex items-center gap-3">
						<Dot />
						<div className="flex-1 space-y-2">
							<Bar className="w-2/3" />
							<Bar className="w-1/3" />
						</div>
						<Bar className="h-6 w-12 rounded-md" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function FormCard() {
	return (
		<Card size="sm">
			<CardHeader className="gap-2">
				<Bar className="h-4 w-32" />
				<Bar className="w-44" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Bar className="w-16" />
					<Bar className="h-9 w-full rounded-lg" />
				</div>
				<div className="space-y-2">
					<Bar className="w-20" />
					<Bar className="h-9 w-full rounded-lg" />
				</div>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Bar className="h-8 w-20 rounded-lg" />
				<Bar className="h-8 w-24 rounded-lg" />
			</CardFooter>
		</Card>
	);
}

function ToggleCard() {
	return (
		<Card size="sm">
			<CardHeader className="gap-2">
				<Bar className="h-4 w-28" />
				<Bar className="w-36" />
			</CardHeader>
			<CardContent className="space-y-4">
				{[0, 1, 2].map((i) => (
					<div key={i} className="flex items-center justify-between gap-3">
						<div className="flex-1 space-y-2">
							<Bar className="w-1/2" />
							<Bar className="w-3/4" />
						</div>
						<Bar className="h-5 w-9 rounded-full" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function TextCard() {
	return (
		<Card size="sm">
			<CardHeader className="gap-2">
				<Bar className="h-4 w-24" />
			</CardHeader>
			<CardContent className="space-y-2">
				<Bar className="w-full" />
				<Bar className="w-full" />
				<Bar className="w-4/5" />
				<Bar className="w-2/3" />
			</CardContent>
		</Card>
	);
}

const RAIL_COLUMNS = [
	[StatCard, ListCard, TextCard, FormCard, ToggleCard],
	[ToggleCard, FormCard, StatCard, TextCard, ListCard],
	[ListCard, TextCard, ToggleCard, StatCard, FormCard],
	[FormCard, StatCard, ListCard, ToggleCard, TextCard],
] as const;

function RailColumn({ cards }: { cards: readonly (() => React.ReactElement)[] }) {
	return (
		<div className="flex flex-col gap-(--rail-gap)">
			{cards.map((CardComponent, i) => (
				<CardComponent key={i} />
			))}
		</div>
	);
}

export function SkeletonRail({ side }: { side: "left" | "right" }) {
	const [colA, colB] =
		side === "left" ? ([RAIL_COLUMNS[0], RAIL_COLUMNS[1]] as const) : ([RAIL_COLUMNS[2], RAIL_COLUMNS[3]] as const);
	return (
		// A flex item that grows to fill the gutter beside the real grid on large
		// screens. Its fixed-width content overflows and is clipped, so it peeks in
		// from the edge and reveals more as the viewport widens. Hidden below `lg`,
		// where the real grid bleeds off the edges instead. A horizontal mask fades
		// each rail toward the outer screen edge so it reads progressively darker. The
		// content hugs the inner edge (next to the real grid) via justify-*.
		<Skeleton
			isLoading
			aria-hidden="true"
			className={cn(
				"hidden shrink-0 grow basis-(--rail-peek) overflow-hidden lg:flex",
				"[--rail-col:18rem] [--rail-w:calc(var(--rail-col)*2+var(--rail-gap))]",
				side === "left"
					? "justify-end [mask-image:linear-gradient(to_left,black_25%,transparent)]"
					: "justify-start [mask-image:linear-gradient(to_right,black_25%,transparent)]",
			)}
		>
			<div className="grid w-(--rail-w) shrink-0 grid-cols-2 gap-(--rail-gap) opacity-45">
				<RailColumn cards={colA} />
				<RailColumn cards={colB} />
			</div>
		</Skeleton>
	);
}
