import type { RegistryItem } from "./types";

export const base: RegistryItem = {
  name: "base",
  dependencies: [
    "tailwind-variants",
    "react-aria-components",
    "tailwindcss-react-aria-components",
  ],
  registryDependencies: ["utils"],
  files: [],
};
