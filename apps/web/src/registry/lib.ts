import { Registry } from "@/registry/schema"

export const lib: Registry = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/cn.ts",
        type: "registry:lib",
      },
    ],
  },
]