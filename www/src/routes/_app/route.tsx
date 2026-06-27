import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

import type * as PageTree from "fumadocs-core/page-tree";

import { Header } from "@/components/layout/header";

import type { SerializedPageTree } from "@/lib/source";

const getPageTree = createServerFn({ method: "GET" })
	.middleware([staticFunctionMiddleware])
	.handler(async (): Promise<SerializedPageTree> => {
		const { getSerializedPageTree } = await import("@/lib/source");
		return getSerializedPageTree();
	});

export const Route = createFileRoute("/_app")({
	component: AppLayout,
	loader: async () => {
		const pageTree = await getPageTree();
		return { pageTree };
	},
	// The page tree is immutable until the next build/deploy (baked at build time
	// via staticFunctionMiddleware), so never background-revalidate it on re-match.
	staleTime: Infinity,
});

function AppLayout() {
	const { pageTree } = Route.useLoaderData();
	const items = pageTree.children as PageTree.Node[];

	// The builder owns its own focused top bar, so the site nav is suppressed on
	// /create only — every other route keeps the standard site Header. The
	// --header-height token stays defined here so the builder's height math
	// (calc(100svh - header-height)) and its own sticky bar line up.
	const { pathname } = useLocation();
	const isCreate = pathname === "/create";

	return (
		<div className="[--header-height:--spacing(14)]">
			{!isCreate && <Header items={items} />}
			<Outlet />
		</div>
	);
}
