import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import type * as PageTree from "fumadocs-core/page-tree";

import { SidebarProvider } from "@dotui/registry/ui/sidebar";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSerializedPageTree } from "@/lib/source";

const getPageTree = createServerFn({ method: "GET" })
	.middleware([staticFunctionMiddleware])
	.handler(getSerializedPageTree);

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
		<div className="[--header-height:calc(var(--spacing)*12)]">
			<SidebarProvider defaultOpen={false}>
				<AppSidebar items={items} />
				<div className="size-full">
					<Header items={items} className="md:hidden" />
					<Outlet />
					<Footer />
				</div>
			</SidebarProvider>
		</div>
	);
}
