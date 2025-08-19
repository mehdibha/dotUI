"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";

export function useStyleQuery() {
	const pathname = usePathname();
	const segments = pathname.split("/");
	const username = segments[2] ?? "";
	const styleName = segments[3] ?? "";

	const trpc = useTRPC();
	const query = useQuery(
		trpc.style.getByNameAndUsername.queryOptions({
			name: styleName,
			username,
		}),
	);

	return { ...query, username, styleName } as const;
}

