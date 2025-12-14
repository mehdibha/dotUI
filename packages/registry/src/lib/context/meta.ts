import type { RegistryItem } from "@dotui/registry/types";

const contextMeta = {
  name: "context",
  type: "registry:lib",
  files: [
    {
      path: "lib/context/index.tsx",
      type: "registry:lib",
      target: "lib/context.tsx",
    },
  ],
} satisfies RegistryItem;

export default contextMeta;
