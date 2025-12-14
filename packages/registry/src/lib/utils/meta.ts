import type { RegistryItem } from "@dotui/registry/types";

const utilsMeta = {
  name: "utils",
  type: "registry:lib",
  files: [
    {
      path: "lib/utils/index.ts",
      type: "registry:lib",
      target: "lib/utils.ts",
    },
  ],
} satisfies RegistryItem;

export default utilsMeta;
