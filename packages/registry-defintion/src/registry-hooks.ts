import type { Registry } from "shadcn/registry";

export const hooks: Registry["items"] = [
  {
    name: "use-is-mobile",
    type: "registry:hook",
    files: [
      {
        type: "registry:hook",
        path: "hooks/use-is-mobile.ts",
        target: "hooks/use-is-mobile.ts",
      },
    ],
  },
];
