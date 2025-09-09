import type { RegistryItem } from "shadcn/schema";

import type { Style } from "../../types";

export function generateRegistryTheme(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { styleName, style } = options;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    extends: "none",
    type: "registry:theme",
    title: `${styleName} theme`,
    description: `Color theme for ${styleName} style`,
    ...style.theme,
  };
}
