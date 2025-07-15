import type { RegistryItem } from "shadcn/registry";

import { createTheme } from "../../lib";
import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types-v2";

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
