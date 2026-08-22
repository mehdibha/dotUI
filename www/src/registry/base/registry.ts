import type { RegistryItem } from "@/registry/types"

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
    ],
    css: {
      "@plugin tailwindcss-react-aria-components": {},
    },

    registryDependencies: ["utils", "focus-styles", "theme"],
    files: [],
  },
] as const satisfies RegistryItem[]
