import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";

import { docs, marketing } from "@/.source/server";

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon: (icon) => {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

export const marketingSource = loader({
  baseUrl: "/",
  source: marketing.toFumadocsSource(),
});
