import type { RegistryItem } from "@/registry/types"

const questionnaireMeta = {
  name: "questionnaire",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/questionnaire/base.tsx",
      target: "ui/questionnaire.tsx",
    },
  ],
  dependencies: ["@shadcn/react"],
  registryDependencies: ["button", "input"],
  params: {
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default questionnaireMeta
