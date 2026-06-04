"use client";

import { Skeleton } from "@/registry/ui/skeleton";

import type { SkeletonProps } from "@/registry/ui/skeleton";

export default function Demo({ isLoading = true }: SkeletonProps = {}) {
	return (
		<Skeleton isLoading={isLoading}>
			<div className="flex items-center gap-4">
				<Skeleton className="size-12 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</Skeleton>
	);
}
