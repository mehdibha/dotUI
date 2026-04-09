import { ArrowRightIcon, ArrowUpRightIcon, BadgeCheckIcon } from "lucide-react";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Badge } from "@/registry/ui/badge";
import { Loader } from "@/registry/ui/loader";

export default function BadgeExample() {
	return (
		<Examples className="lg:grid-cols-1">
			<BadgeVariants />
			<BadgeWithIconLeft />
			<BadgeWithIconRight />
			<BadgeWithSpinner />
			<BadgeAsLink />
			<BadgeLongText />
			<BadgeCustomColors />
		</Examples>
	);
}

function BadgeVariants() {
	return (
		<Example title="Variants">
			<div className="flex flex-wrap gap-2">
				<Badge>Default</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="destructive">Destructive</Badge>
				<Badge variant="outline">Outline</Badge>
				<Badge variant="ghost">Ghost</Badge>
				<Badge variant="link">Link</Badge>
			</div>
		</Example>
	);
}

function BadgeWithIconLeft() {
	return (
		<Example title="Icon Left" className="max-w-fit">
			<div className="flex flex-wrap gap-2">
				<Badge>
					<BadgeCheckIcon data-icon="inline-start" />
					Default
				</Badge>
				<Badge variant="secondary">
					<BadgeCheckIcon data-icon="inline-start" />
					Secondary
				</Badge>
				<Badge variant="destructive">
					<BadgeCheckIcon data-icon="inline-start" />
					Destructive
				</Badge>
				<Badge variant="outline">
					<BadgeCheckIcon data-icon="inline-start" />
					Outline
				</Badge>
				<Badge variant="ghost">
					<BadgeCheckIcon data-icon="inline-start" />
					Ghost
				</Badge>
				<Badge variant="link">
					<BadgeCheckIcon data-icon="inline-start" />
					Link
				</Badge>
			</div>
		</Example>
	);
}

function BadgeWithIconRight() {
	return (
		<Example title="Icon Right" className="max-w-fit">
			<div className="flex flex-wrap gap-2">
				<Badge>
					Default
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
				<Badge variant="secondary">
					Secondary
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
				<Badge variant="destructive">
					Destructive
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
				<Badge variant="outline">
					Outline
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
				<Badge variant="ghost">
					Ghost
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
				<Badge variant="link">
					Link
					<ArrowRightIcon data-icon="inline-end" />
				</Badge>
			</div>
		</Example>
	);
}

function BadgeWithSpinner() {
	return (
		<Example title="With Spinner" className="max-w-fit">
			<div className="flex flex-wrap gap-2">
				<Badge>
					<Loader />
					Default
				</Badge>
				<Badge variant="secondary">
					<Loader />
					Secondary
				</Badge>
				<Badge variant="destructive">
					<Loader />
					Destructive
				</Badge>
				<Badge variant="outline">
					<Loader />
					Outline
				</Badge>
				<Badge variant="ghost">
					<Loader />
					Ghost
				</Badge>
				<Badge variant="link">
					<Loader />
					Link
				</Badge>
			</div>
		</Example>
	);
}

function BadgeAsLink() {
	return (
		<Example title="asChild">
			<div className="flex flex-wrap gap-2">
				<Badge
					render={
						<a href="#">
							Link <ArrowUpRightIcon data-icon="inline-end" />
						</a>
					}
				/>
				<Badge
					variant="secondary"
					render={
						<a href="#">
							Link <ArrowUpRightIcon data-icon="inline-end" />
						</a>
					}
				/>
				<Badge
					variant="destructive"
					render={
						<a href="#">
							Link <ArrowUpRightIcon data-icon="inline-end" />
						</a>
					}
				/>
				<Badge
					variant="ghost"
					render={
						<a href="#">
							Link <ArrowUpRightIcon data-icon="inline-end" />
						</a>
					}
				/>
			</div>
		</Example>
	);
}

function BadgeLongText() {
	return (
		<Example title="Long Text">
			<div className="flex flex-wrap gap-2">
				<Badge variant="secondary">A badge with a lot of text to see how it wraps</Badge>
			</div>
		</Example>
	);
}

function BadgeCustomColors() {
	return (
		<Example title="Custom Colors" className="max-w-fit">
			<div className="flex flex-wrap gap-2">
				<Badge className="bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50">Blue</Badge>
				<Badge className="bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50">Green</Badge>
				<Badge className="bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50">Sky</Badge>
				<Badge className="bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50">Purple</Badge>
				<Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</Badge>
				<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</Badge>
				<Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</Badge>
				<Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</Badge>
				<Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</Badge>
			</div>
		</Example>
	);
}
