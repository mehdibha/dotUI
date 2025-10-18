import type { RegistryItem } from "@dotui/registry/types";

const animationMeta: RegistryItem = {
  name: "animation",
  type: "registry:block",
  registryDependencies: ["all"],
  files: [
    {
      path: "blocks/showcase/animation/components/animation.tsx",
      type: "registry:component",
    },
  ],
  categories: ["featured", "showcase"],
  meta: {
    containerHeight: 600,
  },
};

export default animationMeta;
