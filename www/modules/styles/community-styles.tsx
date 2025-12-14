"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPCClient } from "@/lib/trpc/react";
import { StylesList } from "@/modules/styles/styles-list";

const PAGE_SIZE = 6;

export function CommunityStyles() {
	const trpcClient = useTRPCClient();
	const isMounted = useMounted();

	const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: ["style.getPublicStyles", { type: "infinite", limit: PAGE_SIZE }],
		initialPageParam: 0,
		retry: false,
		queryFn: async ({ pageParam }) => {
			const offset = typeof pageParam === "number" ? pageParam : 0;
			const items = await trpcClient.style.getPublicStyles.query({
				limit: PAGE_SIZE,
				offset,
			});
			const nextOffset = items.length === PAGE_SIZE ? offset + PAGE_SIZE : undefined;
			return { items, nextOffset };
		},
		getNextPageParam: (lastPage) => lastPage.nextOffset,
	});

	const styles = React.useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

	const sentinelRef = React.useRef<HTMLDivElement | null>(null);
	React.useEffect(() => {
		if (!isMounted) return;
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					void fetchNextPage();
				}
			},
			{ rootMargin: "200px 0px", threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage, isMounted]);

	if (!isMounted) {
		return <StylesList isLoading />;
	}

	return (
		<div className="space-y-6">
			<StylesList styles={styles} isLoading={isPending} />
			<div ref={sentinelRef} />
			{isFetchingNextPage && <StylesList isLoading />}
		</div>
	);
}
