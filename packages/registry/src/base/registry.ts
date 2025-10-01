import type { RegistryItem } from "@dotui/registry/types";

export const registryBase = [
  {
    name: "base",
    type: "registry:style",
    extends: "none",
    dependencies: [
      "tailwind-variants",
      "react-aria-components",
      "tailwindcss-react-aria-components",
      "tw-animate-css",
      "tailwindcss-autocontrast",
    ],
    css: {
      "@plugin tailwindcss-react-aria-components": {},
      "@plugin tailwindcss-autocontrast": {},
    },

    registryDependencies: ["utils", "focus-styles", "theme"],
    files: [],
  },
] as const satisfies RegistryItem[];
