import { loader } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";

import { docs, legal } from "@/.source/server";

export interface DocsPageItem extends PageTree.Item {
	wip?: boolean;
}

// Serialized page tree types (ReactNode replaced with string for JSON serialization)
export interface SerializedItem {
	type: "page";
	name: string;
	url: string;
}

export interface SerializedFolder {
	type: "folder";
	name: string;
	children: SerializedNode[];
}

export interface SerializedSeparator {
	type: "separator";
	name: string;
}

export type SerializedNode = SerializedItem | SerializedFolder | SerializedSeparator;

export interface SerializedPageTree {
	children: SerializedNode[];
}

export const docsSource = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
	pageTree: {
		transformers: [
			{
				file(node, filePath) {
					if (!filePath) return node;
					const file = this.storage.read(filePath);
					if (!file || file.format !== "page") return node;

					return {
						...node,
						wip: file.data.wip,
					} as DocsPageItem;
				},
			},
		],
	},
});

export const legalSource = loader({
	baseUrl: "/",
	source: legal.toFumadocsSource(),
});

/** Get serialized page tree with proper types (fumadocs returns generic `object`) */
export async function getSerializedPageTree(): Promise<SerializedPageTree> {
	const pageTree = docsSource.getPageTree();
	const serialized = await docsSource.serializePageTree(pageTree);
	return serialized as SerializedPageTree;
}
