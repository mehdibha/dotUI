import type { Registry } from "shadcn/registry";

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.tsx",
        type: "registry:lib",
        target: "lib/utils.tsx",
      },
    ],
  },
  {
    name: "focus-styles",
    type: "registry:lib",
    files: [
      {
        path: "lib/focus-styles.ts",
        type: "registry:lib",
        target: "lib/focus-styles.ts",
      },
    ],
  },
];
