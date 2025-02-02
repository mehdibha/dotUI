import type { Registry } from "./types";

export const hooks: Registry = [
  {
    name: "use-is-mobile",
    files: [
      {
        type: "hook",
        path: "hooks/use-is-mobile.ts",
        target: "hooks/use-is-mobile.ts",
      },
    ],
  },
];
