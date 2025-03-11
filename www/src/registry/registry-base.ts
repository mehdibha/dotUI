import { InternalRegistryItem } from "@dotui/schemas";

export const base: InternalRegistryItem = {
  name: "base",
  type: "base",
  deps: [
    "tailwind-variants",
    "react-aria-components",
    "tailwindcss-react-aria-components",
  ],
  registryDeps: ["utils"],
  files: [],
};
