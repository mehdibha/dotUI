import type { RegistryItem } from "@/registry/types"

const questionnaireMeta = {
  name: "questionnaire",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/questionnaire/base.tsx",
      target: "ui/questionnaire.tsx",
    },
  ],
  dependencies: ["@shadcn/react"],
  registryDependencies: ["button"],
} satisfies RegistryItem

export default questionnaireMeta
