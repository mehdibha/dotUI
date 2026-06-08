"use client";

import { Link } from "@tanstack/react-router";

import { cn } from "@/registry/lib/utils";

import { componentDemos } from "./demos";

function ComponentPreview({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border bg-bg p-4",
				className,
			)}
		>
			{children}
		</div>
	);
}

interface ComponentCardProps {
	name: string;
	slug: string;
	href: string;
	scale?: number;
	previewClassName?: string;
}

export function ComponentCard({ name, slug, href, scale = 0.8, previewClassName }: ComponentCardProps) {
	const Demo = componentDemos[slug];

	return (
		<div data-component={slug} className="flex flex-col items-center gap-3">
			<ComponentPreview className={previewClassName}>
				<div className="flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
					{Demo ? <Demo /> : <span className="text-sm text-fg-muted">{name}</span>}
				</div>
			</ComponentPreview>
			<Link
				to="/docs/$"
				params={{ _splat: href.replace("/docs/", "") }}
				className="text-sm font-medium text-fg hover:underline"
			>
				{name}
			</Link>
		</div>
	);
}
