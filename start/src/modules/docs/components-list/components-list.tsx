"use client";

import { cn } from "@dotui/registry/lib/utils";
import { ComponentCard } from "./component-card";
import type { ComponentCategory } from "./components-data";

interface ComponentsListProps {
	data: ComponentCategory[];
}

export function ComponentsList({ data }: ComponentsListProps) {
	return (
		<div className="space-y-12">
			{data.map((category) => (
				<section key={category.slug} id={category.slug}>
					<h2 className="font-medium text-2xl">{category.title}</h2>
					<div
						className={cn(
							"mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						)}
					>
						{category.components.map((component) => (
							<ComponentCard
								key={component.slug}
								name={component.name}
								slug={component.slug}
								href={component.href}
								scale={component.scale}
								iframe={component.iframe}
								previewClassName={cn(
									category.slug === "pickers" && "h-38",
									category.slug === "dates" && "h-48",
									category.slug === "collections" && "h-40",
									category.slug === "navigation" && "h-40",
									category.slug === "data-display" && "h-40",
									category.slug === "overlays" && "h-48",
								)}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
