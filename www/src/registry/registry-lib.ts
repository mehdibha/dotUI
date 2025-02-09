import { InternalRegistry, InternalRegistryItem } from "@dotui/schemas";

export const lib: InternalRegistry = [
  {
    name: "utils",
    deps: ["clsx", "tailwind-merge"],
    files: [
      {
        source: "lib/utils.tsx",
        type: "lib",
        target: "lib/utils.tsx",
      },
    ],
  },
  {
    name: "focus-styles",
    files: [
      {
        source: "lib/focus-styles.ts",
        type: "lib",
        target: "lib/focus-styles.ts",
      },
    ],
  },
].map(
  ({ name, ...rest }) =>
    ({ name, type: "lib", ...rest }) as InternalRegistryItem
);
