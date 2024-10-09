import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { icons } from "lucide-react";
import { docs, meta } from "~/.source";

export const { getPage, getPages, pageTree, generateParams, files,  } = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
  icon: (icon) => {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
