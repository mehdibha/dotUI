"use client";

import { Skeleton } from "@/registry/ui/skeleton";

interface SkeletonPlaygroundProps {
	isLoading?: boolean;
}

export function SkeletonPlayground({ isLoading = true }: SkeletonPlaygroundProps) {
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
