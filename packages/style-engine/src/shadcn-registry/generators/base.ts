import type { RegistryItem } from "shadcn/registry";

import type { Style } from "@dotui/style-engine/types";

export function generateBaseRegistry(style: Style): RegistryItem {
  const styleName = style.name;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    extends: "none",
    name: "base",
    type: "registry:style",
    title: `${styleName} Base`,
    description: `Base configuration for ${styleName} style`,
    dependencies: [
      "tailwind-variants",
      "react-aria-components",
      "tailwindcss-react-aria-components",
    ],
    registryDependencies: ["utils", "focus-styles"],
  };
}
