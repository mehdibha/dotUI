import { Registry } from "./types";

export const lib: Registry = [
  {
    name: "utils",
    type: "lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.tsx",
        type: "lib",
        target: "lib/utils.tsx",
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
        target: "lib/focus-styles.ts",
      },
    ],
  },
];
