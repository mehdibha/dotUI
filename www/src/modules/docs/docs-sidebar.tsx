import { Link, useLocation } from "@tanstack/react-router";

import type * as PageTree from "fumadocs-core/page-tree";

import { cn } from "@/registry/lib/utils";

import type { DocsPageItem } from "@/lib/source";

export function DocsSidebar({ items }: { items: PageTree.Node[] }) {
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
								return (
									<DocsSidebarLink key={child.url} item={child as DocsPageItem} isActive={pathname === child.url} />
								);
							})}
						</div>
					);
				}
				if (item.type === "page") {
					return <DocsSidebarLink key={item.url} item={item as DocsPageItem} isActive={pathname === item.url} />;
				}
				return null;
			})}
		</nav>
	);
}

function DocsSidebarLink({ item, isActive }: { item: DocsPageItem; isActive: boolean }) {
	return (
		<Link to={item.url} className="text-[0.8rem]">
			<span
				className={cn(
					"flex items-center gap-2 rounded-md bg-transparent px-2 py-1 text-fg-muted transition-colors hover:text-fg",
					isActive && "bg-neutral font-medium text-fg",
				)}
			>
				<span>{item.name}</span>
				<span
					aria-hidden="true"
					className={cn("size-1.5 shrink-0 rounded-full", item.wip ? "bg-amber-400" : "bg-blue-400")}
				/>
			</span>
		</Link>
	);
}
