import type { RegistryItem } from "@/registry/types"

import { LIST_PARAMS } from "../list-box/meta"

const menuMeta = {
  name: "menu",
  type: "registry:ui",
  group: "menus-lists",
  files: [
    {
      type: "registry:ui",
      path: "ui/menu/base.tsx",
      target: "ui/menu.tsx",
    },
  ],
  registryDependencies: ["button", "popover"],
  params: LIST_PARAMS,
} satisfies RegistryItem

export default menuMeta
