"use client";

import { cn } from "@/registry/lib/utils";

import { useStyles } from "./styles";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
	isLoading?: boolean;
	show?: boolean;
};

export function Skeleton({ className, children, isLoading, show, ...props }: SkeletonProps) {
	const { root } = useStyles()();
	const shouldShowSkeleton = isLoading ?? show ?? true;
	const hasChildren = children != null;

	if (!hasChildren && !shouldShowSkeleton) return null;

	return (
		<div
			data-skeleton-loading={shouldShowSkeleton ? "" : undefined}
			aria-busy={shouldShowSkeleton ? "true" : undefined}
			inert={shouldShowSkeleton ? true : undefined}
			className={
				shouldShowSkeleton
					? root({ className: cn(!hasChildren && "skeleton block h-6 rounded-md", className) })
					: className
			}
			{...props}
		>
			{children}
		</div>
	);
}
