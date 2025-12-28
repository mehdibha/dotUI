import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type * as PageTree from "fumadocs-core/page-tree";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/lib/source";

// Serialized page tree node types (ReactNode replaced with string)
interface SerializedItem {
	type: "page";
	name: string;
	url: string;
}

interface SerializedFolder {
	type: "folder";
	name: string;
	children: SerializedNode[];
}

interface SerializedSeparator {
	type: "separator";
	name: string;
}

type SerializedNode = SerializedItem | SerializedFolder | SerializedSeparator;

interface SerializedPageTree {
	children: SerializedNode[];
}

const getPageTree = createServerFn({ method: "GET" }).handler(async () => {
	const pageTree = docsSource.getPageTree();
	return docsSource.serializePageTree(pageTree) as unknown as SerializedPageTree;
});

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
	loader: async () => {
		const pageTree = await getPageTree();
		return { pageTree };
	},
});

function DocsLayout() {
	const { pageTree } = Route.useLoaderData();

	return (
		<div className="[--header-height:calc(var(--spacing)*12)]">
			<Header items={pageTree.children as PageTree.Node[]} />
			<Outlet />
			<Footer />
		</div>
	);
}
