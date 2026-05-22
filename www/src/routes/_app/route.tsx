import { createFileRoute, Outlet } from "@tanstack/react-router";
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
});

function AppLayout() {
	const { pageTree } = Route.useLoaderData();
	const items = pageTree.children as PageTree.Node[];

	return (
		<div className="[--header-height:--spacing(14)]">
			<Header items={items} />
			<Outlet />
		</div>
	);
}
