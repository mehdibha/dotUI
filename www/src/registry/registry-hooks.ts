import { InternalRegistry, InternalRegistryItem } from "@dotui/schemas";

export const hooks: InternalRegistry = [
  {
    name: "use-is-mobile",
    files: [
      {
        type: "hook",
        source: "hooks/use-is-mobile.ts",
        target: "hooks/use-is-mobile.ts",
      },
    ],
  },
].map(
  ({ name, ...rest }) =>
    ({ name, type: "hook", ...rest }) as InternalRegistryItem
);
