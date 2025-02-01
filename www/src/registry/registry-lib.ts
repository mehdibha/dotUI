import { Registry } from "@dotui/registry/types";

export const lib: Registry = [
  {
    name: "utils",
    type: "lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "lib",
        target: "lib/utils.ts",
      },
    ],
  },
  {
    name: "focus-styles",
    type: "lib",
    files: [
      {
        path: "lib/focus-styles.ts",
        type: "lib",
      },
    ],
  },
];
