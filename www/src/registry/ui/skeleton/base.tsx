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

	if (!shouldShowSkeleton) return children;

	return (
		<div
			data-skeleton-loading=""
			aria-busy="true"
			inert
			className={root({ className: cn(!hasChildren && "skeleton block h-6 rounded-md", className) })}
			{...props}
		>
			{children}
		</div>
	);
}
