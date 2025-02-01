import type { Registry } from "./types";

export const base: Registry = [
  {
    name: "base",
    dependencies: [
      "tailwind-variants",
      "react-aria-components",
      "tailwindcss-react-aria-components",
    ],
    registryDependencies: ["utils"],
    files: [],
  },
];
