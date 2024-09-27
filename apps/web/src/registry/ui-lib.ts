import { Registry } from "@dotui/registry/types";

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
    name: "focus-styles",
    type: "registry:lib",
    dependencies: ["tailwind-variants"],
    files: [
      {
        path: "lib/focus-styles.ts",
        type: "registry:lib",
      },
    ],
  },
];
