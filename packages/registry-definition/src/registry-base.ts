import type { RegistryItem } from "shadcn/schema";

export const base: RegistryItem = {
  name: "base",
  type: "registry:style",
  extends: "none",
  dependencies: [
    "tailwind-variants",
    "react-aria-components@1.10.1",
    "tailwindcss-react-aria-components",
    "tw-animate-css",
  ],
  registryDependencies: ["utils", "focus-styles", "theme"],
  files: [],
};
