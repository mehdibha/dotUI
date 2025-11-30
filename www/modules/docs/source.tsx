import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { icons } from "lucide-react";

import { docs, marketing } from "@/.source/server";

// Extended Item type that includes wip status
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
          const page = this.storage.read(filePath, "page");
          if (!page) return node;

          // Attach wip status to the node
          return {
            ...node,
            wip: page.data.wip ?? false,
          } as DocsPageItem;
        },
      },
    ],
  },
});

export const marketingSource = loader({
  baseUrl: "/",
  source: marketing.toFumadocsSource(),
});
