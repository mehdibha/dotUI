import type { RegistryItem } from "@dotui/registry/types";

export const registryHooks: RegistryItem[] = [
  {
    name: "use-is-mobile",
    type: "registry:hook",
    files: [
      {
        type: "registry:hook",
        path: "hooks/use-is-mobile.ts",
        target: "hooks/use-is-mobile.ts",
      },
    ],
  },
];
