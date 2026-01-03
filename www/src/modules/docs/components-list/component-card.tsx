"use client";

import { Link } from "@tanstack/react-router";
import { cn } from "@dotui/registry/lib/utils";
import { componentDemos } from "./demos";

function ComponentPreview({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative h-32 w-full rounded-lg border bg-bg",
				className,
			)}
		>
			<div className="flex h-full w-full items-center justify-center p-4">
				{children}
			</div>
		</div>
	);
}

function IframePreview({
	slug,
	scale = 1,
	className,
}: {
	slug: string;
	scale?: number;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative h-32 w-full overflow-hidden rounded-lg border bg-bg",
				className,
			)}
		>
			<iframe
				src={`/demos/${slug}`}
				className="origin-top-left border-0"
				title={slug}
				tabIndex={-1}
				style={{
					transform: `scale(${scale})`,
					width: `${100 / scale}%`,
					height: `${100 / scale}%`,
				}}
			/>
		</div>
	);
}

interface ComponentCardProps {
	name: string;
	slug: string;
	href: string;
	scale?: number;
	iframe?: boolean;
	previewClassName?: string;
}

export function ComponentCard({
	name,
	slug,
	href,
	scale = 0.8,
	iframe = false,
	previewClassName,
}: ComponentCardProps) {
	const Demo = componentDemos[slug];

	return (
		<div className="flex flex-col items-center">
			{iframe ? (
				<IframePreview slug={slug} scale={scale} className={previewClassName} />
			) : (
				<ComponentPreview className={previewClassName}>
					<div
						className="flex items-center justify-center"
						style={{ transform: `scale(${scale})` }}
					>
						{Demo ? <Demo /> : <span className="text-fg-muted text-sm">{name}</span>}
					</div>
				</ComponentPreview>
			)}
			<Link to="/docs/$" params={{ _splat: href.replace("/docs/", "") }} className="font-medium text-fg hover:underline">
				{name}
			</Link>
		</div>
	);
}
