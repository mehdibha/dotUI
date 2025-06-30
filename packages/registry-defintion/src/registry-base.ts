import { RegistryItem } from "shadcn/registry";

export const base: RegistryItem = {
  name: "base",
  type: "registry:style",
  extends: "none",
  dependencies: [
    "tailwind-variants",
    "react-aria-components",
    "tailwindcss-react-aria-components",
  ],
  registryDependencies: ["utils", "focus-styles"],
  files: [],
};
