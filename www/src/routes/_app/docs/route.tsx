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
		<div className="flex min-h-[calc(100vh-var(--header-height))]">
			<aside className="sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-60 shrink-0 overflow-y-auto border-r py-6 pr-3 pl-4 md:block">
				<DocsSidebarNav items={items} />
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
		<nav className="flex flex-col gap-6">
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
