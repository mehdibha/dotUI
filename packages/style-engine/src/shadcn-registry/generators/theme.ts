import type { RegistryItem } from "shadcn/registry";

import type { Style } from "../../types";

export function generateThemeRegistry(options: {
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { style } = options;
  const { name: styleName } = style;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: `${styleName} Theme`,
    description: `Color theme for ${styleName} style`,
    files: [
      {
        path: `registry/${styleName}/theme/colors.css`,
        type: "registry:file",
        target: "app/globals.css",
      },
    ],
    cssVars: {},
    css: {},
  };
}
