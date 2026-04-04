import { createFileRoute, getRouteApi, Link, Outlet, useLocation } from "@tanstack/react-router";
import type * as PageTree from "fumadocs-core/page-tree";

export const Route = createFileRoute("/_app/docs")({
	component: DocsLayout,
});

const appRoute = getRouteApi("/_app");

function DocsLayout() {
	const { pageTree } = appRoute.useLoaderData();
	const items = pageTree.children as PageTree.Node[];

	return (
		<div className="flex min-h-[calc(100vh-var(--header-height))] [--sidebar-width:240px]">
			<aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] w-(--sidebar-width) shrink-0 md:block">
				<DocsSidebarNav items={items} />
				<div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent lg:flex" />
			</aside>
			<div className="min-w-0 flex-1">
				<Outlet />
			</div>
		</div>
	);
}

function DocsSidebarNav({ items }: { items: PageTree.Node[] }) {
	const { pathname } = useLocation();

	return (
		<nav className="no-scrollbar flex h-full flex-col gap-6 overflow-y-auto scroll-smooth rounded-2xl py-6 pr-3 pl-4 [mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)]">
			{items.map((item) => {
				if (item.type === "folder") {
					return (
						<div key={item.$id} className="flex flex-col">
							<h4 className="mb-1 px-2 font-medium text-fg text-sm">{item.name}</h4>
							{item.children.map((child) => {
								if (child.type !== "page") return null;
								const isActive = pathname === child.url;
								return (
									<Link
										key={child.url}
										to={child.url}
										className={`rounded-md px-2 py-1 text-[0.8rem] transition-colors ${
											isActive ? "bg-bg-muted font-medium text-fg" : "text-fg-muted hover:text-fg"
										}`}
									>
										{child.name}
									</Link>
								);
							})}
						</div>
					);
				}
				if (item.type === "page") {
					const isActive = pathname === item.url;
					return (
						<Link
							key={item.url}
							to={item.url}
							className={`rounded-md px-2 py-1 text-[0.8rem] transition-colors ${
								isActive ? "bg-bg-muted font-medium text-fg" : "text-fg-muted hover:text-fg"
							}`}
						>
							{item.name}
						</Link>
					);
				}
				return null;
			})}
		</nav>
	);
}
