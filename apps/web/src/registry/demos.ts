import { Registry } from "@/registry/schema"

export const demos: Registry = [
  {
    name: "accordion-demo",
    type: "registry:demo",
    registryDependencies: ["accordion"],
    files: ["example/accordion-demo.tsx"],
  },]