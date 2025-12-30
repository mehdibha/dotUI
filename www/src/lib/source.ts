import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

import { docs, legal } from "@/.source/server";

export interface DocsPageItem extends PageTree.Item {
	wip?: boolean;
}

export const docsSource = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
	icon: (icon) => {
		if (!icon) {
			return;
		}
		if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
	},
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
