"use client";

import React from "react";

import { cn } from "@dotui/registry/lib/utils";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import type { RouterOutputs } from "@dotui/api";

import { StyleCard } from "./style-card";

export function StylesList({
	styles,
	isLoading,
	search = false,
	...props
}: React.ComponentProps<"div"> & {
	styles?: RouterOutputs["style"]["getPublicStyles"];
	isLoading?: boolean;
	search?: boolean;
}) {
	const [query, setQuery] = React.useState("");

	const filtered = (styles ?? []).filter(
		(s: { name: string; description: string | null; user: { username: string } }) => {
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return (
				s.name.toLowerCase().includes(q) ||
				(s.description ?? "").toLowerCase().includes(q) ||
				s.user.username.toLowerCase().includes(q)
			);
		},
	);

	return (
		<div className={cn("@container/styles-list", props.className)}>
			{search && (
				<SearchField
					aria-label="Search styles"
					className="w-full"
					onChange={(value) => setQuery(value?.toString() ?? "")}
					value={query}
				>
					<Input placeholder="Search styles..." />
				</SearchField>
			)}
			<div
				className={cn(
					"grid @3xl/styles-list:grid-cols-2 @5xl/styles-list:grid-cols-3 grid-cols-1 gap-4",
					search && "mt-6",
					props.className,
				)}
			>
				{(!styles || styles.length === 0 || filtered.length === 0) && !isLoading && (
					<p className="text-fg-muted text-sm">No styles found</p>
				)}
				{isLoading &&
					Array.from({ length: 3 }).map((_, key) => (
						<div key={`skeleton-${key}`} className="space-y-3">
							<Skeleton className="h-62" />
							<div className="flex items-center justify-between gap-2 px-[2px]">
								<Skeleton className="h-6 w-28" />
								<div className="flex items-center gap-2">
									<Skeleton className="size-5" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
						</div>
					))}
				{filtered.map((style: RouterOutputs["style"]["getPublicStyles"][number]) => (
					<StyleCard key={style.name} style={style} />
				))}
			</div>
		</div>
	);
}
