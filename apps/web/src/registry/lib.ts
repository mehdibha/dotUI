import { Registry } from "@/registry/schema";

export const lib: Registry = [
  {
    name: "cn",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/cn.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "styles",
    type: "registry:lib",
    dependencies: ["tailwind-variants"],
    files: [
      {
        path: "lib/styles.ts",
        type: "registry:lib",
      },
    ],
  },
];
