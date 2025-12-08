import type { RegistryItem } from "@dotui/registry/types";

export const registryHooks: RegistryItem[] = [
  {
    name: "use-mobile",
    type: "registry:hook",
    files: [
      {
        type: "registry:hook",
        path: "hooks/use-mobile.ts",
        target: "hooks/use-mobile.ts",
      },
    ],
  },
];
