import type { RegistryItem } from "shadcn/registry";

import { createTheme } from "../../theme";
import type { Style } from "../../types";

export function generateRegistryTheme(options: {
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { style } = options;
  const { name: styleName } = style;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    extends: "none",
    type: "registry:theme",
    title: `${styleName} theme`,
    description: `Color theme for ${styleName} style`,
    ...createTheme(style.theme),
  };
}
