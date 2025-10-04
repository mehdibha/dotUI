import type { RegistryItem } from "@dotui/registry/types";

const utilsMeta = {
  name: "utils",
  type: "registry:lib",
  files: [
    {
      path: "lib/utils/index.tsx",
      type: "registry:lib",
      target: "lib/utils.tsx",
    },
  ],
} satisfies RegistryItem;

export default utilsMeta;
