import type { Registry } from "@dotui/registry/types";

export const styles: Registry = [
  {
    name: "default",
    type: "registry:style",
    label: "Default",
    dependencies: ["tailwindcss-animate"],
    registryDependencies: ["cn", "focus-styles"],
    tailwind: {
      config: {
        plugins: [`require("tailwindcss-animate")`],
      },
    },
    cssVars: {},
    files: [],
  },
];

export type Style = (typeof styles)[number];
