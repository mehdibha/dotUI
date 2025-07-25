import type { RegistryItemProps } from "./types";

export const base: RegistryItemProps = {
  name: "base",
  type: "registry:style",
  extends: "none",
  dependencies: [
    "tailwind-variants",
    "react-aria-components",
    "tailwindcss-react-aria-components",
    "lucide-react",
  ],
  registryDependencies: ["utils", "focus-styles"],
  files: [],
};
