"use client";

import { Link } from "@tanstack/react-router";

import { cn } from "@/registry/lib/utils";

import { animatedDemos } from "./anim";
import { componentDemos } from "./demos";
import { overlayPreviews } from "./previews";

import type { ComponentPreviewKind } from "./components-data";

function ComponentPreview({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={cn("relative h-32 w-full rounded-lg border bg-bg", className)}>
			<div className="flex h-full w-full items-center justify-center p-4">{children}</div>
		</div>
	);
}

function IframePreview({ slug, scale = 1, className }: { slug: string; scale?: number; className?: string }) {
	return (
		<div className={cn("relative h-32 w-full overflow-hidden rounded-lg border bg-bg", className)}>
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

function OverlayPreview({ name, slug, className }: { name: string; slug: string; className?: string }) {
	const Preview = overlayPreviews[slug];
	return (
		<div className={cn("relative h-32 w-full overflow-hidden rounded-lg border bg-bg", className)}>
			{Preview ? (
				<Preview />
			) : (
				<span className="flex h-full w-full items-center justify-center text-sm text-fg-muted">{name}</span>
			)}
		</div>
	);
}

interface ComponentCardProps {
	name: string;
	slug: string;
	href: string;
	scale?: number;
	iframe?: boolean;
	preview?: ComponentPreviewKind;
	previewClassName?: string;
}

export function ComponentCard({
	name,
	slug,
	href,
	scale = 0.8,
	iframe = false,
	preview,
	previewClassName,
}: ComponentCardProps) {
	const Demo = componentDemos[slug];
	const Animated = animatedDemos[slug];

	return (
		<div className="flex flex-col items-center">
			{Animated ? (
				<div className={cn("relative h-32 w-full overflow-hidden rounded-lg border bg-bg", previewClassName)}>
					<Animated />
				</div>
			) : preview === "overlay" ? (
				<OverlayPreview name={name} slug={slug} className={previewClassName} />
			) : iframe ? (
				<IframePreview slug={slug} scale={scale} className={previewClassName} />
			) : (
				<ComponentPreview className={previewClassName}>
					<div className="flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
						{Demo ? <Demo /> : <span className="text-sm text-fg-muted">{name}</span>}
					</div>
				</ComponentPreview>
			)}
			<Link
				to="/docs/$"
				params={{ _splat: href.replace("/docs/", "") }}
				className="font-medium text-fg hover:underline"
			>
				{name}
			</Link>
		</div>
	);
}
