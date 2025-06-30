import type { Style } from "../../types";
import type { RegistryItem } from "../types";

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

// function getBaseDependencies(style: Style): string[] {
//   const baseDeps = [
//     "tailwind-variants",
//     "react-aria-components",
//     "tailwindcss-react-aria-components",
//   ];

//   return baseDeps;
// }
